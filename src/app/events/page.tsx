'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import EventModal from '../../components/EventModal';
import { getEvents, createEvent, updateEvent, deleteEvent } from '../../utils/api';
import '../../styles/events.css';

export default function Events() {
  const [events, setEvents] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [page, setPage] = useState(1); // صفحه فعلی
  const [totalPages, setTotalPages] = useState(1); // تعداد کل صفحات
  const [limit] = useState(20); // تعداد رویداد در هر صفحه

  const fetchEvents = async (page = 1) => {
    try {
      const { data } = await getEvents({ page, limit }); // ارسال page و limit به صورت مستقیم
      setEvents(data.events);
      setTotalPages(data.totalPages);
      setPage(data.currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEvents(page);
  }, [page]);

  const handleOpenModal = (event = null) => {
    setSelectedEvent(event);
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
    setSelectedEvent(null);
  };

  const handleSubmit = async (data) => {
    try {
      if (selectedEvent) {
        await updateEvent(selectedEvent._id, data);
      } else {
        await createEvent(data);
      }
      fetchEvents(page); // به‌روزرسانی لیست پس از ثبت/ویرایش
      handleCloseModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteEvent(id);
      fetchEvents(page); // به‌روزرسانی لیست پس از حذف
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
    <div className="events-container">
      <Header />
      <div className="events-content">
        <h2>مدیریت رویدادها</h2>
        <button onClick={() => handleOpenModal()} className="add-button">
          افزودن رویداد
        </button>
        <table className="events-table">
          <thead>
            <tr>
              <th>متن</th>
              <th>تاریخ</th>
              <th>نوع تقویم</th>
              <th>عملیات</th>
            </tr>
          </thead>
          <tbody>
            {events.map((event) => (
              <tr key={event._id}>
                <td>{event.content}</td>
                <td>{event.date}</td>
                <td>
                  {event.calendarType === 'shamsi'
                    ? 'شمسی'
                    : event.calendarType === 'miladi'
                    ? 'میلادی'
                    : 'قمری'}
                </td>
                <td>
                  <button onClick={() => handleOpenModal(event)} className="edit-button">
                    ویرایش
                  </button>
                  <button onClick={() => handleDelete(event._id)} className="delete-button">
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

        {openModal && (
          <EventModal
            open={openModal}
            onClose={handleCloseModal}
            onSubmit={handleSubmit}
            initialData={selectedEvent}
          />
        )}
      </div>
    </div>
  );
}