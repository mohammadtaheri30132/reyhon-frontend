import axios from 'axios';

const api = axios.create({
  baseURL: 'http://193.242.208.20:1128/api',
  // baseURL: 'http://localhost:4545/api',

});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      if (error.response.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/';
      } else if (error.response.status === 500) {
        alert('مشکل پیش آمد. لطفاً به پشتیبانی گزارش دهید.');
      }
    }
    return Promise.reject(error);
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
export const serachPost = ({ search = '', page = 1, limit = 20 }) =>
  api.get('/admin/posts/search', {
    params: {
      search: search.trim() || undefined,
      page,
      limit,
    },
  });
export const getCategories = ({ mainCategoryId, page, limit }) =>
  api.get('/admin/categories', { params: { mainCategoryId, page, limit } });
export const createCategory = (data) => api.post('/admin/category', data);
export const updateCategory = (id, data) => api.put(`/admin/category/${id}`, data);
export const deleteCategory = (id) => api.post(`/admin/category/delete/`,{
  id
});

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

// Banner API functions
export const getBanners = (params) => api.get('/admin/banners', { params });
export const createBanner = (data) => api.post('/admin/banners', data);
export const deleteBanner = (id) => api.delete(`/admin/banners/${id}`);

// Comment API functions
export const getAllCommentsAdmin = (params) => api.get('/admin/comments', { params });
export const deleteCommentAdmin = (id) => api.delete(`/admin/comments/${id}`);

// Topic API functions
export const getAllTopicsAdmin = (params) => api.get('/admin/topics', { params });
export const deleteTopicAdmin = (id) => api.delete(`/admin/topics/${id}`);
export const getTopicCommentsAdmin = (params) => api.get('/admin/topics/:topicId/comments', { params });
export const deleteTopicCommentAdmin = (id) => api.delete(`/admin/topics/comments/${id}`);


export const getAllUsersAdmin = (params) => api.get('/admin/users', { params });
export const deleteUserAdmin = (id) => api.delete(`/admin/users/${id}`);
