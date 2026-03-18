export interface CommandDef {
  name: string;
  description: string;
  usage: string;
  handler: (args: string[]) => Promise<void>;
}

const registry = new Map<string, CommandDef>();

export function registerCommand(def: CommandDef): void {
  registry.set(def.name, def);
}

export function getCommand(name: string): CommandDef | undefined {
  return registry.get(name);
}

export function listCommands(): CommandDef[] {
  return Array.from(registry.values());
}
