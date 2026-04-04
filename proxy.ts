import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const { pathname } = request.nextUrl;

  // 1. Tentukan route mana saja yang butuh proteksi (Auth Required)
  const isDashboardPage = pathname.startsWith('/dashboard');
  
  // 2. Tentukan route yang tidak boleh diakses kalau sudah login (Guest Only)
  const isAuthPage = pathname.startsWith('/auth/login') || pathname.startsWith('/auth/register');

  // LOGIKA PROTEKSI:
  
  // Jika mencoba akses dashboard tapi tidak punya token
  if (isDashboardPage && !token) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  // Jika sudah login tapi mencoba ke halaman login/register lagi
  if (isAuthPage && token) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

// Konfigurasi agar middleware hanya berjalan pada route tertentu
// Ini penting untuk performa agar tidak ngecek file static/images
export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/auth/login', 
    '/auth/register'
  ],
};