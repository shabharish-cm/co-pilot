import { getCommand, listCommands } from './command-registry';

export async function route(argv: string[]): Promise<void> {
  const [, , commandName, ...args] = argv;

  if (!commandName || commandName === '--help' || commandName === '-h') {
    printHelp();
    return;
  }

  const cmd = getCommand(commandName);
  if (!cmd) {
    console.error(`Unknown command: ${commandName}`);
    printHelp();
    process.exit(1);
  }

  await cmd.handler(args);
}

function printHelp(): void {
  console.log('\nPM Copilot CLI\n');
  for (const cmd of listCommands()) {
    console.log(`  ${cmd.usage.padEnd(30)} ${cmd.description}`);
  }
  console.log('');
}
