'use client';

import { useEffect, useState, useMemo } from 'react';
import { useBoardStore } from '../store/boardStore';
import { renderMarkdown } from '../lib/markdown';

interface PulseData {
  content: string | null;
  exists: boolean;
}

export default function PulseView() {
  const { toggleSidebar } = useBoardStore();
  const [data, setData] = useState<PulseData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    fetch('/api/pulse')
      .then(res => {
        if (!res.ok) throw new Error(`Failed to fetch pulse: ${res.status}`);
        return res.json();
      })
      .then((d: PulseData) => {
        setData(d);
        setLoading(false);
      })
      .catch(e => {
        setError(e instanceof Error ? e.message : 'Unknown error');
        setLoading(false);
      });
  }, []);

  const htmlContent = useMemo(() => {
    if (!data?.content) return '';
    return renderMarkdown(data.content);
  }, [data?.content]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Header bar */}
      <div
        style={{
          background: '#000',
          color: '#fff',
          padding: '0 20px',
          height: '48px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: '2.5px solid #000',
        }}
      >
        <span
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.12em',
          }}
        >
          CUSTOMER PULSE
        </span>

        <button
          onClick={() => {
            toggleSidebar();
            // Note: toggleSidebar opens the terminal sidebar; user can then run /pulse
          }}
          style={{
            background: '#FFE500',
            color: '#000',
            border: '2px solid #FFE500',
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 700,
            fontSize: '11px',
            letterSpacing: '0.08em',
            padding: '5px 14px',
            cursor: 'pointer',
          }}
        >
          RUN /PULSE
        </button>
      </div>

      {/* Content */}
      <div style={{ flex: 1, overflowY: 'auto', padding: '24px', background: '#FFFBF5' }}>
        {loading && (
          <div
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '12px',
              color: '#888',
              padding: '40px 0',
              textAlign: 'center',
            }}
          >
            Loading pulse data…
          </div>
        )}

        {error && (
          <div
            style={{
              fontFamily: 'var(--font-space-mono)',
              fontSize: '12px',
              color: '#FF3B00',
              padding: '20px 0',
            }}
          >
            Error: {error}
          </div>
        )}

        {!loading && !error && !data?.exists && (
          <div
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: '14px',
              color: '#888',
              padding: '60px 0',
              textAlign: 'center',
              maxWidth: '480px',
              margin: '0 auto',
            }}
          >
            No pulse data yet. Run{' '}
            <span
              style={{
                fontFamily: 'var(--font-space-mono)',
                fontWeight: 700,
                color: '#000',
                background: '#FFE500',
                padding: '1px 6px',
              }}
            >
              /pulse
            </span>{' '}
            in the terminal to generate.
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
