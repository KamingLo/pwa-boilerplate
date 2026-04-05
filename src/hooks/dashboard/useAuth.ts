// @/hooks/dashboard/useAuth.ts
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getSession, logoutUser } from '@/lib/actions/auth/session';
import { useUserStore } from '@/store/useUserStore';

export const useAuth = () => {
  const router = useRouter();
  const { user, loading, setUser, setLoading, clearUser } = useUserStore();

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
        router.push('/auth/login');
      } finally {
        setLoading(false);
      }
    };

    if (!user) fetchUser();
  }, [router, setUser, setLoading, user]);

  const handleLogout = async () => {
    const result = await logoutUser();
    if (result.success) {
      clearUser();
      router.push('/auth/login');
    }
  };

  return { user, loading, handleLogout };
};