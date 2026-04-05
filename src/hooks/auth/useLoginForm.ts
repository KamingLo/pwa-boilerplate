// @/hooks/auth/useLoginForm.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/actions/auth/login';
import { initiateGoogleAuth } from '@/lib/actions/auth/oauth';
import { forgotPassword } from '@/lib/actions/auth/forgot-password';
import { getSession } from '@/lib/actions/auth/session'; // Pastikan ini mengembalikan data user
import { useUserStore } from '@/store/useUserStore';

export const useAuthForm = () => {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const router = useRouter();
  
  // Mengambil action dari store
  const setUser = useUserStore((state) => state.setUser);
  const setLoadingStore = useUserStore((state) => state.setLoading);

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
      // 1. Proses Login untuk mendapatkan JWT (disimpan di Cookie oleh Server Action)
      const result = await loginUser(formData);
      
      if (result.success) {
        // 2. Karena hanya dapat JWT, kita perlu ambil data profil user sekarang
        // agar Zustand langsung terisi sebelum pindah halaman
        const session = await getSession();
        
        if (session.success && session.data) {
          setUser(session.data); // Simpan data user asli (id, email, name) ke Zustand
          setLoadingStore(false);
          router.push('/dashboard');
        } else {
          setErrorMessage('Gagal mengambil profil akun. Silakan coba masuk kembali.');
        }
      } else {
        setErrorMessage(result.message || 'Email atau password salah');
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan sistem saat mencoba masuk');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    if (isLoading) return;
    setIsLoading(true);
    setErrorMessage(null);

    try {
      const result = await initiateGoogleAuth('web');
      if (result.success && result.data?.data?.url) {
        // Redirect ke Google tidak memerlukan set state user 
        // karena session akan dicek ulang di dashboard setelah redirect balik
        window.location.href = result.data.data.url;
      } else {
        setErrorMessage(result.message || 'Gagal menghubungi server Google');
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan sistem saat inisiasi Google');
    } finally {
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
        setSuccessMessage('Tautan pemulihan telah dikirim ke email Anda.');
        setFormData({ ...formData, email: '' });
      } else {
        setErrorMessage(result.message || 'Email tidak ditemukan');
      }
    } catch (error) {
      setErrorMessage('Gagal menghubungi server pemulihan.');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    view,
    formData,
    setFormData,
    isLoading,
    errorMessage,
    successMessage,
    toggleView,
    handleManualLogin,
    handleGoogleLogin,
    handleForgotPassword
  };
};