import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:4545/api', // آدرس بک‌اند
});

// افزودن interceptor برای درخواست‌ها
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// افزودن interceptor برای مدیریت پاسخ‌ها و خطاها
api.interceptors.response.use(
  (response) => response, // پاسخ موفق مستقیم برگردانده می‌شود
  (error) => {
    if (error.response) {
      // خطای 401: توکن نامعتبر یا منقضی شده
      if (error.response.status === 401) {
        localStorage.removeItem('token'); // پاک کردن توکن
        window.location.href = '/'; // هدایت به صفحه اصلی
      }
      // خطای 500: مشکل سرور
      else if (error.response.status === 500) {
        alert('مشکل پیش آمد. لطفاً به پشتیبانی گزارش دهید.');
      }
    }
    return Promise.reject(error); // ارور را به caller برگردان
  }
);

export const login = (username, password) =>
  api.post('/auth/adminlogin', { username, password });

export const getEvents = (params) => api.get('/admin/events', { params });
export const createEvent = (data) => api.post('/admin/event', data);
export const updateEvent = (id, data) => api.put(`/admin/event/${id}`, data);
export const deleteEvent = (id) => api.delete(`/admin/event/${id}`);

export const getMainCategories = () => api.get('/admin/main-categories');
export const createMainCategory = (data) => api.post('/admin/main-category', data);
export const updateMainCategory = (id, data) => api.put(`/admin/main-category/${id}`, data);
export const deleteMainCategory = (id) => api.delete(`/admin/main-category/${id}`);

export const getCategories = ({ mainCategoryId, page, limit }) =>
  api.get('/admin/categories', { params: { mainCategoryId, page, limit } });
export const createCategory = (data) => api.post('/admin/category', data);
export const updateCategory = (id, data) => api.put(`/admin/category/${id}`, data);
export const deleteCategory = (id) => api.delete(`/admin/category/${id}`);

export const getPosts = ({ mainCategoryId, page, limit }) =>
  api.get('/admin/posts', { params: { mainCategoryId, page, limit } });
export const createPost = (data) => api.post('/admin/post', data);
export const updatePost = (id, data) => api.put(`/admin/post/${id}`, data);
export const deletePost = (id) => api.delete(`/admin/post/${id}`);

export const getImages = ({ page, limit }) =>
  api.get('/admin/images', { params: { page, limit } });

export const uploadImage = (formData, config) =>
  api.post('/admin/images', formData, config);

export const deleteImage = (id) => api.delete(`/admin/images/${id}`);
// Story Type API functions
export const getStoryTypes = (params = {}) =>
  api.get('/admin/story-types', { params });

export const createStoryType = (data) =>
  api.post('/admin/story-type', data);

export const updateStoryType = (id, data) =>
  api.put(`/admin/story-type/${id}`, data);

export const deleteStoryType = (id) =>
  api.delete(`/admin/story-type/${id}`);

// Story API functions
export const addStory = (storyTypeId, data) =>
  api.post(`/admin/story-type/${storyTypeId}/story`, data);

export const updateStory = (storyTypeId, storyId, data) =>
  api.put(`/admin/story-type/${storyTypeId}/story/${storyId}`, data);

export const deleteStory = (storyTypeId, storyId) =>
  api.delete(`/admin/story-type/${storyTypeId}/story/${storyId}`);