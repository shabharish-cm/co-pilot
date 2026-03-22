'use client';

import type { RoutingResult } from '../lib/types';
import { SECTION_CONFIGS } from '../lib/utils';
import type { SectionKey } from '../lib/types';

interface RoutingModalProps {
  taskTitle: string;
  routing: RoutingResult;
  draggedSectionKey: SectionKey;
  onConfirmDrag: () => void;
  onKeepSuggested: () => void;
  onClose: () => void;
}

const SECTION_KEY_MAP: Record<string, SectionKey> = {
  '6g8x4HVHxpWVfVHQ': 'csRequests',
  '6g8x4MgXR2q68fgQ': 'enggAsks',
  '6g8x4JxwH876pgGQ': 'features',
  '6g9wjjpVgppgxJwQ': 'cm',
  '6g9QcvpjJw2cFmCx': 'effy',
};

export default function RoutingModal({
  taskTitle,
  routing,
  draggedSectionKey,
  onConfirmDrag,
  onKeepSuggested,
  onClose,
}: RoutingModalProps) {
  const suggestedKey = SECTION_KEY_MAP[routing.sectionId] ?? 'features';
  const suggestedCfg = SECTION_CONFIGS[suggestedKey];
  const draggedCfg = SECTION_CONFIGS[draggedSectionKey];

  const confidenceBg =
    routing.confidence === 'inferred'
      ? '#FFF3CD'
      : routing.confidence === 'defaulted'
      ? '#f5f5f5'
      : '#fff';

  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'rgba(0,0,0,0.6)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        zIndex: 9999,
      }}
      onClick={onClose}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: '#fff',
          border: '2.5px solid #000',
          boxShadow: '8px 8px 0 #000',
          width: '420px',
          maxWidth: '90vw',
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div
          style={{
            background: '#000',
            color: '#fff',
            padding: '12px 16px',
            fontFamily: 'var(--font-heading)',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
          }}
        >
          ▓▓▓ CONFIRM SECTION CHANGE
        </div>

        <div style={{ padding: '20px' }}>
          {/* Task title */}
          <div
            style={{
              background: '#f5f5f5',
              border: '1.5px solid #000',
              padding: '8px 12px',
              marginBottom: '16px',
              fontFamily: 'var(--font-body)',
              fontSize: '13px',
              fontWeight: 600,
            }}
          >
            Moving: &ldquo;{taskTitle}&rdquo;
          </div>

          {/* Confidence warning */}
          <div
            style={{
              background: confidenceBg,
              border: '1.5px solid #000',
              padding: '10px 12px',
              marginBottom: '16px',
            }}
          >
            <div
              style={{
                fontFamily: 'var(--font-heading)',
                fontWeight: 700,
                fontSize: '11px',
                letterSpacing: '0.06em',
                marginBottom: '4px',
              }}
            >
              ⚠ Routing confidence:{' '}
              <span style={{ color: '#FF3B00' }}>{routing.confidence.toUpperCase()}</span>
            </div>
            {routing.match && (
              <div style={{ fontSize: '12px', fontFamily: 'var(--font-mono)', color: '#555' }}>
                Matched on: {routing.rule} &ldquo;{routing.match}&rdquo;
              </div>
            )}
          </div>

          {/* Section comparison */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: '1fr 1fr',
              gap: '12px',
              marginBottom: '20px',
            }}
          >
            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: '#777',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}
              >
                Suggested
              </div>
              <div
                style={{
                  background: suggestedCfg.color,
                  border: '2px solid #000',
                  padding: '6px 10px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '12px',
                }}
              >
                {suggestedCfg.name}
              </div>
            </div>
            <div>
              <div
                style={{
                  fontSize: '10px',
                  fontFamily: 'var(--font-mono)',
                  color: '#777',
                  marginBottom: '4px',
                  textTransform: 'uppercase',
                }}
              >
                You dragged to
              </div>
              <div
                style={{
                  background: draggedCfg.color,
                  border: '2px solid #000',
                  padding: '6px 10px',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '12px',
                }}
              >
                {draggedCfg.name}
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: '10px' }}>
            <button
              className="nb-btn"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={onConfirmDrag}
            >
              MOVE TO {draggedCfg.name.toUpperCase()}
            </button>
            <button
              className="nb-btn nb-btn-primary"
              style={{ flex: 1, justifyContent: 'center' }}
              onClick={onKeepSuggested}
            >
              KEEP IN {suggestedCfg.name.toUpperCase()}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
