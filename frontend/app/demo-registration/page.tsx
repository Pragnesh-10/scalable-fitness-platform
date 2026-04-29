"use client";

import SignupForm from "@/components/ui/registration";

export default function DemoPage() {
  return (
    <div className="flex justify-center items-center min-h-screen bg-[#030303] relative overflow-hidden">
      {/* Decorative background element */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-[#6C63FF]/10 rounded-full blur-[120px]" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-[#4ECDC4]/10 rounded-full blur-[120px]" />
      
      <div className="relative z-10 w-full">
        <SignupForm />
      </div>
    </div>
  );
}
