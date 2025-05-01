'use client';

import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import CategoryModal from '../../../components/CategoryModal';
import PostModal from '../../../components/PostModal';
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getPosts,
  createPost,
  updatePost,
  deletePost,
} from '../../../utils/api';
import '../../../styles/main-category-details.css';

export default function MainCategoryDetails({ params }) {
  const [tab, setTab] = useState(0);
  const [categories, setCategories] = useState([]);
  const [posts, setPosts] = useState([]);
  const [categoryPage, setCategoryPage] = useState(1);
  const [postPage, setPostPage] = useState(1);
  const [categoryTotalPages, setCategoryTotalPages] = useState(1);
  const [postTotalPages, setPostTotalPages] = useState(1);
  const [limit] = useState(20);
  const [openCategoryModal, setOpenCategoryModal] = useState(false);
  const [openPostModal, setOpenPostModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [selectedPost, setSelectedPost] = useState(null);

  const fetchCategories = async (page = 1) => {
    try {
      const { data } = await getCategories({ mainCategoryId: params.id, page, limit });
      setCategories(data.categories);
      setCategoryTotalPages(data.totalPages);
      setCategoryPage(data.currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchPosts = async (page = 1) => {
    try {
      const { data } = await getPosts({ mainCategoryId: params.id, page, limit });
      setPosts(data.posts);
      setPostTotalPages(data.totalPages);
      setPostPage(data.currentPage);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (params.id) {
      fetchCategories(categoryPage);
      fetchPosts(postPage);
    }
  }, [params.id, categoryPage, postPage]);

  const handleOpenCategoryModal = (category = null) => {
    setSelectedCategory(category);
    setOpenCategoryModal(true);
  };

  const handleCloseCategoryModal = () => {
    setOpenCategoryModal(false);
    setSelectedCategory(null);
  };

  const handleOpenPostModal = (post = null) => {
    setSelectedPost(post);
    setOpenPostModal(true);
  };

  const handleClosePostModal = () => {
    setOpenPostModal(false);
    setSelectedPost(null);
  };

  const handleCategorySubmit = async (data) => {
    try {
      if (selectedCategory) {
        await updateCategory(selectedCategory._id, data);
      } else {
        await createCategory({ ...data, mainCategoryId: params.id });
      }
      fetchCategories(categoryPage);
      handleCloseCategoryModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handlePostSubmit = async (data) => {
    try {
      if (selectedPost) {
        await updatePost(selectedPost._id, data);
      } else {
        await createPost(data);
      }
      fetchPosts(postPage);
      handleClosePostModal();
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCategory = async (categoryId) => {
    try {
      await deleteCategory(categoryId);
      fetchCategories(categoryPage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await deletePost(postId);
      fetchPosts(postPage);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCategoryPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= categoryTotalPages) {
      setCategoryPage(newPage);
    }
  };

  const handlePostPageChange = (newPage) => {
    if (newPage >= 1 && newPage <= postTotalPages) {
      setPostPage(newPage);
    }
  };

  return (
    <div className="main-category-details-container">
      <Header />
      <div className="main-category-details-content">
        <h2>مدیریت سر دسته</h2>
        <div className="tabs">
          <button
            className={`tab-button ${tab === 0 ? 'active' : ''}`}
            onClick={() => setTab(0)}
          >
            دسته‌بندی‌ها
          </button>
          <button
            className={`tab-button ${tab === 1 ? 'active' : ''}`}
            onClick={() => setTab(1)}
          >
            مطالب
          </button>
        </div>
        {tab === 0 && (
          <div className="tab-content">
            <button onClick={() => handleOpenCategoryModal()} className="add-button">
              افزودن دسته‌بندی
            </button>
            <table className="details-table">
              <thead>
                <tr>
                  <th>نام</th>
                  <th>تعداد مطالب</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category.name}</td>
                    <td>{category.postCount || 0}</td>
                    <td>
                      <button
                        onClick={() => handleOpenCategoryModal(category)}
                        className="edit-button"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDeleteCategory(category._id)}
                        className="delete-button"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
            <div className="pagination">
              <button
                onClick={() => handleCategoryPageChange(categoryPage - 1)}
                disabled={categoryPage === 1}
                className="pagination-button"
              >
                قبلی
              </button>
              <span>
                صفحه {categoryPage} از {categoryTotalPages}
              </span>
              <button
                onClick={() => handleCategoryPageChange(categoryPage + 1)}
                disabled={categoryPage === categoryTotalPages}
                className="pagination-button"
              >
                بعدی
              </button>
            </div>
            {openCategoryModal && (
              <CategoryModal
                open={openCategoryModal}
                onClose={handleCloseCategoryModal}
                onSubmit={handleCategorySubmit}
                initialData={selectedCategory}
              />
            )}
          </div>
        )}
        {tab === 1 && (
          <div className="tab-content">
            <button onClick={() => handleOpenPostModal()} className="add-button">
              افزودن مطلب
            </button>
            <table className="details-table">
              <thead>
                <tr>
                  <th>عنوان</th>
                  <th>دسته‌بندی</th>
                  <th>عملیات</th>
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post._id}>
                    <td>{post.title}</td>
                    <td>
                      {categories.find((c) => c._id === post.category)?.name || '-'}
                    </td>
                    <td>
                      <button
                        onClick={() => handleOpenPostModal(post)}
                        className="edit-button"
                      >
                        ویرایش
                      </button>
                      <button
                        onClick={() => handleDeletePost(post._id)}
                        className="delete-button"
                      >
                        حذف
                      </button>
                    </td>
                  </tr>
                ))}
                </tbody>
              </table>
              <div className="pagination">
                <button
                  onClick={() => handlePostPageChange(postPage - 1)}
                  disabled={postPage === 1}
                  className="pagination-button"
                >
                  قبلی
                </button>
                <span>
                  صفحه {postPage} از {postTotalPages}
                </span>
                <button
                  onClick={() => handlePostPageChange(postPage + 1)}
                  disabled={postPage === postTotalPages}
                  className="pagination-button"
                >
                  بعدی
                </button>
              </div>
              {openPostModal && (
                <PostModal
                  open={openPostModal}
                  onClose={handleClosePostModal}
                  onSubmit={handlePostSubmit}
                  categories={categories}
                  initialData={selectedPost}
                />
              )}
            </div>
          )}
        </div>
      </div>
    );
}