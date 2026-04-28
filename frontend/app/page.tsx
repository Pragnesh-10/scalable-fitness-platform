import ShaderShowcase from "@/components/ui/hero"
import Link from 'next/link'
import Image from 'next/image'

export default function Home() {
    return (
        <div className="min-h-screen bg-[#030303] text-white overflow-hidden">
            {/* Hero Section with Nav */}
            <ShaderShowcase />
            
            {/* Features & Images Section */}
            <section className="relative z-10 container mx-auto px-6 py-24 -mt-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                    <div className="space-y-6">
                        <h2 className="text-4xl font-bold tracking-tight">Train Hard, Track Smart</h2>
                        <p className="text-white/60 text-lg leading-relaxed">
                            Join elite athletes and coaches using data-driven insights to achieve peak performance. FitPulse connects you with the right tools, whether you're lifting heavy, running far, or recovering well.
                        </p>
                        <Link href="/register" className="inline-block bg-white text-black font-semibold px-8 py-3 rounded-full hover:bg-white/90 transition">
                            Start Free Trial
                        </Link>
                    </div>
                    <div className="relative h-[500px] rounded-2xl overflow-hidden shadow-2xl shadow-indigo-500/10">
                        <Image 
                            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1470" 
                            alt="Athletes training in gym" 
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                        <div className="absolute bottom-6 left-6 right-6">
                            <p className="text-white font-medium text-xl">"The only platform that tracks my lifts and endurance in one place."</p>
                            <p className="text-white/60 mt-2">— Sarah J., Professional Coach</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-24">
                    <div className="bg-white/[0.03] border border-white/[0.08] p-8 rounded-2xl">
                        <div className="w-12 h-12 bg-indigo-500/20 rounded-lg flex items-center justify-center mb-6">
                            <Image src="https://images.unsplash.com/photo-1549060279-7e168fcee0c2?auto=format&fit=crop&q=80&w=200" width={48} height={48} alt="Analytics" className="rounded-lg object-cover opacity-80" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Deep Analytics</h3>
                        <p className="text-white/50">Visualize your progress with stunning charts and metrics synced from your wearable devices.</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.08] p-8 rounded-2xl">
                        <div className="w-12 h-12 bg-rose-500/20 rounded-lg flex items-center justify-center mb-6">
                            <Image src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&q=80&w=200" width={48} height={48} alt="Coaching" className="rounded-lg object-cover opacity-80" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Elite Coaching</h3>
                        <p className="text-white/50">Connect with certified personal trainers to build customized workout regimens that adapt to you.</p>
                    </div>
                    <div className="bg-white/[0.03] border border-white/[0.08] p-8 rounded-2xl">
                        <div className="w-12 h-12 bg-amber-500/20 rounded-lg flex items-center justify-center mb-6">
                            <Image src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80&w=200" width={48} height={48} alt="Community" className="rounded-lg object-cover opacity-80" />
                        </div>
                        <h3 className="text-xl font-semibold mb-3">Active Community</h3>
                        <p className="text-white/50">Join global fitness circles, share your PRs, and find accountability partners to stay on track.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
