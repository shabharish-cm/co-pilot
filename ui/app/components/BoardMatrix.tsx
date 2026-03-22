'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useBoardStore, startPolling, stopPolling } from '../store/boardStore';
import type { TaskStatus, SectionKey } from '../lib/types';
import {
  SECTION_CONFIGS,
  SECTION_ORDER,
  STATUS_ORDER,
  STATUS_LABELS,
} from '../lib/utils';
import TaskCard from './TaskCard';
import QuickAddForm from './QuickAddForm';

// Confirm-done modal (simple inline)
function DoneModal({ onConfirm, onCancel }: { onConfirm: () => void; onCancel: () => void }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.45)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000,
    }}>
      <div style={{
        background: '#fff', border: '2.5px solid #000', boxShadow: '6px 6px 0 #000',
        padding: '24px 28px', maxWidth: '340px', width: '100%',
      }}>
        <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '13px', letterSpacing: '0.08em', marginBottom: '12px' }}>
          MARK AS COMPLETE?
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#444', marginBottom: '20px' }}>
          This will close the task in Todoist. It cannot be undone from this board.
        </div>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button className="nb-btn nb-btn-primary" onClick={onConfirm} style={{ fontSize: '11px' }}>COMPLETE ✓</button>
          <button className="nb-btn" onClick={onCancel} style={{ fontSize: '11px' }}>CANCEL</button>
        </div>
      </div>
    </div>
  );
}

export default function BoardMatrix() {
  const {
    fetchTasks,
    getFilteredTasks,
    updateTaskStatus,
    completeTask,
    openDrawer,
    lastFetch,
    isLoading,
    error,
    filterSection,
    filterStatus,
    filterDue,
    setFilter,
    clearFilters,
    enableUpNext,
    enableBlocked,
  } = useBoardStore();

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [doneConfirm, setDoneConfirm] = useState<{ taskId: string } | null>(null);
  const [syncStatus, setSyncStatus] = useState<{ ago: string; next: string }>({ ago: '…', next: '15m' });
  const filterRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetchTasks();
    startPolling(fetchTasks);
    return () => stopPolling();
  }, [fetchTasks]);

  // Sync status ticker
  useEffect(() => {
    const iv = setInterval(() => {
      if (!lastFetch) return;
      const elapsed = Math.floor((Date.now() - lastFetch) / 1000);
      const nextIn = Math.max(0, 15 * 60 - elapsed);
      setSyncStatus({
        ago: elapsed < 60 ? `${elapsed}s ago` : elapsed < 3600 ? `${Math.floor(elapsed / 60)}m ago` : `${Math.floor(elapsed / 3600)}h ago`,
        next: nextIn < 60 ? `${nextIn}s` : `${Math.floor(nextIn / 60)}m`,
      });
    }, 5000);
    return () => clearInterval(iv);
  }, [lastFetch]);

  // Close filter on outside click
  useEffect(() => {
    const h = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) setShowFilterDropdown(false);
    };
    document.addEventListener('mousedown', h);
    return () => document.removeEventListener('mousedown', h);
  }, []);

  // Cmd+N shortcut
  useEffect(() => {
    const h = (e: KeyboardEvent) => { if (e.key === 'n' && e.metaKey) { e.preventDefault(); setShowQuickAdd(true); } };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  }, []);

  const tasks = getFilteredTasks();
  const hasActiveFilters = !!(filterSection || filterStatus || filterDue.length > 0);

  const visibleStatuses = STATUS_ORDER.filter(s => {
    if (s === 'up-next' && !enableUpNext) return false;
    if (s === 'blocked' && !enableBlocked) return false;
    return true;
  });

  const onDragEnd = useCallback((result: DropResult) => {
    const { draggableId, destination, source } = result;
    if (!destination || destination.droppableId === source.droppableId) return;

    const destStatus = destination.droppableId as TaskStatus;

    if (destStatus === 'done') {
      setDoneConfirm({ taskId: draggableId });
      return;
    }

    updateTaskStatus(draggableId, destStatus);
  }, [updateTaskStatus]);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>

      {/* Toolbar */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: '8px',
        padding: '10px 16px', borderBottom: '2.5px solid #000',
        background: '#fff', flexShrink: 0, flexWrap: 'wrap',
      }}>
        <button className="nb-btn nb-btn-primary" onClick={() => setShowQuickAdd(true)} style={{ fontSize: '11px' }}>
          + ADD TASK
        </button>

        {/* Filter dropdown */}
        <div ref={filterRef} style={{ position: 'relative' }}>
          <button
            className="nb-btn"
            onClick={() => setShowFilterDropdown(v => !v)}
            style={{ fontSize: '11px', background: hasActiveFilters ? '#FFE500' : undefined }}
          >
            FILTER {hasActiveFilters ? '●' : '▾'}
          </button>

          {showFilterDropdown && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 4px)', left: 0,
              background: '#fff', border: '2.5px solid #000', boxShadow: '4px 4px 0 #000',
              padding: '12px', zIndex: 1000, minWidth: '220px',
            }}>
              {/* Section filter */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '9px', letterSpacing: '0.08em', marginBottom: '5px', color: '#666' }}>
                  SECTION
                </div>
                {SECTION_ORDER.map(key => (
                  <label key={key} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'var(--font-body)', cursor: 'pointer', padding: '2px 0' }}>
                    <input type="radio" name="filter-section" checked={filterSection === key} onChange={() => setFilter('section', key)} />
                    <span style={{
                      background: SECTION_CONFIGS[key].color, border: '1.5px solid #000',
                      padding: '1px 6px', fontSize: '10px', fontFamily: 'var(--font-mono)',
                      fontWeight: 700, letterSpacing: '0.05em',
                    }}>
                      {SECTION_CONFIGS[key].name}
                    </span>
                  </label>
                ))}
              </div>

              {/* Due filter */}
              <div style={{ marginBottom: '12px' }}>
                <div style={{ fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '9px', letterSpacing: '0.08em', marginBottom: '5px', color: '#666' }}>
                  DUE
                </div>
                {(['overdue', 'today', 'this-week'] as const).map(d => (
                  <label key={d} style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '12px', fontFamily: 'var(--font-body)', cursor: 'pointer', padding: '2px 0' }}>
                    <input type="checkbox" checked={filterDue.includes(d)} onChange={() => setFilter('due', d)} />
                    {d === 'overdue' ? 'Overdue' : d === 'today' ? 'Due today' : 'This week'}
                  </label>
                ))}
              </div>

              <button className="nb-btn" onClick={clearFilters} style={{ fontSize: '10px', width: '100%' }}>
                CLEAR FILTERS
              </button>
            </div>
          )}
        </div>

        {/* Sync status */}
        <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#888', marginLeft: 'auto' }}>
          {isLoading ? '⟳ syncing…' : `↺ ${syncStatus.ago} · next ${syncStatus.next}`}
        </span>

        {error && (
          <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#FF3B00' }}>
            ⚠ {error}
          </span>
        )}
      </div>

      {/* Kanban columns */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{
          flex: 1, display: 'flex', overflowX: 'auto', overflowY: 'hidden',
          padding: '0', gap: '0',
        }}>
          {visibleStatuses.map((status, colIdx) => {
            const colTasks = tasks.filter(t => t.status === status);
            const isDoneCol = status === 'done';

            return (
              <div
                key={status}
                style={{
                  minWidth: '220px',
                  flex: '1 1 220px',
                  display: 'flex',
                  flexDirection: 'column',
                  borderRight: colIdx < visibleStatuses.length - 1 ? '2.5px solid #000' : undefined,
                  height: '100%',
                  background: isDoneCol ? 'rgba(0,0,0,0.02)' : '#FFFBF5',
                }}
              >
                {/* Column header */}
                <div style={{
                  background: '#000', color: '#fff', padding: '8px 12px',
                  fontFamily: 'var(--font-heading)', fontWeight: 700, fontSize: '11px',
                  letterSpacing: '0.12em', display: 'flex', alignItems: 'center',
                  justifyContent: 'space-between', flexShrink: 0,
                  borderBottom: '2.5px solid #000',
                }}>
                  <span>{STATUS_LABELS[status]}</span>
                  <span style={{
                    background: colTasks.length > 0 ? '#FFE500' : '#333',
                    color: colTasks.length > 0 ? '#000' : '#888',
                    fontFamily: 'var(--font-mono)', fontSize: '10px', fontWeight: 700,
                    padding: '1px 6px', border: '1.5px solid #444',
                  }}>
                    {colTasks.length}
                  </span>
                </div>

                {/* Droppable area */}
                <Droppable droppableId={status}>
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.droppableProps}
                      style={{
                        flex: 1,
                        overflowY: 'auto',
                        padding: '10px 8px',
                        background: snapshot.isDraggingOver ? 'rgba(255,229,0,0.08)' : undefined,
                        transition: 'background 0.15s',
                        minHeight: '80px',
                      }}
                    >
                      {colTasks.map((task, idx) => (
                        <TaskCard
                          key={task.id}
                          task={task}
                          index={idx}
                          onOpen={() => openDrawer(task.id)}
                          onMenuOpen={() => {}}
                        />
                      ))}
                      {provided.placeholder}

                      {colTasks.length === 0 && !snapshot.isDraggingOver && (
                        <div style={{
                          textAlign: 'center', color: '#ccc',
                          fontFamily: 'var(--font-mono)', fontSize: '10px',
                          padding: '20px 0', userSelect: 'none',
                        }}>
                          —
                        </div>
                      )}
                    </div>
                  )}
                </Droppable>
              </div>
            );
          })}
        </div>
      </DragDropContext>

      {/* Modals */}
      {doneConfirm && (
        <DoneModal
          onConfirm={() => {
            completeTask(doneConfirm.taskId);
            setDoneConfirm(null);
          }}
          onCancel={() => setDoneConfirm(null)}
        />
      )}

      {showQuickAdd && <QuickAddForm onClose={() => setShowQuickAdd(false)} />}
    </div>
  );
}
