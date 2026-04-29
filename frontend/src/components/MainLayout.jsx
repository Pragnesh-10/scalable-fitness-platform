import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';

export default function MainLayout() {
  return (
    <div className="flex min-h-screen bg-[#030303] text-white">
      <Sidebar />
      <main className="flex-1 transition-all duration-700 ease-[cubic-bezier(0.23,1,0.32,1)] app-container" style={{ marginLeft: 'var(--sidebar-width, 0px)' }}>
        <Outlet />
      </main>
    </div>
  );
}
