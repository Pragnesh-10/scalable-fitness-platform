import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#030303] overflow-hidden text-white w-full font-lexend relative">
      {/* Immersive background decoration */}
      <div className="orb orb-1 opacity-[0.03]" />
      <div className="orb orb-2 opacity-[0.03]" />
      
      <Sidebar />
      <main 
        className="flex-1 overflow-y-auto w-full transition-all duration-500 relative z-10 custom-scrollbar"
        style={{ marginLeft: 'var(--sidebar-width, 256px)' }}
      >
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
