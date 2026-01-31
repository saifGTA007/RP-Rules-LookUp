'use client';
import './globals.css';
import { useEffect, useState } from 'react';
import { isMobileDevice } from '@/lib/device-guard';

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    if (isMobileDevice()) {
      setIsMobile(true);
    }
  }, []);

  if (isMobile) {
    return (
      <html lang="en">
        <body className="bg-black text-white flex items-center justify-center min-h-screen p-10 text-center font-mono">
          <div className="space-y-4 border border-red-500/30 p-8 rounded-2xl bg-red-500/5">
            <h1 className="text-red-500 font-black text-2xl tracking-tighter uppercase">Access Denied</h1>
            <p className="text-xs text-gray-400 leading-relaxed uppercase tracking-widest">
              This website is restricted to desktop hardware only.<br/>
              Mobile access is prohibited.
            </p>
          </div>
        </body>
      </html>
    );
  }

  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}