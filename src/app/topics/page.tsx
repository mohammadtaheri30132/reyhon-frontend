'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { getAllTopicsAdmin, deleteTopicAdmin } from '../../utils/api';
import '../../styles/topics.css';

export default function Topics() {
  const [topics, setTopics] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  const fetchTopics = async (pageNum = 1) => {
    try {
      const { data } = await getAllTopicsAdmin({ page: pageNum, limit });
      setTopics(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.currentPage);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTopics(page);
  }, [page]);

  const handleDelete = async (topicId) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این تاپیک را حذف کنید؟')) {
      try {
        await deleteTopicAdmin(topicId);
        fetchTopics(page);
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
        <h2>مدیریت تاپیک‌ها</h2>
        {loading ? (
          <p>در حال بارگذاری...</p>
        ) : topics.length > 0 ? (
          <table className="details-table">
            <thead>
              <tr>
                <th>عنوان</th>
                <th>تعداد کامنت‌ها</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {topics.map((topic) => (
                <tr key={topic._id}>
                  <td>{topic.title}</td>
                  <td>{topic.commentCount || 0}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(topic._id)}
                      className="delete-button"
                    >
                      حذف
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        ) : (
          <p>هیچ تاپیکی یافت نشد.</p>
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