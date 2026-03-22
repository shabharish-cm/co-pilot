'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useBoardStore } from '../store/boardStore';
import type { ChatMessage } from '../lib/types';
import { cleanContent } from '../lib/utils';

const SLASH_COMMANDS = [
  { cmd: '/morning', label: '/morning', desc: "Today's digest summary" },
  { cmd: '/eod', label: '/eod', desc: 'Generate EOD summary' },
  { cmd: '/now', label: '/now', desc: 'Top 3 priority tasks' },
  { cmd: '/pulse', label: '/pulse', desc: 'Customer pulse snapshot' },
];

function processCommand(input: string, tasks: ReturnType<typeof useBoardStore.getState>['tasks']): string {
  const cmd = input.trim().toLowerCase();

  if (cmd === '/morning') {
    return '/morning — summarize my morning digest and top priorities for today';
  }
  if (cmd === '/eod') {
    const inProgress = tasks.filter(t => t.status === 'in-progress').map(t => cleanContent(t.content));
    const done = tasks.filter(t => t.status === 'done').map(t => cleanContent(t.content));
    return `/eod — generate an EOD summary. In-progress: ${inProgress.join(', ') || 'none'}. Done today: ${done.join(', ') || 'none'}.`;
  }
  if (cmd === '/now') {
    return '/now — what are my top 3 priority tasks right now?';
  }
  if (cmd === '/pulse') {
    return '/pulse — give me a customer pulse snapshot from the CS Requests section';
  }
  if (cmd.startsWith('what\'s due today') || cmd.startsWith('whats due today')) {
    return "what's due today? — list all tasks with due date today";
  }

  return input;
}

export default function ClaudeSidebar() {
  const { sidebarOpen, toggleSidebar, tasks, selectedTaskId, drawerOpen } = useBoardStore();

  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isStreaming, setIsStreaming] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [streamingContent, setStreamingContent] = useState('');
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Keyboard shortcut: Cmd+K
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        toggleSidebar();
        setTimeout(() => inputRef.current?.focus(), 100);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [toggleSidebar]);

  // Listen for copilot commands from DigestPanel REGENERATE button
  useEffect(() => {
    const handler = (e: CustomEvent<string>) => {
      setInput(e.detail);
      setTimeout(() => inputRef.current?.focus(), 100);
    };
    window.addEventListener('copilot:command', handler as EventListener);
    return () => window.removeEventListener('copilot:command', handler as EventListener);
  }, []);

  // Auto-scroll
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [messages, streamingContent]);

  const getContext = useCallback(() => {
    if (!drawerOpen || !selectedTaskId) return undefined;
    const task = tasks.find(t => t.id === selectedTaskId);
    if (!task) return undefined;
    return `Task context: "${cleanContent(task.content)}" — Section: ${task.sectionKey}, Status: ${task.status}, Due: ${task.due?.date ?? 'none'}`;
  }, [drawerOpen, selectedTaskId, tasks]);

  const sendMessage = useCallback(async (overrideInput?: string) => {
    const raw = (overrideInput ?? input).trim();
    if (!raw || isStreaming) return;

    const processed = processCommand(raw, tasks);
    const userMsg: ChatMessage = { role: 'user', content: processed };

    const newMessages = [...messages, userMsg];
    setMessages(newMessages);
    setInput('');
    setHistory(h => [raw, ...h.slice(0, 49)]);
    setHistoryIdx(-1);
    setIsStreaming(true);
    setStreamingContent('');

    try {
      const res = await fetch('/api/claude', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          context: getContext(),
          tasks: tasks.slice(0, 30).map(t => ({
            content: t.content,
            sectionKey: t.sectionKey,
            status: t.status,
            isOverdue: t.isOverdue,
            due: t.due,
          })),
        }),
      });

      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(err.error ?? `HTTP ${res.status}`);
      }

      const reader = res.body!.getReader();
      const decoder = new TextDecoder();
      let accumulated = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value, { stream: true });
        accumulated += chunk;
        setStreamingContent(accumulated);
      }

      const assistantMsg: ChatMessage = { role: 'assistant', content: accumulated };
      setMessages(prev => [...prev, assistantMsg]);
      setStreamingContent('');
    } catch (e: unknown) {
      const errorMsg = e instanceof Error ? e.message : 'Unknown error';
      const assistantMsg: ChatMessage = {
        role: 'assistant',
        content: `⚠ Error: ${errorMsg}`,
      };
      setMessages(prev => [...prev, assistantMsg]);
      setStreamingContent('');
    } finally {
      setIsStreaming(false);
    }
  }, [input, messages, isStreaming, tasks, getContext]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
      return;
    }
    if (e.key === 'ArrowUp' && input === '') {
      const idx = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(idx);
      setInput(history[idx] ?? '');
    }
    if (e.key === 'ArrowDown' && historyIdx >= 0) {
      const idx = historyIdx - 1;
      setHistoryIdx(idx);
      setInput(idx < 0 ? '' : history[idx]);
    }
  };

  if (!sidebarOpen) {
    return (
      <button
        onClick={toggleSidebar}
        style={{
          position: 'fixed',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          background: '#000',
          color: '#FFE500',
          border: '2.5px solid #000',
          borderRight: 'none',
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '0.08em',
          writingMode: 'vertical-rl',
          padding: '16px 8px',
          cursor: 'pointer',
          zIndex: 500,
          boxShadow: '-3px 0 0 #000',
        }}
      >
        ◆ CLAUDE
      </button>
    );
  }

  return (
    <div
      style={{
        width: '320px',
        flexShrink: 0,
        borderLeft: '2.5px solid #000',
        background: '#FFFBF5',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#000',
          color: '#fff',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ color: '#FFE500', fontSize: '16px' }}>◆</span>
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '12px',
              letterSpacing: '0.08em',
            }}
          >
            CLAUDE COPILOT
          </span>
        </div>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'transparent',
            border: '1px solid #555',
            color: '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            padding: '2px 6px',
            cursor: 'pointer',
          }}
          title="Close (Cmd+K)"
        >
          ✕
        </button>
      </div>

      {/* Context indicator */}
      {drawerOpen && selectedTaskId && (
        <div
          style={{
            padding: '6px 12px',
            background: '#FFE500',
            borderBottom: '1.5px solid #000',
            fontSize: '10px',
            fontFamily: 'var(--font-mono)',
            display: 'flex',
            alignItems: 'center',
            gap: '4px',
            flexShrink: 0,
          }}
        >
          <span>CTX:</span>
          <span style={{ fontWeight: 700 }}>
            {cleanContent(tasks.find(t => t.id === selectedTaskId)?.content ?? '').slice(0, 40)}…
          </span>
        </div>
      )}

      {/* Slash command badges */}
      <div
        style={{
          padding: '8px 12px',
          borderBottom: '1.5px solid #ddd',
          display: 'flex',
          gap: '4px',
          flexWrap: 'wrap',
          flexShrink: 0,
        }}
      >
        {SLASH_COMMANDS.map(({ cmd, label }) => (
          <button
            key={cmd}
            onClick={() => setInput(cmd)}
            title={cmd}
            style={{
              background: '#f5f5f5',
              border: '1.5px solid #000',
              boxShadow: '2px 2px 0 #000',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              padding: '3px 7px',
              cursor: 'pointer',
              transition: 'all 0.1s ease',
            }}
            onMouseEnter={e => {
              (e.currentTarget as HTMLElement).style.background = '#FFE500';
              (e.currentTarget as HTMLElement).style.transform = 'translate(-1px, -1px)';
              (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 #000';
            }}
            onMouseLeave={e => {
              (e.currentTarget as HTMLElement).style.background = '#f5f5f5';
              (e.currentTarget as HTMLElement).style.transform = '';
              (e.currentTarget as HTMLElement).style.boxShadow = '2px 2px 0 #000';
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Messages area */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          display: 'flex',
          flexDirection: 'column',
          gap: '10px',
        }}
      >
        {messages.length === 0 && !isStreaming && (
          <div
            style={{
              fontSize: '12px',
              fontFamily: 'var(--font-mono)',
              color: '#aaa',
              textAlign: 'center',
              marginTop: '24px',
              lineHeight: 1.6,
            }}
          >
            Ask me anything about your tasks.<br />
            Use /morning, /eod, /now for quick summaries.<br />
            <span style={{ fontSize: '10px', display: 'block', marginTop: '8px', color: '#bbb' }}>
              Cmd+K to toggle · ↑↓ for history
            </span>
          </div>
        )}

        {messages.map((msg, i) => (
          <div key={i}>
            {msg.role === 'user' ? (
              <div
                style={{
                  borderLeft: '3px solid #FFE500',
                  paddingLeft: '8px',
                  display: 'flex',
                  gap: '6px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#999',
                    flexShrink: 0,
                    paddingTop: '1px',
                  }}
                >
                  YOU &gt;
                </span>
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: '#333',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                </span>
              </div>
            ) : (
              <div
                style={{
                  background: '#fff',
                  border: '1.5px solid #000',
                  boxShadow: '2px 2px 0 #000',
                  padding: '10px 12px',
                }}
              >
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#888',
                    marginBottom: '6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  <span style={{ color: '#FFE500' }}>◆</span> CLAUDE
                </div>
                <div
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '12px',
                    color: '#111',
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                    lineHeight: 1.6,
                  }}
                >
                  {msg.content}
                </div>
              </div>
            )}
          </div>
        ))}

        {/* Streaming output */}
        {isStreaming && (
          <div
            style={{
              background: '#fff',
              border: '1.5px solid #000',
              boxShadow: '2px 2px 0 #000',
              padding: '10px 12px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#888',
                marginBottom: '6px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px',
              }}
            >
              <span style={{ color: '#FFE500' }}>◆</span> CLAUDE
            </div>
            <div
              style={{
                fontFamily: 'var(--font-mono)',
                fontSize: '12px',
                color: '#111',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                lineHeight: 1.6,
              }}
            >
              {streamingContent || <span className="loading-dots" />}
            </div>
          </div>
        )}
      </div>

      {/* Input area */}
      <div
        style={{
          borderTop: '2.5px solid #000',
          padding: '10px 12px',
          flexShrink: 0,
          background: '#fff',
        }}
      >
        <div style={{ display: 'flex', gap: '6px' }}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… (↵ to send, ↑↓ history)"
            rows={2}
            style={{
              flex: 1,
              border: '2.5px solid #000',
              boxShadow: '3px 3px 0 #000',
              background: '#fff',
              padding: '8px 10px',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              resize: 'none',
              outline: 'none',
            }}
            disabled={isStreaming}
          />
          <button
            className="nb-btn nb-btn-primary"
            onClick={() => sendMessage()}
            disabled={!input.trim() || isStreaming}
            style={{
              padding: '8px 12px',
              flexShrink: 0,
              alignSelf: 'stretch',
              opacity: !input.trim() || isStreaming ? 0.5 : 1,
              fontSize: '11px',
            }}
          >
            {isStreaming ? '…' : 'SEND ↵'}
          </button>
        </div>
      </div>
    </div>
  );
}
