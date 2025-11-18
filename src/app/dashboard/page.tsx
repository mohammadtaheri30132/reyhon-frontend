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
            <h3>پست ها</h3>
            <button onClick={() => router.push('/posts')} className="card-button">
                مدیریت تمامی پست ها یکجا
            </button>
          </div>
            <div className="card">
            <h3>سر دسته‌ها</h3>
            <button onClick={() => router.push('/main-categories')} className="card-button">
              مدیریت سر دسته‌ها
            </button>
          </div>
             <div className="card">
            <h3>کاربرها</h3>
            <button onClick={() => router.push('/users')} className="card-button">
              مدیریت کاربرها
            </button>
          </div>
           <div className="card">
            <h3>استوری</h3>
            <button onClick={() => router.push('/stories')} className="card-button">
              مدیریت استوری
            </button>
          </div>
          <div className="card">
            <h3>رویدادها</h3>
            <button onClick={() => router.push('/events')} className="card-button">
              مدیریت رویدادها
            </button>
          </div>
       
         
        
          <div className="card">
            <h3>بنرها</h3>
            <button onClick={() => router.push('/banners')} className="card-button">
              مدیریت بنرها
            </button>
          </div>
          <div className="card">
            <h3>نظرات</h3>
            <button onClick={() => router.push('/comments')} className="card-button">
              مدیریت نظرات
            </button>
          </div>
          <div className="card">
            <h3>تاپیک‌ها</h3>
            <button onClick={() => router.push('/topics')} className="card-button">
              مدیریت تاپیک‌ها
            </button>
          </div>
        
        </div>
      </div>
    </div>
  );
}