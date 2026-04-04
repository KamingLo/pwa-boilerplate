'use server';

type AuthPayload = Record<string, any>;

export async function sendOtp(payload: AuthPayload) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/otp`, {
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
        message: data?.message || 'Gagal mengirim OTP',
        error: data?.error || null,
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    console.error('Action sendOtp Error:', error);
    return { success: false, message: 'Internal Server Error', status: 500 };
  }
}

// Action untuk Registrasi
export async function registerUser(payload: AuthPayload) {
  try {
    const response = await fetch(`${process.env.BACKEND_URL}/auth/register`, {
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
        message: data?.message || 'Registrasi gagal',
        error: data?.error || null,
        status: response.status,
      };
    }

    return data;
  } catch (error) {
    console.error('Action registerUser Error:', error);
    return { success: false, message: 'Internal Server Error', status: 500 };
  }
}