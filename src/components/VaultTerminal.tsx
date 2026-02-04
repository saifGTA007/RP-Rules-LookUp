'use client';
import { useState, useRef } from 'react';
import { translations } from '@/lib/translations';
import { setLanguageCookie } from '@/lib/lang-config';
import Link from 'next/link';

export default function VaultTerminal({ initialLang, initialUsername }: { initialLang: string, initialUsername: string }) {
  const [lang, setLang] = useState(initialLang);
  const [username] = useState(initialUsername);
  const [ruleKey, setRuleKey] = useState('');
  const [mode, setMode] = useState('normal');
  const [dmId, setDmId] = useState('');
  const [displayResult, setDisplayResult] = useState('');
  const [status, setStatus] = useState('');
  const [isError, setIsError] = useState(false);
  const [showCopyNote, setShowCopyNote] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const t = translations[lang];

  const toggleLang = () => {
    const newLang = t.lang;
    setLang(newLang);
    setLanguageCookie(newLang);
  };

  const handleProcess = async (manualResult?: string) => {
    if (manualResult) {
      navigator.clipboard.writeText(manualResult);
      setShowCopyNote(true);
      setTimeout(() => setShowCopyNote(false), 2000);
      return;
    }

    // NEW: Search the database instead of the local file
    const res = await fetch(`/api/rules/search?q=${ruleKey}`);
    const data = await res.json();

    if (data.length === 0) {
      setIsError(true);
      setStatus(t.invalid);
      setDisplayResult("");
      setTimeout(() => { setStatus(''); setIsError(false); }, 2000);
      return;
    }

    const definition = data[0].content;
    let prefix = '';
    if (mode === 'LocalOOC') prefix = 'LocalOOC ';
    if (mode === 'dm') prefix = `dm ${dmId} `;

    const finalString = `${prefix}${definition}`;
    setDisplayResult(definition);
    navigator.clipboard.writeText(finalString);
    
    setStatus(t.copy);
    setShowCopyNote(true);
    setRuleKey('');
    setTimeout(() => { setStatus(''); setShowCopyNote(false); }, 2000);
  };

  return (
    <main dir={t.dir} className="min-h-screen p-6 flex items-center justify-center relative font-mono text-white">
      
      {/* HEADER BAR */}
      <div className="fixed top-8 left-0 right-0 px-8 flex flex-row justify-between items-center z-50" dir="ltr">
        <Link href="/" className="flex flex-row items-center gap-3 text-blue-300/40 hover:text-white transition-all group">
          <div className="w-10 h-10 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-400 group-hover:bg-blue-500/10 transition-all">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 12H5M12 19l-7-7 7-7"/></svg>
          </div>
          <span className="text-xs font-bold uppercase tracking-widest hidden md:block">{t.return}</span>
        </Link>

        <div className="flex flex-col items-center text-center" dir={t.dir}>
          <div className="flex items-center gap-2">
            <span className="text-[10px] text-blue-300/40 uppercase tracking-[0.3em] font-bold">{t.welcome}</span>
            <span className="text-[11px] text-blue-400 font-black uppercase tracking-widest drop-shadow-[0_0_8px_rgba(96,165,250,0.5)]">{username}</span>
          </div>
          <div className="h-[1px] w-full max-w-[120px] bg-gradient-to-r from-transparent via-blue-500/50 to-transparent mt-1"></div>
        </div>

        <button onClick={toggleLang} className="glass-card w-[100px] py-2 text-[10px] font-bold border border-white/10 hover:bg-white/10 transition-all uppercase tracking-widest">
          {t.lang}
        </button>
      </div>

      <div className="glass-card p-10 max-w-2xl w-full space-y-8 mt-12 border border-white/5">
        <div className="text-center">
          <h1 className="text-3xl font-black italic tracking-tighter uppercase">{t.ruleGen}</h1>
          <div className="h-1 w-20 bg-blue-500 mx-auto rounded-full mt-2"></div>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center gap-3">
          {['normal', 'LocalOOC', 'dm'].map((m) => (
            <button key={m} onClick={() => setMode(m)} className={`px-5 py-2 rounded-xl text-[10px] font-bold uppercase transition-all border ${mode === m ? 'bg-blue-600 border-blue-400 text-white' : 'bg-white/5 border-white/10 text-blue-300/50'}`}>
              {m === 'normal' ? t.normal : m}
            </button>
          ))}
        </div>

        <div className="space-y-6">
          <div className="flex gap-4">
            {mode === 'dm' && (
              <input dir="ltr" className="input-field w-20 text-center" placeholder={t.id} value={dmId} onChange={(e) => setDmId(e.target.value)} />
            )}
            <input
              ref={inputRef}
              dir="ltr"
              className="input-field flex-1 text-left"
              placeholder={t.placeholder}
              value={ruleKey}
              onChange={(e) => setRuleKey(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleProcess()}
            />
            <button onClick={() => handleProcess()} className="btn-primary px-8">{t.search}</button>
          </div>

          <div className="min-h-[140px] flex flex-col items-center justify-center p-8 bg-black/40 rounded-3xl border border-white/5 relative group">
            {showCopyNote && (
              <div className="absolute top-4 right-6 flex items-center gap-2 text-emerald-400 animate-in fade-in slide-in-from-right-2 duration-300">
                <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></div>
                <span className="text-[10px] font-bold uppercase tracking-widest">{t.copy || "COPIED"}</span>
              </div>
            )}

            <p dir="auto" className={`text-white text-center leading-relaxed transition-opacity duration-300 ${displayResult ? 'opacity-100' : 'opacity-20'} ${lang === 'ar' ? 'text-xl' : 'text-lg font-mono'}`}>
               {displayResult || "..."}
            </p>

            {displayResult && (
              <button onClick={() => handleProcess(displayResult)} className="mt-4 px-4 py-1.5 bg-white/5 border border-white/10 rounded-full text-[9px] font-bold uppercase tracking-widest text-white/40 hover:text-white transition-all flex items-center gap-2">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
                {lang === 'ar' ? 'نسخ' : 'COPY'}
              </button>
            )}

            {status && isError && (
              <div className="absolute inset-0 flex items-center justify-center backdrop-blur-sm rounded-3xl bg-red-900/40">
                <span className="font-bold uppercase tracking-widest text-red-400">{status}</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}