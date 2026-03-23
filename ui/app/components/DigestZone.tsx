'use client';

import { useEffect, useRef, useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { renderMarkdown } from '../lib/markdown';

interface DigestData {
  content: string | null;
  exists: boolean;
  date: string;
  stale?: boolean;
}

const IST = 'Asia/Kolkata';

export default function DigestZone() {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [generating, setGenerating] = useState(false);
  const [genOutput, setGenOutput] = useState('');
  const [dots, setDots] = useState('');
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => () => { abortRef.current?.abort(); }, []);

  useEffect(() => {
    if (!generating) { setDots(''); return; }
    const id = setInterval(() => setDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(id);
  }, [generating]);

  const fetchDigest = async () => {
    try {
      const res = await fetch('/api/digest');
      if (res.ok) setDigest(await res.json());
    } catch { /* ignore */ }
  };

  useEffect(() => { fetchDigest(); }, []);

  const handleRegenerate = async () => {
    if (generating) return;
    abortRef.current?.abort();
    const abort = new AbortController();
    abortRef.current = abort;
    setGenerating(true);
    setGenOutput('');
    let acc = '';
    let hasError = false;
    try {
      await fetch('/api/state/refresh', { method: 'POST', signal: abort.signal }).catch(() => {});
      const res = await fetch('/api/shell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: '/morning' }),
        signal: abort.signal,
      });
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');
      const decoder = new TextDecoder();
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setGenOutput(acc);
      }
    } catch (err: unknown) {
      if ((err as Error).name === 'AbortError') return;
      hasError = true;
      setGenOutput(`[error: ${(err as Error).message}]`);
    } finally {
      abortRef.current = null;
      setGenerating(false);
      if (!hasError) {
        await fetch('/api/digest', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ rawOutput: acc }),
        }).catch(() => {});
        await fetchDigest();
        setTimeout(() => setGenOutput(''), 1500);
      }
    }
  };

  const today = formatInTimeZone(new Date(), IST, "EEE, d MMM yyyy").toUpperCase();
  const htmlContent = digest?.content ? renderMarkdown(digest.content) : '';

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Zone header */}
      <div style={{
        background: '#000', color: '#FFE500',
        padding: '8px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        borderBottom: '2.5px solid #000',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em' }}>
            MORNING DIGEST
          </span>
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888' }}>
            {today}
          </span>
          {digest?.stale && (
            <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', background: '#856404', color: '#fff', padding: '1px 6px' }}>
              STALE — SHOWING PREV
            </span>
          )}
        </div>
        <button
          onClick={handleRegenerate}
          disabled={generating}
          style={{
            background: generating ? '#333' : '#FFE500',
            color: '#000',
            border: '2px solid #FFE500',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '10px',
            letterSpacing: '0.08em',
            padding: '4px 12px',
            cursor: generating ? 'not-allowed' : 'pointer',
            opacity: generating ? 0.7 : 1,
          }}
        >
          {generating ? `GENERATING${dots}` : '↺ RUN /MORNING'}
        </button>
      </div>

      {/* Content area */}
      <div style={{ flex: 1, overflowY: 'auto', background: '#FFFBF5' }}>

        {/* Generating output stream */}
        {(generating || genOutput) && (
          <div style={{
            margin: '12px 16px',
            background: '#0d0d0d',
            border: '2px solid #333',
            padding: '10px 14px',
            fontFamily: 'var(--font-mono)',
            fontSize: '11px',
            maxHeight: '140px',
            overflowY: 'auto',
          }}>
            {generating && (
              <div style={{ color: '#FFE500', marginBottom: genOutput ? '6px' : 0 }}>
                ⟳ Running /morning{dots}
              </div>
            )}
            {genOutput && (
              <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: genOutput.startsWith('[error') ? '#FF6B6B' : '#b0b0b0' }}>
                {genOutput}
              </pre>
            )}
            {!generating && genOutput && !genOutput.startsWith('[error') && (
              <div style={{ color: '#4CAF50', marginTop: '6px' }}>✓ Digest refreshed</div>
            )}
          </div>
        )}

        {/* No digest state */}
        {!digest?.exists && !digest?.stale && !generating && (
          <div style={{ padding: '32px 20px', textAlign: 'center' }}>
            <div style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#888', marginBottom: '16px' }}>
              No morning digest for today. The scheduled run may not have fired yet.
            </div>
            <button
              onClick={handleRegenerate}
              className="nb-btn nb-btn-primary"
              style={{ fontSize: '12px' }}
            >
              RUN /MORNING NOW ↺
            </button>
          </div>
        )}

        {/* Digest content */}
        {digest?.content && !generating && (
          <div
            className="md-content"
            style={{ padding: '16px 20px', maxWidth: '860px' }}
            dangerouslySetInnerHTML={{ __html: htmlContent }}
          />
        )}
      </div>
    </div>
  );
}
