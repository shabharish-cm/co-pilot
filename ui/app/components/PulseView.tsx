'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { renderMarkdown } from '../lib/markdown';

interface PulseData {
  content: string | null;
  exists: boolean;
  filename: string | null;
  label: string | null;
}

export default function PulseView() {
  const [data, setData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Inline run state
  const [running, setRunning] = useState(false);
  const [runOutput, setRunOutput] = useState('');
  const [dots, setDots] = useState('');
  const abortRef = useRef<AbortController | null>(null);
  const outputRef = useRef<HTMLDivElement>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  useEffect(() => {
    if (!running) { setDots(''); return; }
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(id);
  }, [running]);

  // Auto-scroll run output
  useEffect(() => {
    if (outputRef.current) outputRef.current.scrollTop = outputRef.current.scrollHeight;
  }, [runOutput]);

  const fetchPulse = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/pulse');
      if (!res.ok) throw new Error(`Failed: ${res.status}`);
      setData(await res.json());
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchPulse(); }, []);

  const handleRunPulse = useCallback(async () => {
    if (running) return;
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;
    setRunning(true);
    setRunOutput('');
    let acc = '';
    let hasError = false;
    try {
      const res = await fetch('/api/shell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: '/pulse' }),
        signal: abort.signal,
      });
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setRunOutput(acc);
      }
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      hasError = true;
      setRunOutput(`[error: ${(err as Error).message}]`);
    } finally {
      abortRef.current = null;
      setRunning(false);
      if (!hasError) {
        // Reload digest after successful run
        setTimeout(() => fetchPulse(), 1000);
      }
    }
  }, [running]);

  const htmlContent = data?.content ? renderMarkdown(data.content) : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Header */}
      <div style={{
        background: '#000', color: '#fff',
        padding: '0 20px', height: '48px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0, borderBottom: '2.5px solid #000',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-space-grotesk)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.12em' }}>
            CUSTOMER PULSE
          </span>
          {data?.label && (
            <span style={{ fontFamily: 'var(--font-space-mono)', fontSize: '11px', color: '#888', background: '#1a1a1a', padding: '2px 8px', border: '1px solid #333' }}>
              {data.label}
            </span>
          )}
        </div>

        <button
          onClick={handleRunPulse}
          disabled={running}
          style={{
            background: running ? '#333' : '#FFE500',
            color: '#000',
            border: '2px solid #FFE500',
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 700, fontSize: '11px', letterSpacing: '0.08em',
            padding: '5px 14px', cursor: running ? 'not-allowed' : 'pointer',
            opacity: running ? 0.7 : 1,
          }}
        >
          {running ? `RUNNING /PULSE${dots}` : 'RUN /PULSE ↺'}
        </button>
      </div>

      {/* Run output stream */}
      {(running || runOutput) && (
        <div
          ref={outputRef}
          style={{
            background: '#0d0d0d',
            borderBottom: '2.5px solid #333',
            padding: '10px 16px',
            fontFamily: 'var(--font-space-mono)',
            fontSize: '11px',
            maxHeight: '160px',
            overflowY: 'auto',
            flexShrink: 0,
          }}
        >
          {running && (
            <div style={{ color: '#FFE500', marginBottom: runOutput ? '6px' : 0 }}>
              ⟳ Running /pulse{dots}
            </div>
          )}
          {runOutput && (
            <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: runOutput.startsWith('[error') ? '#FF6B6B' : '#b0b0b0' }}>
              {runOutput}
            </pre>
          )}
          {!running && runOutput && !runOutput.startsWith('[error') && (
            <div style={{ color: '#4CAF50', marginTop: '6px' }}>✓ Pulse digest updated — reloading…</div>
          )}
        </div>
      )}

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#FFFBF5' }}>
        {loading && (
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', color: '#888', padding: '40px 0', textAlign: 'center' }}>
            Loading pulse data…
          </div>
        )}

        {error && (
          <div style={{ fontFamily: 'var(--font-space-mono)', fontSize: '12px', color: '#FF3B00', padding: '20px 0' }}>
            Error: {error}
          </div>
        )}

        {!loading && !error && !data?.exists && (
          <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#888', padding: '60px 0', textAlign: 'center', maxWidth: '480px', margin: '0 auto' }}>
            No weekly pulse digest found in{' '}
            <span style={{ fontFamily: 'var(--font-space-mono)', fontWeight: 700, color: '#000', background: '#FFE500', padding: '1px 6px' }}>
              pulse/weekly/
            </span>
            <br /><br />
            Click{' '}
            <button
              onClick={handleRunPulse}
              style={{ fontFamily: 'var(--font-space-mono)', fontWeight: 700, color: '#000', background: '#FFE500', border: '2px solid #000', padding: '3px 10px', cursor: 'pointer' }}
            >
              RUN /PULSE ↺
            </button>
            {' '}to generate one.
          </div>
        )}

        {!loading && !error && data?.exists && data.content && (
          <div
            style={{ maxWidth: '860px', margin: '0 auto' }}
            className="md-content"
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>
    </div>
  );
}
