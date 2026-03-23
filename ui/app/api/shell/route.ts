import { NextRequest } from 'next/server';
import { spawn } from 'child_process';
import type { ChildProcessWithoutNullStreams } from 'child_process';
import path from 'path';

// Always run in the Co-Pilot repo root, not ui/
const REPO_ROOT = path.resolve(process.cwd(), '..');
const CLAUDE_BIN = '/opt/homebrew/bin/claude';
const { ANTHROPIC_API_KEY: _stripped, ...restEnv } = process.env;
const SHELL_ENV = {
  ...restEnv,
  HOME: process.env.HOME ?? '/Users/shabharish',
  PATH: '/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin',
};

const TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes — hard cap per invocation

export async function POST(req: NextRequest) {
  const { command } = await req.json() as { command: string };
  if (!command?.trim()) {
    return new Response('', { status: 200 });
  }

  const encoder = new TextEncoder();

  // Hoisted so cancel() can reference them
  let proc: ChildProcessWithoutNullStreams | null = null;
  let timeoutId: ReturnType<typeof setTimeout> | null = null;

  const readable = new ReadableStream({
    start(controller) {
      const cmd = command.trim();

      proc = spawn(
        CLAUDE_BIN,
        ['--dangerously-skip-permissions', '-p'],
        { cwd: REPO_ROOT, env: SHELL_ENV, stdio: ['pipe', 'pipe', 'pipe'] }
      );
      proc.stdin!.write(cmd);
      proc.stdin!.end();

      // Hard timeout — kills the process if it runs too long
      timeoutId = setTimeout(() => {
        proc?.kill('SIGTERM');
        try {
          controller.enqueue(encoder.encode('\n[timeout: process killed after 5 minutes]'));
          controller.close();
        } catch { /* already closed */ }
      }, TIMEOUT_MS);

      proc.stdout.on('data', (chunk: Buffer) => {
        try { controller.enqueue(encoder.encode(chunk.toString())); } catch { /* stream closed */ }
      });

      proc.stderr.on('data', (chunk: Buffer) => {
        try { controller.enqueue(encoder.encode(chunk.toString())); } catch { /* stream closed */ }
      });

      proc.on('close', (code) => {
        if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
        try {
          if (code !== 0 && code !== null) {
            controller.enqueue(encoder.encode(`\n[exited ${code}]`));
          }
          controller.close();
        } catch { /* already closed */ }
      });

      proc.on('error', (err) => {
        if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
        try {
          controller.enqueue(encoder.encode(`[error: ${err.message}]`));
          controller.close();
        } catch { /* already closed */ }
      });
    },

    // Called when the client disconnects or aborts — kill the process immediately
    cancel() {
      if (timeoutId) { clearTimeout(timeoutId); timeoutId = null; }
      proc?.kill('SIGTERM');
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
