'use client';
import { useState, useEffect } from 'react';
import { getLanguageCookie, setLanguageCookie } from '@/lib/lang-config';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { translations } from '@/lib/translations';

export default function RegisterPage() {
  const router = useRouter();
  
  // 1. STATE DEFINITIONS
  const [lang, setLang] = useState('ar');
  const [token, setToken] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [status, setStatus] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
      setLang(getLanguageCookie());
  }, []);
  
  const toggleLang = () => {
    const newLang = lang === 'ar' ? 'en' : 'ar';
    setLang(newLang);
    setLanguageCookie(newLang);
  };

  const t = translations[lang];

  // 2. FINGERPRINT LOGIC
  const getFingerprint = async () => {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl');
    if (!gl) return "standard-hash";
    
    const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
    const renderer = debugInfo ? gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL) : "";
    const screenRes = `${window.screen.width}x${window.screen.height}`;
    
    // Simple hash of hardware strings
    const rawString = `${renderer}-${screenRes}-${navigator.hardwareConcurrency}`;
    const msgUint8 = new TextEncoder().encode(rawString);
    const hashBuffer = await crypto.subtle.digest('SHA-256', msgUint8);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
  };

  // 3. REGISTRATION HANDLER
  const handleRegister = async () => {
    setStatus('CONNECTING...'); // Initial feedback
    try {
      const hardwareHash = await getFingerprint();
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, username, password, hardwareHash })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('SUCCESS');
        document.cookie = `user_session=${hardwareHash}; path=/; SameSite=Lax`;
        setTimeout(() => router.push('/vault'), 1500);
      } else {
        // Fail feedback
        setStatus(data.error === 'TOKEN REVOKED' ? 'TOKEN REVOKED' : 'REGISTRATION FAILED');
      }
    } catch (err) {
      setStatus('CONNECTION ERROR');
    }
  };
  return (
    <main dir={t.dir} className={`min-h-screen flex items-center justify-center p-6 relative ${lang === 'ar' ? 'font-sans' : 'font-mono'}`}>
      
      {/* Return Button */}
      <div className="fixed top-8 left-8 z-50" dir="ltr">
        <Link href="/" className="flex items-center gap-3 text-blue-300/40 hover:text-white transition-all group">
        <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-white/30 transition-all">
            <svg 
              width="16" 
              height="16" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="2.5" 
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7"/>
            </svg>
        </div>
          <span className="text-xs font-bold uppercase">{t.return}</span>
        </Link>
      </div>

      {/* Language Button */}
      <div className="fixed top-8 right-8 z-50" dir="ltr">
        <button 
          onClick={toggleLang}
          className="glass-card w-[100px] py-2 text-[10px] font-bold border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
        >
          {t.lang}
        </button>
      </div>

      <div className="glass-card p-10 max-w-md w-full space-y-6 relative overflow-hidden">
        <h1 className="text-2xl font-black text-center uppercase tracking-tighter text-white">
          {t.register}
        </h1>

        <div className="space-y-4">
          <div className="space-y-1">
            <label className="text-[15px] font-bold text-blue-300 block px-1">{t.token}</label>
            <input 
              dir="ltr"
              value={token}
              onChange={(e) => setToken(e.target.value)}
              className="input-field w-full text-left" 
              placeholder="XXXX-XXXX" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[15px] font-bold text-blue-300 block px-1">{t.username}</label>
            <input 
              dir="ltr"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="input-field w-full text-left" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-[15px] font-bold text-blue-300 block px-1">
              {t.password}
            </label>
            <input 
              type="password"
              dir="ltr"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="input-field w-full text-left" 
            />
          </div>

          <button 
            onClick={handleRegister}
            disabled={isLoading}
            className="btn-primary w-full mt-4 h-12 flex items-center justify-center relative overflow-hidden"
          >
            {isLoading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            ) : (
              t.enroll
            )}
          </button>
        </div>

        {/* Status Feedback Box */}
        {status && status === 'SUCCESS' ? (
          <div className="pt-4 text-center">
             <span className="text-[12px] font-bold text-green-500 px-4 py-1 rounded-full">
               {status}
             </span>
             <span className="text-[12px] font-bold text-green-500 px-4 py-1 rounded-full animate-pulse">
               REDIRECTING ...
             </span>
          </div>
        ):(
          <div className="pt-4 text-center">
             <span className="text-[12px] font-bold text-red-500 px-4 py-1 rounded-full">
               {status}
             </span>
          </div>
        )}
      </div>
    </main>
  );
}