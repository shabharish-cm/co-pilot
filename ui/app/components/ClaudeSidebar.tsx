'use client';

import { useEffect } from 'react';
import { useBoardStore } from '../store/boardStore';
import { useTerminal } from '../hooks/useTerminal';

const QUICK_COMMANDS = ['/morning', '/eod', '/now', '/pulse'];

export default function ClaudeSidebar() {
  const { sidebarOpen, toggleSidebar } = useBoardStore();
  const {
    entries, input, setInput, running, dots,
    outputRef, inputRef,
    runCommand, handleKeyDown, abort,
  } = useTerminal();

  // Auto-focus when opened
  useEffect(() => {
    if (sidebarOpen) setTimeout(() => inputRef.current?.focus(), 100);
  }, [sidebarOpen, inputRef]);

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
        width: '360px',
        minWidth: '360px',
        display: 'flex',
        flexDirection: 'column',
        border: '2.5px solid #000',
        boxShadow: '-4px 0 0 #000',
        background: '#fff',
        height: '100%',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        style={{
          background: '#000',
          borderBottom: '2.5px solid #000',
          padding: '10px 14px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        <span style={{ fontFamily: 'var(--font-heading)', fontSize: '11px', fontWeight: 700, letterSpacing: '0.12em', color: '#FFE500' }}>
          ◆ TERMINAL — Co-Pilot
        </span>
        <button
          onClick={toggleSidebar}
          style={{ background: 'transparent', border: '1.5px solid #555', color: '#aaa', width: '22px', height: '22px', cursor: 'pointer', fontFamily: 'var(--font-mono)', fontSize: '11px', display: 'flex', alignItems: 'center', justifyContent: 'center', lineHeight: 1 }}
        >×</button>
      </div>

      {/* Quick commands */}
      <div style={{ display: 'flex', gap: '6px', padding: '8px 12px', background: '#F5F5F5', borderBottom: '1px solid #e0e0e0', flexWrap: 'wrap', flexShrink: 0 }}>
        {QUICK_COMMANDS.map(cmd => (
          <button
            key={cmd}
            onClick={() => runCommand(cmd)}
            disabled={running}
            style={{
              background: 'transparent',
              border: '1.5px solid #ccc',
              color: '#444',
              padding: '3px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              cursor: running ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em',
              opacity: running ? 0.4 : 1,
            }}
            onMouseEnter={e => { if (!running) { (e.currentTarget as HTMLElement).style.background = '#FFE500'; (e.currentTarget as HTMLElement).style.borderColor = '#000'; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; (e.currentTarget as HTMLElement).style.borderColor = '#ccc'; }}
          >
            {cmd}
          </button>
        ))}
      </div>

      {/* Output — white background */}
      <div
        ref={outputRef}
        style={{ flex: 1, overflowY: 'auto', padding: '12px', fontFamily: 'var(--font-mono)', fontSize: '12px', lineHeight: '1.7', color: '#111', background: '#fff' }}
        onClick={() => inputRef.current?.focus()}
      >
        {entries.length === 0 && (
          <div style={{ color: '#bbb', fontSize: '11px' }}>
            <div style={{ color: '#999' }}>◆ Claude CLI — Co-Pilot context loaded</div>
            <div style={{ marginTop: '4px', color: '#bbb' }}>Ask anything, or use /morning, /eod, /now, /pulse</div>
            <div style={{ marginTop: '2px', color: '#bbb' }}>Ctrl+C cancel  ·  Ctrl+L clear  ·  ↑↓ history</div>
          </div>
        )}
        {entries.map(entry => (
          <div key={entry.id} style={{ marginBottom: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <span style={{ color: '#999', flexShrink: 0 }}>$</span>
              <span style={{ color: '#000', fontWeight: 600, wordBreak: 'break-all' }}>{entry.command}</span>
              {entry.running && <span style={{ color: '#bbb', marginLeft: '4px' }}>▌</span>}
            </div>
            {entry.output && (
              <pre style={{
                margin: '4px 0 0 14px',
                padding: 0,
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: entry.output.includes('[exited') || entry.output.startsWith('[error') ? '#CC0000' : '#333',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                lineHeight: '1.6',
              }}>
                {entry.output}
              </pre>
            )}
          </div>
        ))}
        {!running && entries.length > 0 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <span style={{ color: '#999' }}>$</span>
            <span style={{ color: '#ddd' }}>_</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 12px', background: '#F9F9F9', borderTop: '1.5px solid #d0d0d0', flexShrink: 0 }}>
        <span style={{ color: running ? '#bbb' : '#999', fontFamily: 'var(--font-mono)', fontSize: '13px', flexShrink: 0 }}>$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={running ? `running${dots} (Ctrl+C to cancel)` : 'ask claude or /skill…'}
          disabled={running}
          autoComplete="off"
          spellCheck={false}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: running ? '#aaa' : '#000', fontFamily: 'var(--font-mono)', fontSize: '12px', caretColor: '#000' }}
        />
        {running && (
          <button onClick={abort} style={{ background: 'transparent', border: '1px solid #e0e0e0', color: '#CC0000', padding: '2px 8px', fontFamily: 'var(--font-mono)', fontSize: '10px', cursor: 'pointer' }}>
            ^C
          </button>
        )}
      </div>
    </div>
  );
}
