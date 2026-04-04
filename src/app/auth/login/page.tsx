'use client';

import { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

// 1. Import Server Actions
import { loginUser } from '@/app/actions/auth/login';
import { initiateGoogleAuth } from '@/app/actions/auth/oauth';

function LoginForm() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    const errorParam = searchParams.get('error');
    if (errorParam === 'user_not_registered') {
      setErrorMessage('Akun Google kamu belum terdaftar. Silakan daftar terlebih dahulu.');
    } else if (errorParam === 'google_auth_failed') {
      setErrorMessage('Gagal melakukan autentikasi dengan Google.');
    }
  }, [searchParams]);

  const handleManualLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return; // Prevent double submission
    
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await loginUser(formData);
      
      if (!result.success) {
        setErrorMessage(result.message || 'Email atau password salah');
        setIsLoading(false); // Set false di sini jika gagal agar tombol aktif kembali
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

  return (
    <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Masuk</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">
          Gunakan akun Universitas Tarumanagara kamu
        </p>
      </div>

      {errorMessage && (
        <div className="p-4 bg-red-50 border border-red-100 rounded-2xl dark:bg-red-950/30 dark:border-red-900/50">
          <p className="text-sm text-red-600 dark:text-red-400 font-bold text-center">
            {errorMessage}
          </p>
        </div>
      )}

      <form onSubmit={handleManualLogin} className="space-y-4">
        <div className="space-y-1">
          <input
            type="email"
            placeholder="Email"
            disabled={isLoading}
            className="w-full p-4 border border-zinc-200 rounded-2xl outline-none focus:border-zinc-900 transition-colors dark:bg-black dark:border-zinc-700 dark:focus:border-zinc-50 disabled:opacity-50"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
        </div>
        <div className="space-y-1">
          <input
            type="password"
            placeholder="Password"
            disabled={isLoading}
            className="w-full p-4 border border-zinc-200 rounded-2xl outline-none focus:border-zinc-900 transition-colors dark:bg-black dark:border-zinc-700 dark:focus:border-zinc-50 disabled:opacity-50"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-zinc-950 text-white p-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:bg-zinc-300 disabled:scale-100 disabled:cursor-not-allowed dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200 dark:disabled:bg-zinc-800 dark:disabled:text-zinc-500"
        >
          {isLoading ? 'Memproses...' : 'Masuk'}
        </button>
      </form>

      <div className="relative flex items-center py-2">
        <div className="flex-grow border-t border-zinc-100 dark:border-zinc-800"></div>
        <span className="flex-shrink mx-4 text-zinc-400 text-xs font-bold uppercase">Atau</span>
        <div className="flex-grow border-t border-zinc-100 dark:border-zinc-800"></div>
      </div>

      <button
        onClick={handleGoogleLogin}
        type="button"
        disabled={isLoading}
        className="w-full flex items-center justify-center gap-3 border border-zinc-200 p-4 rounded-2xl font-bold hover:bg-zinc-50 transition-colors active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed disabled:scale-100 dark:border-zinc-700 dark:hover:bg-zinc-800"
      >
        <Image 
          src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" 
          alt="Google Logo" 
          width={20} 
          height={20} 
          className={isLoading ? 'grayscale opacity-50' : ''}
        />
        <span className="text-zinc-900 dark:text-zinc-50">
          {isLoading ? 'Menghubungkan...' : 'Masuk dengan Google'}
        </span>
      </button>

      <p className="text-center text-sm text-zinc-500">
        Belum punya akun?{' '}
        {isLoading ? (
          <span className="text-zinc-300 font-bold dark:text-zinc-700 cursor-not-allowed">
            Daftar sekarang
          </span>
        ) : (
          <Link href="/auth/register" className="text-zinc-950 font-bold hover:underline dark:text-zinc-50">
            Daftar sekarang
          </Link>
        )}
      </p>
    </div>
  );
}

export default function LoginPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-black font-sans">
      <Suspense fallback={<div className="text-zinc-500">Memuat...</div>}>
        <LoginForm />
      </Suspense>
    </main>
  );
}