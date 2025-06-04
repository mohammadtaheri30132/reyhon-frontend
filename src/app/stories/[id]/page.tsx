'use client';

import React, { useState, useEffect } from 'react';
import { getStoryTypes, addStory, updateStory, deleteStory } from '../../../utils/api';
import { useParams } from 'next/navigation';
import Header from '@/components/Header';
import moment from 'jalali-moment';
interface Story {
  _id: string;
  story_image: string;
  createdAt: string;
  displayTime: string;
}

interface StoryType {
  _id: string;
  name: string;
  stories: Story[];
}

const persianMonths = [
  'فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور',
  'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند'
];

const days = Array.from({ length: 31 }, (_, i) => (i + 1).toString());
const years = Array.from({ length: 21 }, (_, i) => (1404 + i).toString());

export default function StoriesPage() {
  const { id } = useParams();
  const [storyType, setStoryType] = useState<StoryType | null>(null);
  const [storyImage, setStoryImage] = useState('');
  const [day, setDay] = useState('');
  const [month, setMonth] = useState('');
  const [year, setYear] = useState('');
  const [editingStoryId, setEditingStoryId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchStoryType = async () => {
    try {
      const response = await getStoryTypes();
        console.log('response ',response.data)

      const foundStoryType = response.data.data.find((st: StoryType) => st._id === id);
      setStoryType(foundStoryType);
    } catch (err) {
      console.log('tesst')
      setError('Failed to fetch story type');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      fetchStoryType();
    }
  }, [id]);
  const convertPersianToGregorian = (persianYear, persianMonth, persianDay) => {
    const persianDate = `${persianYear}/${persianMonths.indexOf(persianMonth) + 1}/${persianDay}`;
    return moment(persianDate, 'jYYYY/jM/jD').locale('en').format('YYYY-MM-DDTHH:mm:ss.SSS[Z]');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!day || !month || !year) {
      setError('لطفاً تاریخ نمایش را انتخاب کنید');
      return;
    }
  
    const displayTime = convertPersianToGregorian(year, month, day);

    try {
      if (editingStoryId) {
        const response = await updateStory(id as string, editingStoryId, { story_image: storyImage,displayTime:displayTime });
        setStoryType(response.data);
      } else {
        const response = await addStory(id as string, {
          story_image: storyImage,
          createdAt: new Date().toISOString(),
          displayTime,
        });
        setStoryType(response.data);
      }
      setStoryImage('');
      setDay('');
      setMonth('');
      setYear('');
      setEditingStoryId(null);
      setError(null);
      setIsModalOpen(false);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving story');
    }
  };

  const handleEdit = (story: Story) => {
    setEditingStoryId(story._id);
    setStoryImage(story.story_image);
    setIsModalOpen(true);
  };

  const handleDelete = async (storyId: string) => {
    try {
      await deleteStory(id as string, storyId);
      setStoryType({
        ...storyType!,
        stories: storyType!.stories.filter(story => story._id !== storyId),
      });
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting story');
    }
  };

  const openAddModal = () => {
    setEditingStoryId(null);
    setStoryImage('');
    setDay('');
    setMonth('');
    setYear('');
    setError(null);
    setIsModalOpen(true);
  };

  if (!storyType) return <div style={{
    textAlign: 'center',
    padding: '20px',
    fontSize: '18px',
    color: '#666',
  }}>
    در حال بارگذاری...
  </div>;

  return (
    <div style={{
      maxWidth: '1200px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif',
      backgroundColor: '#f5f5f5',
      minHeight: '100vh',
    }}>
              <Header/>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
      }}>
        <h1 style={{
          fontSize: '28px',
          fontWeight: 'bold',
          color: '#333',
        }}>
          مدیریت استوری‌های {storyType.name}
        </h1>
        <button
          onClick={openAddModal}
          style={{
            backgroundColor: '#007bff',
            color: '#fff',
            padding: '10px 20px',
            border: 'none',
            borderRadius: '5px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.3s',
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#0056b3'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#007bff'}
        >
          افزودن استوری جدید
        </button>
      </div>

      {isModalOpen && (
        <div style={{
          position: 'fixed',
          top: '0',
          left: '0',
          width: '100%',
          height: '100%',
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          zIndex: '1000',
        }}>
          <div style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            width: '90%',
            maxWidth: '500px',
            boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
            position: 'relative',
          }}>
            <button
              onClick={() => setIsModalOpen(false)}
              style={{
                position: 'absolute',
                top: '10px',
                right: '10px',
                background: 'none',
                border: 'none',
                fontSize: '24px',
                cursor: 'pointer',
                color: '#666',
              }}
            >
              ×
            </button>
            <h2 style={{
              fontSize: '20px',
              fontWeight: 'bold',
              color: '#333',
              marginBottom: '20px',
              textAlign: 'center',
            }}>
              {editingStoryId ? 'ویرایش استوری' : 'افزودن استوری جدید'}
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '16px',
                  color: '#555',
                }}>
                  لینک تصویر استوری
                </label>
                <input
                  type="text"
                  value={storyImage}
                  onChange={(e) => setStoryImage(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    border: '1px solid #ddd',
                    borderRadius: '5px',
                    fontSize: '16px',
                    outline: 'none',
                    transition: 'border-color 0.3s',
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#007bff'}
                  onBlur={(e) => e.target.style.borderColor = '#ddd'}
                  required
                />
              </div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{
                  display: 'block',
                  marginBottom: '5px',
                  fontSize: '16px',
                  color: '#555',
                }}>
                  تاریخ نمایش
                </label>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                }}>
                  <select
                    value={day}
                    onChange={(e) => setDay(e.target.value)}
                    style={{
                      flex: '1',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                    required
                  >
                    <option value="">روز</option>
                    {days.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                  <select
                    value={month}
                    onChange={(e) => setMonth(e.target.value)}
                    style={{
                      flex: '1',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                    required
                  >
                    <option value="">ماه</option>
                    {persianMonths.map(m => (
                      <option key={m} value={m}>{m}</option>
                    ))}
                  </select>
                  <select
                    value={year}
                    onChange={(e) => setYear(e.target.value)}
                    style={{
                      flex: '1',
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '5px',
                      fontSize: '16px',
                      outline: 'none',
                      transition: 'border-color 0.3s',
                    }}
                    onFocus={(e) => e.target.style.borderColor = '#007bff'}
                    onBlur={(e) => e.target.style.borderColor = '#ddd'}
                    required
                  >
                    <option value="">سال</option>
                    {years.map(y => (
                      <option key={y} value={y}>{y}</option>
                    ))}
                  </select>
                </div>
              </div>
              <button
                type="submit"
                style={{
                  backgroundColor: editingStoryId ? '#f0ad4e' : '#007bff',
                  color: '#fff',
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '5px',
                  fontSize: '16px',
                  cursor: 'pointer',
                  transition: 'background-color 0.3s',
                  width: '100%',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = editingStoryId ? '#ec971f' : '#0056b3'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = editingStoryId ? '#f0ad4e' : '#007bff'}
              >
                {editingStoryId ? 'ویرایش استوری' : 'افزودن استوری'}
              </button>
            </form>
            {error && (
              <p style={{
                color: '#dc3545',
                textAlign: 'center',
                marginTop: '10px',
                fontSize: '14px',
              }}>
                {error}
              </p>
            )}
          </div>
        </div>
      )}

      {storyType?.stories?.length === 0 ? (
        <p style={{
          textAlign: 'center',
          color: '#666',
          fontSize: '16px',
          marginTop: '20px',
        }}>
          هنوز استوری‌ای اضافه نشده است.
        </p>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
          gap: '20px',
        }}>
          {storyType.stories.map((story) => (
            <div
              key={story._id}
              style={{
                backgroundColor: '#fff',
                borderRadius: '8px',
                boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
                overflow: 'hidden',
              }}
            >
              <img
                src={story.story_image}
                alt="Story"
                style={{
                  width: '100%',
                  height: '200px',
                  objectFit: 'cover',
                  display: 'block',
                }}
                onError={(e) => {
                  e.currentTarget.src = 'https://via.placeholder.com/200x200?text=تصویر+ناموجود';
                }}
              />
              <div style={{
                padding: '10px',
                textAlign: 'center',
              }}>
                <p style={{
                  color: '#666',
                  fontSize: '14px',
                  marginBottom: '10px',
                }}>
                  نمایش در: {new Date(story.displayTime).toLocaleString('fa-IR')}
                </p>
                <div style={{
                  display: 'flex',
                  gap: '10px',
                  justifyContent: 'center',
                }}>
                  <button
                    onClick={() => handleEdit(story)}
                    style={{
                      backgroundColor: '#f0ad4e',
                      color: '#fff',
                      padding: '8px 15px',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#ec971f'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#f0ad4e'}
                  >
                    ویرایش
                  </button>
                  <button
                    onClick={() => handleDelete(story._id)}
                    style={{
                      backgroundColor: '#dc3545',
                      color: '#fff',
                      padding: '8px 15px',
                      border: 'none',
                      borderRadius: '5px',
                      fontSize: '14px',
                      cursor: 'pointer',
                      transition: 'background-color 0.3s',
                    }}
                    onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#c82333'}
                    onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#dc3545'}
                  >
                    حذف
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}