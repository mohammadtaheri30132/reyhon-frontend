import { useState, useEffect } from 'react';
import moment from 'moment-jalaali';
import '../../styles/event-modal.css';

moment.loadPersian({ dialect: 'persian-modern' });

export default function EventModal({ open, onClose, onSubmit, initialData }) {
  const [content, setContent] = useState('');
  const [date, setDate] = useState('');
  const [calendarType, setCalendarType] = useState('shamsi');

  useEffect(() => {
    if (initialData) {
      setContent(initialData.content);
      setDate(initialData.date);
      setCalendarType(initialData.calendarType);
    } else {
      setContent('');
      setDate('');
      setCalendarType('shamsi');
    }
  }, [initialData, open]);

  const handleSubmit = () => {
    onSubmit({ content, date, calendarType });
  };

  if (!open) return null;

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>{initialData ? 'ویرایش رویداد' : 'افزودن رویداد'}</h2>
        <div className="modal-content">
          <div className="form-group">
            <label htmlFor="content">متن رویداد</label>
            <input
              type="text"
              id="content"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="calendarType">نوع تقویم</label>
            <select
              id="calendarType"
              value={calendarType}
              onChange={(e) => setCalendarType(e.target.value)}
            >
              <option value="shamsi">شمسی</option>
              <option value="miladi">میلادی</option>
              <option value="qamari">قمری</option>
            </select>
          </div>
          <div className="form-group">
            <label htmlFor="date">تاریخ (مثال: 1403-07-20)</label>
            <input
              type="text"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder={
                calendarType === 'shamsi'
                  ? '1403-07-20'
                  : calendarType === 'miladi'
                  ? '2024-10-11'
                  : '1446-04-15'
              }
              required
            />
          </div>
        </div>
        <div className="modal-actions">
          <button onClick={onClose} className="cancel-button">لغو</button>
          <button
            onClick={handleSubmit}
            className="submit-button"
            disabled={!content || !date}
          >
            {initialData ? 'ویرایش' : 'افزودن'}
          </button>
        </div>
      </div>
    </div>
  );
}