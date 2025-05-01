import { useState, useEffect } from 'react';
import '../../styles/post-modal.css';

export default function PostModal({ open, onClose, onSubmit, categories, initialData }) {
  const [title, setTitle] = useState('');
  const [image, setImage] = useState('');
  const [content, setContent] = useState('');
  const [categoryId, setCategoryId] = useState('');

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title);
      setImage(initialData.image);
      setContent(initialData.content);
      setCategoryId(initialData.category);
    } else {
      setTitle('');
      setImage('');
      setContent('');
      setCategoryId('');
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    onSubmit({ title, image, content, categoryId });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? 'ویرایش مطلب' : 'افزودن مطلب'}</h2>
        <div className="modal-content">
          <div className="form-group">
            <label htmlFor="title">عنوان</label>
            <input
              type="text"
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="image">لینک تصویر</label>
            <input
              type="text"
              id="image"
              value={image}
              onChange={(e) => setImage(e.target.value)}
              
            />
          </div>
          <div className="form-group">
            <label htmlFor="content">متن</label>
            <textarea
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={4}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="category">دسته‌بندی</label>
            <select
              id="category"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
            >
              <option value="">انتخاب کنید</option>
              {categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">لغو</button>
          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={!title  || !content || !categoryId}
          >
            {initialData ? 'ویرایش' : 'افزودن'}
          </button>
        </div>
      </div>
    </div>
  );
}