'use client';

import { useEffect, useState } from 'react';
import { formatInTimeZone } from 'date-fns-tz';
import { useBoardStore } from '../store/boardStore';
import type { ActiveTab } from '../store/boardStore';

const IST = 'Asia/Kolkata';

const TAB_LABELS: { id: ActiveTab; label: string }[] = [
  { id: 'home',     label: 'HOME' },
  { id: 'board',    label: 'BOARD' },
  { id: 'pulse',    label: 'PULSE' },
  { id: 'prd',      label: 'PRD \u25C8' },
  { id: 'settings', label: 'SETTINGS' },
];

export default function Navbar() {
  const [time, setTime] = useState('');
  const { activeTab, setActiveTab, toggleSidebar, sidebarOpen } = useBoardStore();

  useEffect(() => {
    const tick = () => setTime(formatInTimeZone(new Date(), IST, 'hh:mm a zzz'));
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  // Cmd+K only relevant on tabs that have the sidebar
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'k' && (e.metaKey || e.ctrlKey) && activeTab !== 'home') {
        e.preventDefault();
        toggleSidebar();
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [activeTab, toggleSidebar]);

  return (
    <nav
      style={{
        background: '#000',
        borderBottom: '2.5px solid #000',
        display: 'flex',
        alignItems: 'center',
        padding: '0 20px',
        height: '52px',
        gap: '24px',
        flexShrink: 0,
      }}
    >
      {/* Logo */}
      <div
        style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontWeight: 700,
          fontSize: '16px',
          color: '#FFE500',
          letterSpacing: '0.05em',
          whiteSpace: 'nowrap',
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
        }}
      >
        PM COPILOT
        <span style={{ color: '#FF90E8', fontSize: '18px' }}>◆</span>
      </div>

      {/* Nav tabs */}
      <div style={{ display: 'flex', gap: '4px', flex: 1 }}>
        {TAB_LABELS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => setActiveTab(id)}
            style={{
              background: activeTab === id ? '#FFE500' : 'transparent',
              color: activeTab === id ? '#000' : '#999',
              border: 'none',
              borderRadius: 0,
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.08em',
              textTransform: 'uppercase',
              padding: '6px 14px',
              cursor: 'pointer',
              transition: 'all 0.1s ease',
            }}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Right: time + sidebar toggle (hidden on HOME — CLI is always visible there) */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
        <span
          style={{
            fontFamily: 'var(--font-space-mono)',
            fontSize: '12px',
            color: '#888',
            whiteSpace: 'nowrap',
          }}
        >
          {time}
        </span>

        {activeTab !== 'home' && (
          <button
            onClick={toggleSidebar}
            title={sidebarOpen ? 'Close Claude sidebar (Cmd+K)' : 'Open Claude sidebar (Cmd+K)'}
            style={{
              background: sidebarOpen ? '#FFE500' : '#1a1a1a',
              color: sidebarOpen ? '#000' : '#FFE500',
              border: '2px solid #FFE500',
              fontFamily: 'var(--font-space-grotesk)',
              fontWeight: 700,
              fontSize: '11px',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '5px 12px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              whiteSpace: 'nowrap',
            }}
          >
            <span style={{ fontSize: '14px' }}>◆</span>
            CLAUDE
          </button>
        )}
      </div>
    </nav>
  );
}
