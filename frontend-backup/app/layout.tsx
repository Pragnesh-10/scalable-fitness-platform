import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "FitPulse | Scalable Fitness",
  description: "A centralized fitness ecosystem for athletes and coaches",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="antialiased selection:bg-primary/30 selection:text-white">
        {children}
      </body>
    </html>
  );
}
