'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useBoardStore } from '../store/boardStore';

interface TerminalEntry {
  id: number;
  command: string;
  output: string;
  running: boolean;
}

const QUICK_COMMANDS = ['/morning', '/eod', '/now', '/pulse'];

let entryId = 0;

export default function ClaudeSidebar() {
  const { sidebarOpen, toggleSidebar } = useBoardStore();

  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [running, setRunning] = useState(false);

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Cmd+K to focus
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

  // Auto-scroll on new output
  useEffect(() => {
    if (outputRef.current) {
      outputRef.current.scrollTop = outputRef.current.scrollHeight;
    }
  }, [entries]);

  const runCommand = useCallback(async (cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed || running) return;

    setHistory(h => [trimmed, ...h.filter(x => x !== trimmed)].slice(0, 50));
    setHistoryIdx(-1);
    setInput('');
    setRunning(true);

    const id = ++entryId;
    setEntries(prev => [...prev, { id, command: trimmed, output: '', running: true }]);

    const abort = new AbortController();
    abortRef.current = abort;

    try {
      const res = await fetch('/api/shell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: trimmed }),
        signal: abort.signal,
      });

      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');

      const decoder = new TextDecoder();
      let acc = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        const snapshot = acc;
        setEntries(prev =>
          prev.map(e => e.id === id ? { ...e, output: snapshot } : e)
        );
      }
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') {
        setEntries(prev =>
          prev.map(e => e.id === id ? { ...e, output: e.output + '\n^C' } : e)
        );
      } else {
        setEntries(prev =>
          prev.map(e => e.id === id ? { ...e, output: e.output + `\n[${(err as Error).message}]` } : e)
        );
      }
    } finally {
      setEntries(prev =>
        prev.map(e => e.id === id ? { ...e, running: false } : e)
      );
      setRunning(false);
      abortRef.current = null;
      setTimeout(() => inputRef.current?.focus(), 50);
    }
  }, [running]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      runCommand(input);
    } else if (e.key === 'c' && e.ctrlKey) {
      abortRef.current?.abort();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      const next = Math.min(historyIdx + 1, history.length - 1);
      setHistoryIdx(next);
      setInput(history[next] ?? '');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      const next = Math.max(historyIdx - 1, -1);
      setHistoryIdx(next);
      setInput(next === -1 ? '' : history[next] ?? '');
    } else if (e.key === 'l' && e.ctrlKey) {
      e.preventDefault();
      setEntries([]);
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
          transform: 'translateY(-50%) rotate(90deg)',
          background: '#000',
          color: '#FFE500',
          border: '2.5px solid #000',
          padding: '6px 14px',
          fontFamily: 'var(--font-mono)',
          fontSize: '11px',
          fontWeight: 700,
          letterSpacing: '0.1em',
          cursor: 'pointer',
          zIndex: 40,
          boxShadow: '3px 3px 0 #FFE500',
        }}
      >
        TERMINAL ◆
      </button>
    );
  }

  return (
    <div
      style={{
        width: '340px',
        minWidth: '340px',
        display: 'flex',
        flexDirection: 'column',
        border: '2.5px solid #000',
        boxShadow: '4px 4px 0 #000',
        background: '#0d0d0d',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#000',
          borderBottom: '2.5px solid #FFE500',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontSize: '12px',
          fontWeight: 700,
          letterSpacing: '0.12em',
          color: '#FFE500',
        }}>
          ◆ TERMINAL — Co-Pilot
        </span>
        <button
          onClick={toggleSidebar}
          style={{
            background: 'transparent',
            border: '1.5px solid #555',
            color: '#aaa',
            width: '22px',
            height: '22px',
            cursor: 'pointer',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            lineHeight: 1,
          }}
        >
          ×
        </button>
      </div>

      {/* Quick command badges */}
      <div style={{
        display: 'flex',
        gap: '6px',
        padding: '8px 12px',
        background: '#111',
        borderBottom: '1px solid #222',
        flexWrap: 'wrap',
        flexShrink: 0,
      }}>
        {QUICK_COMMANDS.map(cmd => (
          <button
            key={cmd}
            onClick={() => runCommand(cmd)}
            disabled={running}
            style={{
              background: 'transparent',
              border: '1.5px solid #444',
              color: '#ccc',
              padding: '3px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              cursor: running ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em',
              opacity: running ? 0.4 : 1,
            }}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Terminal output */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '12px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          lineHeight: '1.6',
          color: '#e0e0e0',
          background: '#0d0d0d',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {entries.length === 0 && (
          <div style={{ color: '#555', fontSize: '11px' }}>
            <div>PM Copilot terminal. CWD: ~/Co-Pilot</div>
            <div style={{ marginTop: '4px' }}>Type any shell command or /morning, /eod, /pulse</div>
            <div style={{ marginTop: '2px' }}>Ctrl+C cancel  ·  Ctrl+L clear  ·  ↑↓ history</div>
          </div>
        )}

        {entries.map(entry => (
          <div key={entry.id} style={{ marginBottom: '12px' }}>
            {/* Command line */}
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <span style={{ color: '#FFE500', flexShrink: 0 }}>$</span>
              <span style={{ color: '#fff', wordBreak: 'break-all' }}>{entry.command}</span>
              {entry.running && (
                <span style={{ color: '#555', animation: 'pulse 1s infinite', marginLeft: '4px' }}>▌</span>
              )}
            </div>
            {/* Output */}
            {entry.output && (
              <pre
                style={{
                  margin: '4px 0 0 14px',
                  padding: 0,
                  whiteSpace: 'pre-wrap',
                  wordBreak: 'break-word',
                  color: entry.output.startsWith('[error') || entry.output.includes('[exited') ? '#FF6B6B' : '#b0b0b0',
                  fontSize: '11.5px',
                  fontFamily: 'var(--font-mono)',
                }}
              >
                {entry.output}
              </pre>
            )}
          </div>
        ))}

        {/* Inline cursor when idle */}
        {!running && entries.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#FFE500' }}>$</span>
            <span style={{ color: '#555' }}>_</span>
          </div>
        )}
      </div>

      {/* Input */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 12px',
          background: '#111',
          borderTop: '2px solid #222',
          flexShrink: 0,
        }}
      >
        <span style={{ color: '#FFE500', fontFamily: 'var(--font-mono)', fontSize: '13px', flexShrink: 0 }}>$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={running ? 'running… (Ctrl+C to cancel)' : 'command or /skill…'}
          disabled={running}
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: running ? '#555' : '#fff',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            caretColor: '#FFE500',
          }}
        />
        {running && (
          <button
            onClick={() => abortRef.current?.abort()}
            style={{
              background: 'transparent',
              border: '1px solid #555',
              color: '#FF6B6B',
              padding: '2px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              cursor: 'pointer',
            }}
          >
            ^C
          </button>
        )}
      </div>
    </div>
  );
}
