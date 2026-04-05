'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { sendOtp, registerUser } from '@/lib/actions/auth/register';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({ 
    email: '', 
    username: '', 
    otp_code: '', 
    password: '' 
  });
  const [isLoading, setIsLoading] = useState(false);
  const [loadingOTP, setLoadingOTP] = useState(false);
  const [notification, setNotification] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleRequestOTP = async () => {
    if (!formData.email) {
      setNotification({ type: 'error', text: 'Masukkan email terlebih dahulu' });
      return;
    }
    
    setLoadingOTP(true);
    setNotification(null);
    
    try {
      const result = await sendOtp({ email: formData.email });
      if (!result.success) {
        setNotification({ 
          type: 'error', 
          text: result.error || result.message || 'Gagal mengirim OTP' 
        });
        return;
      }
      setNotification({ type: 'success', text: 'Kode OTP telah dikirim ke email Anda' });
    } catch (error) {
      setNotification({ type: 'error', text: 'Terjadi kesalahan sistem' });
    } finally {
      setLoadingOTP(false);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setNotification(null);

    try {
      const result = await registerUser(formData);
      if (!result.success) {
        setNotification({ 
          type: 'error', 
          text: result.error || result.message || 'Registrasi gagal' 
        });
        return;
      }

      setNotification({ type: 'success', text: 'Registrasi berhasil! Mengalihkan...' });
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);

    } catch (error) {
      setNotification({ type: 'error', text: 'Terjadi kesalahan sistem' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white overflow-hidden">
      
      {/* Brand Header */}
      <div className="absolute top-0 w-full max-w-6xl flex items-center justify-between p-8 z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-cyan-500/20">
            A
          </div>
          <span className="text-xl font-bold tracking-tight group-hover:text-cyan-400 transition-colors">Auth-Next</span>
        </Link>
      </div>

      <div className="w-full max-w-md z-10 mt-12 md:mt-0">
        <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl relative overflow-hidden">
          
          {/* Header Section */}
          <div className="text-center space-y-3 mb-8">
            <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
              Create Account
            </h1>
            <p className="text-sm text-zinc-400">
              Lengkapi data untuk bergabung ke ekosistem
            </p>
          </div>

          {/* Notification System */}
          {notification && (
            <div className={`mb-6 p-4 rounded-2xl border text-sm font-bold text-center transition-all animate-in fade-in slide-in-from-top-2 ${
              notification.type === 'error' 
                ? 'bg-red-500/10 border-red-500/20 text-red-400' 
                : 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400'
            }`}>
              {notification.text}
            </div>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            {/* Email & OTP Action */}
            <div className="space-y-2">
              <input
                type="email"
                placeholder="Email Address"
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500/50 transition-all text-white placeholder:text-zinc-600"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
              />
              <button
                type="button"
                onClick={handleRequestOTP}
                disabled={loadingOTP}
                className="w-full text-[10px] font-bold uppercase tracking-widest text-zinc-400 border border-zinc-800 p-3 rounded-xl hover:bg-zinc-800 hover:text-white transition-all disabled:opacity-50"
              >
                {loadingOTP ? 'Sending OTP...' : 'Request Verification Code'}
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <input
                type="text"
                placeholder="Username"
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500/50 transition-all text-white placeholder:text-zinc-600"
                value={formData.username}
                onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                required
              />
              <input
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="OTP Code"
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500/50 transition-all text-white text-center font-bold placeholder:text-zinc-600"
                value={formData.otp_code}
                onChange={(e) => setFormData({ ...formData, otp_code: e.target.value.slice(0, 6) })}
                required
              />
            </div>

            <input
              type="password"
              placeholder="Create Password"
              className="w-full p-4 bg-black border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500/50 transition-all text-white placeholder:text-zinc-600"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              required
            />

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-white text-black p-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 shadow-lg shadow-white/5 mt-4"
            >
              {isLoading ? 'Processing...' : 'Register Now'}
            </button>
          </form>

          {/* Footer Navigation */}
          <div className="mt-8 text-center">
            <p className="text-sm text-zinc-500">
              Sudah punya akun?{' '}
              <Link href="/auth/login" className="text-white font-bold hover:text-cyan-400 transition-colors">
                Masuk di sini
              </Link>
            </p>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-center z-20">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
          Secured by MSC Ecosystem • 2026
        </p>
      </div>

      {/* Background Ambience */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-10%,#1e293b,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[radial-gradient(circle_at_50%_110%,#083344,transparent_50%)] opacity-30 pointer-events-none" />
    </main>
  );
}