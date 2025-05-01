import { useState, useEffect } from 'react';
import '../../styles/category-modal.css';

export default function CategoryModal({ open, onClose, onSubmit, initialData }) {
  const [name, setName] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name);
    } else {
      setName('');
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    onSubmit({ name });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? 'ویرایش دسته‌بندی' : 'افزودن دسته‌بندی'}</h2>
        <div className="modal-content">
          <div className="form-group">
            <label htmlFor="name">نام دسته‌بندی</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">لغو</button>
          <button onClick={handleSubmit} className="submit-button" disabled={!name}>
            {initialData ? 'ویرایش' : 'افزودن'}
          </button>
        </div>
      </div>
    </div>
  );
}