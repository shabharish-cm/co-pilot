'use client';

import { useEffect } from 'react';
import { useTerminal } from '../hooks/useTerminal';

const QUICK_COMMANDS = ['/morning', '/eod', '/now', '/pulse'];

export default function CliPanel() {
  const {
    entries, input, setInput, running, dots,
    outputRef, inputRef,
    runCommand, handleKeyDown, abort, clear,
  } = useTerminal();

  useEffect(() => {
    setTimeout(() => inputRef.current?.focus(), 150);
  }, [inputRef]);

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      background: '#fff',
      borderTop: '2.5px solid #000',
      height: '100%',
      overflow: 'hidden',
    }}>

      {/* Panel header with quick commands */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '5px 12px',
        background: '#F5F5F5',
        borderBottom: '1.5px solid #d0d0d0',
        flexShrink: 0,
        flexWrap: 'wrap',
      }}>
        <span style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '0.12em',
          color: '#000',
          marginRight: '4px',
          whiteSpace: 'nowrap',
        }}>
          ◆ TERMINAL
        </span>

        <span style={{ color: '#ccc', fontSize: '14px' }}>|</span>

        {QUICK_COMMANDS.map(cmd => (
          <button
            key={cmd}
            onClick={() => runCommand(cmd)}
            disabled={running}
            style={{
              background: 'transparent',
              border: '1.5px solid #ccc',
              color: '#444',
              padding: '2px 8px',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              cursor: running ? 'not-allowed' : 'pointer',
              letterSpacing: '0.05em',
              opacity: running ? 0.4 : 1,
              whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => { if (!running) { (e.currentTarget as HTMLElement).style.borderColor = '#000'; (e.currentTarget as HTMLElement).style.background = '#FFE500'; } }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.borderColor = '#ccc'; (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
          >
            {cmd}
          </button>
        ))}

        <button
          onClick={clear}
          style={{
            marginLeft: 'auto',
            background: 'transparent',
            border: 'none',
            color: '#bbb',
            fontFamily: 'var(--font-mono)',
            fontSize: '10px',
            cursor: 'pointer',
            padding: '2px 4px',
          }}
          title="Ctrl+L to clear"
          onMouseEnter={e => { (e.currentTarget as HTMLElement).style.color = '#000'; }}
          onMouseLeave={e => { (e.currentTarget as HTMLElement).style.color = '#bbb'; }}
        >
          CLR
        </button>
      </div>

      {/* Output area — white background, dark text */}
      <div
        ref={outputRef}
        style={{
          flex: 1,
          overflowY: 'auto',
          padding: '10px 16px',
          fontFamily: 'var(--font-mono)',
          fontSize: '12px',
          lineHeight: '1.7',
          color: '#111',
          background: '#fff',
          cursor: 'text',
        }}
        onClick={() => inputRef.current?.focus()}
      >
        {entries.length === 0 && (
          <div style={{ color: '#bbb', fontSize: '11px' }}>
            <span style={{ color: '#999' }}>$</span>
            <span style={{ marginLeft: '8px' }}>Ask Claude or run a /command — ↑↓ history · Ctrl+C cancel · Ctrl+L clear</span>
          </div>
        )}

        {entries.map(entry => (
          <div key={entry.id} style={{ marginBottom: '10px' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '6px' }}>
              <span style={{ color: '#999', flexShrink: 0 }}>$</span>
              <span style={{ color: '#000', fontWeight: 600, wordBreak: 'break-all' }}>{entry.command}</span>
              {entry.running && <span style={{ color: '#bbb', marginLeft: '4px' }}>▌</span>}
            </div>
            {entry.output && (
              <pre style={{
                margin: '3px 0 0 16px',
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
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '7px 12px',
        background: '#F9F9F9',
        borderTop: '1.5px solid #d0d0d0',
        flexShrink: 0,
      }}>
        <span style={{
          color: running ? '#bbb' : '#999',
          fontFamily: 'var(--font-mono)',
          fontSize: '13px',
          flexShrink: 0,
        }}>$</span>
        <input
          ref={inputRef}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={running ? `running${dots}  (Ctrl+C to cancel)` : 'ask claude or /skill…'}
          disabled={running}
          autoComplete="off"
          spellCheck={false}
          style={{
            flex: 1,
            background: 'transparent',
            border: 'none',
            outline: 'none',
            color: running ? '#aaa' : '#000',
            fontFamily: 'var(--font-mono)',
            fontSize: '12px',
            caretColor: '#000',
          }}
        />
        {running && (
          <button
            onClick={abort}
            style={{
              background: 'transparent',
              border: '1px solid #e0e0e0',
              color: '#CC0000',
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
