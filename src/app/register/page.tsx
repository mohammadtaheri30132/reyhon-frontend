// app/register/page.tsx
'use client';

import { useState } from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';
import '../styles/register.css';

export default function Register() {
  const [mobile, setMobile] = useState('');
  const [otp, setOtp] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [step, setStep] = useState(1); // Step 1: Request OTP, Step 2: Verify OTP and Register
  const [error, setError] = useState('');
  const router = useRouter();

  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post('http://193.242.208.20:1128/api/auth/request-otp', { mobile });
      setStep(2);
    } catch (err) {
      setError('خطا در ارسال OTP');
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://193.242.208.20:1128/api/auth/registerWithOTP', {
        mobile,
        otp,
        firstName,
        lastName,
      });
      localStorage.setItem('token', response.data.token);
      router.push('/dashboard');
    } catch (err) {
      setError('کد OTP نامعتبر است یا منقضی شده است');
    }
  };

  return (
    <div className="register-container">
      <h2>ثبت‌نام</h2>
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
        <form onSubmit={handleRegister}>
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
          <div className="form-group">
            <label htmlFor="firstName">نام</label>
            <input
              type="text"
              id="firstName"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="lastName">نام خانوادگی</label>
            <input
              type="text"
              id="lastName"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              required
            />
          </div>
          <button type="submit">ثبت‌نام</button>
        </form>
      )}
    </div>
  );
}