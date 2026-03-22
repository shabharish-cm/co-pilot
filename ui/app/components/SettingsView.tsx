'use client';

import { useBoardStore } from '../store/boardStore';

function ToggleRow({
  label,
  description,
  enabled,
  onToggle,
}: {
  label: string;
  description: string;
  enabled: boolean;
  onToggle: (v: boolean) => void;
}) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '16px 0',
        borderBottom: '1.5px solid #000',
      }}
    >
      <div style={{ flex: 1 }}>
        <div
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 700,
            fontSize: '13px',
            letterSpacing: '0.05em',
            marginBottom: '4px',
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '12px',
            color: '#666',
          }}
        >
          {description}
        </div>
      </div>

      <button
        onClick={() => onToggle(!enabled)}
        style={{
          background: enabled ? '#FFE500' : '#FFFBF5',
          color: '#000',
          border: '2.5px solid #000',
          boxShadow: enabled ? '3px 3px 0 #000' : '2px 2px 0 #000',
          fontFamily: 'var(--font-space-mono)',
          fontWeight: 700,
          fontSize: '11px',
          letterSpacing: '0.08em',
          padding: '6px 16px',
          cursor: 'pointer',
          minWidth: '60px',
          transition: 'all 0.1s ease',
        }}
      >
        {enabled ? 'ON' : 'OFF'}
      </button>
    </div>
  );
}

function SectionHeader({ title }: { title: string }) {
  return (
    <div
      style={{
        background: '#000',
        color: '#fff',
        padding: '8px 14px',
        fontFamily: 'var(--font-space-grotesk)',
        fontWeight: 700,
        fontSize: '11px',
        letterSpacing: '0.12em',
        textTransform: 'uppercase',
        marginBottom: '0',
        marginTop: '32px',
      }}
    >
      {title}
    </div>
  );
}

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        padding: '14px 0',
        borderBottom: '1.5px solid #000',
      }}
    >
      <div
        style={{
          fontFamily: 'var(--font-space-grotesk)',
          fontWeight: 700,
          fontSize: '13px',
          letterSpacing: '0.05em',
          flex: 1,
        }}
      >
        {label}
      </div>
      <div
        style={{
          fontFamily: 'var(--font-space-mono)',
          fontSize: '11px',
          color: '#444',
          background: '#f5f5f5',
          border: '1.5px solid #ccc',
          padding: '4px 10px',
        }}
      >
        {value}
      </div>
    </div>
  );
}

export default function SettingsView() {
  const { enableUpNext, enableBlocked, setEnableUpNext, setEnableBlocked } = useBoardStore();

  return (
    <div
      style={{
        flex: 1,
        overflowY: 'auto',
        padding: '32px 24px',
        background: '#FFFBF5',
      }}
    >
      <div style={{ maxWidth: '600px', margin: '0 auto' }}>
        {/* Page title */}
        <div
          style={{
            fontFamily: 'var(--font-space-grotesk)',
            fontWeight: 700,
            fontSize: '22px',
            letterSpacing: '0.06em',
            marginBottom: '4px',
          }}
        >
          SETTINGS
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '13px',
            color: '#888',
            marginBottom: '0',
          }}
        >
          Configure your PM Copilot workspace.
        </div>

        {/* Board Columns section */}
        <SectionHeader title="Board Columns" />
        <div
          style={{
            border: '2.5px solid #000',
            borderTop: 'none',
            padding: '0 16px',
            background: '#fff',
          }}
        >
          <ToggleRow
            label="Up Next"
            description="Enable the UP NEXT column on your board"
            enabled={enableUpNext}
            onToggle={setEnableUpNext}
          />
          <ToggleRow
            label="Blocked"
            description="Enable the BLOCKED column on your board"
            enabled={enableBlocked}
            onToggle={setEnableBlocked}
          />
        </div>

        {/* Sync section */}
        <SectionHeader title="Sync" />
        <div
          style={{
            border: '2.5px solid #000',
            borderTop: 'none',
            padding: '0 16px',
            background: '#fff',
          }}
        >
          <InfoRow label="Todoist sync interval" value="every 15 minutes" />
          <InfoRow label="Data source" value="GitHub Actions · 6:00 AM IST daily" />
        </div>
      </div>
    </div>
  );
}
