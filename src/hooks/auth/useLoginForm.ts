// @/hooks/useAuthForm.ts
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { loginUser } from '@/lib/actions/auth/login';
import { initiateGoogleAuth } from '@/lib/actions/auth/oauth';
import { forgotPassword } from '@/lib/actions/auth/forgot-password';
import { useUserStore } from '@/store/useUserStore';

export const useAuthForm = () => {
  const [view, setView] = useState<'login' | 'forgot'>('login');
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  
  const router = useRouter();
  const setUser = useUserStore((state: any) => state.setUser);

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
      if (result.success) {
        setUser(result.data); // Simpan ke Zustand
        router.push('/dashboard');
      } else {
        setErrorMessage(result.message || 'Email atau password salah');
      }
    } catch (error) {
      setErrorMessage('Terjadi kesalahan sistem');
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      const result = await initiateGoogleAuth('web');
      if (result.success && result.data?.data?.url) {
        window.location.href = result.data.data.url;
      } else {
        setErrorMessage(result.message || 'Gagal inisiasi Google');
      }
    } catch (error) {
      setErrorMessage('Kesalahan sistem Google');
    } finally {
      setIsLoading(false);
    }
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    try {
      const result = await forgotPassword(formData.email);
      if (result.success) {
        setSuccessMessage('Tautan reset telah dikirim.');
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

  return {
    view, formData, setFormData, isLoading, errorMessage, successMessage,
    toggleView, handleManualLogin, handleGoogleLogin, handleForgotPassword
  };
};