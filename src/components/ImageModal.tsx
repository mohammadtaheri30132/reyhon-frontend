import { useState, useEffect } from 'react';
import { uploadImage, getImages, deleteImage } from '../utils/api';
import '../styles/image-modal.css';
import { Input } from '@mui/material';

export default function ImageModal({ open, onClose, fetchImages }) {
  const [file, setFile] = useState(null);
  const [progress, setProgress] = useState(0);
  const [uploading, setUploading] = useState(false);
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);

  const fetchModalImages = async (page = 1) => {
    try {
      const { data } = await getImages({ page, limit });
      setImages(data.images);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (open) {
      fetchModalImages(page);
    }
  }, [open, page]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    setProgress(0);
  };

  const handleUpload = async () => {
    if (!file) return;

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append('image', file);

      await uploadImage(formData, {
        onUploadProgress: (progressEvent) => {
          const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          setProgress(percent);
        },
      });

      fetchModalImages(page);
      fetchImages();
      setFile(null);
      setProgress(0);
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteImage(id);
      fetchModalImages(page);
      fetchImages();
    } catch (err) {
      console.error(err);
    }
  };

  const handleCopyLink = (url) => {
    // روش اصلی با Clipboard API
    if (navigator.clipboard && window.isSecureContext) {
      navigator.clipboard.writeText(url)
        .then(() => {
          alert('لینک کپی شد!');
        })
        .catch((err) => {
          console.error('Clipboard API failed:', err);
          fallbackCopyText(url);
        });
    } else {
      // در صورت عدم پشتیبانی یا ناامن بودن
      fallbackCopyText(url);
    }
  };
  
  // روش جایگزین برای کپی کردن
  const fallbackCopyText = (text) => {
    try {
      // ایجاد یک textarea موقت
      const textArea = document.createElement('textarea');
      textArea.value = text;
      textArea.style.position = 'fixed'; // جلوگیری از اسکرول به textarea
      textArea.style.opacity = '0'; // مخفی کردن
      document.body.appendChild(textArea);
      textArea.focus();
      textArea.select();
  
      // اجرای کپی
      document.execCommand('copy');
      document.body.removeChild(textArea);
      alert('لینک کپی شد!');
    } catch (err) {
      console.error('Fallback copy failed:', err);
      alert('کپی کردن 실패 کرد. لطفاً لینک را دستی کپی کنید.');
    }
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };

  if (!open) return null;

  return (
    <div className="image-modal-overlay">
      <div className="image-modal">
        <button className="close-button" onClick={onClose}>
          ×
        </button>
        <div className="image-modal-content">
          <div className="upload-section">
            <h3>آپلود تصویر</h3>
            <input
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              disabled={uploading}
            />
            {file && (
              <div className="progress-bar">
                <div
                  className="progress"
                  style={{ width: `${progress}%` }}
                >{`${progress}%`}</div>
              </div>
            )}
            <button
              onClick={handleUpload}
              disabled={!file || uploading}
              className="upload-button"
            >
              {uploading ? 'در حال آپلود...' : 'آپلود'}
            </button>
          </div>
          <div className="image-list">
            <h3>لیست تصاویر</h3>
            <div className="image-grid">
              {images.map((image) => (
                <div key={image._id} className="image-item">
                  <img src={image.url} alt={image.originalName} />
                  <div className="image-info">
                    <Input value={image.url} multiline contentEditable={false}/>
                    <button
                      onClick={() => handleCopyLink(image.url)}
                      className="copy-button"
                    >
                      کپی لینک
                    </button>
                    <button
                      onClick={() => handleDelete(image._id)}
                      className="delete-button"
                    >
                      حذف
                    </button>
                  </div>
                </div>
              ))}
            </div>
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
      </div>
    </div>
  );
}