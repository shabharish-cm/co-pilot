'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

export interface TerminalEntry {
  id: number;
  command: string;
  output: string;
  running: boolean;
}

let globalEntryId = 0;

export interface UseTerminalReturn {
  entries: TerminalEntry[];
  input: string;
  setInput: (v: string) => void;
  running: boolean;
  dots: string;
  outputRef: React.RefObject<HTMLDivElement | null>;
  inputRef: React.RefObject<HTMLInputElement | null>;
  runCommand: (cmd: string) => Promise<void>;
  handleKeyDown: (e: React.KeyboardEvent<HTMLInputElement>) => void;
  abort: () => void;
  clear: () => void;
}

export function useTerminal(): UseTerminalReturn {
  const [entries, setEntries] = useState<TerminalEntry[]>([]);
  const [input, setInput] = useState('');
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);
  const [running, setRunning] = useState(false);
  const [dots, setDots] = useState('');

  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const abortRef = useRef<AbortController | null>(null);

  // Animate dots when running
  useEffect(() => {
    if (!running) { setDots(''); return; }
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(id);
  }, [running]);

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

    const id = ++globalEntryId;
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

      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          acc += decoder.decode(value, { stream: true });
          const snapshot = acc;
          setEntries(prev =>
            prev.map(e => e.id === id ? { ...e, output: snapshot } : e)
          );
        }
      } finally {
        reader.cancel();
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

  const abort = () => abortRef.current?.abort();
  const clear = () => setEntries([]);

  return {
    entries, input, setInput, running, dots,
    outputRef, inputRef,
    runCommand, handleKeyDown, abort, clear,
  };
}
