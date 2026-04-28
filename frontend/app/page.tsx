import Link from 'next/link'
import Image from 'next/image'
import { BarChart3, Users, Target } from 'lucide-react'
import { HeroGeometric } from '@/components/ui/shape-landing-hero'
import { BarChart3, Users, Target } from 'lucide-react'

export default function Home() {
    return (
        <div className="min-h-screen bg-[#030303] text-white overflow-hidden">
            {/* Hero Section with Nav */}
            <HeroGeometric 
                badge="FitPulse Platform" 
                title1="Transform Your" 
                title2="Body & Mind" 
            />
            
            {/* Features & Images Section */}
            <section className="relative z-10 container mx-auto px-6 py-32">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
                    <div className="space-y-8">
                        <div className="inline-flex items-center px-4 py-2 rounded-full bg-white/5 border border-white/10 text-white/80 text-sm font-medium">
                            <span className="flex h-2 w-2 rounded-full bg-[#6C63FF] mr-3 animate-pulse"></span>
                            Platform Features
                        </div>
                        <h2 className="text-5xl md:text-6xl font-bold tracking-tight leading-[1.1]">
                            Train Hard, <br/>
                            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#6C63FF] to-[#4ECDC4]">Track Smart</span>
                        </h2>
                        <p className="text-white/60 text-lg md:text-xl leading-relaxed max-w-lg font-light">
                            Join elite athletes and coaches using data-driven insights to achieve peak performance. FitPulse connects you with the right tools, whether you're lifting heavy, running far, or recovering well.
                        </p>
                        <div className="pt-4">
                            <Link href="/register" className="inline-flex items-center justify-center bg-white text-black font-semibold px-8 py-4 rounded-full hover:scale-105 transition-all duration-300 shadow-[0_0_30px_rgba(255,255,255,0.2)] hover:shadow-[0_0_40px_rgba(255,255,255,0.4)]">
                                Start Your Journey
                            </Link>
                        </div>
                    </div>
                    
                    <div className="relative h-[600px] rounded-[2.5rem] overflow-hidden shadow-[0_0_50px_rgba(108,99,255,0.15)] border border-white/10 group">
                        <Image 
                            src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80&w=1470" 
                            alt="Athletes training in gym" 
                            fill
                            className="object-cover transition-transform duration-1000 group-hover:scale-105"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80" />
                        
                        {/* Floating Testimonial Card */}
                        <div className="absolute bottom-8 left-8 right-8 bg-black/40 backdrop-blur-xl border border-white/10 p-6 md:p-8 rounded-[1.5rem] transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                            <p className="text-white/90 font-medium text-lg md:text-xl italic leading-relaxed">
                                "The only platform that tracks my lifts and endurance in one place."
                            </p>
                            <div className="mt-6 flex items-center gap-4">
                                <div className="h-10 w-10 rounded-full overflow-hidden relative border border-white/20">
                                    <Image src="https://ui-avatars.com/api/?name=Sarah+J&background=6C63FF&color=fff" alt="Sarah J" fill className="object-cover"/>
                                </div>
                                <div>
                                    <p className="text-[#4ECDC4] font-semibold text-sm uppercase tracking-wider">Sarah J.</p>
                                    <p className="text-white/50 text-xs">Professional Coach</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-32">
                    {/* Feature Card 1 */}
                    <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08] p-10 rounded-[2rem] hover:bg-white/[0.08] transition-colors group cursor-pointer">
                        <div className="w-14 h-14 bg-[#6C63FF]/20 rounded-2xl flex items-center justify-center mb-8 border border-[#6C63FF]/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <BarChart3 className="text-[#6C63FF] w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">Deep Analytics</h3>
                        <p className="text-white/50 text-lg leading-relaxed font-light">Visualize your progress with stunning charts and metrics synced automatically from your wearable devices.</p>
                    </div>
                    
                    {/* Feature Card 2 */}
                    <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08] p-10 rounded-[2rem] hover:bg-white/[0.08] transition-colors group cursor-pointer">
                        <div className="w-14 h-14 bg-[#FF6B6B]/20 rounded-2xl flex items-center justify-center mb-8 border border-[#FF6B6B]/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <Target className="text-[#FF6B6B] w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">Elite Coaching</h3>
                        <p className="text-white/50 text-lg leading-relaxed font-light">Connect with certified personal trainers to build customized workout regimens that adapt perfectly to you.</p>
                    </div>
                    
                    {/* Feature Card 3 */}
                    <div className="bg-gradient-to-b from-white/[0.05] to-transparent border border-white/[0.08] p-10 rounded-[2rem] hover:bg-white/[0.08] transition-colors group cursor-pointer">
                        <div className="w-14 h-14 bg-[#4ECDC4]/20 rounded-2xl flex items-center justify-center mb-8 border border-[#4ECDC4]/30 group-hover:scale-110 group-hover:rotate-3 transition-transform duration-300">
                            <Users className="text-[#4ECDC4] w-7 h-7" />
                        </div>
                        <h3 className="text-2xl font-bold mb-4 text-white tracking-tight">Active Community</h3>
                        <p className="text-white/50 text-lg leading-relaxed font-light">Join global fitness circles, share your PRs, and find accountability partners to stay on track.</p>
                    </div>
                </div>
            </section>
        </div>
    );
}
