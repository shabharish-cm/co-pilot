import { NextRequest } from 'next/server';
import { spawn } from 'child_process';

const SYSTEM_PROMPT = `You are the PM Copilot assistant for Shabharish, a Product Manager at CultureMonkey.

## Your Role
You are a focused, intelligent PM assistant that helps with task management, prioritisation, daily planning, and synthesis of customer feedback.

## CultureMonkey Product Context
CultureMonkey is an employee engagement platform. Key features:
- Survey (Engagement, Pulse, Lifecycle, eNPS)
- Heatmap, Segment, Driver analytics
- Comment Analytics, Topic Explorer, Ask Cooper (AI chatbot)
- Report Builder, Manager Dashboard, Admin Dashboard
- Channels: Email, Slack, Teams, WhatsApp, SMS, QR, Kiosk

## Team
- CS Team: KN, Karthik Rao, Gowtham (GK), Yugi
- Engineering: Dhamo, Sam (Director of Engineering), Saran, Nandha, Krishna

## Todoist Board Sections
- CS Requests: Customer success team asks
- Engg asks: Engineering team coordination
- Features: Product features being built
- CM: Internal CultureMonkey org/strategy tasks
- effy: effy product tasks

## Task Status Labels
- backlog → status:backlog
- up-next → status:up-next
- in-progress → status:in-progress
- blocked → status:blocked
- done → complete the task

## Response Style
- Be concise and direct
- Use bullet points for lists
- Use UPPERCASE for section/status names
- Format task titles in bold
- Always use IST timezone (Asia/Kolkata)
- When routing tasks: explain confidence level (matched/inferred/defaulted)

## Routing Rules (priority order)
1. "effy" in title → effy section (matched)
2. CS team name in title → CS Requests (matched)
3. Engg team name in title → Engg asks (matched)
4. CM keywords (initiative, digest, pulse, org, strategy, blog, etc.) → CM (inferred)
5. Feature keywords (build, design, feature, PRD, spec, roadmap) → Features (inferred)
6. Default → Features (defaulted)`;

interface RequestBody {
  messages: Array<{ role: 'user' | 'assistant'; content: string }>;
  context?: string;
  tasks?: unknown[];
}

export async function POST(req: NextRequest) {
  let body: RequestBody;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ error: 'Invalid JSON' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' },
    });
  }

  const { messages, context, tasks } = body;

  // Build full prompt: system context + conversation history + final user message
  let systemContext = SYSTEM_PROMPT;

  if (context) {
    systemContext += `\n\n## Current Context\n${context}`;
  }

  if (tasks && Array.isArray(tasks) && tasks.length > 0) {
    const taskList = (tasks as Array<{ content: string; sectionKey: string; status: string; isOverdue: boolean; due?: { date: string } | null }>)
      .slice(0, 30)
      .map(t => `- [${t.sectionKey}/${t.status}] ${t.content}${t.isOverdue ? ' [OVERDUE]' : ''}${t.due ? ` (due: ${t.due.date})` : ''}`)
      .join('\n');
    systemContext += `\n\n## Current Board Tasks (top 30)\n${taskList}`;
  }

  // Process slash commands — inject extra context into the prompt
  const lastMsg = messages[messages.length - 1];
  if (lastMsg?.role === 'user') {
    const cmd = lastMsg.content.trim().toLowerCase();
    if (cmd === '/morning') {
      try {
        const digestRes = await fetch(`${req.nextUrl.origin}/api/digest`);
        if (digestRes.ok) {
          const digest = await digestRes.json();
          if (digest.content) {
            systemContext += `\n\n## Today's Morning Digest\n${digest.content}`;
          }
        }
      } catch { /* ignore */ }
    }
  }

  // Build the full prompt for claude CLI:
  // Prepend system context, then interleave conversation history, then final user message
  const conversationParts: string[] = [];

  // System context block
  conversationParts.push(`[SYSTEM CONTEXT]\n${systemContext}\n[/SYSTEM CONTEXT]`);

  // Prior turns (all but the last user message)
  for (const msg of messages.slice(0, -1)) {
    const prefix = msg.role === 'user' ? 'User' : 'Assistant';
    conversationParts.push(`${prefix}: ${msg.content}`);
  }

  // Final user message
  if (lastMsg) {
    conversationParts.push(`User: ${lastMsg.content}`);
  }

  const fullPrompt = conversationParts.join('\n\n');

  const encoder = new TextEncoder();

  const readable = new ReadableStream({
    start(controller) {
      // claude --print reads from stdin and streams to stdout
      const proc = spawn('/opt/homebrew/bin/claude', ['--print'], {
        env: { ...process.env, HOME: process.env.HOME ?? '/Users/shabharish' },
      });

      proc.stdin.write(fullPrompt);
      proc.stdin.end();

      proc.stdout.on('data', (chunk: Buffer) => {
        controller.enqueue(encoder.encode(chunk.toString()));
      });

      proc.stderr.on('data', (chunk: Buffer) => {
        // Suppress stderr — claude CLI outputs progress to stderr
        const txt = chunk.toString();
        if (txt.includes('Error') || txt.includes('error')) {
          controller.enqueue(encoder.encode(`\n[Error: ${txt.trim()}]`));
        }
      });

      proc.on('close', (code) => {
        if (code !== 0 && code !== null) {
          controller.enqueue(encoder.encode(`\n[CLI exited with code ${code}]`));
        }
        controller.close();
      });

      proc.on('error', (err) => {
        controller.enqueue(encoder.encode(`\n[Failed to start claude CLI: ${err.message}]`));
        controller.close();
      });
    },
  });

  return new Response(readable, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Transfer-Encoding': 'chunked',
      'Cache-Control': 'no-cache',
      'X-Content-Type-Options': 'nosniff',
    },
  });
}
