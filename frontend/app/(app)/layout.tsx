import Sidebar from '@/components/Sidebar';

export default function AppLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#030303] overflow-hidden text-white w-full font-lexend">
      <Sidebar />
      <main className="flex-1 md:ml-64 overflow-y-auto w-full transition-all duration-300 relative z-10 custom-scrollbar">
        <div className="min-h-full">
          {children}
        </div>
      </main>
    </div>
  );
}
