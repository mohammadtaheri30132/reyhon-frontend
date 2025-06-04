'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import BannerModal from '../../components/BannerModal';
import { getBanners, createBanner, deleteBanner } from '../../utils/api';
import '../../styles/banners.css';

export default function Banners() {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
  const [openBannerModal, setOpenBannerModal] = useState(false);

  const fetchBanners = async (pageNum = 1) => {
    try {
      const { data } = await getBanners({ page: pageNum, limit });
      setBanners(data.data);
      setTotalPages(data.pagination.totalPages);
      setPage(data.pagination.currentPage);
      setLoading(false);
    } catch (err) {
      console.error('Error fetching banners:', err);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners(page);
  }, [page]);

  const handleOpenBannerModal = () => {
    setOpenBannerModal(true);
  };

  const handleCloseBannerModal = () => {
    setOpenBannerModal(false);
  };

  const handleBannerSubmit = async (data) => {
    try {
      await createBanner(data);
      fetchBanners(page);
      handleCloseBannerModal();
    } catch (err) {
      console.error('Error creating banner:', err);
    }
  };

  const handleDelete = async (bannerId) => {
    if (confirm('آیا مطمئن هستید که می‌خواهید این بنر را حذف کنید؟')) {
      try {
        await deleteBanner(bannerId);
        fetchBanners(page);
      } catch (err) {
        console.error('Error deleting banner:', err);
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
        <h2>مدیریت بنرها</h2>
        <div className="tab-content">
          <button onClick={() => handleOpenBannerModal()} className="add-button">
            افزودن بنر
          </button>
          {loading ? (
            <p>در حال بارگذاری...</p>
          ) : banners.length > 0 ? (
            <table className="details-table">
              <thead>
                <tr>
                  <th>عنوان</th>
                  <th>آدرس تصویر</th>
                  <th>آدرس لینک</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {banners.map((banner) => (
                  <tr key={banner._id}>
                    <td>{banner.title}</td>
                    <td>
                       <img src={banner.imageUrl} alt={banner.title} className="banner-image" style={{width:'200px'}} />
                   </td>
                    <td>{banner.linkUrl}</td>
                    <td>
                      <button
                        onClick={() => handleDelete(banner._id)}
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
            <p>هیچ بنری یافت نشد.</p>
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
          <BannerModal
            open={openBannerModal}
            onClose={handleCloseBannerModal}
            onSubmit={handleBannerSubmit}
            initialData={null}
          />
        </div>
      </div>
    </div>
  );
}