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

export default function DigestPanel() {
  const [digest, setDigest] = useState<DigestData | null>(null);
  const [expanded, setExpanded] = useState(true);
  const [tasksExpanded, setTasksExpanded] = useState(true);
  const { tasks, openDrawer, setSidebarOpen } = useBoardStore();

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

  const topTasks = tasks
    .filter(t => t.status !== 'done')
    .sort((a, b) => {
      // P1 first, then by overdue
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
          {/* Prose summary */}
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
            <p
              style={{
                fontSize: '12px',
                fontFamily: 'var(--font-body)',
                color: '#333',
                margin: '0 0 10px',
                lineHeight: 1.5,
              }}
            >
              {prose}
              {digest!.content!.length > 240 ? '…' : ''}
            </p>
          )}

          {/* Top tasks */}
          <div
            style={{
              borderTop: '1.5px solid #000',
              paddingTop: '8px',
            }}
          >
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

          {/* Regenerate button */}
          <button
            className="nb-btn nb-btn-primary"
            style={{ marginTop: '10px', width: '100%', fontSize: '11px' }}
            onClick={() => {
              setSidebarOpen(true);
              // Signal to sidebar to run /morning
              window.dispatchEvent(new CustomEvent('copilot:command', { detail: '/morning' }));
            }}
          >
            REGENERATE ↺
          </button>
        </div>
      )}
    </div>
  );
}
