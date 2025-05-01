'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Header from '../../components/Header';
import {
  getMainCategories,
  createMainCategory,
  updateMainCategory,
  deleteMainCategory,
} from '../../utils/api';
import '../../styles/main-categories.css';

export default function MainCategories() {
  const [mainCategories, setMainCategories] = useState([]);
  const [page, setPage] = useState(1); // صفحه فعلی
  const [totalPages, setTotalPages] = useState(1); // تعداد کل صفحات
  const [limit] = useState(20); // تعداد سر دسته در هر صفحه
  const router = useRouter();

  const fetchMainCategories = async (page = 1) => {
    try {
      const { data } = await getMainCategories({ page, limit }); // ارسال پارامترهای پیجینیشن
      setMainCategories(data.mainCategories);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchMainCategories(page);
  }, [page]);

  const handleAdd = async () => {
    const name = prompt('نام سر دسته:');
    const image = prompt('لینک تصویر:');
    if (name && image) {
      try {
        await createMainCategory({ name, image });
        fetchMainCategories(page); // به‌روزرسانی لیست
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleEdit = async (id) => {
    const mainCategory = mainCategories.find((mc) => mc._id === id);
    const name = prompt('نام جدید:', mainCategory.name);
    const image = prompt('لینک تصویر جدید:', mainCategory.image);
    if (name && image) {
      try {
        await updateMainCategory(id, { name, image });
        fetchMainCategories(page); // به‌روزرسانی لیست
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteMainCategory(id);
      fetchMainCategories(page); // به‌روزرسانی لیست
    } catch (err) {
      console.error(err);
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="main-categories-container">
      <Header />
      <div className="main-categories-content">
        <h2>مدیریت سر دسته‌ها</h2>
        <button onClick={handleAdd} className="add-button">
          افزودن سر دسته
        </button>
        <table className="main-categories-table">
          <thead>
            <tr>
              <th>نام</th>
              <th>تصویر</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {mainCategories.map((mc) => (
              <tr
                key={mc._id}
                onClick={() => router.push(`/main-categories/${mc._id}`)}
                className="clickable-row"
              >
                <td>{mc.name}</td>
                <td>
                  <img src={mc.image} alt={mc.name} className="category-image" />
                </td>
                <td>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEdit(mc._id);
                    }}
                    className="edit-button"
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(mc._id);
                    }}
                    className="delete-button"
                  >
                    حذف
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* کنترل‌های پیجینیشن */}
        <div className="pagination">
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
            className="pagination-button"
          >
            قبلی
          </button>
          <span>
            صفحه {page} از {totalPages}
          </span>
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
            className="pagination-button"
          >
            بعدی
          </button>
        </div>
      </div>
    </div>
  );
}