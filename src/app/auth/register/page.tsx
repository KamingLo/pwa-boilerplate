'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { sendOtp, registerUser } from '@/app/actions/auth/register';

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

  // State baru untuk mengelola notifikasi (error atau success)
  const [notification, setNotification] = useState<{ type: 'error' | 'success', text: string } | null>(null);

  // Efek untuk menghilangkan notifikasi secara otomatis setelah 5 detik
  useEffect(() => {
    if (notification) {
      const timer = setTimeout(() => {
        setNotification(null);
      }, 5000);
      
      // Bersihkan timer jika komponen di-unmount atau notifikasi berubah
      return () => clearTimeout(timer);
    }
  }, [notification]);

  const handleRequestOTP = async () => {
    if (!formData.email) {
      setNotification({ type: 'error', text: 'Masukkan email terlebih dahulu' });
      return;
    }
    
    setLoadingOTP(true);
    setNotification(null); // Reset notifikasi sebelumnya
    
    try {
      const result = await sendOtp({ email: formData.email });
      
      if (!result.success) {
        // Tampilkan result.error (pesan spesifik) jika ada, jika tidak gunakan result.message
        setNotification({ 
          type: 'error', 
          text: result.error || result.message || 'Gagal mengirim OTP' 
        });
        return;
      }
      
      setNotification({ type: 'success', text: 'Kode OTP telah dikirim ke email Anda' });
    } catch (error) {
      setNotification({ type: 'error', text: 'Terjadi kesalahan sistem saat mengirim OTP' });
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
          text: result.error || result.message || 'Registrasi gagal, silakan cek kembali data Anda' 
        });
        return;
      }

      setNotification({ type: 'success', text: 'Registrasi berhasil! Mengalihkan...' });
      
      // Beri sedikit waktu agar user bisa membaca pesan sukses sebelum dialihkan
      setTimeout(() => {
        router.push('/auth/login');
      }, 1500);

    } catch (error) {
      setNotification({ type: 'error', text: 'Terjadi kesalahan sistem saat registrasi' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-black font-sans">
      <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
        
        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">
            Daftar Akun
          </h1>
          <p className="text-sm text-zinc-500 dark:text-zinc-400">
            Lengkapi data untuk membuat akun baru
          </p>
        </div>

        {/* --- KOMPONEN NOTIFIKASI --- */}
        {notification && (
          <div className={`p-4 rounded-2xl border text-sm font-bold text-center transition-all animate-in fade-in slide-in-from-top-2 ${
            notification.type === 'error' 
              ? 'bg-red-50 border-red-100 text-red-600 dark:bg-red-950/30 dark:border-red-900/50 dark:text-red-400' 
              : 'bg-green-50 border-green-100 text-green-600 dark:bg-green-950/30 dark:border-green-900/50 dark:text-green-400'
          }`}>
            {notification.text}
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          {/* Input Email & Tombol OTP */}
          <div className="space-y-2">
            <input
              type="email"
              placeholder="Email"
              className="w-full p-4 border border-zinc-200 rounded-2xl outline-none focus:border-zinc-900 transition-colors dark:bg-black dark:border-zinc-700 dark:focus:border-zinc-50"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              required
            />
            <button
              type="button"
              onClick={handleRequestOTP}
              disabled={loadingOTP}
              className="w-full text-xs font-bold uppercase text-zinc-600 border border-zinc-200 p-2 rounded-xl hover:bg-zinc-50 transition-colors dark:border-zinc-700 dark:text-zinc-400 dark:hover:bg-zinc-800"
            >
              {loadingOTP ? 'Mengirim...' : 'Minta Kode OTP'}
            </button>
          </div>

          {/* Input Username */}
          <input
            type="text"
            placeholder="Username"
            className="w-full p-4 border border-zinc-200 rounded-2xl outline-none focus:border-zinc-900 transition-colors dark:bg-black dark:border-zinc-700 dark:focus:border-zinc-50"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />

          {/* Input Kode OTP */}
          <input
            type="text"
            inputMode="numeric"
            maxLength={6}
            placeholder="6 Digit Kode OTP"
            className="w-full p-4 border border-zinc-200 rounded-2xl outline-none focus:border-zinc-900 transition-colors text-center font-bold dark:bg-black dark:border-zinc-700 dark:focus:border-zinc-50"
            value={formData.otp_code}
            onChange={(e) => {
              const val = e.target.value.slice(0, 6);
              setFormData({ ...formData, otp_code: val });
            }}
            required
          />

          {/* Input Password */}
          <input
            type="password"
            placeholder="Password"
            className="w-full p-4 border border-zinc-200 rounded-2xl outline-none focus:border-zinc-900 transition-colors dark:bg-black dark:border-zinc-700 dark:focus:border-zinc-50"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-zinc-950 text-white p-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:bg-zinc-300 dark:bg-zinc-50 dark:text-black dark:hover:bg-zinc-200"
          >
            {isLoading ? 'Memproses...' : 'Daftar Sekarang'}
          </button>
        </form>

        {/* Footer Link */}
        <p className="text-center text-sm text-zinc-500">
          Sudah punya akun?{' '}
          <a href="/auth/login" className="text-zinc-950 font-bold hover:underline dark:text-zinc-50">
            Masuk
          </a>
        </p>
      </div>
    </main>
  );
}