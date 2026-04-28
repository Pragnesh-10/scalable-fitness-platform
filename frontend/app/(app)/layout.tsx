import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#030303] overflow-hidden text-white w-full">
      {/* Background gradients for modern glass aesthetic globally inside the app */}
      <div className="fixed inset-0 bg-gradient-to-br from-indigo-500/[0.03] via-transparent to-rose-500/[0.03] pointer-events-none" />
      
      <Sidebar />
      <main className="flex-1 md:ml-64 overflow-y-auto w-full transition-all duration-300 relative z-10 custom-scrollbar">
        <div className="px-4 sm:px-6 md:px-8 py-8 md:py-12 min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
