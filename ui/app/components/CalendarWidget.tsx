'use client';

import { useEffect, useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import type { GCalDayGroup, GCalEvent } from '../lib/types';

const IST = 'Asia/Kolkata';

function formatEventTime(event: GCalEvent): string | null {
  if (event.start.dateTime) {
    return formatInTimeZone(new Date(event.start.dateTime), IST, 'HH:mm');
  }
  return null;
}

function EventRow({
  event,
  expanded,
  onClick,
}: {
  event: GCalEvent;
  expanded: boolean;
  onClick: () => void;
}) {
  const time = formatEventTime(event);
  const isAllDay = !event.start.dateTime;

  return (
    <div
      onClick={onClick}
      style={{
        padding: '4px 0',
        cursor: 'pointer',
        borderBottom: '1px solid #eee',
      }}
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '6px',
          fontSize: '12px',
        }}
      >
        {time ? (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#555',
              flexShrink: 0,
              minWidth: '38px',
            }}
          >
            {time}
          </span>
        ) : (
          <span
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: '11px',
              color: '#aaa',
              flexShrink: 0,
              minWidth: '38px',
              fontStyle: 'italic',
            }}
          >
            ALL
          </span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <span
            style={{
              fontStyle: isAllDay ? 'italic' : 'normal',
              fontFamily: 'var(--font-body)',
              fontSize: '12px',
              display: 'block',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {event.summary}
          </span>

          {expanded && (
            <div
              style={{
                marginTop: '4px',
                fontSize: '11px',
                color: '#444',
                fontFamily: 'var(--font-body)',
              }}
            >
              {event.attendees && event.attendees.length > 0 && (
                <div style={{ marginBottom: '3px' }}>
                  <span style={{ fontFamily: 'var(--font-mono)', color: '#777' }}>Attendees: </span>
                  {event.attendees
                    .slice(0, 5)
                    .map(a => a.displayName ?? a.email)
                    .join(', ')}
                  {event.attendees.length > 5 ? ` +${event.attendees.length - 5} more` : ''}
                </div>
              )}
              {event.description && (
                <div style={{ color: '#555', whiteSpace: 'pre-wrap', lineHeight: 1.4 }}>
                  {event.description.slice(0, 200)}
                  {event.description.length > 200 ? '…' : ''}
                </div>
              )}
            </div>
          )}
        </div>

        {event.hangoutLink && (
          <a
            href={event.hangoutLink}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              background: '#FFE500',
              border: '1.5px solid #000',
              boxShadow: '2px 2px 0 #000',
              fontFamily: 'var(--font-heading)',
              fontWeight: 700,
              fontSize: '9px',
              letterSpacing: '0.05em',
              padding: '2px 6px',
              textDecoration: 'none',
              color: '#000',
              flexShrink: 0,
              whiteSpace: 'nowrap',
            }}
          >
            ▶ JOIN
          </a>
        )}
      </div>
    </div>
  );
}

function DayRow({ group }: { group: GCalDayGroup }) {
  const [showAll, setShowAll] = useState(false);
  const [expandedEvent, setExpandedEvent] = useState<string | null>(null);
  const MAX_VISIBLE = 4;
  const visible = showAll ? group.events : group.events.slice(0, MAX_VISIBLE);
  const hidden = group.events.length - MAX_VISIBLE;
  const isToday = group.label === 'TODAY';

  return (
    <div
      style={{
        borderBottom: '1.5px solid #000',
        padding: '8px 12px',
        background: isToday ? 'rgba(255, 229, 0, 0.06)' : 'transparent',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-heading)',
          fontWeight: 700,
          fontSize: '10px',
          letterSpacing: '0.08em',
          color: isToday ? '#000' : '#555',
          marginBottom: '4px',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        {group.label}
        {isToday && (
          <span
            style={{
              background: '#FFE500',
              border: '1px solid #000',
              fontSize: '8px',
              padding: '1px 4px',
              fontWeight: 700,
            }}
          >
            NOW
          </span>
        )}
      </div>

      {group.events.length === 0 ? (
        <div
          style={{
            fontSize: '11px',
            color: '#aaa',
            fontStyle: 'italic',
            fontFamily: 'var(--font-body)',
          }}
        >
          (no events)
        </div>
      ) : (
        <div>
          {visible.map(event => (
            <EventRow
              key={event.id}
              event={event}
              expanded={expandedEvent === event.id}
              onClick={() =>
                setExpandedEvent(expandedEvent === event.id ? null : event.id)
              }
            />
          ))}
          {!showAll && hidden > 0 && (
            <button
              onClick={() => setShowAll(true)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#555',
                cursor: 'pointer',
                padding: '2px 0',
                textDecoration: 'underline',
              }}
            >
              +{hidden} more
            </button>
          )}
          {showAll && hidden > 0 && (
            <button
              onClick={() => setShowAll(false)}
              style={{
                background: 'none',
                border: 'none',
                fontFamily: 'var(--font-mono)',
                fontSize: '10px',
                color: '#555',
                cursor: 'pointer',
                padding: '2px 0',
                textDecoration: 'underline',
              }}
            >
              show less
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default function CalendarWidget() {
  const [groups, setGroups] = useState<GCalDayGroup[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [expanded, setExpanded] = useState(true);

  useEffect(() => {
    fetch('/api/calendar?days=5')
      .then(res => {
        if (!res.ok) return res.json().then(d => Promise.reject(d.error ?? 'Calendar error'));
        return res.json();
      })
      .then(setGroups)
      .catch(err => {
        setError(typeof err === 'string' ? err : 'Calendar unavailable');
      });
  }, []);

  return (
    <div
      style={{
        border: '2.5px solid #000',
        boxShadow: '4px 4px 0 #000',
        background: '#fff',
        overflow: 'hidden',
      }}
    >
      {/* Header */}
      <div
        className="nb-header-bar"
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          cursor: 'pointer',
        }}
        onClick={() => setExpanded(e => !e)}
      >
        <span>NEXT 5 DAYS</span>
        <span style={{ fontWeight: 400 }}>{expanded ? '−' : '+'}</span>
      </div>

      {expanded && (
        <div>
          {error && (
            <div
              style={{
                padding: '12px',
                background: '#f5f5f5',
                borderBottom: '1.5px solid #ccc',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#666',
              }}
            >
              {error.includes('not configured') ? (
                <span>CONNECT GOOGLE CALENDAR</span>
              ) : (
                <span>⚠ {error}</span>
              )}
            </div>
          )}

          {!groups && !error && (
            <div
              style={{
                padding: '12px',
                fontSize: '11px',
                fontFamily: 'var(--font-mono)',
                color: '#888',
              }}
            >
              Loading calendar...
            </div>
          )}

          {groups &&
            groups.map(group => <DayRow key={group.date} group={group} />)}
        </div>
      )}
    </div>
  );
}
