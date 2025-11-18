'use client';

import Header from '@/components/Header';
import {
  createPost,
  deletePost,
  getCategories,
  getMainCategories,
  serachPost,
  getPosts,
  updatePost,
  createCategory,
  deleteCategory,
} from '@/utils/api';
import { useState, useEffect } from 'react';

interface Category {
  _id: string;
  name: string;
}

interface MainCategory {
  _id: string;
  name: string;
}

interface Post {
  _id: string;
  title?: string;
  content: string;
  category: any;
}

export default function AdminAllPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [mainCategories, setMainCategories] = useState<MainCategory[]>([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [search, setSearch] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [loading, setLoading] = useState(false);

  // مدال‌ها
  const [modalOpen, setModalOpen] = useState(false);
  const [categoriesModalOpen, setCategoriesModalOpen] = useState(false);
  const [addCategoryModalOpen, setAddCategoryModalOpen] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [selectedMainCategoryId, setSelectedMainCategoryId] = useState<string>('');

  // ویرایش پست
  const [editingPost, setEditingPost] = useState<Post | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [selectedCategoryIds, setSelectedCategoryIds] = useState<string[]>([]);

  const limit = 20;

  // بارگذاری سر‌دسته‌ها
  const loadMainCategories = async () => {
    try {
      const res = await getMainCategories({ limit: 100 });
      const data = res.data.data || [];
      setMainCategories(data);
      if (data.length > 0 && !selectedMainCategoryId) {
        setSelectedMainCategoryId(data[0]._id);
      }
    } catch (err) {
      console.error('خطا در بارگذاری سر‌دسته‌ها', err);
    }
  };

  // بارگذاری همه دسته‌بندی‌ها (زیرمجموعه‌ها)
  const loadAllCategories = async () => {
    try {
      const mainRes = await getMainCategories();
      const mains = mainRes.data.data || [];
      const all: Category[] = [];

      for (const m of mains) {
        const res = await getCategories({ mainCategoryId: m._id, limit: 200 });
        all.push(...(res.data.data || []));
      }

      setCategories(all);
      setAllCategories(all);
    } catch (err) {
      console.error('خطا در بارگذاری دسته‌بندی‌ها', err);
    }
  };

  useEffect(() => {
    loadMainCategories();
    loadAllCategories();
    loadPosts(1, '');
  }, []);

  // بارگذاری پست‌ها
  const loadPosts = async (p = 1, query = '') => {
    setLoading(true);
    try {
      const res = query
        ? await serachPost({ search: query, page: p, limit })
        : await getPosts({ page: p, limit });

      setPosts(res.data.data || []);
      setTotalPages(res.data.pagination?.totalPages || 1);
      setTotalPosts(res.data.pagination?.total || 0);
      setPage(res.data.pagination?.currentPage || p);
    } catch (err: any) {
      alert(err.response?.data?.message || 'خطا در دریافت مطالب');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (!search.trim()) return;
    setIsSearching(true);
    loadPosts(1, search);
  };

  const handleResetSearch = () => {
    setSearch('');
    setIsSearching(false);
    setPage(1);
    loadPosts(1, '');
  };

  const handlePageChange = (newPage: number) => {
    if (newPage < 1 || newPage > totalPages) return;
    setPage(newPage);
    loadPosts(newPage, isSearching ? search : '');
  };

  const handleDeletePost = (id: string) => {
    if (!confirm('آیا از حذف این مطلب اطمینان دارید؟')) return;
    deletePost(id).then(() => loadPosts(page, isSearching ? search : ''));
  };

  const openCreate = () => {
    setEditingPost(null);
    setTitle('');
    setContent('');
    setSelectedCategoryIds([]);
    setModalOpen(true);
  };

  const openEdit = (post: Post) => {
    setEditingPost(post);
    setTitle(post.title || '');
    setContent(post.content);

    let ids: string[] = [];
    if (Array.isArray(post.category)) {
      ids = post.category.map((c: any) => (typeof c === 'object' ? c._id : c));
    } else if (post.category?._id) {
      ids = [post.category._id];
    } else if (typeof post.category === 'string') {
      ids = [post.category];
    }
    setSelectedCategoryIds(ids);
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    if (!content.trim()) return alert('محتوا الزامی است');

    const payload = {
      title: title.trim() || undefined,
      content: content.trim(),
      categoryIds: selectedCategoryIds,
    };

    try {
      if (editingPost) {
        await updatePost(editingPost._id, payload);
      } else {
        await createPost(payload);
      }
      setModalOpen(false);
      loadPosts(page, isSearching ? search : '');
    } catch (err: any) {
      alert(err.response?.data?.message || 'خطا در ذخیره');
    }
  };

  const getTitle = (post: Post) => {
    if (post.title && post.title.trim().length > 1) return post.title;
    return post.content.substring(0, 80) + (post.content.length > 80 ? '...' : '');
  };

  const getCategoryNames = (post: Post) => {
    if (!post.category) return 'بدون دسته';
    const arr = Array.isArray(post.category) ? post.category : [post.category];
    return arr
      .map((c: any) => {
        if (typeof c === 'object' && c.name) return c.name;
        return categories.find((cat) => cat._id === c)?.name || 'نامشخص';
      })
      .filter(Boolean)
      .join('، ') || 'بدون دسته';
  };

  // ایجاد دسته‌بندی جدید با انتخاب سر‌دسته
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategoryName.trim()) return alert('نام دسته‌بندی الزامی است');
    if (!selectedMainCategoryId) return alert('لطفاً یک سر‌دسته انتخاب کنید');

    try {
      await createCategory({
        name: newCategoryName.trim(),
        mainCategoryId: selectedMainCategoryId,
      });
      setNewCategoryName('');
      setSelectedMainCategoryId(mainCategories[0]?._id || '');
      setAddCategoryModalOpen(false);
      loadAllCategories();
    } catch (err: any) {
      alert(err.response?.data?.message || 'خطا در ایجاد دسته‌بندی');
    }
  };

  const handleDeleteCategory = async (id: string, name: string) => {
    if (!confirm(`آیا از حذف دسته‌بندی "${name}" و تمام مطالب آن مطمئن هستید؟`)) return;

    try {
      await deleteCategory(id);
      loadAllCategories();
      loadPosts(page, isSearching ? search : '');
    } catch (err: any) {
      alert(err.response?.data?.message || 'خطا در حذف دسته‌بندی');
    }
  };

  return (
    <div className="admin-posts-wrapper">
      <Header />

      <div className="admin-header">
        <h1>مدیریت مطالب</h1>
        <p>تعداد کل: {totalPosts}</p>
      </div>

      <div className="toolbar">
        <div className="search-group">
          <input
            type="text"
            placeholder="جستجو در عنوان و محتوا..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className="search-box"
          />
          {isSearching ? (
            <button onClick={handleResetSearch} className="reset-btn">بازگشت</button>
          ) : (
            <button onClick={handleSearch} className="search-btn">جستجو</button>
          )}
        </div>

        <div className="action-buttons">
          <button onClick={() => setCategoriesModalOpen(true)} className="categories-btn">
            دسته‌بندی‌ها
          </button>
          <button onClick={() => setAddCategoryModalOpen(true)} className="add-category-btn">
            افزودن دسته‌بندی
          </button>
          <button onClick={openCreate} className="add-btn">
            افزودن مطلب
          </button>
        </div>
      </div>

      {loading ? (
        <div className="center">در حال بارگذاری...</div>
      ) : (
        <>
          <div className="posts-list">
            {posts.length === 0 ? (
              <div className="empty">مطلبی یافت نشد</div>
            ) : (
              posts.map((post) => (
                <div key={post._id} className="post-card">
                  <div className="post-title">{getTitle(post)}</div>
                  <div className="post-category">{getCategoryNames(post)}</div>
                  <div className="post-actions">
                    <button onClick={() => openEdit(post)} className="edit-btn">ویرایش</button>
                    <button onClick={() => handleDeletePost(post._id)} className="delete-btn">حذف</button>
                  </div>
                </div>
              ))
            )}
          </div>

          {totalPages > 1 && (
            <div className="pagination">
              <button onClick={() => handlePageChange(page - 1)} disabled={page <= 1} className="page-btn">قبلی</button>
              <select value={page} onChange={(e) => handlePageChange(+e.target.value)} className="page-select">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                  <option key={p} value={p}>صفحه {p}</option>
                ))}
              </select>
              <span className="page-info">از {totalPages}</span>
              <button onClick={() => handlePageChange(page + 1)} disabled={page >= totalPages} className="page-btn">بعدی</button>
            </div>
          )}
        </>
      )}

      {/* مدال ویرایش/ایجاد پست */}
      {modalOpen && (
        <div className="modal-fullscreen">
          <div className="modal-header">
            <button onClick={() => setModalOpen(false)} className="close-btn">×</button>
            <h2>{editingPost ? 'ویرایش مطلب' : 'مطلب جدید'}</h2>
          </div>
          <div className="modal-body">
            <input type="text" placeholder="عنوان (اختیاری)" value={title} onChange={(e) => setTitle(e.target.value)} className="input-title" />
            <textarea placeholder="محتوای مطلب..." value={content} onChange={(e) => setContent(e.target.value)} rows={12} className="input-content" />
            <div className="categories-section">
              <h3>دسته‌بندی‌ها</h3>
              <div className="categories-grid">
                {categories.map((cat) => (
                  <label key={cat._id} className="cat-checkbox">
                    <input
                      type="checkbox"
                      checked={selectedCategoryIds.includes(cat._id)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedCategoryIds([...selectedCategoryIds, cat._id]);
                        } else {
                          setSelectedCategoryIds(selectedCategoryIds.filter(id => id !== cat._id));
                        }
                      }}
                    />
                    <span>{cat.name}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>
          <div className="modal-footer">
            <button onClick={() => setModalOpen(false)} className="cancel-btn">انصراف</button>
            <button onClick={handleSubmit} className="save-btn">ذخیره</button>
          </div>
        </div>
      )}

      {/* مدال لیست دسته‌بندی‌ها */}
      {categoriesModalOpen && (
        <div className="modal-overlay" onClick={() => setCategoriesModalOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2>مدیریت دسته‌بندی‌ها</h2>
            <div className="categories-list">
              {allCategories.length === 0 ? (
                <p>دسته‌بندی وجود ندارد</p>
              ) : (
                allCategories.map((cat) => (
                  <div key={cat._id} className="category-item">
                    <span>{cat.name}</span>
                    <button onClick={() => handleDeleteCategory(cat._id, cat.name)} className="delete-category-btn">
                      حذف
                    </button>
                  </div>
                ))
              )}
            </div>
            <button onClick={() => setCategoriesModalOpen(false)} className="close-modal-btn">بستن</button>
          </div>
        </div>
      )}

      {/* مدال افزودن دسته‌بندی جدید - با انتخاب سر‌دسته */}
      {addCategoryModalOpen && (
        <div className="modal-overlay" onClick={() => setAddCategoryModalOpen(false)}>
          <div className="modal-content small" onClick={(e) => e.stopPropagation()}>
            <h2>افزودن دسته‌بندی جدید</h2>
            <form onSubmit={handleCreateCategory}>
              <div className="form-group">
                <label>سر‌دسته:</label>
                <select
                  value={selectedMainCategoryId}
                  onChange={(e) => setSelectedMainCategoryId(e.target.value)}
                  className="main-category-select"
                  required
                >
                  <option value="">-- انتخاب سر‌دسته --</option>
                  {mainCategories.map((mc) => (
                    <option key={mc._id} value={mc._id}>
                      {mc.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="form-group">
                <label>نام دسته‌بندی:</label>
                <input
                  type="text"
                  value={newCategoryName}
                  onChange={(e) => setNewCategoryName(e.target.value)}
                  placeholder="مثلاً: اخبار فناوری"
                  className="category-input"
                  required
                />
              </div>

              <div className="modal-actions">
                <button type="button" onClick={() => setAddCategoryModalOpen(false)} className="cancel-btn">
                  انصراف
                </button>
                <button type="submit" className="save-btn">ایجاد دسته‌بندی</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <style jsx>{`
        .admin-posts-wrapper { font-family: Tahoma, sans-serif; direction: rtl; padding: 16px; background: #f9f9f9; min-height: 100vh; }
        .admin-header h1 { font-size: 24px; margin: 0 0 8px; color: #333; text-align: center; }
        .admin-header p { font-size: 14px; color: #666; text-align: center; margin: 0; }
        .toolbar { display: flex; justify-content: space-between; align-items: center; margin: 20px 0; flex-wrap: wrap; gap: 12px; }
        .search-group { display: flex; gap: 8px; flex: 1; min-width: 280px; }
        .search-box { flex: 1; padding: 12px; border: 1px solid #ddd; border-radius: 12px; font-size: 16px; }
        .search-btn, .reset-btn, .categories-btn, .add-category-btn, .add-btn { padding: 12px 20px; border: none; border-radius: 12px; font-weight: bold; cursor: pointer; }
        .search-btn { background: #28a745; color: white; }
        .reset-btn { background: #6c757d; color: white; }
        .categories-btn { background: #17a2b8; color: white; }
        .add-category-btn { background: #6f42c1; color: white; }
        .add-btn { background: #0070f3; color: white; }
        .action-buttons { display: flex; gap: 10px; flex-wrap: wrap; }

        .posts-list { display: flex; flex-direction: column; gap: 16px; }
        .post-card { background: white; padding: 16px; border-radius: 16px; box-shadow: 0 2px 10px rgba(0,0,0,0.08); }
        .post-title { font-weight: bold; font-size: 16px; margin-bottom: 8px; color: #333; }
        .post-category { font-size: 14px; color: #666; margin-bottom: 12px; }
        .post-actions button { padding: 8px 16px; margin-left: 8px; border: none; border-radius: 8px; font-size: 14px; }
        .edit-btn { background: #f0ad4e; color: white; }
        .delete-btn { background: #d9534f; color: white; }

        .empty, .center { text-align: center; padding: 60px 20px; color: #888; font-size: 18px; }

        .pagination { display: flex; justify-content: center; align-items: center; gap: 12px; margin: 30px 0; flex-wrap: wrap; }
        .page-btn { padding: 10px 18px; background: #0070f3; color: white; border: none; border-radius: 12px; }
        .page-btn:disabled { background: #ccc; cursor: not-allowed; }
        .page-select { padding: 10px; border-radius: 12px; border: 1px solid #ddd; font-size: 15px; }
        .page-info { color: #555; font-size: 15px; }

        .modal-overlay { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: rgba(0,0,0,0.7); display: flex; justify-content: center; align-items: center; z-index: 1000; }
        .modal-content { background: white; padding: 24px; border-radius: 16px; width: 90%; max-width: 500px; max-height: 80vh; overflow-y: auto; }
        .modal-content.small { max-width: 420px; }
        .modal-content h2 { text-align: center; margin-bottom: 24px; color: #333; }

        .form-group { margin-bottom: 20px; }
        .form-group label { display: block; margin-bottom: 8px; font-weight: bold; color: #333; }
        .main-category-select, .category-input { width: 100%; padding: 12px; border: 1px solid #ddd; border-radius: 8px; font-size: 16px; }
        .main-category-select { background: white; }

        .categories-list { max-height: 400px; overflow-y: auto; }
        .category-item { display: flex; justify-content: space-between; align-items: center; padding: 12px; background: #f8f9fa; border-radius: 8px; margin-bottom: 10px; }
        .delete-category-btn { background: #dc3545; color: white; padding: 6px 12px; border: none; border-radius: 6px; font-size: 13px; }

        .close-modal-btn { width: 100%; padding: 12px; background: #6c757d; color: white; border: none; border-radius: 8px; margin-top: 20px; }

        .modal-fullscreen { position: fixed; top: 0; left: 0; right: 0; bottom: 0; background: white; z-index: 1000; display: flex; flex-direction: column; }
        .modal-header { padding: 16px; border-bottom: 1px solid #eee; position: relative; text-align: center; }
        .close-btn { position: absolute; left: 16px; background: none; border: none; font-size: 28px; color: #999; cursor: pointer; }
        .modal-body { flex: 1; overflow-y: auto; padding: 20px; }
        .input-title, .input-content { width: 100%; padding: 14px; margin-bottom: 20px; border: 1px solid #ddd; border-radius: 12px; font-size: 16px; }
        .input-content { min-height: 200px; resize: none; }
        .categories-section h3 { margin: 24px 0 16px; font-size: 18px; color: #333; }
        .categories-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 14px; }
        .cat-checkbox { display: flex; align-items: center; font-size: 15px; }
        .cat-checkbox input { margin-left: 10px; }
        .modal-footer { padding: 16px; border-top: 1px solid #eee; display: flex; gap: 12px; }
        .cancel-btn, .save-btn { flex: 1; padding: 14px; border-radius: 12px; font-weight: bold; font-size: 16px; }
        .cancel-btn { background: #eee; color: #333; }
        .save-btn { background: #0070f3; color: white; }
      `}</style>
    </div>
  );
}