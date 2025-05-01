'use client';

import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import '../../styles/dashboard.css';

export default function Dashboard() {
  const router = useRouter();

  return (
    <div className="dashboard-container">
      <Header />
      <div className="dashboard-content">
        <h2>داشبورد ادمین</h2>
        <div className="dashboard-cards">
          <div className="card">
            <h3>رویدادها</h3>
            <button onClick={() => router.push('/events')} className="card-button">
              مدیریت رویدادها
            </button>
          </div>
          <div className="card">
            <h3>سر دسته‌ها</h3>
            <button onClick={() => router.push('/main-categories')} className="card-button">
              مدیریت سر دسته‌ها
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}