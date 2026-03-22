'use client';

import Navbar from './components/Navbar';
import DigestPanel from './components/DigestPanel';
import CalendarWidget from './components/CalendarWidget';
import BoardMatrix from './components/BoardMatrix';
import TaskDrawer from './components/TaskDrawer';
import ClaudeSidebar from './components/ClaudeSidebar';
import { useBoardStore } from './store/boardStore';

export default function HomePage() {
  const { sidebarOpen } = useBoardStore();

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        height: '100vh',
        overflow: 'hidden',
        background: '#FFFBF5',
      }}
    >
      <Navbar />

      <div
        style={{
          display: 'flex',
          flex: 1,
          overflow: 'hidden',
        }}
      >
        {/* Left panel */}
        <div
          style={{
            width: '280px',
            flexShrink: 0,
            borderRight: '2.5px solid #000',
            overflowY: 'auto',
            padding: '12px',
            background: '#FFFBF5',
          }}
        >
          <DigestPanel />
          <CalendarWidget />
        </div>

        {/* Main board */}
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          <BoardMatrix />
        </div>

        {/* Claude sidebar */}
        {sidebarOpen && <ClaudeSidebar />}
      </div>

      {/* Task drawer (overlay) */}
      <TaskDrawer />
    </div>
  );
}
