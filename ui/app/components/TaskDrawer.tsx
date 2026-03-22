'use client';

import { useEffect, useRef, useState } from 'react';
import { useBoardStore } from '../store/boardStore';
import type { TaskStatus, SectionKey, TodoistComment } from '../lib/types';
import {
  SECTION_CONFIGS,
  SECTION_ORDER,
  STATUS_ORDER,
  STATUS_LABELS,
  priorityColor,
  placementColor,
  parseValueEffort,
  cleanContent,
} from '../lib/utils';
import { format, parseISO } from 'date-fns';
import { formatInTimeZone } from 'date-fns-tz';

interface ConfirmModal {
  type: 'complete' | 'delete';
}

export default function TaskDrawer() {
  const {
    tasks,
    selectedTaskId,
    drawerOpen,
    closeDrawer,
    openDrawer,
    updateTaskStatus,
    moveTaskToSection,
    completeTask,
    addComment,
    fetchComments,
    updateTask,
  } = useBoardStore();

  const task = tasks.find(t => t.id === selectedTaskId);

  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [newComment, setNewComment] = useState('');
  const [postingComment, setPostingComment] = useState(false);
  const [confirm, setConfirm] = useState<ConfirmModal | null>(null);
  const [newLabel, setNewLabel] = useState('');
  const [addingLabel, setAddingLabel] = useState(false);
  const [newSubtask, setNewSubtask] = useState('');
  const [addingSubtask, setAddingSubtask] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);

  // Sync local fields when task changes
  useEffect(() => {
    if (task) {
      setContent(cleanContent(task.content));
      setDescription(task.description ?? '');
      setDueDate(task.due?.date ?? '');
    }
  }, [task?.id]);

  // Fetch comments when drawer opens
  useEffect(() => {
    if (drawerOpen && selectedTaskId) {
      fetchComments(selectedTaskId);
    }
  }, [drawerOpen, selectedTaskId]);

  // Keyboard: Escape to close
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'Escape') closeDrawer();
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [closeDrawer]);

  if (!drawerOpen || !task) return null;

  const sectionCfg = SECTION_CONFIGS[task.sectionKey];
  const valueEffort = parseValueEffort(description);

  const handleContentBlur = () => {
    if (content !== cleanContent(task.content)) {
      updateTask(task.id, { content });
    }
  };

  const handleDescriptionBlur = () => {
    if (description !== task.description) {
      updateTask(task.id, { description });
    }
  };

  const handleDueDateBlur = () => {
    const current = task.due?.date ?? '';
    if (dueDate !== current) {
      updateTask(task.id, { due: dueDate ? { date: dueDate } : null });
    }
  };

  const handleStatusChange = (status: TaskStatus) => {
    updateTaskStatus(task.id, status);
  };

  const handleSectionChange = (sectionKey: SectionKey) => {
    const cfg = SECTION_CONFIGS[sectionKey];
    moveTaskToSection(task.id, cfg.id, sectionKey);
  };

  const handlePostComment = async () => {
    if (!newComment.trim()) return;
    setPostingComment(true);
    await addComment(task.id, newComment.trim());
    setNewComment('');
    setPostingComment(false);
  };

  const handleRemoveLabel = (label: string) => {
    const newLabels = task.labels.filter(l => l !== label);
    updateTask(task.id, { labels: newLabels });
  };

  const handleAddLabel = () => {
    if (!newLabel.trim()) return;
    const normalized = newLabel.trim().toLowerCase().replace(/\s+/g, '-');
    if (!task.labels.includes(normalized)) {
      updateTask(task.id, { labels: [...task.labels, normalized] });
    }
    setNewLabel('');
    setAddingLabel(false);
  };

  const handleComplete = async () => {
    setConfirm(null);
    await completeTask(task.id);
  };

  const handleAddSubtask = async () => {
    if (!newSubtask.trim()) return;
    setAddingSubtask(true);
    try {
      const res = await fetch('/api/todoist/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: newSubtask.trim(), parent_id: task.id }),
      });
      if (!res.ok) throw new Error('Failed to create subtask');
      setNewSubtask('');
    } catch {
      // silently ignore for now
    } finally {
      setAddingSubtask(false);
    }
  };

  const subtasks = tasks.filter(t => t.parent_id === task.id);
  const comments: TodoistComment[] = task.comments ?? [];

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={closeDrawer}
        style={{
          position: 'fixed',
          inset: 0,
          background: 'rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}
      />

      {/* Drawer */}
      <div
        ref={drawerRef}
        className="slide-in"
        style={{
          position: 'fixed',
          top: 0,
          right: 0,
          bottom: 0,
          width: '420px',
          background: '#FFFBF5',
          borderLeft: '2.5px solid #000',
          boxShadow: '-6px 0 0 #000',
          zIndex: 1001,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#000',
            color: '#fff',
            padding: '12px 16px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            flexShrink: 0,
          }}
        >
          <div
            style={{
              width: '6px',
              height: '20px',
              background: priorityColor(task.priority),
              flexShrink: 0,
            }}
          />
          <div style={{ flex: 1, minWidth: 0 }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '13px',
                letterSpacing: '0.04em',
                whiteSpace: 'nowrap',
                overflow: 'hidden',
                textOverflow: 'ellipsis',
              }}
            >
              {cleanContent(task.content)}
            </div>
            <div style={{ display: 'flex', gap: '6px', marginTop: '2px' }}>
              <span
                style={{
                  background: sectionCfg.color,
                  color: '#000',
                  fontSize: '9px',
                  fontFamily: 'var(--font-mono)',
                  padding: '1px 5px',
                  border: '1px solid rgba(255,255,255,0.4)',
                }}
              >
                {sectionCfg.name}
              </span>
              {task.isOverdue && (
                <span
                  style={{
                    background: '#FF3B00',
                    color: '#fff',
                    fontSize: '9px',
                    fontFamily: 'var(--font-mono)',
                    fontWeight: 700,
                    padding: '1px 5px',
                  }}
                >
                  OVERDUE
                </span>
              )}
            </div>
          </div>
          <button
            onClick={closeDrawer}
            style={{
              background: 'transparent',
              border: '1.5px solid #666',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '14px',
              padding: '2px 8px',
              cursor: 'pointer',
              lineHeight: 1,
              flexShrink: 0,
            }}
          >
            ✕
          </button>
        </div>

        {/* Scrollable body */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '16px' }}>
          {/* Title field */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              TITLE
            </label>
            <textarea
              className="nb-input"
              value={content}
              onChange={e => setContent(e.target.value)}
              onBlur={handleContentBlur}
              rows={2}
              style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '13px' }}
            />
          </div>

          {/* Section + Status row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                SECTION
              </label>
              <select
                className="nb-input"
                value={task.sectionKey}
                onChange={e => handleSectionChange(e.target.value as SectionKey)}
                style={{ cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                {SECTION_ORDER.map(key => (
                  <option key={key} value={key}>
                    {SECTION_CONFIGS[key].name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                STATUS
              </label>
              <select
                className="nb-input"
                value={task.status}
                onChange={e => handleStatusChange(e.target.value as TaskStatus)}
                style={{ cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                {STATUS_ORDER.map(s => (
                  <option key={s} value={s}>
                    {STATUS_LABELS[s]}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Priority + Due date row */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '14px',
            }}
          >
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                PRIORITY
              </label>
              <select
                className="nb-input"
                value={task.priority}
                onChange={e =>
                  updateTask(task.id, {
                    priority: parseInt(e.target.value) as 1 | 2 | 3 | 4,
                  })
                }
                style={{ cursor: 'pointer', fontFamily: 'var(--font-body)' }}
              >
                <option value={1}>P1 — Urgent</option>
                <option value={2}>P2 — High</option>
                <option value={3}>P3 — Medium</option>
                <option value={4}>P4 — Low</option>
              </select>
            </div>
            <div>
              <label
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  display: 'block',
                  marginBottom: '4px',
                }}
              >
                DUE DATE
              </label>
              <input
                type="date"
                className="nb-input"
                value={dueDate}
                onChange={e => setDueDate(e.target.value)}
                onBlur={handleDueDateBlur}
                style={{ fontFamily: 'var(--font-body)', cursor: 'pointer' }}
              />
            </div>
          </div>

          {/* Labels */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              LABELS
            </label>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '4px', marginBottom: '4px' }}>
              {task.labels.map(label => (
                <span
                  key={label}
                  style={{
                    background: label.startsWith('status:') ? '#FFE500' : '#f5f5f5',
                    border: '1.5px solid #000',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    padding: '2px 6px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '4px',
                  }}
                >
                  #{label}
                  <button
                    onClick={() => handleRemoveLabel(label)}
                    style={{
                      background: 'none',
                      border: 'none',
                      cursor: 'pointer',
                      padding: '0 1px',
                      fontSize: '10px',
                      color: '#666',
                      lineHeight: 1,
                    }}
                  >
                    ×
                  </button>
                </span>
              ))}

              {addingLabel ? (
                <div style={{ display: 'flex', gap: '4px' }}>
                  <input
                    className="nb-input"
                    value={newLabel}
                    onChange={e => setNewLabel(e.target.value)}
                    onKeyDown={e => {
                      if (e.key === 'Enter') handleAddLabel();
                      if (e.key === 'Escape') setAddingLabel(false);
                    }}
                    placeholder="label-name"
                    style={{ width: '120px', fontSize: '11px', padding: '2px 6px' }}
                    autoFocus
                  />
                  <button
                    onClick={handleAddLabel}
                    style={{
                      background: '#FFE500',
                      border: '1.5px solid #000',
                      fontFamily: 'var(--font-heading)',
                      fontWeight: 700,
                      fontSize: '9px',
                      padding: '2px 6px',
                      cursor: 'pointer',
                    }}
                  >
                    ADD
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setAddingLabel(true)}
                  style={{
                    background: 'transparent',
                    border: '1.5px dashed #999',
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#777',
                    padding: '2px 6px',
                    cursor: 'pointer',
                  }}
                >
                  + ADD
                </button>
              )}
            </div>
          </div>

          {/* Value/Effort display */}
          {valueEffort && (
            <div
              style={{
                border: '1.5px solid #000',
                padding: '10px 12px',
                marginBottom: '14px',
                background: '#f9f9f9',
              }}
            >
              <div
                style={{
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '10px',
                  letterSpacing: '0.08em',
                  textTransform: 'uppercase',
                  marginBottom: '6px',
                }}
              >
                VALUE/EFFORT SCORE
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                  Value: <strong>{valueEffort.value}</strong>
                </span>
                <span style={{ fontFamily: 'var(--font-mono)', fontSize: '13px' }}>
                  Effort: <strong>{valueEffort.effort}</strong>
                </span>
                <span
                  style={{
                    background: placementColor(valueEffort.placement),
                    border: '1.5px solid #000',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '10px',
                    padding: '2px 8px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {valueEffort.placement}
                </span>
              </div>
            </div>
          )}

          {/* Description */}
          <div style={{ marginBottom: '14px' }}>
            <label
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                display: 'block',
                marginBottom: '4px',
              }}
            >
              DESCRIPTION
            </label>
            <textarea
              className="nb-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              onBlur={handleDescriptionBlur}
              rows={5}
              placeholder="Add description, V:H E:M, notes…"
              style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '12px' }}
            />
          </div>

          {/* Subtasks */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                borderBottom: '1.5px solid #000',
                paddingBottom: '4px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <span>SUBTASKS ({subtasks.length})</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', marginBottom: '8px' }}>
              {subtasks.length === 0 && (
                <div style={{ fontSize: '12px', color: '#aaa', fontFamily: 'var(--font-body)' }}>
                  No subtasks.
                </div>
              )}
              {subtasks.map(st => (
                <div
                  key={st.id}
                  onClick={() => openDrawer(st.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    padding: '6px 8px',
                    border: '1.5px solid #ddd',
                    background: '#fff',
                    cursor: 'pointer',
                    transition: 'border-color 0.1s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.borderColor = '#000')}
                  onMouseLeave={e => (e.currentTarget.style.borderColor = '#ddd')}
                >
                  <div
                    style={{
                      width: '4px',
                      height: '14px',
                      background: st.status === 'done' ? '#aaa' : '#FFE500',
                      flexShrink: 0,
                      border: '1px solid #000',
                    }}
                  />
                  <span
                    style={{
                      flex: 1,
                      fontFamily: 'var(--font-body)',
                      fontSize: '12px',
                      color: st.status === 'done' ? '#aaa' : '#000',
                      textDecoration: st.status === 'done' ? 'line-through' : 'none',
                    }}
                  >
                    {cleanContent(st.content)}
                  </span>
                  <span
                    style={{
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      color: '#888',
                      background: '#f5f5f5',
                      border: '1px solid #ccc',
                      padding: '1px 4px',
                    }}
                  >
                    {st.status}
                  </span>
                  <span style={{ color: '#bbb', fontSize: '10px' }}>↗</span>
                </div>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '6px' }}>
              <input
                className="nb-input"
                value={newSubtask}
                onChange={e => setNewSubtask(e.target.value)}
                onKeyDown={e => { if (e.key === 'Enter') handleAddSubtask(); }}
                placeholder="Add subtask…"
                style={{ flex: 1, fontSize: '12px', padding: '5px 8px' }}
              />
              <button
                className="nb-btn"
                onClick={handleAddSubtask}
                disabled={addingSubtask || !newSubtask.trim()}
                style={{ fontSize: '10px', opacity: addingSubtask || !newSubtask.trim() ? 0.5 : 1 }}
              >
                + ADD
              </button>
            </div>
          </div>

          {/* Comments */}
          <div style={{ marginBottom: '14px' }}>
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '10px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                marginBottom: '8px',
                borderBottom: '1.5px solid #000',
                paddingBottom: '4px',
              }}
            >
              COMMENTS ({comments.length})
            </div>

            {comments.length === 0 && (
              <div style={{ fontSize: '12px', color: '#aaa', fontFamily: 'var(--font-body)', marginBottom: '8px' }}>
                No comments yet.
              </div>
            )}

            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '10px' }}>
              {comments.map(c => (
                <div
                  key={c.id}
                  style={{
                    border: '1.5px solid #000',
                    padding: '8px 10px',
                    background: '#fff',
                  }}
                >
                  <div
                    style={{
                      fontSize: '11px',
                      fontFamily: 'var(--font-mono)',
                      color: '#777',
                      marginBottom: '4px',
                    }}
                  >
                    {formatInTimeZone(new Date(c.posted_at), 'Asia/Kolkata', 'MMM d, HH:mm')} IST
                  </div>
                  <div style={{ fontSize: '13px', fontFamily: 'var(--font-body)', whiteSpace: 'pre-wrap' }}>
                    {c.content}
                  </div>
                </div>
              ))}
            </div>

            {/* Add comment */}
            <textarea
              className="nb-input"
              value={newComment}
              onChange={e => setNewComment(e.target.value)}
              rows={3}
              placeholder="Add a comment…"
              style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '12px', marginBottom: '6px' }}
              onKeyDown={e => {
                if (e.key === 'Enter' && (e.metaKey || e.ctrlKey)) handlePostComment();
              }}
            />
            <button
              className="nb-btn"
              onClick={handlePostComment}
              disabled={postingComment || !newComment.trim()}
              style={{ opacity: postingComment || !newComment.trim() ? 0.5 : 1 }}
            >
              {postingComment ? 'POSTING…' : 'POST COMMENT'}
            </button>
          </div>
        </div>

        {/* Footer actions */}
        <div
          style={{
            padding: '12px 16px',
            borderTop: '2.5px solid #000',
            display: 'flex',
            gap: '10px',
            alignItems: 'center',
            background: '#fff',
            flexShrink: 0,
          }}
        >
          <button
            className="nb-btn nb-btn-primary"
            style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }}
            onClick={() => setConfirm({ type: 'complete' })}
          >
            ✓ MARK COMPLETE
          </button>
          <button
            onClick={() => setConfirm({ type: 'delete' })}
            style={{
              background: 'none',
              border: 'none',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              color: '#FF3B00',
              cursor: 'pointer',
              textDecoration: 'underline',
              padding: '4px 8px',
            }}
          >
            DELETE
          </button>
        </div>
      </div>

      {/* Confirm modal */}
      {confirm && (
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
          onClick={() => setConfirm(null)}
        >
          <div
            onClick={e => e.stopPropagation()}
            style={{
              background: '#fff',
              border: '2.5px solid #000',
              boxShadow: '6px 6px 0 #000',
              padding: '24px',
              width: '340px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '14px',
                marginBottom: '12px',
              }}
            >
              {confirm.type === 'complete'
                ? 'Mark complete in Todoist?'
                : 'Are you sure you want to delete?'}
            </div>
            <div style={{ fontSize: '12px', color: '#555', marginBottom: '16px' }}>
              {confirm.type === 'complete'
                ? `"${cleanContent(task.content)}" will be marked complete and removed from the board.`
                : 'This task will be permanently deleted.'}
            </div>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button
                className="nb-btn"
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={() => setConfirm(null)}
              >
                CANCEL
              </button>
              <button
                className={confirm.type === 'complete' ? 'nb-btn nb-btn-primary' : 'nb-btn nb-btn-danger'}
                style={{ flex: 1, justifyContent: 'center' }}
                onClick={handleComplete}
              >
                {confirm.type === 'complete' ? 'COMPLETE' : 'DELETE'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
