'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function AdminLogin() {
  const [password, setPassword] = useState('');
  const [error, setError] = useState(''); 
  const router = useRouter();

  const handleLogin = async () => {
    setError("");
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password })
      });

      if (res.ok) {
        window.location.href = '/admin';
      } else {
        const data = await res.json();
        setError(data.error || "Invalid Password");
      }
    } catch (err) {
      setError("Connection Failed");
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center p-6 relative">
      {/* Centered Card */}
      <div className="glass-card p-10 max-w-sm w-full space-y-6 text-center">
        <h1 className="text-2xl font-bold italic tracking-tighter uppercase text-red-600">Admin Portal</h1>
        
        <div className="space-y-4">
          <input 
            type="password"
            className={`input-field w-full ${error ? 'border-red-500/50 ring-1 ring-red-500/20' : ''}`}
            placeholder="Enter Password"
            value={password}
            onChange={(e) => { setPassword(e.target.value); setError(''); }}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          
          {error && (
            <div className="p-3 bg-red-500/10 border border-red-500/20 rounded-lg text-red-400 text-[10px] font-bold uppercase animate-shake">
              {error}
            </div>
          )}

          <button onClick={handleLogin} className="btn-primary w-full uppercase text-xs tracking-widest">
            SignUp
          </button>
          
          <Link href="/" className="block text-[10px] text-blue-300/40 hover:text-blue-300 uppercase tracking-widest transition-colors">
            ← Cancel
          </Link>
        </div>
      </div>
    </main>
  );
}