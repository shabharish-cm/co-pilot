'use client';

import { Draggable } from '@hello-pangea/dnd';
import type { TaskWithMeta } from '../lib/types';
import { SECTION_CONFIGS, priorityColor, placementColor, formatDueDate, cleanContent } from '../lib/utils';

interface TaskCardProps {
  task: TaskWithMeta;
  index: number;
  onOpen: () => void;
  onMenuOpen: (e: React.MouseEvent) => void;
}

export default function TaskCard({ task, index, onOpen, onMenuOpen }: TaskCardProps) {
  const sectionCfg = SECTION_CONFIGS[task.sectionKey];
  const due = formatDueDate(task.due);
  const title = cleanContent(task.content);
  const hasValueEffort = !!task.valueEffort;

  return (
    <Draggable draggableId={task.id} index={index}>
      {(provided, snapshot) => (
        <div
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={{
            ...provided.draggableProps.style,
            background: sectionCfg.bgColor,
            border: '2.5px solid #000',
            boxShadow: snapshot.isDragging ? '6px 6px 0 #000' : '3px 3px 0 #000',
            marginBottom: '8px',
            padding: 0,
            cursor: 'grab',
            transform: snapshot.isDragging
              ? `${provided.draggableProps.style?.transform ?? ''} rotate(2deg)`
              : provided.draggableProps.style?.transform,
            userSelect: 'none',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Priority stripe */}
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              bottom: 0,
              width: '4px',
              background: priorityColor(task.priority),
            }}
          />

          {/* Card content */}
          <div style={{ paddingLeft: '12px', paddingRight: '8px', paddingTop: '8px', paddingBottom: '8px' }}>
            {/* Title */}
            <div
              style={{
                fontSize: '13px',
                fontFamily: 'var(--font-body)',
                fontWeight: 600,
                lineHeight: 1.4,
                marginBottom: '6px',
                overflow: 'hidden',
                display: '-webkit-box',
                WebkitLineClamp: 2,
                WebkitBoxOrient: 'vertical',
                paddingRight: '24px', // room for overdue stamp
              }}
            >
              {title}
            </div>

            {/* Overdue stamp */}
            {task.isOverdue && (
              <div
                style={{
                  position: 'absolute',
                  top: '6px',
                  right: '6px',
                  background: '#FF3B00',
                  color: '#fff',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '8px',
                  letterSpacing: '0.1em',
                  padding: '2px 5px',
                  transform: 'rotate(-15deg)',
                  border: '1.5px solid #000',
                  zIndex: 1,
                }}
              >
                OVERDUE
              </div>
            )}

            {/* Value/Effort row */}
            {hasValueEffort && (
              <div
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  marginBottom: '5px',
                }}
              >
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: '#555',
                  }}
                >
                  V:{task.valueEffort!.value} E:{task.valueEffort!.effort}
                </span>
                <span
                  style={{
                    background: placementColor(task.valueEffort!.placement),
                    border: '1px solid #000',
                    fontFamily: 'var(--font-heading)',
                    fontWeight: 700,
                    fontSize: '8px',
                    padding: '1px 4px',
                    letterSpacing: '0.05em',
                  }}
                >
                  {task.valueEffort!.placement}
                </span>
              </div>
            )}

            {/* Labels + due date row */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                gap: '4px',
                marginBottom: '6px',
              }}
            >
              {task.labels
                .filter(l => !l.startsWith('status:'))
                .slice(0, 3)
                .map(label => (
                  <span
                    key={label}
                    style={{
                      background: '#f5f5f5',
                      border: '1px solid #ccc',
                      fontFamily: 'var(--font-mono)',
                      fontSize: '9px',
                      padding: '1px 4px',
                    }}
                  >
                    #{label}
                  </span>
                ))}

              {due && (
                <span
                  style={{
                    fontFamily: 'var(--font-mono)',
                    fontSize: '10px',
                    color: task.isOverdue ? '#FF3B00' : '#555',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '2px',
                  }}
                >
                  📅 {due}
                </span>
              )}
            </div>

            {/* Action row */}
            <div
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}
            >
              <button
                onClick={e => {
                  e.stopPropagation();
                  onOpen();
                }}
                style={{
                  background: 'transparent',
                  border: '1.5px solid #000',
                  boxShadow: '2px 2px 0 #000',
                  fontFamily: 'var(--font-heading)',
                  fontWeight: 700,
                  fontSize: '9px',
                  letterSpacing: '0.05em',
                  textTransform: 'uppercase',
                  padding: '3px 8px',
                  cursor: 'pointer',
                }}
              >
                OPEN ↗
              </button>

              <button
                onClick={e => {
                  e.stopPropagation();
                  onMenuOpen(e);
                }}
                style={{
                  background: 'transparent',
                  border: '1.5px solid #ccc',
                  fontFamily: 'var(--font-mono)',
                  fontSize: '13px',
                  padding: '1px 6px',
                  cursor: 'pointer',
                  lineHeight: 1,
                  color: '#666',
                }}
                title="More options"
              >
                ···
              </button>
            </div>
          </div>
        </div>
      )}
    </Draggable>
  );
}
