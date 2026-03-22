'use client';

import { useState } from 'react';
import { useBoardStore } from '../store/boardStore';
import { routeTask } from '../lib/routing';
import { SECTION_CONFIGS, SECTION_ORDER } from '../lib/utils';
import type { SectionKey } from '../lib/types';

interface QuickAddFormProps {
  onClose: () => void;
}

export default function QuickAddForm({ onClose }: QuickAddFormProps) {
  const { createTask } = useBoardStore();

  const [content, setContent] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<1 | 2 | 3 | 4>(3);
  const [sectionKey, setSectionKey] = useState<SectionKey | 'auto'>('auto');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const routing = content ? routeTask(content) : null;
  const autoSectionKey = routing
    ? Object.entries(SECTION_CONFIGS).find(([, cfg]) => cfg.id === routing.sectionId)?.[0] as SectionKey | undefined
    : undefined;
  const effectiveSectionKey = sectionKey === 'auto' ? (autoSectionKey ?? 'features') : sectionKey;
  const effectiveSectionCfg = SECTION_CONFIGS[effectiveSectionKey];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    setSubmitting(true);
    setError(null);

    try {
      const section_id = sectionKey === 'auto' ? undefined : SECTION_CONFIGS[sectionKey].id;
      await createTask({
        content: content.trim(),
        description: description.trim() || undefined,
        due_date: dueDate || undefined,
        priority,
        section_id,
      });
      onClose();
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Failed to create task');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.5)',
        display: 'flex',
        alignItems: 'flex-start',
        justifyContent: 'center',
        zIndex: 5000,
        paddingTop: '80px',
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          border: '2.5px solid #000',
          boxShadow: '8px 8px 0 #000',
          width: '520px',
          maxWidth: '95vw',
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
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <span
            style={{
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '13px',
              letterSpacing: '0.06em',
            }}
          >
            + ADD TASK
          </span>
          <button
            onClick={onClose}
            style={{
              background: 'transparent',
              border: '1px solid #666',
              color: '#fff',
              fontFamily: 'var(--font-mono)',
              fontSize: '12px',
              padding: '2px 8px',
              cursor: 'pointer',
            }}
          >
            ESC
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ padding: '16px' }}>
          {error && (
            <div
              style={{
                background: '#FFE4E0',
                border: '1.5px solid #FF3B00',
                padding: '8px 12px',
                fontSize: '12px',
                fontFamily: 'var(--font-mono)',
                color: '#FF3B00',
                marginBottom: '12px',
              }}
            >
              {error}
            </div>
          )}

          {/* Task title */}
          <div style={{ marginBottom: '12px' }}>
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
              TASK TITLE *
            </label>
            <input
              type="text"
              className="nb-input"
              value={content}
              onChange={e => setContent(e.target.value)}
              placeholder="e.g. Follow up with Karthik on Display Name ETA"
              autoFocus
              required
            />
          </div>

          {/* Routing preview */}
          {routing && sectionKey === 'auto' && (
            <div
              style={{
                background: effectiveSectionCfg.bgColor,
                border: '1.5px solid #000',
                padding: '8px 10px',
                marginBottom: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
              }}
            >
              <span
                style={{
                  background: effectiveSectionCfg.color,
                  border: '1px solid #000',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '10px',
                  padding: '2px 6px',
                  fontWeight: 700,
                }}
              >
                {effectiveSectionCfg.name}
              </span>
              <span style={{ fontFamily: 'var(--font-mono)', fontSize: '10px', color: '#555' }}>
                {routing.confidence.toUpperCase()}
                {routing.match ? ` · matched "${routing.match}"` : ''}
              </span>
            </div>
          )}

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '12px',
            }}
          >
            {/* Section */}
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
                value={sectionKey}
                onChange={e => setSectionKey(e.target.value as SectionKey | 'auto')}
                style={{ cursor: 'pointer' }}
              >
                <option value="auto">AUTO-ROUTE</option>
                {SECTION_ORDER.map(key => (
                  <option key={key} value={key}>
                    {SECTION_CONFIGS[key].name}
                  </option>
                ))}
              </select>
            </div>

            {/* Priority */}
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
                value={priority}
                onChange={e => setPriority(parseInt(e.target.value) as 1 | 2 | 3 | 4)}
                style={{ cursor: 'pointer' }}
              >
                <option value={1}>P1 — Urgent</option>
                <option value={2}>P2 — High</option>
                <option value={3}>P3 — Medium</option>
                <option value={4}>P4 — Low</option>
              </select>
            </div>
          </div>

          {/* Due date */}
          <div style={{ marginBottom: '12px' }}>
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
              DUE DATE (OPTIONAL)
            </label>
            <input
              type="date"
              className="nb-input"
              value={dueDate}
              onChange={e => setDueDate(e.target.value)}
            />
          </div>

          {/* Description */}
          <div style={{ marginBottom: '16px' }}>
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
              DESCRIPTION (OPTIONAL)
            </label>
            <textarea
              className="nb-input"
              value={description}
              onChange={e => setDescription(e.target.value)}
              rows={3}
              placeholder="Add context, V:H E:L, links…"
              style={{ resize: 'vertical', fontFamily: 'var(--font-body)', fontSize: '12px' }}
            />
          </div>

          {/* Submit */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              type="submit"
              className="nb-btn nb-btn-primary"
              style={{ flex: 1, justifyContent: 'center', fontSize: '12px' }}
              disabled={submitting || !content.trim()}
            >
              {submitting ? 'CREATING…' : 'CREATE TASK →'}
            </button>
            <button
              type="button"
              className="nb-btn"
              onClick={onClose}
            >
              CANCEL
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
