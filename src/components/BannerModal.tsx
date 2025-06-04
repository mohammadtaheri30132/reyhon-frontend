'use client';

import { useState, useEffect } from 'react';
import '../styles/modal.css';

export default function BannerModal({ open, onClose, onSubmit, initialData }) {
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [linkUrl, setLinkUrl] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setImageUrl(initialData.imageUrl || '');
      setLinkUrl(initialData.linkUrl || '');
    } else {
      setTitle('');
      setImageUrl('');
      setLinkUrl('');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ title, imageUrl, linkUrl });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <div className="modal-content">
          <h2>افزودن بنر</h2>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>عنوان</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>آدرس تصویر</label>
              <input
                type="text"
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                required
              />
            </div>
            <div className="form-group">
              <label>آدرس لینک</label>
              <input
                type="text"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                required
              />
            </div>
            <div className="modal-buttons">
              <button type="submit" className="submit-button">
                ایجاد
              </button>
              <button type="button" onClick={onClose} className="cancel-button">
                لغو
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}