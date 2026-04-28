import { HeroGeometric } from "@/components/ui/shape-landing-hero"
import Link from 'next/link'

export default function Home() {
    return (
        <div className="relative min-h-screen">
            <HeroGeometric 
                badge="FitPulse Platform"
                title1="Elevate Your"
                title2="Fitness Journey" 
            />
            <div className="absolute top-6 right-6 z-50 space-x-4">
                <Link href="/login" className="text-white hover:text-indigo-300 font-medium px-4 py-2 transition z-50">
                    Login
                </Link>
                <Link href="/register" className="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2 rounded-full transition shadow-[0_0_20px_rgba(99,102,241,0.4)] z-50">
                    Sign Up
                </Link>
            </div>
            
            {/* Call to action overlapping the hero slightly */}
            <div className="absolute bottom-24 left-0 right-0 z-50 flex justify-center">
                <Link href="/login" className="bg-white/10 backdrop-blur-md border border-white/20 text-white hover:bg-white/20 font-medium px-8 py-3 rounded-full transition shadow-[0_8px_32px_0_rgba(255,255,255,0.1)] flex items-center space-x-2">
                    <span>Enter Dashboard</span>
                    <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>
                </Link>
            </div>
        </div>
    );
}
