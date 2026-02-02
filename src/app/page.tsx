'use client';
import { useState, useEffect } from 'react';
import { getLanguageCookie, setLanguageCookie } from '@/lib/lang-config';
import Link from 'next/link';
import { translations } from '@/lib/translations';

export default function Home() {
  const [lang, setLang] = useState('ar');

  useEffect(() => {
    setLang(getLanguageCookie());
  }, []);

  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    setLanguageCookie(newLang); // 2. Save choice
  };

  const t = translations[lang];

  return (
    <main dir={t.dir} className={`min-h-screen flex flex-col items-center justify-center p-6 relative transition-all duration-500 ${lang === 'ar' ? 'font-sans' : 'font-mono'}`}>
      
      {/* UI BUTTONS */}
      {/* Admin Link */}
      <div className="fixed top-8 left-8 z-50" dir="ltr">
        <Link href="/admin/login" className="flex items-center gap-3 text-blue-300/40 hover:text-white transition-all group">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-400 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
              <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
            </svg>
          </div>
          <span className="text-[10px] font-bold uppercase tracking-widest">{t.admin}</span>
        </Link>
      </div>

      {/* Language Toggle */}
      <div className="fixed top-8 right-8 z-50" dir="ltr">
        <button 
          onClick={toggleLang}
          className="glass-card px-4 py-2 text-[10px] font-bold border border-white/10 hover:bg-white/10 transition-all"
        >
          {t.lang}
        </button>
      </div>

      {/* Main Content */}
      <div className="glass-card p-12 max-w-lg w-full text-center space-y-5 shadow-2xl relative overflow-hidden">
        {/* Decorative Background Element */}
        <div className="absolute -top-10 -right-10 w-32 h-32 bg-blue-500/10 rounded-full blur-3xl"></div>
        
        <div className="space-y-2">
          <h1 className="text-4xl font-black italic tracking-tighter text-white uppercase">
            {lang === 'ar' ? 'تعريفات قوانين الاربي' : 'RP rules LookUp'}
          </h1>
          <div className="h-1 w-24 bg-blue-600 mx-auto rounded-full"></div>
        </div>

        <div className="grid grid-cols-1 gap-4">
          <Link href="/login" className="group">
            <div className="p-6 rounded-2xl bg-blue-600/10 border border-blue-500/20 hover:border-blue-400 hover:bg-blue-600/20 transition-all text-center">
              <h3 className="text-lg font-bold text-blue-400 mb-1">{t.login}</h3>
            </div>
          </Link>

          <Link href="/register" className="group">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-500/50 hover:bg-blue-500/5 transition-all duration-300 text-center">
              <h3 className="text-lg font-bold text-white mb-1">{t.register}</h3>
            </div>
          </Link>
        </div>

        <div className="pt-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse mt-[-2px]"></div>
            <span className="text-[9px] font-bold text-emerald-500 uppercase ">System Online</span>
          </div>
          <p className="text-blue-300/40 text-[10px] uppercase tracking-[0.4em] mt-4 font-bold text-emerald-500">v1.0</p>
          <p className="text-blue-300/40 text-[12px]  tracking-[0.4em] mt-4 font-bold text-emerald-500">by saifGTA</p>
        </div>
      </div>
    </main>
  );
}