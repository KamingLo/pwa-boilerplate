'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

// Import Server Actions
import { getSession, logoutUser } from '@/lib/actions/auth/session';

interface UserData {
  id: string;
  email: string;
}

export default function DashboardPage() {
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await getSession();
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          router.push('/auth/login');
        }
      } catch (err) {
        console.error("Gagal mengambil data:", err);
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [router]);

  const handleLogout = async () => {
    try {
      const result = await logoutUser();
      if (result.success) {
        router.push('/auth/login');
      }
    } catch (err) {
      console.error('Kesalahan sistem saat keluar:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black">
        <div className="flex flex-col items-center gap-4">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 animate-spin shadow-lg shadow-cyan-500/20 flex items-center justify-center">
            <div className="h-8 w-8 bg-black rounded-lg"></div>
          </div>
          <p className="text-zinc-500 font-mono text-[10px] uppercase tracking-[0.3em] animate-pulse">
            Booting_System...
          </p>
        </div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-black text-white font-sans selection:bg-cyan-500/30">
      
      {/* Sidebar / Navigation (Desktop Only Sidebar Style) */}
      <nav className="fixed top-0 left-0 h-full w-20 hidden md:flex flex-col items-center py-8 border-r border-zinc-900 bg-zinc-900/20 backdrop-blur-xl z-30">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg mb-12 shadow-lg shadow-cyan-500/20">
          A
        </div>
        <div className="flex flex-col gap-8 text-zinc-500">
           <div className="p-2 text-cyan-400 bg-cyan-500/10 rounded-lg cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" /></svg>
           </div>
           <div className="p-2 hover:text-white transition-colors cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" /></svg>
           </div>
           <div className="p-2 hover:text-white transition-colors cursor-pointer">
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" /></svg>
           </div>
        </div>
      </nav>

      <div className="md:pl-20">
        {/* Header Section */}
        <header className="w-full border-b border-zinc-900 bg-black/50 backdrop-blur-md sticky top-0 z-20">
          <div className="max-w-7xl mx-auto px-6 py-4 flex justify-between items-center">
            <div className="flex flex-col">
              <h2 className="text-xl font-bold tracking-tight">Console</h2>
              <p className="text-[10px] text-zinc-500 font-mono flex items-center gap-1.5 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                System Operational
              </p>
            </div>
            <div className="flex items-center gap-4">
               <div className="hidden sm:block text-right">
                  <p className="text-xs font-bold text-white">{user?.email}</p>
                  <p className="text-[9px] text-zinc-500 font-mono">ID: {user?.id.slice(0, 8)}...</p>
               </div>
               <button 
                onClick={handleLogout}
                className="px-4 py-2 bg-zinc-900 border border-zinc-800 rounded-lg text-xs font-bold hover:bg-red-500/10 hover:border-red-500/20 hover:text-red-400 transition-all active:scale-95"
               >
                 Log Out
               </button>
            </div>
          </div>
        </header>

        {/* Content Section */}
        <div className="max-w-7xl mx-auto p-6 space-y-8">
          
          {/* Stats Grid Placeholder */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'API Calls', val: '2.4k', change: '+12%', color: 'cyan' },
              { label: 'Server Load', val: '14%', change: 'Stable', color: 'emerald' },
              { label: 'Latency', val: '42ms', change: '-5ms', color: 'blue' },
              { label: 'Integrations', val: '08', change: 'Live', color: 'purple' },
            ].map((stat, i) => (
              <div key={i} className="bg-zinc-900/40 border border-zinc-800 p-5 rounded-2xl relative overflow-hidden group hover:border-zinc-700 transition-colors">
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-wider mb-2">{stat.label}</p>
                <div className="flex items-baseline gap-2">
                  <h3 className="text-2xl font-bold">{stat.val}</h3>
                  <span className="text-[10px] font-mono text-cyan-400">{stat.change}</span>
                </div>
                <div className={`absolute bottom-0 right-0 h-1 w-0 bg-gradient-to-r from-cyan-500 to-blue-500 group-hover:w-full transition-all duration-500`}></div>
              </div>
            ))}
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Project Log Placeholder */}
            <div className="lg:col-span-2 space-y-4">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Recent Activity Log</h3>
              <div className="bg-zinc-900/20 border border-zinc-900 rounded-2xl overflow-hidden backdrop-blur-sm">
                <table className="w-full text-left text-sm">
                  <thead className="bg-zinc-900/50 border-b border-zinc-800 text-[10px] uppercase text-zinc-500 font-bold">
                    <tr>
                      <th className="px-6 py-4">Event</th>
                      <th className="px-6 py-4">Target Backend</th>
                      <th className="px-6 py-4">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-zinc-900 font-mono text-xs">
                    {[
                      { ev: 'POST /auth/login', target: 'MSC-Express', st: '200 OK' },
                      { ev: 'GET /user/profile', target: 'MSC-Gin-Go', st: '200 OK' },
                      { ev: 'POST /auth/refresh', target: 'MSC-Express', st: '200 OK' },
                      { ev: 'GET /system/health', target: 'Internal', st: '200 OK' },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-zinc-900/30 transition-colors group">
                        <td className="px-6 py-4 text-zinc-300 group-hover:text-white">{row.ev}</td>
                        <td className="px-6 py-4 text-zinc-500">{row.target}</td>
                        <td className="px-6 py-4">
                          <span className="text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded text-[10px]">{row.st}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Profile Info Card */}
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-widest">Active Identity</h3>
              <div className="bg-gradient-to-br from-zinc-900 to-black border border-zinc-800 p-6 rounded-3xl relative">
                <div className="h-12 w-12 rounded-full bg-zinc-800 border-2 border-cyan-500/20 mb-4 overflow-hidden flex items-center justify-center font-bold text-cyan-500">
                  {user?.email[0].toUpperCase()}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Full Identifier</p>
                    <p className="text-sm font-mono text-zinc-300">{user?.email}</p>
                  </div>
                  <div>
                    <p className="text-[10px] text-zinc-600 font-bold uppercase tracking-tighter">Access Token Rank</p>
                    <p className="text-sm font-bold text-white italic">Administrator</p>
                  </div>
                  <div className="pt-4 border-t border-zinc-800">
                    <p className="text-[9px] text-zinc-500 font-mono break-all leading-relaxed">
                      UUID: {user?.id}
                    </p>
                  </div>
                </div>
                <div className="absolute top-4 right-6">
                  <div className="h-2 w-2 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Decorative Background Elements */}
      <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-cyan-600/5 blur-[120px] pointer-events-none -z-10" />
      <div className="fixed bottom-0 left-0 w-[500px] h-[500px] bg-blue-900/5 blur-[120px] pointer-events-none -z-10" />
    </main>
  );
}