'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import { getAllCommentsAdmin, deleteCommentAdmin } from '../../utils/api';
import '../../styles/comments.css';

export default function Comments() {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  const fetchComments = async (pageNum = 1) => {
    try {
      const { data } = await getAllCommentsAdmin({ page: pageNum, limit });
      setComments(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.currentPage);
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchComments(page);
  }, [page]);

  const handleDelete = async (commentId) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این نظر را حذف کنید؟')) {
      try {
        await deleteCommentAdmin(commentId);
        fetchComments(page);
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
        <h2>مدیریت نظرات</h2>
        {loading ? (
          <p>در حال بارگذاری...</p>
        ) : comments.length > 0 ? (
          <table className="details-table">
            <thead>
              <tr>
                <th>متن</th>
                <th>کاربر</th>
                <th>عملیات</th>
              </tr>
            </thead>
            <tbody>
              {comments.map((comment) => (
                <tr key={comment._id}>
                  <td>{comment.text}</td>
                  <td>
                    {comment.user.firstName} {comment.user.lastName}
                  </td>
                  <td>
                    <button
                      onClick={() => handleDelete(comment._id)}
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
          <p>هیچ نظری یافت نشد.</p>
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