import { registerCommand } from './command-registry';
import { route } from './router';
import { createTask, updateTask, completeTask, findMatchingTasks } from '../services/task-manager/task-manager.service';
import { routeTask } from '../integrations/todoist/routing';
import { TODOIST_SECTIONS } from '../config/sections';
import * as readline from 'readline';

/** Resolve a user-supplied section name to a { id, name } pair, or null if unrecognised. */
function resolveSection(raw: string): { id: string; name: string } | null {
  const lower = raw.toLowerCase().replace(/[^a-z]/g, '');
  for (const sec of Object.values(TODOIST_SECTIONS)) {
    if (sec.name.toLowerCase().replace(/[^a-z]/g, '') === lower) return sec;
  }
  return null;
}

function askConfirm(question: string): Promise<boolean> {
  const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
  return new Promise(resolve => {
    rl.question(`${question} [y/n] `, answer => {
      rl.close();
      resolve(answer.trim().toLowerCase() === 'y');
    });
  });
}

// ── /add ────────────────────────────────────────────────────────────────────
registerCommand({
  name: 'add',
  description: 'Create a new Todoist task',
  usage: 'add "<task title>" [due:"tomorrow"] [p:2]',
  handler: async (args) => {
    const title = args[0];
    if (!title) { console.error('Usage: add "<task title>"'); process.exit(1); }

    const dueArg     = args.find(a => a.startsWith('due:'))?.slice(4);
    const priArg     = args.find(a => a.startsWith('p:'))?.slice(2);
    const sectionArg = args.find(a => a.startsWith('section:'))?.slice(8);
    const priority   = priArg ? (parseInt(priArg, 10) as 1|2|3|4) : undefined;

    let sectionId:   string;
    let sectionName: string;
    let ruleLabel:   string;

    if (sectionArg) {
      const resolved = resolveSection(sectionArg);
      if (!resolved) {
        const valid = Object.values(TODOIST_SECTIONS).map(s => s.name).join(', ');
        console.error(`Unknown section "${sectionArg}". Valid: ${valid}`);
        process.exit(1);
      }
      sectionId   = resolved.id;
      sectionName = resolved.name;
      ruleLabel   = 'section-override';
    } else {
      const routing = routeTask(title);
      sectionId   = routing.sectionId;
      sectionName = routing.sectionName;
      ruleLabel   = `${routing.rule}, confidence: ${routing.confidence}${routing.match ? `, match: ${routing.match}` : ''}`;
      if (routing.competingMatch) {
        console.log(`  ⚠ Competing match: ${routing.competingMatch.rule} → ${routing.competingMatch.match} (logged, CS wins)`);
      }
      const needsConfirm = routing.confidence === 'inferred' || routing.confidence === 'defaulted';
      if (needsConfirm) {
        console.log(`\nCreating task: "${title}"`);
        console.log(`  Section:    ${sectionName}  (rule: ${ruleLabel})`);
        if (dueArg)   console.log(`  Due:        ${dueArg}`);
        if (priority) console.log(`  Priority:   ${priority}`);
        const ok = await askConfirm('Routing confidence is low — proceed?');
        if (!ok) { console.log('Cancelled.'); return; }
      }
    }

    console.log(`\nCreating task: "${title}"`);
    console.log(`  Section:    ${sectionName}  (rule: ${ruleLabel})`);
    if (dueArg)   console.log(`  Due:        ${dueArg}`);
    if (priority) console.log(`  Priority:   ${priority}`);

    const task = await createTask({
      content:   title,
      dueString: dueArg,
      priority,
      sectionId,
    });

    console.log(`\n✓ Created: ${task.content} [${task.id}] → ${sectionName}`);
    console.log(`  Todoist: ${task.url}`);
  },
});

// ── /update ──────────────────────────────────────────────────────────────────
registerCommand({
  name: 'update',
  description: 'Update an existing Todoist task',
  usage: 'update <taskId> [content:"new"] [due:"tomorrow"] [p:2]',
  handler: async (args) => {
    const taskId   = args[0];
    if (!taskId) { console.error('Usage: update <taskId> [field:value ...]'); process.exit(1); }

    const contentArg = args.find(a => a.startsWith('content:'))?.slice(8);
    const dueArg     = args.find(a => a.startsWith('due:'))?.slice(4);
    const priArg     = args.find(a => a.startsWith('p:'))?.slice(2);
    const priority   = priArg ? (parseInt(priArg, 10) as 1|2|3|4) : undefined;

    console.log(`\nUpdating task ${taskId}:`);
    if (contentArg) console.log(`  content → "${contentArg}"`);
    if (dueArg)     console.log(`  due     → ${dueArg}`);
    if (priority)   console.log(`  priority → ${priority}`);

    const ok = await askConfirm('Apply changes?');
    if (!ok) { console.log('Cancelled.'); return; }

    const task = await updateTask(taskId, { content: contentArg, dueString: dueArg, priority });
    console.log(`\n✓ Updated: ${task.content} [${task.id}]`);
  },
});

// ── /done ────────────────────────────────────────────────────────────────────
registerCommand({
  name: 'done',
  description: 'Complete a Todoist task',
  usage: 'done <taskId|"search query">',
  handler: async (args) => {
    const query = args.join(' ');
    if (!query) { console.error('Usage: done <taskId or search query>'); process.exit(1); }

    // Try direct ID first, else search
    const isId = /^\d+$/.test(query);
    if (isId) {
      const ok = await askConfirm(`Complete task ${query}?`);
      if (!ok) { console.log('Cancelled.'); return; }
      await completeTask(query);
      console.log(`\n✓ Completed task ${query}`);
      return;
    }

    // Search
    const matches = findMatchingTasks(query);
    if (matches.length === 0) {
      console.log(`No open tasks matching "${query}"`);
      return;
    }
    if (matches.length > 1) {
      console.log(`\nMultiple matches for "${query}" — please confirm:`);
      matches.forEach((t, i) => console.log(`  ${i + 1}. [${t.id}] ${t.content}`));
      const ok = await askConfirm('Complete the first match?');
      if (!ok) { console.log('Cancelled — use task ID directly for precision.'); return; }
    }

    const target = matches[0];
    const ok = await askConfirm(`Complete: "${target.content}"?`);
    if (!ok) { console.log('Cancelled.'); return; }
    await completeTask(target.id);
    console.log(`\n✓ Completed: ${target.content}`);
  },
});

// ── Entrypoint ────────────────────────────────────────────────────────────────
route(process.argv).catch(err => {
  console.error('CLI error:', err);
  process.exit(1);
});
