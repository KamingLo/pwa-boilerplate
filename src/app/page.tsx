import Image from 'next/image';
import { formatDate } from '../lib/formatDate';
import Link from 'next/link';

export default function Home() {
  const today = formatDate(new Date());

  return (
    <main className="min-h-screen flex flex-col items-center bg-black text-white overflow-hidden">
      
      {/* Navigation */}
      <nav className="w-full max-w-6xl flex flex-col md:flex-row items-center justify-between p-6 md:px-12 md:py-8 gap-4 md:gap-0 z-20">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-lg shadow-lg shadow-cyan-500/20">
            A
          </div>
          <span className="text-2xl font-bold tracking-tight">Auth-Next</span>
        </div>
        <div className="flex items-center gap-6 text-sm">
          <span className="rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs font-medium text-cyan-400">
            v1.0 Stable
          </span>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="flex flex-col items-center text-center mt-10 w-full max-w-5xl px-6 z-10 relative">
        <div className="mb-6 flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900/50 px-4 py-1.5 text-xs md:text-sm font-medium text-zinc-300">
          <span className="flex h-2 w-2 rounded-full bg-emerald-500 animate-pulse"></span>
          Optimized for Kaming's MSC Ecosystem
        </div>
        
        <h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-8">
          One Frontend. <br /> 
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-600">
            Infinite Backends.
          </span>
        </h1>
        
        <p className="text-base md:text-xl text-zinc-400 mb-12 max-w-3xl mx-auto leading-relaxed">
          Auth-Next menyediakan koneksi mulus ke template backend MSC (Model-Service-Controller) buatan kaming. 
          Siap digunakan untuk validasi alur autentikasi secara instan.
        </p>
        
        {/* CTA Baru: Login & Register */}
        <div className="flex flex-col sm:group sm:flex-row gap-4 w-full sm:w-auto">
          <Link 
            href="/auth/login"
            className="px-10 py-4 rounded-xl bg-white text-black font-bold flex items-center justify-center gap-2 hover:bg-zinc-200 transition-all shadow-xl shadow-white/5"
          >
            Test Login
          </Link>
          <Link 
            href="/auth/register"
            className="px-10 py-4 rounded-xl border border-zinc-800 bg-zinc-900/50 hover:bg-zinc-800 transition-all font-bold flex items-center justify-center gap-2"
          >
            Register Now
          </Link>
        </div>
      </section>

      {/* Configuration Section */}
      <section className="mt-24 w-full max-w-4xl px-6 z-10">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-12 relative overflow-hidden group">
          <div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity">
            <svg className="w-32 h-32" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L1 21h22L12 2zm0 3.45L20.14 19H3.86L12 5.45zM11 16h2v2h-2v-2zm0-7h2v5h-2V9z"/></svg>
          </div>
          
          <div className="relative z-10">
            <h2 className="text-2xl md:text-3xl font-bold mb-4">Plug & Play Logic</h2>
            <p className="text-zinc-400 mb-8 max-w-xl">
              Cukup arahkan endpoint ke backend pilihan Anda. Gunakan template resmi kaming untuk integrasi otomatis tanpa konfigurasi tambahan.
            </p>

            {/* Template Buttons Moved Here */}
            <div className="flex flex-wrap gap-3 mb-8">
              <a 
                href="https://github.com/kaminglo/express-template-msc"
                target="_blank"
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <span className="text-zinc-400">Get</span> Express Template
              </a>
              <a 
                href="https://github.com/kaminglo/gin-template-msc"
                target="_blank"
                className="px-4 py-2 rounded-lg bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-xs font-semibold flex items-center gap-2 transition-colors"
              >
                <span className="text-zinc-400">Get</span> Go-Gin Template
              </a>
            </div>
            
            <div className="space-y-4">
              <div className="p-4 rounded-xl bg-black border border-zinc-800 font-mono text-sm overflow-x-auto">
                <p className="text-zinc-500"># .env</p>
                <p className="text-white">
                  <span className="text-pink-500">BACKEND_URL</span>=
                  <span className="text-yellow-400">"http://localhost:8000"</span> 
                  <span className="text-zinc-500 ml-4">// Backend Template By Kaming</span>
                </p>
              </div>
              <div className="flex items-center gap-2 text-xs text-zinc-500 italic">
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" /></svg>
                Mendukung auto-parsing untuk login, registrasi, dan validasi token universal.
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tech Stack Footer */}
      <footer className="mt-32 mb-20 w-full max-w-6xl px-6 border-t border-zinc-900 pt-12 flex flex-col md:flex-row justify-between items-center gap-8 z-10">
        <div className="text-zinc-500 text-sm text-center md:text-left">
          <p className="font-medium text-zinc-300 italic">Crafted by Kaming</p>
          <p>© 2026 Auth-Next. Built for speed, scaled for production.</p>
        </div>
        <div className="flex gap-6 items-center">
            <div className="flex -space-x-2">
                <div className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-[10px] font-bold" title="Express.js">EX</div>
                <div className="h-8 w-8 rounded-full bg-zinc-800 border-2 border-black flex items-center justify-center text-[10px] font-bold text-cyan-400" title="Golang Gin">GO</div>
            </div>
            <span className="h-4 w-[1px] bg-zinc-800"></span>
            <span className="text-xs font-mono text-zinc-500 uppercase tracking-widest">{today}</span>
        </div>
      </footer>

      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-20%,#1e293b,transparent_50%)] pointer-events-none" />
    </main>
  );
}