'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { getLanguageCookie, setLanguageCookie } from '@/lib/lang-config';
import { translations } from '@/lib/translations';
import { getFingerprint } from '@/lib/fingerprint';

export default function LoginPage() {
  const router = useRouter();
  const [lang, setLang] = useState('ar');
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


  const handleLogin = async () => {

    if (!username.trim() || !password.trim()) {
      setStatus(lang === 'ar' ? 'يرجى ملء جميع الحقول' : 'PLEASE FILL IN ALL FIELDS');
      return;
    }
    
    setIsLoading(true);
    setStatus('VERIFYING');

    try {
      const hardwareHash = await getFingerprint();
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password, hardwareHash })
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('ACCESS GRANTED');
        // Set session cookie
        document.cookie = `user_session=${hardwareHash}; path=/; SameSite=Lax`;
        setTimeout(() => router.push('/vault'), 1000);
      } else {
        setStatus(data.error || lang === 'ar' ? 'معلومات خاطئة' : 'INVALID CREDENTIALS');
      }
    } catch (err) {
      setStatus(lang === 'ar' ? 'خطئ من الخادم' : 'SERVER ERROR');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main dir={t.dir} className="min-h-screen flex items-center justify-center p-6 relative">
      <div className="fixed top-8 left-8 z-50" dir="ltr">
        <Link href="/" className="flex items-center gap-3 text-blue-300/40 hover:text-white">
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

            <div className="fixed top-8 right-8 z-50" dir="ltr">
        <button 
          onClick={toggleLang}
          className="glass-card w-[100px] py-2 text-[10px] font-bold border border-white/10 hover:bg-white/10 transition-all flex items-center justify-center"
        >
          {t.lang}
        </button>
      </div>

      <div className="glass-card p-10 max-w-md w-full space-y-6">
        <h1 className="text-2xl font-black text-center uppercase text-white">
          {t.login}
        </h1>

        <div className="space-y-4">
          <input 
            className="input-field w-full" 
            placeholder={t.username} 
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />
          <input 
            type="password"
            className="input-field w-full" 
            placeholder={t.password} 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button onClick={handleLogin} disabled={isLoading} className="btn-primary w-full h-12">
            {isLoading ? '...' : (lang === 'ar' ? 'دخول' : 'VALIDATE')}
          </button>
        </div>

        {status && status === 'ACCESS GRANTED' ? (
          <>
            <p className="text-center text-[10px] text-green-500 font-bold">
              {lang === 'ar' ? 'تم التحقق بنجاح !' : 'ACCESS GRANTED'}
            </p>
            <p className="text-center text-[10px] text-green-500 animate-pulse font-bold">REDIRECTING...</p>
          </>
        ):(status === 'VERIFYING' ?
          
          <p className="text-center text-[10px] text-yellow-500 font-bold">{lang === 'ar' ? 'جاري التحقق ...' : 'VERIFYING...'}</p>
          :
          <p className="text-center text-[10px] text-red-500 font-bold">{status}</p>
        )}
      </div>
    </main>
  );
}