# PRD Kanban Board (VS Code Extension)

Kanban-style workflow board for the PRD pipeline:

- `backlog` -> `research` -> `jtbd` -> `prd` -> `wireframe` -> `done`
- Run stages using Claude slash commands:
  - `/research <feature>`
  - `/jtbd <feature>`
  - `/prd <feature>`
  - `/wireframe <feature>`

## What it does

- Reads feature folders from `PRDs/` in your current workspace.
- Infers each card's next stage from artifacts in that folder:
  - if `research` doc exists -> card appears in `jtbd`
  - if `jtbd` doc exists -> card appears in `prd`
  - if `prd` doc exists -> card appears in `wireframe`
  - if `wireframes/*.html` exists -> card appears in `done`
  - if none found -> card appears in `backlog`
- Lets you manually move cards (drag/drop), for example `backlog` -> `research`.
- Shows a notes box on runnable stages and sends notes with the command prompt.
- Enforces single active run globally (only one card action at a time).
- Shows loader and command output while running.

## Run locally (extension development host)

1. Open this folder in VS Code.
2. Open the `vscode-prd-kanban` folder as the extension project.
3. Press `F5` to launch an Extension Development Host.
4. In the new window, open your repo workspace.
5. Run command: `PRD Kanban: Open Workflow Board`.

## Settings

- `prdKanban.claudeCliPath`
  - Default: `/opt/homebrew/bin/claude`
- `prdKanban.cliArgs`
  - Default: `["--dangerously-skip-permissions", "-p"]`
- `prdKanban.timeoutMs`
  - Default: `600000`

