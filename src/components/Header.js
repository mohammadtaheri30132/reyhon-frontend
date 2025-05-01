import { useRouter } from 'next/navigation';
import { useEffect,useState } from 'react';
import '../../styles/header.css';
import { getImages } from '@/utils/api';
import ImageModal from './ImageModal';

export default function Header() {
  const router = useRouter();
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [limit] = useState(20);
  const [openModal, setOpenModal] = useState(false);

  const fetchImages = async (page = 1) => {
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
    fetchImages(page);
  }, [page]);

  const handleOpenModal = () => {
    setOpenModal(true);
  };

  const handleCloseModal = () => {
    setOpenModal(false);
  };

  const handlePageChange = (newPage) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push('/');
    }
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/');
  };

  return (
    <header className="header">
      <div className="header-content">
        <h1>پنل ادمین</h1>
        <button onClick={handleLogout} className="logout-button">
          خروج
        </button>
        <button onClick={handleOpenModal} className="open-modal-button">
          مدیریت تصاویر
        </button>
        {openModal && (
          <ImageModal
            open={openModal}
            onClose={handleCloseModal}
            fetchImages={() => fetchImages(page)}
          />
        )}
      </div>
    </header>
  );
}