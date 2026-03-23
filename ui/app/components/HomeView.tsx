'use client';

import DigestZone from './DigestZone';
import DueTodayRow from './DueTodayRow';
import CliPanel from './CliPanel';

export default function HomeView() {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      overflow: 'hidden',
      background: '#FFFBF5',
    }}>
      {/* Zone A — Top 2/3: Morning Digest + Due Today sidebar */}
      <div style={{
        flex: '0 0 66.666%',
        minHeight: 0,
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'row',
        borderBottom: '2.5px solid #000',
      }}>
        {/* Digest — takes remaining width */}
        <div style={{ flex: 1, minWidth: 0, overflow: 'hidden' }}>
          <DigestZone />
        </div>

        {/* Due Today sidebar — fixed 280px right panel */}
        <div style={{
          width: '280px',
          flexShrink: 0,
          borderLeft: '2.5px solid #000',
          overflow: 'hidden',
        }}>
          <DueTodayRow sidebar />
        </div>
      </div>

      {/* Zone C — Bottom 1/3: CLI Terminal */}
      <div style={{
        flex: '1 1 0',
        minHeight: 0,
        overflow: 'hidden',
      }}>
        <CliPanel />
      </div>
    </div>
  );
}
