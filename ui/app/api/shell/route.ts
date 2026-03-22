import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import path from 'path';

// Always run in the Co-Pilot repo root, not ui/
const REPO_ROOT = path.resolve(process.cwd(), '..');
const CLAUDE_BIN = '/opt/homebrew/bin/claude';
const SHELL_ENV = {
  ...process.env,
  HOME: process.env.HOME ?? '/Users/shabharish',
  PATH: '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
};

export async function POST(req: NextRequest) {
  const { command } = await req.json() as { command: string };
  if (!command?.trim()) {
    return new Response('', { status: 200 });
  }

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    start(controller) {
      const cmd = command.trim();
      let proc;

      // All input goes to Claude CLI — pipe via stdin so skills resolve correctly
      proc = spawn(
        CLAUDE_BIN,
        ['--dangerously-skip-permissions', '-p'],
        { cwd: REPO_ROOT, env: SHELL_ENV, stdio: ['pipe', 'pipe', 'pipe'] }
      );
      proc.stdin!.write(cmd);
      proc.stdin!.end();

      proc.stdout.on('data', (chunk: Buffer) => {
        controller.enqueue(encoder.encode(chunk.toString()));
      });

      proc.stderr.on('data', (chunk: Buffer) => {
        // Include stderr so the user can see errors/progress
        controller.enqueue(encoder.encode(chunk.toString()));
      });

      proc.on('close', (code) => {
        if (code !== 0 && code !== null) {
          controller.enqueue(encoder.encode(`\n[exited ${code}]`));
        }
        controller.close();
      });

      proc.on('error', (err) => {
        controller.enqueue(encoder.encode(`[error: ${err.message}]`));
        controller.close();
      });
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'no-cache',
      'Transfer-Encoding': 'chunked',
    },
  });
}
