import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "FitPulse – Your Intelligent Fitness Companion",
  description: "Track workouts, analyze performance, sync wearables, and connect with the fitness community. FitPulse is your all-in-one intelligent fitness platform.",
  keywords: "fitness tracker, workout log, performance analytics, health metrics, fitness community",
  openGraph: {
    title: "FitPulse – Intelligent Fitness Platform",
    description: "Track, analyze, and grow with FitPulse",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="antialiased">{children}</body>
    </html>
  );
}
