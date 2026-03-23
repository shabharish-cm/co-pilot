'use client';

import { useEffect } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { useBoardStore } from '../store/boardStore';
import { SECTION_CONFIGS, cleanContent } from '../lib/utils';
import type { SectionKey } from '../lib/types';

const IST = 'Asia/Kolkata';

interface DueTodayRowProps {
  /** Render as a vertical sidebar panel (used in HomeView Zone A) */
  sidebar?: boolean;
}

export default function DueTodayRow({ sidebar = false }: DueTodayRowProps) {
  const { tasks, fetchTasks, completeTask, openDrawer, setActiveTab } = useBoardStore();

  useEffect(() => {
    if (tasks.length === 0) fetchTasks();
  }, [tasks.length, fetchTasks]);

  const todayStr = formatInTimeZone(new Date(), IST, 'yyyy-MM-dd');
  const dueTodayTasks = tasks.filter(t =>
    t.status !== 'done' &&
    !t.parent_id &&
    t.due?.date === todayStr
  ).sort((a, b) => a.priority - b.priority);

  // ── Sidebar (vertical) layout ──────────────────────────────────────────────
  if (sidebar) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden', background: '#FFFBF5' }}>

        {/* Header */}
        <div style={{
          background: '#000',
          padding: '8px 12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          flexShrink: 0,
          borderBottom: '2.5px solid #000',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <span style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '10px',
              letterSpacing: '0.12em',
              color: '#FFE500',
            }}>
              DUE TODAY
            </span>
            <span style={{
              background: dueTodayTasks.length > 0 ? '#FFE500' : '#333',
              color: dueTodayTasks.length > 0 ? '#000' : '#888',
              fontFamily: 'var(--font-mono)',
              fontSize: '10px',
              fontWeight: 700,
              padding: '1px 6px',
              border: '1.5px solid #444',
            }}>
              {dueTodayTasks.length}
            </span>
          </div>
          <button
            onClick={() => setActiveTab('board')}
            style={{
              background: 'transparent',
              color: '#888',
              border: 'none',
              fontFamily: 'var(--font-mono)',
              fontSize: '9px',
              padding: '2px 0',
              cursor: 'pointer',
              letterSpacing: '0.05em',
            }}
          >
            BOARD →
          </button>
        </div>

        {/* Vertical scrollable task list */}
        <div style={{
          flex: 1,
          overflowY: 'auto',
          overflowX: 'hidden',
          padding: '8px',
        }}>
          {dueTodayTasks.length === 0 && (
            <div style={{
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              height: '80px',
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#aaa',
              textAlign: 'center',
            }}>
              ✓ Nothing due today
            </div>
          )}

          {dueTodayTasks.map(task => {
            const sectionCfg = SECTION_CONFIGS[task.sectionKey as SectionKey];
            const p1Border = task.priority === 1 ? '#FF3B00' : task.priority === 2 ? '#FFE500' : '#e0e0e0';

            return (
              <div
                key={task.id}
                style={{
                  border: '2px solid #000',
                  boxShadow: '2px 2px 0 #000',
                  background: '#fff',
                  display: 'flex',
                  flexDirection: 'column',
                  borderLeft: `4px solid ${p1Border}`,
                  marginBottom: '8px',
                  cursor: 'pointer',
                  transition: 'transform 0.1s, box-shadow 0.1s',
                }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLElement).style.transform = 'translate(-1px,-1px)';
                  (e.currentTarget as HTMLElement).style.boxShadow = '3px 3px 0 #000';
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLElement).style.transform = '';
                  (e.currentTarget as HTMLElement).style.boxShadow = '2px 2px 0 #000';
                }}
                onClick={() => openDrawer(task.id)}
              >
                {/* Section badge + overdue */}
                <div style={{ padding: '6px 8px 2px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{
                    background: sectionCfg.color,
                    border: '1.5px solid #000',
                    fontSize: '8px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '1px 4px',
                    letterSpacing: '0.04em',
                    textTransform: 'uppercase',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                    maxWidth: '130px',
                  }}>
                    {sectionCfg.name}
                  </span>
                  {task.isOverdue && (
                    <span style={{ fontSize: '8px', color: '#FF3B00', fontFamily: 'var(--font-mono)', fontWeight: 700, flexShrink: 0 }}>
                      OVERDUE
                    </span>
                  )}
                </div>

                {/* Title */}
                <div style={{
                  padding: '2px 8px 6px',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 600,
                  fontSize: '12px',
                  color: '#000',
                  lineHeight: 1.35,
                  overflow: 'hidden',
                  display: '-webkit-box',
                  WebkitLineClamp: 2,
                  WebkitBoxOrient: 'vertical',
                }}>
                  {cleanContent(task.content)}
                </div>

                {/* Done button */}
                <div
                  style={{ borderTop: '1.5px solid #e0e0e0', display: 'flex' }}
                  onClick={e => e.stopPropagation()}
                >
                  <button
                    onClick={() => completeTask(task.id)}
                    style={{
                      flex: 1,
                      background: 'transparent',
                      border: 'none',
                      padding: '4px',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '10px',
                      fontWeight: 700,
                      letterSpacing: '0.05em',
                      cursor: 'pointer',
                      color: '#555',
                      textAlign: 'center',
                    }}
                    onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#B9F0A0'; }}
                    onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'transparent'; }}
                  >
                    ✓ DONE
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ── Horizontal row layout (standalone use) ─────────────────────────────────
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      <div style={{
        background: '#000',
        padding: '8px 16px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexShrink: 0,
        borderBottom: '2.5px solid #000',
        borderTop: '2.5px solid #000',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '11px', letterSpacing: '0.12em', color: '#FFE500' }}>
            DUE TODAY
          </span>
          <span style={{
            background: dueTodayTasks.length > 0 ? '#FFE500' : '#333',
            color: dueTodayTasks.length > 0 ? '#000' : '#888',
            fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
            padding: '1px 7px', border: '1.5px solid #444',
          }}>
            {dueTodayTasks.length}
          </span>
        </div>
        <button
          onClick={() => setActiveTab('board')}
          style={{
            background: 'transparent', color: '#666', border: '1.5px solid #333',
            fontFamily: 'var(--font-mono)', fontSize: '10px', padding: '3px 8px',
            cursor: 'pointer', letterSpacing: '0.05em',
          }}
        >
          FULL BOARD →
        </button>
      </div>

      <div style={{
        flex: 1, overflowX: 'auto', overflowY: 'hidden',
        display: 'flex', alignItems: 'flex-start',
        gap: '10px', padding: '10px 16px', background: '#FFFBF5',
      }}>
        {dueTodayTasks.length === 0 && (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '100%', fontFamily: 'var(--font-mono)', fontSize: '12px', color: '#aaa' }}>
            ✓ Nothing due today
          </div>
        )}
        {dueTodayTasks.map(task => {
          const sectionCfg = SECTION_CONFIGS[task.sectionKey as SectionKey];
          const p1Border = task.priority === 1 ? '#FF3B00' : task.priority === 2 ? '#FFE500' : '#ddd';
          return (
            <div key={task.id} style={{ minWidth: '200px', maxWidth: '240px', flexShrink: 0, border: '2.5px solid #000', boxShadow: '3px 3px 0 #000', background: '#fff', display: 'flex', flexDirection: 'column', borderLeft: `4px solid ${p1Border}`, cursor: 'pointer' }}
              onClick={() => openDrawer(task.id)}>
              <div style={{ padding: '8px 10px 4px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ background: sectionCfg.color, border: '1.5px solid #000', fontSize: '9px', fontFamily: 'var(--font-mono)', fontWeight: 700, padding: '1px 5px', letterSpacing: '0.05em', textTransform: 'uppercase' }}>{sectionCfg.name}</span>
              </div>
              <div style={{ padding: '2px 10px 8px', fontFamily: 'var(--font-body)', fontWeight: 600, fontSize: '13px', color: '#000', lineHeight: 1.4, overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' }}>
                {cleanContent(task.content)}
              </div>
              <div style={{ borderTop: '1.5px solid #000', display: 'flex' }} onClick={e => e.stopPropagation()}>
                <button onClick={() => completeTask(task.id)} style={{ flex: 1, background: 'transparent', border: 'none', padding: '6px', fontFamily: 'var(--font-mono)', fontSize: '11px', fontWeight: 700, cursor: 'pointer', color: '#555', textAlign: 'center' }}>
                  ✓ DONE
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
