'use server';

import { cookies } from 'next/headers';

type AuthPayload = Record<string, any>;

export async function loginUser(payload: AuthPayload) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: data?.message || 'Login gagal',
        status: response.status,
      };
    }

    // Pastikan mengambil token sesuai struktur response dari Golang
    const token = data?.data?.token;

    if (!token) {
      return { success: false, message: 'Token tidak ditemukan', status: 401 };
    }

    // Kelola Cookie secara Server-Side
    const cookieStore = await cookies();
    
    // Hapus sisa cookie lama
    cookieStore.delete('auth_token');

    // Set ulang dengan flag HttpOnly yang ketat
    cookieStore.set('auth_token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24, // 1 hari
    });

    return { success: true, message: 'Login berhasil', data: data?.data };
  } catch (error) {
    console.error('Login Action Error:', error);
    return { success: false, message: 'Server Error', status: 500 };
  }
}