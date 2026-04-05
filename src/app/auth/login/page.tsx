'use client';

import { useState, Suspense } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { loginUser } from '@/lib/actions/auth/login';
import { initiateGoogleAuth } from '@/lib/actions/auth/oauth';
import { forgotPassword } from '@/lib/actions/auth/forgot-password';

function LoginForm() {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const router = useRouter();

  const toggleView = (newView: 'login' | 'forgot') => {
    setErrorMessage(null);
    setSuccessMessage(null);
    setView(newView);
  };

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await loginUser(formData);
      if (!result.success) {
        setErrorMessage(result.message || 'Email atau password salah');
        setIsLoading(false);
        return;
      }
      router.push('/dashboard');
    } catch (error) {
      setErrorMessage('Terjadi kesalahan sistem saat masuk');
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await initiateGoogleAuth('web');
      if (!result.success) {
        setErrorMessage(result.message || 'Gagal menghubungi server Google');
        setIsLoading(false);
        return;
      }
      const googleAuthUrl = result.data?.data?.url;
      if (googleAuthUrl) {
        window.location.href = googleAuthUrl;
      } else {
        setErrorMessage('Sistem gagal mendapatkan tautan autentikasi');
        setIsLoading(false);
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan sistem saat inisiasi Google');
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const result = await forgotPassword(formData.email);
      if (result.success) {
        setSuccessMessage('Tautan reset telah dikirim ke email kamu.');
        setFormData({ ...formData, email: '' });
      } else {
        setErrorMessage(result.message);
      }
    } catch (error) {
      setErrorMessage('Gagal menghubungi server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md z-10">
      <div className="bg-zinc-900/50 border border-zinc-800 rounded-3xl p-8 md:p-10 backdrop-blur-xl shadow-2xl">
        <div className="text-center space-y-3 mb-10">
          <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-white">
            {view === 'login' ? 'Welcome Back' : 'Reset Password'}
          </h1>
          <p className="text-sm text-zinc-400">
            {view === 'login' 
              ? 'Gunakan akun universitas untuk akses ekosistem' 
              : 'Masukkan email untuk menerima tautan pemulihan'}
          </p>
        </div>

        {errorMessage && (
          <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-2xl">
            <p className="text-sm text-red-400 font-bold text-center">{errorMessage}</p>
          </div>
        )}

        {successMessage && (
          <div className="mb-6 p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl">
            <p className="text-sm text-emerald-400 font-bold text-center">{successMessage}</p>
          </div>
        )}

        <form onSubmit={view === 'login' ? handleManualLogin : handleForgotPassword} className="space-y-4">
          <input
            type="email"
            placeholder="Email Address"
            disabled={isLoading}
            className="w-full p-4 bg-black border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500/50 transition-all text-white placeholder:text-zinc-600 disabled:opacity-50"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />

          {view === 'login' && (
            <>
              <input
                type="password"
                placeholder="Password"
                disabled={isLoading}
                className="w-full p-4 bg-black border border-zinc-800 rounded-2xl outline-none focus:border-cyan-500/50 transition-all text-white placeholder:text-zinc-600 disabled:opacity-50"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required
              />
              <div className="flex justify-end px-1">
                <button 
                  type="button"
                  onClick={() => toggleView('forgot')}
                  className="text-xs font-bold text-zinc-500 hover:text-cyan-400 transition-colors"
                >
                  Lupa password?
                </button>
              </div>
            </>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-white text-black p-4 rounded-2xl font-bold hover:bg-zinc-200 transition-all active:scale-[0.98] disabled:bg-zinc-800 disabled:text-zinc-600 disabled:cursor-not-allowed shadow-lg shadow-white/5"
          >
            {isLoading ? 'Processing...' : (view === 'login' ? 'Sign In' : 'Send Reset Link')}
          </button>
        </form>

        {view === 'login' ? (
          <>
            <div className="relative flex items-center py-8">
              <div className="flex-grow border-t border-zinc-800"></div>
              <span className="flex-shrink mx-4 text-zinc-600 text-[10px] font-bold uppercase tracking-widest">Atau</span>
              <div className="flex-grow border-t border-zinc-800"></div>
            </div>

            <button
              onClick={handleGoogleLogin}
              type="button"
              disabled={isLoading}
              className="w-full flex items-center justify-center gap-3 border border-zinc-800 p-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] text-white"
            >
              <Image src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" alt="G" width={18} height={18} />
              <span>Continue with Google</span>
            </button>

            <p className="mt-8 text-center text-sm text-zinc-500">
              Belum punya akun?{' '}
              <Link href="/auth/register" className="text-white font-bold hover:text-cyan-400 transition-colors">
                Daftar sekarang
              </Link>
            </p>
          </>
        ) : (
          <button 
            onClick={() => toggleView('login')}
            className="w-full mt-8 text-center text-sm text-white font-bold hover:text-cyan-400 transition-colors"
          >
            Kembali ke halaman masuk
          </button>
        )}
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center p-6 bg-black text-white overflow-hidden">
      {/* Reusing the Brand Header Style */}
      <div className="absolute top-0 w-full max-w-6xl flex items-center justify-between p-8 z-20">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center font-bold text-sm shadow-lg shadow-cyan-500/20">
            A
          </div>
          <span className="text-xl font-bold tracking-tight group-hover:text-cyan-400 transition-colors">Auth-Next</span>
        </Link>
      </div>

      <Suspense fallback={<div className="text-zinc-500 font-mono text-xs animate-pulse">LOADING_SYSTEM...</div>}>
        <LoginForm />
      </Suspense>

      {/* Footer Branding */}
      <div className="absolute bottom-8 text-center z-20">
        <p className="text-[10px] font-mono text-zinc-600 uppercase tracking-[0.2em]">
          Secured by MSC Ecosystem • 2026
        </p>
      </div>

      {/* Background Ambience consistent with Homepage */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(circle_at_50%_-10%,#1e293b,transparent_60%)] pointer-events-none" />
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-1/2 bg-[radial-gradient(circle_at_50%_110%,#083344,transparent_50%)] opacity-30 pointer-events-none" />
    </main>
  );
}