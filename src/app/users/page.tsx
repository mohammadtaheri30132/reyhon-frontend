'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { getAllUsersAdmin, deleteUserAdmin } from '../../utils/api';
import '../../styles/users.css';

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  const fetchUsers = async (pageNum = 1) => {
    try {
      const { data } = await getAllUsersAdmin({ page: pageNum, limit });
        setUsers(data.data || []);
        setTotalPages(data?.pagination?.totalPages||[]);
        setPage(data?.pagination?.currentPage||[]);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers(page);
  }, [page]);

  const handleDelete = async (userId) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این کاربر را حذف کنید؟')) {
      try {
        await deleteUserAdmin(userId);
        fetchUsers(page);
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  return (
    <div className="main-category-details-container">
      <Header />
      <div className="main-category-details-content">
        <h2>مدیریت کاربران</h2>
        {loading ? (
          <p>در حال بارگذاری...</p>
        ) : users.length > 0 ? (
          <table className="details-table">
            <thead>
              <tr>
                <th>نام</th>
                <th>نام خانوادگی</th>
                <th>موبایل</th>
                <th>نقش</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user._id}>
                  <td>{user.firstName}</td>
                  <td>{user.lastName}</td>
                  <td>{user.mobile}</td>
                  <td>{user.role}</td>
                  <td>
                    {user.role!='admin'&&(
                           <button
                           onClick={() => handleDelete(user._id)}
                           className="delete-button"
                         >
                           حذف
                         </button>
                    )}
                 
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>هیچ کاربری یافت نشد.</p>
        )}
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