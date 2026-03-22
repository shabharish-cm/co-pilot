'use client';

import React, { useCallback, useEffect, useRef, useState } from 'react';
import { DragDropContext, Droppable, DropResult } from '@hello-pangea/dnd';
import { useBoardStore, startPolling, stopPolling } from '../store/boardStore';
import type { TaskStatus, SectionKey, TaskWithMeta } from '../lib/types';
import {
  SECTION_CONFIGS,
  SECTION_ORDER,
  STATUS_ORDER,
  STATUS_LABELS,
} from '../lib/utils';
import { routeTask } from '../lib/routing';
import TaskCard from './TaskCard';
import RoutingModal from './RoutingModal';
import QuickAddForm from './QuickAddForm';
import type { RoutingResult } from '../lib/types';

interface RoutingModalState {
  taskId: string;
  taskTitle: string;
  routing: RoutingResult;
  draggedSectionKey: SectionKey;
  draggedSectionId: string;
}

interface FilterDropdown {
  section: SectionKey | null;
  status: TaskStatus | null;
  due: 'overdue' | 'today' | 'this-week' | null;
}

export default function BoardMatrix() {
  const {
    fetchTasks,
    getFilteredTasks,
    updateTaskStatus,
    moveTaskToSection,
    openDrawer,
    lastFetch,
    isLoading,
    error,
    filterSection,
    filterStatus,
    filterDue,
    setFilter,
    clearFilters,
  } = useBoardStore();

  const [showFilterDropdown, setShowFilterDropdown] = useState(false);
  const [showQuickAdd, setShowQuickAdd] = useState(false);
  const [routingModal, setRoutingModal] = useState<RoutingModalState | null>(null);
  const [doneConfirm, setDoneConfirm] = useState<{ taskId: string } | null>(null);
  const [contextMenu, setContextMenu] = useState<{ taskId: string; x: number; y: number } | null>(null);
  const [syncStatus, setSyncStatus] = useState<{ ago: string; next: string }>({ ago: 'Never', next: '15m' });
  const filterRef = useRef<HTMLDivElement>(null);

  // Start polling on mount
  useEffect(() => {
    fetchTasks();
    startPolling(fetchTasks);
    return () => stopPolling();
  }, [fetchTasks]);

  // Sync status text
  useEffect(() => {
    const interval = setInterval(() => {
      if (lastFetch === 0) {
        setSyncStatus({ ago: 'Never', next: '—' });
        return;
      }
      const elapsed = Math.floor((Date.now() - lastFetch) / 1000);
      const nextIn = Math.max(0, 15 * 60 - elapsed);

      const agoText = elapsed < 60
        ? `${elapsed}s ago`
        : elapsed < 3600
        ? `${Math.floor(elapsed / 60)}m ago`
        : `${Math.floor(elapsed / 3600)}h ago`;

      const nextText = nextIn < 60
        ? `${nextIn}s`
        : `${Math.floor(nextIn / 60)}m`;

      setSyncStatus({ ago: agoText, next: nextText });
    }, 5000);
    return () => clearInterval(interval);
  }, [lastFetch]);

  // Close filter dropdown on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (filterRef.current && !filterRef.current.contains(e.target as Node)) {
        setShowFilterDropdown(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close context menu on outside click
  useEffect(() => {
    const handler = () => setContextMenu(null);
    document.addEventListener('click', handler);
    return () => document.removeEventListener('click', handler);
  }, []);

  // Keyboard shortcuts
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setShowQuickAdd(true);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  const tasks = getFilteredTasks();

  const getTasksForCell = useCallback(
    (sectionKey: SectionKey, status: TaskStatus): TaskWithMeta[] => {
      return tasks.filter(t => t.sectionKey === sectionKey && t.status === status);
    },
    [tasks]
  );

  const onDragEnd = useCallback(
    (result: DropResult) => {
      const { draggableId, destination, source } = result;
      if (!destination) return;
      if (destination.droppableId === source.droppableId) return;

      const [destSection, destStatus] = destination.droppableId.split(':') as [SectionKey, TaskStatus];
      const [srcSection] = source.droppableId.split(':') as [SectionKey, TaskStatus];

      const task = tasks.find(t => t.id === draggableId);
      if (!task) return;

      // Moving to DONE
      if (destStatus === 'done') {
        setDoneConfirm({ taskId: draggableId });
        return;
      }

      // Same section → just update status
      if (destSection === srcSection) {
        updateTaskStatus(draggableId, destStatus);
        return;
      }

      // Cross-section move
      const destCfg = SECTION_CONFIGS[destSection];
      const routing = routeTask(task.content, task.labels);

      // If routing suggests a different section with low confidence → show modal
      const routingSectionId = routing.sectionId;
      const isDifferentFromRouting = routingSectionId !== destCfg.id;
      const isLowConfidence =
        routing.confidence === 'inferred' ||
        routing.confidence === 'defaulted' ||
        routing.confidence === 'label-inferred';

      if (isDifferentFromRouting && isLowConfidence) {
        setRoutingModal({
          taskId: draggableId,
          taskTitle: task.content,
          routing,
          draggedSectionKey: destSection,
          draggedSectionId: destCfg.id,
        });
        return;
      }

      // Matched confidence or dragged to the same as routing → commit immediately
      moveTaskToSection(draggableId, destCfg.id, destSection);
      if (destStatus !== task.status) {
        updateTaskStatus(draggableId, destStatus);
      }
    },
    [tasks, updateTaskStatus, moveTaskToSection]
  );

  const hasActiveFilters = filterSection || filterStatus || filterDue;

  // Dynamic column widths
  const COL_MIN = 180;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
      {/* Board toolbar */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '10px 16px',
          borderBottom: '2.5px solid #000',
          background: '#fff',
          flexShrink: 0,
          flexWrap: 'wrap',
        }}
      >
        {/* Add task */}
        <button
          className="nb-btn nb-btn-primary"
          onClick={() => setShowQuickAdd(true)}
          style={{ fontSize: '11px' }}
        >
          + ADD TASK
        </button>

        {/* Filter */}
        <div ref={filterRef} style={{ position: 'relative' }}>
          <button
            className="nb-btn"
            onClick={() => setShowFilterDropdown(v => !v)}
            style={{
              fontSize: '11px',
              background: hasActiveFilters ? '#FFE500' : undefined,
            }}
          >
            FILTER {hasActiveFilters ? '●' : '▾'}
          </button>

          {showFilterDropdown && (
            <div
              style={{
                position: 'absolute',
                top: 'calc(100% + 4px)',
                left: 0,
                background: '#fff',
                border: '2.5px solid #000',
                boxShadow: '4px 4px 0 #000',
                padding: '12px',
                zIndex: 1000,
                minWidth: '220px',
              }}
            >
              <div style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '9px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                    color: '#666',
                  }}
                >
                  SECTION
                </div>
                {SECTION_ORDER.map(key => (
                  <label
                    key={key}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      padding: '2px 0',
                    }}
                  >
                    <input
                      type="radio"
                      name="filter-section"
                      checked={filterSection === key}
                      onChange={() => setFilter('section', key)}
                    />
                    <span
                      style={{
                        background: SECTION_CONFIGS[key].color,
                        border: '1px solid #000',
                        padding: '1px 4px',
                        fontSize: '10px',
                      }}
                    >
                      {SECTION_CONFIGS[key].name}
                    </span>
                  </label>
                ))}
              </div>

              <div style={{ marginBottom: '10px' }}>
                <div
                  style={{
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '9px',
                    letterSpacing: '0.08em',
                    textTransform: 'uppercase',
                    marginBottom: '4px',
                    color: '#666',
                  }}
                >
                  DUE
                </div>
                {(['overdue', 'today', 'this-week'] as const).map(d => (
                  <label
                    key={d}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      fontSize: '12px',
                      fontFamily: 'var(--font-body)',
                      cursor: 'pointer',
                      padding: '2px 0',
                    }}
                  >
                    <input
                      type="radio"
                      name="filter-due"
                      checked={filterDue === d}
                      onChange={() => setFilter('due', d)}
                    />
                    {d.toUpperCase()}
                  </label>
                ))}
              </div>

              {hasActiveFilters && (
                <button
                  className="nb-btn"
                  style={{ width: '100%', justifyContent: 'center', marginTop: '4px' }}
                  onClick={() => { clearFilters(); setShowFilterDropdown(false); }}
                >
                  CLEAR FILTERS
                </button>
              )}
            </div>
          )}
        </div>

        {/* Sync status */}
        <button
          className="nb-btn"
          onClick={() => fetchTasks()}
          disabled={isLoading}
          style={{ fontSize: '11px', marginLeft: 'auto', opacity: isLoading ? 0.5 : 1 }}
          title="Refresh now"
        >
          ↺ {isLoading ? 'SYNCING…' : `${syncStatus.ago} · NEXT IN ${syncStatus.next}`}
        </button>
      </div>

      {/* Error banner */}
      {error && (
        <div
          style={{
            background: '#FFE4E0',
            border: '1.5px solid #FF3B00',
            borderTop: 'none',
            padding: '8px 16px',
            fontSize: '12px',
            fontFamily: 'var(--font-mono)',
            color: '#FF3B00',
            flexShrink: 0,
          }}
        >
          ⚠ {error}
        </div>
      )}

      {/* Board grid */}
      <DragDropContext onDragEnd={onDragEnd}>
        <div style={{ flex: 1, overflowX: 'auto', overflowY: 'hidden' }}>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: `140px repeat(${STATUS_ORDER.length}, minmax(${COL_MIN}px, 1fr))`,
              minWidth: `${140 + STATUS_ORDER.length * COL_MIN}px`,
              height: '100%',
            }}
          >
            {/* Top-left corner */}
            <div
              style={{
                borderRight: '2.5px solid #000',
                borderBottom: '2.5px solid #000',
                background: '#000',
              }}
            />

            {/* Column headers */}
            {STATUS_ORDER.map(status => (
              <div
                key={status}
                style={{
                  borderRight: '2.5px solid #000',
                  borderBottom: '2.5px solid #000',
                  background: '#000',
                  color: '#fff',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '11px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  padding: '10px 12px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                }}
              >
                {STATUS_LABELS[status]}
                <span
                  style={{
                    background: '#333',
                    fontSize: '10px',
                    padding: '1px 5px',
                    fontWeight: 400,
                  }}
                >
                  {tasks.filter(t => t.status === status).length}
                </span>
              </div>
            ))}

            {/* Rows */}
            {SECTION_ORDER.map(sectionKey => {
              const sectionCfg = SECTION_CONFIGS[sectionKey];
              const sectionTasks = tasks.filter(t => t.sectionKey === sectionKey);

              return (
                <React.Fragment key={sectionKey}>
                  {/* Row label */}
                  <div
                    style={{
                      borderRight: '2.5px solid #000',
                      borderBottom: '1.5px solid #000',
                      background: sectionCfg.color,
                      padding: '8px',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'space-between',
                      alignItems: 'flex-start',
                      minHeight: '100px',
                    }}
                  >
                    <div
                      style={{
                        fontFamily: 'var(--font-heading)',
                        fontWeight: 700,
                        fontSize: '11px',
                        letterSpacing: '0.06em',
                        textTransform: 'uppercase',
                        writingMode: 'vertical-rl',
                        transform: 'rotate(180deg)',
                        flex: 1,
                        display: 'flex',
                        alignItems: 'center',
                        gap: '4px',
                      }}
                    >
                      {sectionCfg.name}
                    </div>
                    <div
                      style={{
                        background: '#000',
                        color: '#fff',
                        fontFamily: 'var(--font-mono)',
                        fontSize: '10px',
                        padding: '2px 4px',
                        marginTop: '4px',
                      }}
                    >
                      {sectionTasks.length}
                    </div>
                  </div>

                  {/* Cells */}
                  {STATUS_ORDER.map(status => {
                    const cellTasks = getTasksForCell(sectionKey, status);
                    const droppableId = `${sectionKey}:${status}`;

                    return (
                      <Droppable key={droppableId} droppableId={droppableId}>
                        {(provided, snapshot) => (
                          <div
                            ref={provided.innerRef}
                            {...provided.droppableProps}
                            style={{
                              borderRight: '2.5px solid #000',
                              borderBottom: '1.5px solid #000',
                              background: snapshot.isDraggingOver
                                ? `${sectionCfg.color}33`
                                : sectionCfg.bgColor,
                              padding: '8px',
                              minHeight: '100px',
                              overflowY: 'auto',
                              transition: 'background 0.15s ease',
                            }}
                          >
                            {cellTasks.map((task, index) => (
                              <TaskCard
                                key={task.id}
                                task={task}
                                index={index}
                                onOpen={() => openDrawer(task.id)}
                                onMenuOpen={(e) => {
                                  e.preventDefault();
                                  setContextMenu({
                                    taskId: task.id,
                                    x: e.clientX,
                                    y: e.clientY,
                                  });
                                }}
                              />
                            ))}
                            {provided.placeholder}

                            {cellTasks.length === 0 && !snapshot.isDraggingOver && (
                              <div
                                style={{
                                  fontSize: '10px',
                                  color: '#bbb',
                                  fontFamily: 'var(--font-mono)',
                                  textAlign: 'center',
                                  padding: '12px 4px',
                                  borderTop: cellTasks.length === 0 ? 'none' : '1px dashed #ddd',
                                }}
                              >
                                —
                              </div>
                            )}
                          </div>
                        )}
                      </Droppable>
                    );
                  })}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </DragDropContext>

      {/* Routing modal */}
      {routingModal && (
        <RoutingModal
          taskTitle={routingModal.taskTitle}
          routing={routingModal.routing}
          draggedSectionKey={routingModal.draggedSectionKey}
          onConfirmDrag={() => {
            moveTaskToSection(
              routingModal.taskId,
              routingModal.draggedSectionId,
              routingModal.draggedSectionKey
            );
            setRoutingModal(null);
          }}
          onKeepSuggested={() => {
            // Keep current section, just close
            setRoutingModal(null);
          }}
          onClose={() => setRoutingModal(null)}
        />
      )}

      {/* Done confirmation */}
      {doneConfirm && (
        <div
          style={{
            position: 'fixed',
            inset: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
          }}
          onClick={() => setDoneConfirm(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              border: '2.5px solid #000',
              boxShadow: '6px 6px 0 #000',
              padding: '24px',
              width: '360px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '14px',
                marginBottom: '8px',
              }}
            >
              Mark complete in Todoist?
            </div>
            <div style={{ fontSize: '12px', color: '#555', marginBottom: '16px' }}>
              This task will be marked complete and removed from the board.
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="nb-btn"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setDoneConfirm(null)}
              >
                CANCEL
              </button>
              <button
                className="nb-btn nb-btn-primary"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => {
                  const { completeTask } = useBoardStore.getState();
                  completeTask(doneConfirm.taskId);
                  setDoneConfirm(null);
                }}
              >
                COMPLETE ✓
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Context menu */}
      {contextMenu && (
        <div
          style={{
            position: 'fixed',
            left: contextMenu.x,
            top: contextMenu.y,
            background: '#fff',
            border: '2.5px solid #000',
            boxShadow: '4px 4px 0 #000',
            zIndex: 9000,
            minWidth: '160px',
          }}
          onClick={e => e.stopPropagation()}
        >
          {[
            { label: 'OPEN DETAILS', action: () => openDrawer(contextMenu.taskId) },
            { label: 'MARK COMPLETE', action: () => {
              setDoneConfirm({ taskId: contextMenu.taskId });
              setContextMenu(null);
            }},
          ].map(item => (
            <button
              key={item.label}
              onClick={() => { item.action(); setContextMenu(null); }}
              style={{
                display: 'block',
                width: '100%',
                background: 'transparent',
                border: 'none',
                borderBottom: '1px solid #eee',
                padding: '10px 14px',
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.06em',
                textTransform: 'uppercase',
                textAlign: 'left',
                cursor: 'pointer',
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      )}

      {/* Quick add form */}
      {showQuickAdd && (
        <QuickAddForm onClose={() => setShowQuickAdd(false)} />
      )}
    </div>
  );
}

