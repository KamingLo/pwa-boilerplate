'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

// Import Server Actions yang sudah kita buat
import { getSession, logoutUser } from '@/app/actions/auth/session';

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
        // Panggil Server Action langsung
        const res = await getSession();
        
        // Cek status keberhasilan langsung dari properti success
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          // Jika status false (misal token kedaluwarsa atau tidak ada sesi), kembali ke login
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
      // Panggil Server Action untuk menghapus sesi/cookie
      const result = await logoutUser();
      
      if (result.success) {
        router.push('/auth/login');
      } else {
        console.error('Gagal keluar dari akun:', result.message);
      }
    } catch (err) {
      console.error('Kesalahan sistem saat keluar:', err);
    }
  };

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-zinc-50 dark:bg-black">
        <p className="text-zinc-500 font-bold animate-pulse">Memuat data...</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-zinc-50 p-4 text-zinc-900 dark:bg-black dark:text-zinc-50 font-sans">
      <div className="mx-auto max-w-md space-y-6">
        <div className="bg-white p-6 rounded-2xl shadow-sm border border-zinc-100 dark:bg-zinc-900 dark:border-zinc-800">
          <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
          <div className="space-y-4">
            <div className="pb-4 border-b border-zinc-50 dark:border-zinc-800">
              <p className="text-xs text-zinc-400 uppercase font-bold mb-1">Email Terdaftar</p>
              <p className="text-lg font-bold">{user?.email || 'Tidak diketahui'}</p>
            </div>
            <div>
              <p className="text-xs text-zinc-400 uppercase font-bold mb-1">User ID</p>
              <p className="text-sm font-mono text-zinc-500 break-all">{user?.id || '-'}</p>
            </div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full bg-red-50 text-red-600 p-4 rounded-xl font-bold border border-red-100 hover:bg-red-100 transition-colors active:scale-[0.98] dark:bg-red-950 dark:border-red-900 dark:text-red-400"
        >
          Keluar dari Akun
        </button>
      </div>
    </main>
  );
}