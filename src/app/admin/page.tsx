'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function AdminPage() {
  const [users, setUsers] = useState<any[]>([]);
  const [tokens, setTokens] = useState<any[]>([]);
  const [generatedToken, setGeneratedToken] = useState('');
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [copied, setCopied] = useState(false);

  const fetchData = async () => {
    setIsRefreshing(true);
    try {
      const [userRes, tokenRes] = await Promise.all([
        fetch('/api/admin/users'),
        fetch('/api/admin/tokens')
      ]);
      const userData = await userRes.json();
      const tokenData = await tokenRes.json();
      setUsers(Array.isArray(userData) ? userData : []);
      setTokens(Array.isArray(tokenData) ? tokenData : []);
    } catch (e) {
      console.error("Fetch failed");
    }
    setTimeout(() => setIsRefreshing(false), 500);
  };

  useEffect(() => { fetchData(); }, []);

  const handleCreateToken = async () => {
    const res = await fetch('/api/admin/generate', { 
      method: 'POST',
      body: JSON.stringify({ name: "System_User" }) // Satisfies the recipient requirement
    });
    if (res.ok) {
      const data = await res.json();
      setGeneratedToken(data.token);
      setCopied(false);
      fetchData(); 
    }
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(generatedToken);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLogout = async () => {
    await fetch('/api/admin/logout', { method: 'POST' });
    window.location.href = '/';
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Wipe this device signature?")) return;
    await fetch('/api/admin/users/delete', { method: 'DELETE', body: JSON.stringify({ id }) });
    fetchData();
  };

  const toggleRevoke = async (id: string, current: boolean) => {
    await fetch('/api/admin/users/revoke', { 
      method: 'PATCH', 
      body: JSON.stringify({ id, isRevoked: !current }) 
    });
    fetchData();
  };

  const handleCancelToken = async (id: string) => {
    if (!confirm("Invalidate this invitation key?")) return;
    const res = await fetch('/api/admin/tokens/delete', {
      method: 'DELETE',
      body: JSON.stringify({ id })
    });
    if (res.ok) fetchData();
  };

  return (
    <div className="min-h-screen p-8 lg:p-20 relative font-mono text-white">
  {/* Return Button */}
  <Link href="/" className="absolute top-8 left-8 text-blue-300/50 hover:text-white flex items-center gap-2 transition-all group">
    <div className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center group-hover:border-blue-400 transition-all">
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
        <path d="M19 12H5M12 19l-7-7 7-7"/>
      </svg>
    </div>
    <span className="text-[10px] font-bold uppercase tracking-[0.2em]">Home</span>
  </Link>

  <div className="max-w-6xl mx-auto space-y-8">
    {/* Header with Refresh & Logout */}
    <div className="flex justify-between items-end border-b border-white/10 pb-6">
      <h1 className="text-3xl font-black italic tracking-tighter uppercase text-white">Control Center</h1>
      <div className='flex gap-4'>
        <button 
          onClick={fetchData} 
          className={`p-2 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all ${isRefreshing ? 'animate-spin' : ''}`}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
            <path d="M21 12a9 9 0 1 1-9-9c2.52 0 4.93 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/>
          </svg>
        </button>
        <button onClick={handleLogout} 
          className="text-[10px] font-bold text-red-400 hover:bg-red-500/10 transition-all uppercase tracking-widest px-4 py-2 border border-red-400/20 rounded-md">
          LogOut
        </button>
      </div>
    </div>

    {/* TOKEN GENERATOR SECTION */}
    <div className="glass-card p-8 border border-white/10">
      <h2 className="text-[13px] font-bold text-blue-300 uppercase tracking-[0.3em] mb-6 underline underline-offset-8">Access Token Authority</h2>
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <button onClick={handleCreateToken} className="btn-primary px-8 py-3 text-xs tracking-widest w-full sm:w-auto shrink-0">
          GENERATE NEW KEY
        </button>
        {generatedToken && (
          <div className="flex gap-2 items-center flex-1 w-full animate-in slide-in-from-left-4 duration-300">
            <div className="flex-1 p-3 bg-blue-500/10 border border-blue-400/30 rounded-lg text-center font-bold tracking-[0.4em] text-blue-400">
              {generatedToken}
            </div>
            <button 
              onClick={handleCopy} 
              className={`px-4 py-3 rounded-lg border text-[10px] font-bold transition-all ${copied ? 'bg-emerald-500/20 border-emerald-500 text-emerald-400' : 'bg-white/5 border-white/10 text-white hover:bg-white/10'}`}
            >
              {copied ? 'COPIED' : 'COPY'}
            </button>
          </div>
        )}
      </div>
    </div>

    {/* SIDE BY SIDE TABLES WRAPPER */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      
      {/* UNCLAIMED TOKENS SECTION */}
      <div className="glass-card overflow-hidden border border-amber-500/20 flex flex-col h-[450px]">
        <div className="p-4 bg-amber-500/5 border-b border-amber-500/20 text-[13px] font-bold tracking-widest text-amber-200 uppercase flex justify-between shrink-0">
          <span>Pending Keys</span>
          <span className="opacity-50">{tokens.length} Total</span>
        </div>
        <div className="divide-y divide-white/5 overflow-y-auto flex-1 custom-scrollbar">
          {tokens.length === 0 && <p className="p-8 text-center text-white/40 text-[12px] uppercase">No pending keys available</p>}
          {tokens.map(t => (
            <div key={t.id} className="p-4 flex items-center justify-between text-xs hover:bg-white/5 group">
              <div className="flex flex-col">
                <span className="font-bold tracking-widest text-amber-400/80 group-hover:text-amber-400 transition-colors">{t.token}</span>
                <span className="text-[10px] text-white/20 uppercase">Issued: {new Date(t.createdAt).toLocaleDateString()}</span>
              </div>
              <div className="flex items-center gap-4">
                <button 
                  onClick={() => handleCancelToken(t.id)}
                  className="p-2 rounded bg-red-500/10 border border-red-500/20 text-red-500 hover:bg-red-500 hover:text-white transition-all"
                  title="Cancel Token"
                >
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="18" y1="6" x2="6" y2="18"></line>
                    <line x1="6" y1="6" x2="18" y2="18"></line>
                  </svg>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* AUTHORIZED DEVICES SECTION */}
      <div className="glass-card overflow-hidden border border-white/10 flex flex-col h-[450px]">
        <div className="p-4 bg-green-500/15 border-b border-green-500/40 text-[13px] font-bold tracking-widest text-green-400 uppercase flex justify-between shrink-0">
          <span>Active Signatures</span>
          <span className="opacity-50">{users.length} Active</span>
        </div>
        <div className="divide-y divide-white/5 overflow-y-auto flex-1 custom-scrollbar">
          {users.length === 0 && <p className="p-10 text-center text-white/20 uppercase text-[12px]">No active device signatures found.</p>}
          {users.map(user => (
            <div key={user.id} className="p-4 flex flex-col justify-between gap-3 hover:bg-white/5 transition-all">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-bold text-sm uppercase tracking-tighter text-white">{user.username}</p>
                  <p className="text-[10px] font-mono text-white/40 uppercase truncate max-w-[150px]">Hash: {user.hardwareHash}</p>
                </div>
                <div className="flex gap-2">
                  <button 
                    onClick={() => toggleRevoke(user.id, user.isRevoked)} 
                    className={`p-2 rounded text-[11px] font-bold tracking-widest transition-all border ${user.isRevoked ? 'bg-emerald-500/20 text-emerald-500 border-emerald-500/50' : 'bg-white/5 text-white border-white/10 hover:border-white/30'}`}
                  >
                    {user.isRevoked ? 'RESTORE' : 'SUSPEND'}
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="p-2 rounded bg-red-600/10 border border-red-500/20 text-red-500 text-[11px] font-bold tracking-widest hover:bg-red-600/20">WIPE</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  </div>
</div>
  );
}