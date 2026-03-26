const vscode = require('vscode');
const fs = require('fs');
const path = require('path');
const { spawn } = require('child_process');

const STAGES = ['backlog', 'research', 'jtbd', 'prd', 'wireframe', 'done'];
const RUNNABLE_STAGES = new Set(['research', 'jtbd', 'prd', 'wireframe']);
const STAGE_LABELS = {
  backlog: 'Backlog',
  research: 'Research',
  jtbd: 'JTBD',
  prd: 'PRD',
  wireframe: 'Wireframe',
  done: 'Done',
};
const STAGE_COMMANDS = {
  research: 'research',
  jtbd: 'jtbd',
  prd: 'prd',
  wireframe: 'wireframe',
};

const STAGE_OVERRIDES_KEY = 'prdKanban.stageOverrides';
const NOTES_KEY = 'prdKanban.notes';
const OUTPUT_LIMIT = 60_000;

function activate(context) {
  const board = new PrdKanbanController(context);
  context.subscriptions.push(
    vscode.commands.registerCommand('prdKanban.openBoard', () => board.openBoard())
  );
}

function deactivate() {}

class PrdKanbanController {
  constructor(context) {
    this.context = context;
    this.panel = undefined;
    this.fileWatcher = undefined;
    this.running = undefined;
    this.outputByFeature = {};
    this.resultByFeature = {};
  }

  openBoard() {
    if (this.panel) {
      this.panel.reveal(vscode.ViewColumn.One);
      this.pushState();
      return;
    }

    this.panel = vscode.window.createWebviewPanel(
      'prdKanbanBoard',
      'PRD Workflow Board',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
      }
    );
    this.panel.webview.html = this.getWebviewHtml(this.panel.webview);

    this.panel.onDidDispose(() => {
      this.panel = undefined;
    });

    this.panel.webview.onDidReceiveMessage((message) => {
      this.handleMessage(message);
    });

    this.ensureWatcher();
    this.pushState();
  }

  ensureWatcher() {
    if (this.fileWatcher) {
      return;
    }
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      return;
    }
    const pattern = new vscode.RelativePattern(workspaceRoot, 'PRDs/**');
    this.fileWatcher = vscode.workspace.createFileSystemWatcher(pattern);
    const refresh = () => {
      if (this.panel) {
        this.pushState();
      }
    };
    this.fileWatcher.onDidCreate(refresh, this, this.context.subscriptions);
    this.fileWatcher.onDidChange(refresh, this, this.context.subscriptions);
    this.fileWatcher.onDidDelete(refresh, this, this.context.subscriptions);
    this.context.subscriptions.push(this.fileWatcher);
  }

  async handleMessage(message) {
    if (!message || typeof message !== 'object') {
      return;
    }
    switch (message.type) {
      case 'ready':
      case 'refresh':
        await this.pushState();
        return;
      case 'moveCard':
        await this.handleMoveCard(message);
        return;
      case 'updateNotes':
        await this.handleUpdateNotes(message);
        return;
      case 'runStage':
        await this.handleRunStage(message);
        return;
      default:
        return;
    }
  }

  async handleMoveCard(message) {
    const feature = typeof message.feature === 'string' ? message.feature : '';
    const toStage = typeof message.toStage === 'string' ? message.toStage : '';
    if (!feature || !isStage(toStage) || toStage === 'done') {
      return;
    }
    const state = await this.buildState();
    const card = state.cards.find((item) => item.feature === feature);
    if (!card) {
      return;
    }
    if (stageIndex(toStage) < stageIndex(card.inferredStage)) {
      this.postMessage({
        type: 'toast',
        level: 'warning',
        message: `Cannot move ${feature} before completed artifacts.`,
      });
      return;
    }

    const overrides = this.getStageOverrides();
    if (toStage === card.inferredStage) {
      delete overrides[feature];
    } else {
      overrides[feature] = toStage;
    }

    await this.context.workspaceState.update(STAGE_OVERRIDES_KEY, overrides);
    await this.pushState();
  }

  async handleUpdateNotes(message) {
    const feature = typeof message.feature === 'string' ? message.feature : '';
    if (!feature) {
      return;
    }
    const notes = typeof message.notes === 'string' ? message.notes : '';
    const notesMap = this.getNotes();
    if (notes.trim()) {
      notesMap[feature] = notes;
    } else {
      delete notesMap[feature];
    }
    await this.context.workspaceState.update(NOTES_KEY, notesMap);
  }

  async handleRunStage(message) {
    const feature = typeof message.feature === 'string' ? message.feature : '';
    const stage = typeof message.stage === 'string' ? message.stage : '';
    const notes = typeof message.notes === 'string' ? message.notes : '';

    if (!feature || !isStage(stage) || !RUNNABLE_STAGES.has(stage)) {
      return;
    }

    if (this.running) {
      this.postMessage({
        type: 'toast',
        level: 'warning',
        message: `Action already running for ${this.running.feature}. Only one action can run at a time.`,
      });
      return;
    }

    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      this.postMessage({
        type: 'toast',
        level: 'error',
        message: 'Open a workspace folder first.',
      });
      return;
    }

    const state = await this.buildState();
    const card = state.cards.find((item) => item.feature === feature);
    if (!card) {
      return;
    }
    if (card.stage !== stage) {
      this.postMessage({
        type: 'toast',
        level: 'warning',
        message: `${feature} is currently in ${STAGE_LABELS[card.stage]}. Refresh and try again.`,
      });
      await this.pushState();
      return;
    }

    const commandName = STAGE_COMMANDS[stage];
    const commandLine = `/${commandName} ${quoteFeature(feature)}`;
    const prompt = notes.trim()
      ? `${commandLine}\n\nContext notes:\n${notes.trim()}`
      : commandLine;

    const config = vscode.workspace.getConfiguration('prdKanban');
    const cliPath = config.get('claudeCliPath', '/opt/homebrew/bin/claude');
    let cliArgs = config.get('cliArgs', ['--dangerously-skip-permissions', '-p']);
    if (!Array.isArray(cliArgs) || cliArgs.some((item) => typeof item !== 'string')) {
      cliArgs = ['--dangerously-skip-permissions', '-p'];
    }
    let timeoutMs = Number(config.get('timeoutMs', 600000));
    if (!Number.isFinite(timeoutMs) || timeoutMs < 30_000) {
      timeoutMs = 600_000;
    }

    this.outputByFeature[feature] = '';
    this.resultByFeature[feature] = null;
    this.running = {
      feature,
      stage,
      startedAt: Date.now(),
      pid: null,
    };

    const overrides = this.getStageOverrides();
    if (card.stage !== card.inferredStage) {
      overrides[feature] = card.stage;
      await this.context.workspaceState.update(STAGE_OVERRIDES_KEY, overrides);
    }

    await this.pushState();

    let proc;
    try {
      proc = spawn(cliPath, cliArgs, {
        cwd: workspaceRoot,
        env: buildCliEnv(),
        stdio: ['pipe', 'pipe', 'pipe'],
      });
    } catch (err) {
      this.running = undefined;
      this.resultByFeature[feature] = {
        ok: false,
        statusText: `Failed to start Claude CLI: ${err.message}`,
        finishedAt: Date.now(),
      };
      await this.pushState();
      this.postMessage({
        type: 'toast',
        level: 'error',
        message: `Failed to start Claude CLI: ${err.message}`,
      });
      return;
    }

    this.running.pid = proc.pid || null;
    let finished = false;
    let timedOut = false;

    const finish = async (ok, statusText) => {
      if (finished) {
        return;
      }
      finished = true;
      this.running = undefined;

      const refreshed = await this.buildState();
      const updatedCard = refreshed.cards.find((item) => item.feature === feature);
      const stageOverrides = this.getStageOverrides();

      if (updatedCard) {
        if (ok && stageIndex(updatedCard.inferredStage) > stageIndex(stage)) {
          delete stageOverrides[feature];
        } else if (stageIndex(updatedCard.inferredStage) < stageIndex(stage)) {
          stageOverrides[feature] = stage;
        }
      }
      await this.context.workspaceState.update(STAGE_OVERRIDES_KEY, stageOverrides);

      this.resultByFeature[feature] = {
        ok,
        statusText,
        finishedAt: Date.now(),
      };

      if (!ok) {
        this.appendOutput(feature, `\n[${statusText}]`);
      }

      await this.pushState();

      if (ok && updatedCard && stageIndex(updatedCard.inferredStage) <= stageIndex(stage)) {
        this.postMessage({
          type: 'toast',
          level: 'warning',
          message: `${feature} finished but no next-stage artifact was detected.`,
        });
      } else {
        this.postMessage({
          type: 'toast',
          level: ok ? 'info' : 'error',
          message: ok
            ? `${feature}: /${commandName} completed.`
            : `${feature}: ${statusText}`,
        });
      }
    };

    const timeoutId = setTimeout(() => {
      timedOut = true;
      proc.kill('SIGTERM');
    }, timeoutMs);

    proc.stdout.on('data', (chunk) => {
      this.appendOutput(feature, chunk.toString());
    });
    proc.stderr.on('data', (chunk) => {
      this.appendOutput(feature, chunk.toString());
    });
    proc.on('error', (err) => {
      clearTimeout(timeoutId);
      finish(false, `Failed to start Claude CLI: ${err.message}`);
    });
    proc.on('close', (code) => {
      clearTimeout(timeoutId);
      if (timedOut) {
        finish(false, `Timed out after ${Math.round(timeoutMs / 1000)}s`);
        return;
      }
      if (code === 0) {
        finish(true, 'Completed');
        return;
      }
      finish(false, `Exited with code ${code}`);
    });

    proc.stdin.write(prompt);
    proc.stdin.end();
  }

  appendOutput(feature, text) {
    const current = this.outputByFeature[feature] || '';
    const next = `${current}${text}`.slice(-OUTPUT_LIMIT);
    this.outputByFeature[feature] = next;
    this.postMessage({
      type: 'runOutput',
      feature,
      output: next,
    });
  }

  async pushState() {
    const state = await this.buildState();
    this.postMessage({ type: 'state', ...state });
  }

  postMessage(message) {
    if (!this.panel) {
      return;
    }
    this.panel.webview.postMessage(message);
  }

  getStageOverrides() {
    const value = this.context.workspaceState.get(STAGE_OVERRIDES_KEY, {});
    if (!value || typeof value !== 'object') {
      return {};
    }
    return { ...value };
  }

  getNotes() {
    const value = this.context.workspaceState.get(NOTES_KEY, {});
    if (!value || typeof value !== 'object') {
      return {};
    }
    return { ...value };
  }

  async buildState() {
    const workspaceRoot = getWorkspaceRoot();
    if (!workspaceRoot) {
      return {
        cards: [],
        running: this.runningState(),
        warning: 'Open a workspace folder to use this board.',
      };
    }

    const prdsDir = path.join(workspaceRoot, 'PRDs');
    if (!fs.existsSync(prdsDir)) {
      return {
        cards: [],
        running: this.runningState(),
        warning: `PRDs folder not found at ${prdsDir}`,
      };
    }

    const stageOverrides = this.getStageOverrides();
    const notesMap = this.getNotes();

    const cards = [];
    const folderNames = fs.readdirSync(prdsDir, { withFileTypes: true })
      .filter((entry) => entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'Icon')
      .map((entry) => entry.name);

    const activeSet = new Set(folderNames);

    for (const feature of folderNames) {
      const featurePath = path.join(prdsDir, feature);
      const artifacts = scanArtifacts(featurePath);
      const inferredStage = inferStage(artifacts);
      const overrideStage = stageOverrides[feature];
      const stage = computeEffectiveStage(inferredStage, overrideStage);

      cards.push({
        feature,
        stage,
        inferredStage,
        artifacts,
        notes: notesMap[feature] || '',
        output: this.outputByFeature[feature] || '',
        lastResult: this.resultByFeature[feature] || null,
      });
    }

    const cleanedOverrides = {};
    for (const [feature, stage] of Object.entries(stageOverrides)) {
      if (activeSet.has(feature) && isStage(stage) && stage !== 'done') {
        cleanedOverrides[feature] = stage;
      }
    }

    const cleanedNotes = {};
    for (const [feature, notes] of Object.entries(notesMap)) {
      if (activeSet.has(feature) && typeof notes === 'string' && notes.trim()) {
        cleanedNotes[feature] = notes;
      }
    }

    const overridesChanged = JSON.stringify(cleanedOverrides) !== JSON.stringify(stageOverrides);
    const notesChanged = JSON.stringify(cleanedNotes) !== JSON.stringify(notesMap);
    if (overridesChanged) {
      await this.context.workspaceState.update(STAGE_OVERRIDES_KEY, cleanedOverrides);
    }
    if (notesChanged) {
      await this.context.workspaceState.update(NOTES_KEY, cleanedNotes);
    }

    cards.sort((a, b) => a.feature.localeCompare(b.feature));

    return {
      cards,
      running: this.runningState(),
      warning: null,
    };
  }

  runningState() {
    if (!this.running) {
      return null;
    }
    return {
      feature: this.running.feature,
      stage: this.running.stage,
      startedAt: this.running.startedAt,
      pid: this.running.pid,
    };
  }

  getWebviewHtml(webview) {
    const nonce = getNonce();
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta http-equiv="Content-Security-Policy" content="default-src 'none'; style-src 'unsafe-inline'; script-src 'nonce-${nonce}';" />
  <title>PRD Workflow Board</title>
  <style>
    :root {
      color-scheme: light;
      --bg: #f7f1e8;
      --panel: #fffdf8;
      --panel-2: #fff8ee;
      --line: #1f1b17;
      --line-soft: #6d655a;
      --text: #171411;
      --muted: #62594f;
      --accent: #0f766e;
      --accent-soft: #d7f1ed;
      --warn: #b45309;
      --ok: #166534;
      --error: #b91c1c;
      --focus: #0284c7;
      --shadow-soft: 2px 2px 0 rgba(31, 27, 23, 0.2);
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: ui-sans-serif, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif;
      color: var(--text);
      background: var(--bg);
    }
    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 12px;
      padding: 10px 14px;
      border-bottom: 2px solid var(--line);
      background: #fff4d8;
      box-shadow: 0 2px 0 rgba(31, 27, 23, 0.18);
      position: sticky;
      top: 0;
      z-index: 2;
    }
    .title {
      font-size: 13px;
      font-weight: 700;
      letter-spacing: 0.03em;
    }
    .subtitle {
      font-size: 11px;
      color: var(--muted);
      margin-top: 2px;
    }
    .actions {
      display: flex;
      align-items: center;
      gap: 8px;
    }
    .btn {
      border: 2px solid var(--line);
      border-radius: 4px;
      background: var(--panel);
      color: var(--text);
      font-size: 11px;
      font-weight: 600;
      padding: 6px 10px;
      cursor: pointer;
      box-shadow: var(--shadow-soft);
    }
    .btn:hover {
      border-color: var(--accent);
      background: #f2faf8;
    }
    .btn:disabled {
      opacity: 0.55;
      cursor: not-allowed;
      box-shadow: none;
    }
    .hint {
      padding: 8px 14px;
      border-bottom: 2px solid var(--line);
      background: #fffdf8;
      color: var(--muted);
      font-size: 11px;
    }
    .warning {
      color: var(--warn);
      font-weight: 600;
    }
    .board-wrap {
      overflow-x: auto;
      overflow-y: hidden;
      height: calc(100vh - 86px);
    }
    .board {
      display: grid;
      grid-template-columns: repeat(6, minmax(270px, 1fr));
      gap: 12px;
      padding: 12px;
      min-width: 1620px;
      height: 100%;
    }
    .column {
      background: var(--panel-2);
      border: 2px solid var(--line);
      border-radius: 4px;
      display: flex;
      flex-direction: column;
      min-height: 0;
      box-shadow: var(--shadow-soft);
      overflow: hidden;
    }
    .column.drag-target {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px var(--accent) inset, var(--shadow-soft);
    }
    .col-head {
      padding: 9px 10px;
      border-bottom: 2px solid var(--line);
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #f8eedf;
    }
    .column[data-stage="backlog"] .col-head { background: #ebe9e4; }
    .column[data-stage="research"] .col-head { background: #ddf5ef; }
    .column[data-stage="jtbd"] .col-head { background: #e4eefc; }
    .column[data-stage="prd"] .col-head { background: #fff1ca; }
    .column[data-stage="wireframe"] .col-head { background: #ffe4ec; }
    .column[data-stage="done"] .col-head { background: #e4f8db; }
    .column[data-stage="backlog"] .col-body { background: #f6f5f2; }
    .column[data-stage="research"] .col-body { background: #f4fcf9; }
    .column[data-stage="jtbd"] .col-body { background: #f4f7ff; }
    .column[data-stage="prd"] .col-body { background: #fffbef; }
    .column[data-stage="wireframe"] .col-body { background: #fff5f8; }
    .column[data-stage="done"] .col-body { background: #f4fcf0; }
    .col-title {
      font-size: 11px;
      font-weight: 700;
      letter-spacing: 0.06em;
      text-transform: uppercase;
    }
    .count {
      font-size: 10px;
      color: var(--muted);
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 2px 6px;
      min-width: 22px;
      text-align: center;
      background: rgba(255, 255, 255, 0.65);
    }
    .col-body {
      flex: 1;
      overflow-y: auto;
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
    }
    .drop-empty {
      border: 2px dashed var(--line-soft);
      border-radius: 4px;
      padding: 8px;
      font-size: 10px;
      color: var(--muted);
      text-align: center;
      background: rgba(255, 255, 255, 0.5);
    }
    .card {
      border: 2px solid var(--line);
      border-radius: 4px;
      background: var(--panel);
      padding: 8px;
      display: flex;
      flex-direction: column;
      gap: 8px;
      box-shadow: var(--shadow-soft);
    }
    .card.running {
      border-color: var(--accent);
      box-shadow: 0 0 0 2px var(--accent) inset, var(--shadow-soft);
    }
    .card-head {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .feature {
      font-size: 12px;
      font-weight: 700;
      line-height: 1.4;
      word-break: break-word;
    }
    .manual {
      font-size: 9px;
      border: 1px solid var(--line);
      border-radius: 999px;
      padding: 1px 6px;
      color: var(--warn);
      white-space: nowrap;
      background: #fff4e3;
    }
    .artifact-row {
      display: flex;
      flex-wrap: wrap;
      gap: 6px;
    }
    .artifact {
      border: 1px solid var(--line);
      border-radius: 4px;
      padding: 1px 5px;
      font-size: 9px;
      letter-spacing: 0.03em;
      color: var(--muted);
      background: rgba(255, 255, 255, 0.8);
    }
    .artifact.on {
      color: var(--ok);
      border-color: var(--ok);
      background: #dcfce7;
    }
    .notes {
      width: 100%;
      min-height: 58px;
      resize: vertical;
      border: 2px solid var(--line);
      border-radius: 4px;
      background: #fffdf8;
      color: var(--text);
      font-size: 11px;
      line-height: 1.4;
      padding: 7px;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
    }
    .notes::placeholder { color: #857b6f; }
    .run-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 8px;
    }
    .run-btn {
      border: 2px solid var(--line);
      border-radius: 4px;
      background: var(--accent-soft);
      color: var(--text);
      font-size: 11px;
      font-weight: 700;
      padding: 6px 8px;
      cursor: pointer;
      box-shadow: var(--shadow-soft);
    }
    .run-btn:hover {
      border-color: var(--accent);
      background: #cceae6;
    }
    .run-btn:disabled {
      opacity: 0.5;
      cursor: not-allowed;
      box-shadow: none;
      background: #e8e4dc;
      border-color: var(--line-soft);
    }
    .loader {
      display: inline-flex;
      align-items: center;
      gap: 6px;
      font-size: 10px;
      color: var(--accent);
      font-weight: 700;
      white-space: nowrap;
    }
    .spinner {
      width: 11px;
      height: 11px;
      border: 2px solid rgba(15, 118, 110, 0.2);
      border-top-color: var(--accent);
      border-radius: 50%;
      animation: spin 0.8s linear infinite;
      display: inline-block;
    }
    @keyframes spin {
      to { transform: rotate(360deg); }
    }
    .result {
      font-size: 10px;
      border-radius: 4px;
      padding: 5px 6px;
      line-height: 1.4;
    }
    .result.ok {
      border: 1px solid var(--ok);
      background: #dcfce7;
      color: #14532d;
    }
    .result.error {
      border: 1px solid var(--error);
      background: #fee2e2;
      color: #991b1b;
    }
    .result.warn {
      border: 1px solid var(--warn);
      background: #fef3c7;
      color: #92400e;
    }
    details {
      border: 2px solid var(--line);
      border-radius: 4px;
      background: #fffdf8;
      overflow: hidden;
    }
    summary {
      cursor: pointer;
      font-size: 10px;
      color: var(--muted);
      padding: 5px 7px;
      user-select: none;
      background: #f4ede2;
    }
    pre {
      margin: 0;
      padding: 8px;
      max-height: 220px;
      overflow: auto;
      border-top: 2px solid var(--line);
      font-size: 10px;
      line-height: 1.45;
      color: var(--text);
      background: #fffcf6;
      font-family: ui-monospace, SFMono-Regular, Menlo, monospace;
      white-space: pre-wrap;
      word-break: break-word;
    }
    .toast {
      position: fixed;
      right: 14px;
      bottom: 14px;
      min-width: 250px;
      max-width: 460px;
      border: 2px solid var(--line);
      border-radius: 4px;
      background: #fffdf8;
      color: var(--text);
      font-size: 11px;
      line-height: 1.4;
      padding: 8px 10px;
      box-shadow: 4px 4px 0 rgba(31, 27, 23, 0.28);
      display: none;
    }
    .toast.show { display: block; }
    .toast.info { border-color: var(--accent); background: #ecfbf8; color: #115e59; }
    .toast.warning { border-color: var(--warn); background: #fff7db; color: #92400e; }
    .toast.error { border-color: var(--error); background: #ffecec; color: #991b1b; }

    .btn:focus-visible,
    .run-btn:focus-visible,
    .notes:focus-visible,
    summary:focus-visible {
      outline: 2px solid var(--focus);
      outline-offset: 2px;
    }
  </style>
</head>
<body>
  <div class="topbar">
    <div>
      <div class="title">PRD Slash-Command Workflow</div>
      <div class="subtitle">/research -> /jtbd -> /prd -> /wireframe</div>
    </div>
    <div class="actions">
      <button id="refreshBtn" class="btn">Refresh</button>
    </div>
  </div>
  <div id="hint" class="hint"></div>
  <div class="board-wrap">
    <div id="board" class="board"></div>
  </div>
  <div id="toast" class="toast"></div>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();
    const stages = ['backlog', 'research', 'jtbd', 'prd', 'wireframe', 'done'];
    const labels = {
      backlog: 'Backlog',
      research: 'Research',
      jtbd: 'JTBD',
      prd: 'PRD',
      wireframe: 'Wireframe',
      done: 'Done'
    };

    let appState = {
      cards: [],
      running: null,
      warning: null
    };

    const noteTimers = new Map();
    const boardEl = document.getElementById('board');
    const hintEl = document.getElementById('hint');
    const refreshBtn = document.getElementById('refreshBtn');
    const toastEl = document.getElementById('toast');

    refreshBtn.addEventListener('click', () => {
      vscode.postMessage({ type: 'refresh' });
    });

    window.addEventListener('message', (event) => {
      const message = event.data;
      if (!message || typeof message !== 'object') {
        return;
      }
      if (message.type === 'state') {
        appState = {
          cards: Array.isArray(message.cards) ? message.cards : [],
          running: message.running || null,
          warning: message.warning || null
        };
        render();
        return;
      }
      if (message.type === 'runOutput') {
        if (typeof message.feature !== 'string') {
          return;
        }
        const card = appState.cards.find((item) => item.feature === message.feature);
        if (card) {
          card.output = typeof message.output === 'string' ? message.output : '';
          render();
        }
        return;
      }
      if (message.type === 'toast') {
        showToast(message.message || '', message.level || 'info');
      }
    });

    function render() {
      if (appState.warning) {
        hintEl.innerHTML = '<span class="warning">' + escapeHtml(appState.warning) + '</span>';
      } else if (appState.running) {
        const run = appState.running;
        hintEl.textContent = 'Running /' + run.stage + ' for "' + run.feature + '". All other Run buttons are locked.';
      } else {
        hintEl.textContent = 'Drag cards across columns. Only one stage action can run at a time.';
      }

      const columnsHtml = stages.map((stage) => {
        const cards = appState.cards.filter((card) => card.stage === stage);
        const cardsHtml = cards.length > 0
          ? cards.map((card) => renderCard(card)).join('')
          : '<div class="drop-empty">Drop card here</div>';

        return ''
          + '<section class="column" data-stage="' + stage + '">'
          +   '<div class="col-head">'
          +     '<div class="col-title">' + labels[stage] + '</div>'
          +     '<div class="count">' + cards.length + '</div>'
          +   '</div>'
          +   '<div class="col-body">' + cardsHtml + '</div>'
          + '</section>';
      }).join('');

      boardEl.innerHTML = columnsHtml;
      wireInteractions();
    }

    function renderCard(card) {
      const running = Boolean(appState.running && appState.running.feature === card.feature);
      const anyRunning = Boolean(appState.running);
      const runnable = ['research', 'jtbd', 'prd', 'wireframe'].includes(card.stage);
      const isBacklog = card.stage === 'backlog';
      const runLabel = '/'+ card.stage;
      const result = renderResult(card.lastResult);

      const artifacts = [
        renderArtifact('research', card.artifacts && card.artifacts.hasResearch),
        renderArtifact('jtbd', card.artifacts && card.artifacts.hasJtbd),
        renderArtifact('prd', card.artifacts && card.artifacts.hasPrd),
        renderArtifact('wireframe', card.artifacts && card.artifacts.hasWireframe)
      ].join('');

      const notes = typeof card.notes === 'string' ? card.notes : '';
      const output = typeof card.output === 'string' && card.output.trim()
        ? '<details><summary>Command output</summary><pre>' + escapeHtml(card.output) + '</pre></details>'
        : '';

      return ''
        + '<article class="card' + (running ? ' running' : '') + '" draggable="' + (!anyRunning) + '" data-feature="' + encodeURIComponent(card.feature) + '" data-stage="' + card.stage + '">'
        +   '<div class="card-head">'
        +     '<div class="feature">' + escapeHtml(card.feature) + '</div>'
        +     (card.stage !== card.inferredStage ? '<span class="manual">manual</span>' : '')
        +   '</div>'
        +   '<div class="artifact-row">' + artifacts + '</div>'
        +   (isBacklog
              ? '<div class="run-row"><button class="run-btn" data-action="move-research" data-feature="' + encodeURIComponent(card.feature) + '"' + (anyRunning ? ' disabled' : '') + '>Move to Research</button></div>'
              : '')
        +   (runnable
              ? ''
                + '<textarea class="notes" data-feature="' + encodeURIComponent(card.feature) + '" placeholder="Optional notes for this stage...">' + escapeHtml(notes) + '</textarea>'
                + '<div class="run-row">'
                +   '<button class="run-btn" data-action="run" data-stage="' + card.stage + '" data-feature="' + encodeURIComponent(card.feature) + '"' + (anyRunning ? ' disabled' : '') + '>Run ' + runLabel + '</button>'
                +   (running
                      ? '<span class="loader"><span class="spinner"></span>Running...</span>'
                      : '')
                + '</div>'
              : '')
        +   result
        +   output
        + '</article>';
    }

    function renderResult(lastResult) {
      if (!lastResult || typeof lastResult !== 'object') {
        return '';
      }
      const ok = Boolean(lastResult.ok);
      const statusText = typeof lastResult.statusText === 'string' ? lastResult.statusText : '';
      if (!statusText) {
        return '';
      }
      const cls = ok ? 'ok' : (statusText.toLowerCase().includes('artifact') ? 'warn' : 'error');
      return '<div class="result ' + cls + '">' + escapeHtml(statusText) + '</div>';
    }

    function renderArtifact(name, enabled) {
      return '<span class="artifact' + (enabled ? ' on' : '') + '">' + name.toUpperCase() + '</span>';
    }

    function wireInteractions() {
      const anyRunning = Boolean(appState.running);

      document.querySelectorAll('.card').forEach((cardEl) => {
        if (anyRunning) {
          return;
        }
        cardEl.addEventListener('dragstart', (event) => {
          const feature = cardEl.getAttribute('data-feature') || '';
          event.dataTransfer.setData('text/plain', feature);
          event.dataTransfer.effectAllowed = 'move';
        });
      });

      document.querySelectorAll('.column').forEach((colEl) => {
        colEl.addEventListener('dragover', (event) => {
          if (anyRunning) {
            return;
          }
          event.preventDefault();
          colEl.classList.add('drag-target');
        });
        colEl.addEventListener('dragleave', () => {
          colEl.classList.remove('drag-target');
        });
        colEl.addEventListener('drop', (event) => {
          colEl.classList.remove('drag-target');
          if (anyRunning) {
            return;
          }
          event.preventDefault();
          const encodedFeature = event.dataTransfer.getData('text/plain');
          const toStage = colEl.getAttribute('data-stage');
          if (!encodedFeature || !toStage) {
            return;
          }
          vscode.postMessage({
            type: 'moveCard',
            feature: decodeURIComponent(encodedFeature),
            toStage
          });
        });
      });

      document.querySelectorAll('textarea.notes').forEach((textarea) => {
        textarea.addEventListener('input', () => {
          const encodedFeature = textarea.getAttribute('data-feature');
          if (!encodedFeature) {
            return;
          }
          const key = encodedFeature;
          if (noteTimers.has(key)) {
            clearTimeout(noteTimers.get(key));
          }
          const timer = setTimeout(() => {
            vscode.postMessage({
              type: 'updateNotes',
              feature: decodeURIComponent(encodedFeature),
              notes: textarea.value || ''
            });
            noteTimers.delete(key);
          }, 250);
          noteTimers.set(key, timer);
        });
      });

      document.querySelectorAll('button[data-action="run"]').forEach((button) => {
        button.addEventListener('click', () => {
          const encodedFeature = button.getAttribute('data-feature');
          const stage = button.getAttribute('data-stage');
          if (!encodedFeature || !stage) {
            return;
          }
          const cardEl = button.closest('.card');
          const notes = cardEl ? (cardEl.querySelector('textarea.notes')?.value || '') : '';
          vscode.postMessage({
            type: 'runStage',
            feature: decodeURIComponent(encodedFeature),
            stage,
            notes
          });
        });
      });

      document.querySelectorAll('button[data-action="move-research"]').forEach((button) => {
        button.addEventListener('click', () => {
          const encodedFeature = button.getAttribute('data-feature');
          if (!encodedFeature) {
            return;
          }
          vscode.postMessage({
            type: 'moveCard',
            feature: decodeURIComponent(encodedFeature),
            toStage: 'research'
          });
        });
      });
    }

    function escapeHtml(value) {
      return String(value)
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
    }

    function showToast(message, level) {
      if (!message) {
        return;
      }
      toastEl.className = 'toast show ' + (level || 'info');
      toastEl.textContent = message;
      clearTimeout(showToast._timer);
      showToast._timer = setTimeout(() => {
        toastEl.className = 'toast';
        toastEl.textContent = '';
      }, 3800);
    }

    vscode.postMessage({ type: 'ready' });
  </script>
</body>
</html>`;
  }
}

function isStage(value) {
  return typeof value === 'string' && STAGES.includes(value);
}

function stageIndex(stage) {
  return STAGES.indexOf(stage);
}

function computeEffectiveStage(inferredStage, overrideStage) {
  if (!isStage(inferredStage)) {
    return 'backlog';
  }
  if (inferredStage === 'done') {
    return 'done';
  }
  if (!isStage(overrideStage) || overrideStage === 'done') {
    return inferredStage;
  }
  return stageIndex(overrideStage) >= stageIndex(inferredStage)
    ? overrideStage
    : inferredStage;
}

function inferStage(artifacts) {
  if (artifacts.hasWireframe) {
    return 'done';
  }
  if (artifacts.hasPrd) {
    return 'wireframe';
  }
  if (artifacts.hasJtbd) {
    return 'prd';
  }
  if (artifacts.hasResearch) {
    return 'jtbd';
  }
  return 'backlog';
}

function scanArtifacts(featurePath) {
  const files = [];
  walkFiles(featurePath, featurePath, files, 0);

  let hasResearch = false;
  let hasJtbd = false;
  let hasPrd = false;
  let hasWireframe = false;

  for (const relPath of files) {
    const normalized = relPath.split(path.sep).join('/').toLowerCase();
    const basename = path.basename(normalized);
    const ext = path.extname(basename);

    const isDoc = ['.md', '.markdown', '.txt', '.docx'].includes(ext);
    const isHtml = ext === '.html' || ext === '.htm';

    if (isDoc && basename.includes('research')) {
      hasResearch = true;
    }
    if (isDoc && (basename.includes('jtbd') || basename.includes('job-to-be-done') || basename.includes('jobs-to-be-done'))) {
      hasJtbd = true;
    }
    if (isDoc && /(^|[._ -])prd([._ -]|$)/.test(basename)) {
      hasPrd = true;
    }
    if (isHtml && (normalized.includes('/wireframes/') || basename.includes('wireframe'))) {
      hasWireframe = true;
    }
  }

  return {
    hasResearch,
    hasJtbd,
    hasPrd,
    hasWireframe,
  };
}

function walkFiles(rootPath, dirPath, outFiles, depth) {
  if (depth > 5) {
    return;
  }
  let entries = [];
  try {
    entries = fs.readdirSync(dirPath, { withFileTypes: true });
  } catch {
    return;
  }

  for (const entry of entries) {
    if (entry.name.startsWith('.') || entry.name === 'Icon') {
      continue;
    }
    const fullPath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      walkFiles(rootPath, fullPath, outFiles, depth + 1);
      continue;
    }
    if (entry.isFile()) {
      outFiles.push(path.relative(rootPath, fullPath));
    }
  }
}

function quoteFeature(feature) {
  const escaped = String(feature).replace(/\\/g, '\\\\').replace(/"/g, '\\"');
  if (/[\s"]/u.test(feature)) {
    return `"${escaped}"`;
  }
  return escaped;
}

function getWorkspaceRoot() {
  const folder = vscode.workspace.workspaceFolders && vscode.workspace.workspaceFolders[0];
  return folder ? folder.uri.fsPath : null;
}

function buildCliEnv() {
  const env = { ...process.env };
  delete env.ANTHROPIC_API_KEY;
  env.HOME = env.HOME || process.env.HOME || '';
  if (!env.PATH) {
    env.PATH = '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin';
  } else if (!env.PATH.includes('/opt/homebrew/bin')) {
    env.PATH = `/opt/homebrew/bin:${env.PATH}`;
  }
  return env;
}

function getNonce() {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let value = '';
  for (let i = 0; i < 32; i += 1) {
    value += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return value;
}

module.exports = {
  activate,
  deactivate,
};
