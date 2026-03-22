'use client';

import { useEffect, useState } from 'react';
import { useBoardStore } from '../store/boardStore';
import { SECTION_CONFIGS, formatDueDate, cleanContent } from '../lib/utils';
import type { SectionKey } from '../lib/types';
import { formatInTimeZone } from 'date-fns-tz';

interface DigestData {
  content: string | null;
  exists: boolean;
  date: string;
  stale?: boolean;
}

function DigestModal({ content, onClose }: { content: string; onClose: () => void }) {
  // Close on Escape
  useEffect(() => {
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  // Minimal markdown → styled sections: headings, bullets, bold
  const lines = content.split('\n');

  return (
    <div
      onClick={onClose}
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.55)',
        zIndex: 1000,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '24px',
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          border: '2.5px solid #000',
          boxShadow: '6px 6px 0 #000',
          width: '100%',
          maxWidth: '680px',
          maxHeight: '80vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Modal header */}
        <div
          className="nb-header-bar"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}
        >
          <div style={{ fontSize: '12px' }}>MORNING DIGEST — FULL VIEW</div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              fontFamily: 'var(--font-mono)',
              fontSize: '16px',
              lineHeight: 1,
              padding: '0 4px',
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable content */}
        <div style={{ overflowY: 'auto', padding: '16px 20px' }}>
          {lines.map((line, i) => {
            if (/^#{1,2}\s/.test(line)) {
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '13px',
                    letterSpacing: '0.06em',
                    textTransform: 'uppercase',
                    marginTop: i === 0 ? 0 : '18px',
                    marginBottom: '6px',
                    borderBottom: /^#\s/.test(line) ? '1.5px solid #000' : 'none',
                    paddingBottom: /^#\s/.test(line) ? '4px' : 0,
                  }}
                >
                  {line.replace(/^#+\s/, '')}
                </div>
              );
            }
            if (/^#{3,}\s/.test(line)) {
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    fontSize: '11px',
                    letterSpacing: '0.05em',
                    textTransform: 'uppercase',
                    marginTop: '12px',
                    marginBottom: '4px',
                    opacity: 0.7,
                  }}
                >
                  {line.replace(/^#+\s/, '')}
                </div>
              );
            }
            if (/^[-*]\s/.test(line) || /^\d+\.\s/.test(line)) {
              const text = line.replace(/^[-*]\s/, '').replace(/^\d+\.\s/, '');
              return (
                <div
                  key={i}
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    lineHeight: 1.6,
                    color: '#222',
                    marginBottom: '4px',
                    paddingLeft: '12px',
                    position: 'relative',
                  }}
                >
                  <span style={{ position: 'absolute', left: 0 }}>·</span>
                  <span dangerouslySetInnerHTML={{ __html: text.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }} />
                </div>
              );
            }
            if (line.trim() === '' || line.startsWith('---')) {
              return <div key={i} style={{ height: line.startsWith('---') ? 0 : '8px' }} />;
            }
            return (
              <p
                key={i}
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '12px',
                  lineHeight: 1.65,
                  color: '#333',
                  margin: '0 0 6px',
                }}
                dangerouslySetInnerHTML={{ __html: line.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>') }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}

export default function DigestPanel() {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [genOutput, setGenOutput] = useState('');
  const [genDots, setGenDots] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const { tasks, openDrawer } = useBoardStore();

  const fetchDigest = async () => {
    try {
      const res = await fetch('/api/digest');
      if (res.ok) {
        const data = await res.json();
        setDigest(data);
      }
    } catch {
      // ignore
    }
  };

  useEffect(() => {
    fetchDigest();
  }, []);

  // Animate dots while generating
  useEffect(() => {
    if (!generating) { setGenDots(''); return; }
    const id = setInterval(() => setGenDots(d => d.length >= 3 ? '' : d + '.'), 400);
    return () => clearInterval(id);
  }, [generating]);

  const handleRegenerate = async () => {
    if (generating) return;
    setGenerating(true);
    setGenOutput('');
    let hasError = false;
    try {
      const res = await fetch('/api/shell', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ command: '/morning' }),
      });
      const reader = res.body?.getReader();
      if (!reader) throw new Error('No response body');
      const decoder = new TextDecoder();
      let acc = '';
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setGenOutput(acc);
      }
    } catch (err: unknown) {
      hasError = true;
      setGenOutput(`[error: ${(err as Error).message}]`);
    } finally {
      setGenerating(false);
      await fetchDigest();
      // Clear output after success so the refreshed digest is the only thing visible
      if (!hasError) {
        setTimeout(() => setGenOutput(''), 1500);
      }
    }
  };

  const topTasks = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => {
      if (a.priority !== b.priority) return a.priority - b.priority;
      if (a.isOverdue && !b.isOverdue) return -1;
      if (!a.isOverdue && b.isOverdue) return 1;
      return 0;
    })
    .slice(0, 3);

  const today = formatInTimeZone(new Date(), 'Asia/Kolkata', 'EEE, MMM d').toUpperCase();

  const prose = digest?.content
    ? digest.content
        .replace(/^#+\s.+$/gm, '')
        .replace(/[-*]\s/gm, '')
        .replace(/\n{2,}/g, ' ')
        .trim()
        .slice(0, 240)
    : null;

  return (
    <>
      {modalOpen && digest?.content && (
        <DigestModal content={digest.content} onClose={() => setModalOpen(false)} />
      )}

      <div
        style={{
          border: '2.5px solid #000',
          boxShadow: '4px 4px 0 #000',
          background: '#fff',
          marginBottom: '16px',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          className="nb-header-bar"
          style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
          onClick={() => setExpanded(e => !e)}
        >
          <div>
            <div style={{ fontSize: '10px', opacity: 0.7 }}>TODAY · {today}</div>
            <div style={{ fontSize: '12px' }}>MORNING DIGEST</div>
          </div>
          <span style={{ fontSize: '16px', fontWeight: 400 }}>{expanded ? '−' : '+'}</span>
        </div>

        {expanded && (
          <div style={{ padding: '12px' }}>
            {digest?.stale && (
              <div
                style={{
                  background: '#FFF3CD',
                  border: '1.5px solid #856404',
                  padding: '4px 8px',
                  fontSize: '11px',
                  fontFamily: 'var(--font-mono)',
                  marginBottom: '8px',
                }}
              >
                SHOWING YESTERDAY'S DIGEST — NO DIGEST FOR TODAY YET
              </div>
            )}

            {!digest?.exists && !digest?.stale && (
              <div
                style={{
                  background: '#f5f5f5',
                  border: '1.5px solid #ccc',
                  padding: '8px',
                  fontSize: '12px',
                  fontFamily: 'var(--font-mono)',
                  color: '#666',
                  marginBottom: '8px',
                }}
              >
                No morning digest found for today.
              </div>
            )}

            {prose && (
              <div style={{ position: 'relative' }}>
                <p
                  style={{
                    fontSize: '12px',
                    fontFamily: 'var(--font-body)',
                    color: '#333',
                    margin: '0 0 6px',
                    lineHeight: 1.5,
                    paddingRight: '28px',
                  }}
                >
                  {prose}
                  {digest!.content!.length > 240 ? '…' : ''}
                </p>
                <button
                  onClick={() => setModalOpen(true)}
                  title="Expand full digest"
                  style={{
                    position: 'absolute',
                    top: 0,
                    right: 0,
                    background: '#FFE500',
                    border: '1.5px solid #000',
                    boxShadow: '1px 1px 0 #000',
                    width: '22px',
                    height: '22px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '11px',
                    flexShrink: 0,
                    padding: 0,
                  }}
                >
                  ⤢
                </button>
              </div>
            )}

            {/* Top tasks */}
            <div style={{ borderTop: '1.5px solid #000', paddingTop: '8px' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  cursor: 'pointer',
                  marginBottom: '6px',
                }}
                onClick={() => setTasksExpanded(e => !e)}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '10px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                  }}
                >
                  TOP OPEN TASKS
                </span>
                <span style={{ fontSize: '14px' }}>{tasksExpanded ? '−' : '+'}</span>
              </div>

              {tasksExpanded && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  {topTasks.length === 0 ? (
                    <div style={{ fontSize: '12px', color: '#666', fontFamily: 'var(--font-mono)' }}>
                      No open tasks.
                    </div>
                  ) : (
                    topTasks.map(task => {
                      const sectionCfg = SECTION_CONFIGS[task.sectionKey as SectionKey];
                      const due = formatDueDate(task.due);
                      return (
                        <div
                          key={task.id}
                          onClick={() => openDrawer(task.id)}
                          style={{
                            border: '1.5px solid #000',
                            padding: '6px 8px',
                            cursor: 'pointer',
                            background: sectionCfg.bgColor,
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '2px',
                            transition: 'transform 0.1s ease, box-shadow 0.1s ease',
                          }}
                          onMouseEnter={e => {
                            (e.currentTarget as HTMLElement).style.transform = 'translate(-1px, -1px)';
                            (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 #000';
                          }}
                          onMouseLeave={e => {
                            (e.currentTarget as HTMLElement).style.transform = '';
                            (e.currentTarget as HTMLElement).style.boxShadow = '';
                          }}
                        >
                          <div
                            style={{
                              fontSize: '12px',
                              fontFamily: 'var(--font-body)',
                              fontWeight: 600,
                              overflow: 'hidden',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                            }}
                          >
                            {cleanContent(task.content)}
                          </div>
                          <div style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                            <span
                              style={{
                                background: sectionCfg.color,
                                border: '1px solid #000',
                                fontSize: '9px',
                                fontFamily: 'var(--font-mono)',
                                padding: '1px 4px',
                                textTransform: 'uppercase',
                              }}
                            >
                              {sectionCfg.name}
                            </span>
                            {due && (
                              <span
                                style={{
                                  fontSize: '10px',
                                  fontFamily: 'var(--font-mono)',
                                  color: task.isOverdue ? '#FF3B00' : '#555',
                                }}
                              >
                                {due}
                              </span>
                            )}
                            {task.isOverdue && (
                              <span style={{ fontSize: '9px', color: '#FF3B00', fontFamily: 'var(--font-mono)', fontWeight: 700 }}>
                                OVERDUE
                              </span>
                            )}
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Inline generation output — only shown while generating or briefly on error */}
            {(generating || genOutput) && (
              <div
                style={{
                  marginTop: '10px',
                  background: '#0d0d0d',
                  border: '1.5px solid #333',
                  padding: '8px 10px',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '11px',
                  maxHeight: '120px',
                  overflowY: 'auto',
                  color: '#b0b0b0',
                }}
              >
                {generating && (
                  <div style={{ color: '#FFE500', marginBottom: genOutput ? '4px' : 0 }}>
                    ⟳ Running /morning{genDots}
                  </div>
                )}
                {genOutput && (
                  <pre style={{ margin: 0, whiteSpace: 'pre-wrap', wordBreak: 'break-word', color: genOutput.startsWith('[error') ? '#FF6B6B' : '#b0b0b0' }}>
                    {genOutput}
                  </pre>
                )}
                {!generating && genOutput && !genOutput.startsWith('[error') && (
                  <div style={{ color: '#4CAF50', marginTop: '4px' }}>✓ Done — digest refreshed</div>
                )}
              </div>
            )}

            {/* Regenerate button */}
            <button
              className="nb-btn nb-btn-primary"
              style={{
                marginTop: '10px',
                width: '100%',
                fontSize: '11px',
                opacity: generating ? 0.6 : 1,
                cursor: generating ? 'not-allowed' : 'pointer',
              }}
              onClick={handleRegenerate}
              disabled={generating}
            >
              {generating ? `GENERATING${genDots}` : 'REGENERATE ↺'}
            </button>
          </div>
        )}
      </div>
    </>
  );
}
