'use client';

import Navbar from './components/Navbar';
import HomeView from './components/HomeView';
import BoardMatrix from './components/BoardMatrix';
import TaskDrawer from './components/TaskDrawer';
import ClaudeSidebar from './components/ClaudeSidebar';
import PulseView from './components/PulseView';
import PRDView from './components/PRDView';
import SettingsView from './components/SettingsView';
import { useBoardStore } from './store/boardStore';

export default function HomePage() {
  const { sidebarOpen, activeTab } = useBoardStore();

  // HOME: full-width 3-zone layout, no left panel, no sidebar toggle
  if (activeTab === 'home') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#FFFBF5' }}>
        <Navbar />
        <div style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <HomeView />
        </div>
        <TaskDrawer />
      </div>
    );
  }

  // BOARD: clean kanban — no left panel, sidebar toggle available
  if (activeTab === 'board') {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#FFFBF5' }}>
        <Navbar />
        <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
          <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
            <BoardMatrix />
          </div>
          {sidebarOpen && <ClaudeSidebar />}
        </div>
        <TaskDrawer />
      </div>
    );
  }

  // PULSE / PRD / SETTINGS: standard with sidebar toggle
  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden', background: '#FFFBF5' }}>
      <Navbar />
      <div style={{ flex: 1, display: 'flex', overflow: 'hidden', minHeight: 0 }}>
        <div style={{ flex: 1, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
          {activeTab === 'pulse'    && <PulseView />}
          {activeTab === 'prd'      && <PRDView />}
          {activeTab === 'settings' && <SettingsView />}
        </div>
        {sidebarOpen && <ClaudeSidebar />}
      </div>
      <TaskDrawer />
    </div>
  );
}
