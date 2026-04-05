'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { resetPasswordAction } from '@/lib/actions/auth/reset-password';

function ResetPasswordForm() {
  const [passwords, setPasswords] = useState({ new: '', confirm: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'error' | 'success'; text: string } | null>(null);

  const router = useRouter();
  const searchParams = useSearchParams();
  
  const email = searchParams.get('email') || '';
  const token = searchParams.get('token') || '';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (isLoading) return;

    if (passwords.new !== passwords.confirm) {
      setMessage({ type: 'error', text: 'Konfirmasi kata sandi tidak cocok' });
      return;
    }

    setIsLoading(true);
    setMessage(null);

    const result = await resetPasswordAction({
      email,
      token,
      new_password: passwords.new,
    });

    if (result.success) {
      setMessage({ type: 'success', text: result.message });
      setTimeout(() => router.push('/auth/login'), 3000);
    } else {
      setMessage({ type: 'error', text: result.message });
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-sm space-y-8 bg-white p-8 rounded-3xl shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold text-zinc-900 dark:text-zinc-50">Kata Sandi Baru</h1>
        <p className="text-sm text-zinc-500 dark:text-zinc-400">Buat kata sandi yang kuat untuk akun kamu</p>
      </div>

      {message && (
        <div className={`p-4 rounded-2xl border ${
          message.type === 'error' 
            ? 'bg-red-50 border-red-100 dark:bg-red-950/30 dark:border-red-900/50' 
            : 'bg-emerald-50 border-emerald-100 dark:bg-emerald-950/30 dark:border-emerald-900/50'
        }`}>
          <p className={`text-sm font-bold text-center ${
            message.type === 'error' ? 'text-red-600 dark:text-red-400' : 'text-emerald-600 dark:text-emerald-400'
          }`}>
            {message.text}
          </p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="password"
          placeholder="Kata sandi baru"
          className="w-full p-4 border border-zinc-200 rounded-2xl outline-none focus:border-zinc-900 transition-colors dark:bg-black dark:border-zinc-700 dark:focus:border-zinc-50 disabled:opacity-50"
          value={passwords.new}
          onChange={(e) => setPasswords({ ...passwords, new: e.target.value })}
          required
          minLength={8}
        />
        <input
          type="password"
          placeholder="Konfirmasi kata sandi baru"
          className="w-full p-4 border border-zinc-200 rounded-2xl outline-none focus:border-zinc-900 transition-colors dark:bg-black dark:border-zinc-700 dark:focus:border-zinc-50 disabled:opacity-50"
          value={passwords.confirm}
          onChange={(e) => setPasswords({ ...passwords, confirm: e.target.value })}
          required
        />

        <button
          type="submit"
          disabled={isLoading || !token}
          className="w-full bg-zinc-950 text-white p-4 rounded-2xl font-bold hover:bg-zinc-800 transition-all active:scale-[0.98] disabled:bg-zinc-300 dark:bg-zinc-50 dark:text-black dark:disabled:bg-zinc-800"
        >
          {isLoading ? 'Memperbarui...' : 'Simpan Kata Sandi'}
        </button>
      </form>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <main className="flex min-h-screen items-center justify-center p-4 bg-zinc-50 dark:bg-black font-sans">
      <Suspense fallback={<div className="text-zinc-500">Memuat...</div>}>
        <ResetPasswordForm />
      </Suspense>
    </main>
  );
}