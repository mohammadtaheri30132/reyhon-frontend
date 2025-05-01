// app/login/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import '../styles/login.css';

export default function Login() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify OTP and Login
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:4545/api/auth/requestOTP', { mobile });
      setStep(2);
    } catch (err) {
      setError('خطا در ارسال OTP');
    }
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4545/api/auth/loginWithOTP', {
        mobile,
        otp,
      });
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('کد OTP نامعتبر است یا منقضی شده است');
    }
  };

  return (
    <div className="login-container">
      <h2>ورود</h2>
      {error && <p className="error">{error}</p>}
      {step === 1 ? (
        <form onSubmit={handleRequestOTP}>
          <div className="form-group">
            <label htmlFor="mobile">شماره موبایل</label>
            <input
              type="text"
              id="mobile"
              value={mobile}
              onChange={(e) => setMobile(e.target.value)}
              required
            />
          </div>
          <button type="submit">دریافت کد OTP</button>
        </form>
      ) : (
        <form onSubmit={handleLogin}>
          <div className="form-group">
            <label htmlFor="otp">کد OTP</label>
            <input
              type="text"
              id="otp"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
            />
          </div>
          <button type="submit">ورود</button>
        </form>
      )}
      <p>
        <a href="/forgot-password">فراموشی رمز عبور</a>
      </p>
    </div>
  );
}