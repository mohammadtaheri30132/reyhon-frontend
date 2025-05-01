'use client';

import React, { useState, useEffect } from 'react';
import { getStoryTypes, createStoryType, updateStoryType, deleteStoryType } from '../../utils/api';
import Header from '@/components/Header';

interface StoryType {
  _id: string;
  name: string;
  profile: string;
  stories: any[];
  createdAt: string;
  updatedAt: string;
}

export default function StoryTypesPage() {
  const [storyTypes, setStoryTypes] = useState<StoryType[]>([]);
  const [name, setName] = useState('');
  const [profile, setProfile] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fetchStoryTypes = async () => {
    try {
      const response = await getStoryTypes();
      setStoryTypes(response.data);
    } catch (err) {
      setError('Failed to fetch story types');
    }
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = '/login';
    } else {
      fetchStoryTypes();
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingId) {
        const response = await updateStoryType(editingId, { name, profile });
        setStoryTypes(storyTypes.map(st => st._id === editingId ? response.data : st));
      } else {
        const response = await createStoryType({ name, profile });
        setStoryTypes([...storyTypes, response.data]);
      }
      setName('');
      setProfile('');
      setEditingId(null);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error saving story type');
    }
  };

  const handleEdit = (storyType: StoryType) => {
    setEditingId(storyType._id);
    setName(storyType.name);
    setProfile(storyType.profile);
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteStoryType(id);
      setStoryTypes(storyTypes.filter(st => st._id !== id));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Error deleting story type');
    }
  };

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
      <h1 style={{
        fontSize: '28px',
        fontWeight: 'bold',
        color: '#333',
        marginBottom: '20px',
        textAlign: 'center',
      }}>
        مدیریت انواع استوری
      </h1>

      <div style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
        marginBottom: '30px',
      }}>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '15px' }}>
            <label style={{
              display: 'block',
              marginBottom: '5px',
              fontSize: '16px',
              color: '#555',
            }}>
              نام
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
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
              لینک پروفایل
            </label>
            <input
              type="text"
              value={profile}
              onChange={(e) => setProfile(e.target.value)}
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
          <button
            type="submit"
            style={{
              backgroundColor: editingId ? '#f0ad4e' : '#007bff',
              color: '#fff',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              fontSize: '16px',
              cursor: 'pointer',
              transition: 'background-color 0.3s',
            }}
            onMouseOver={(e) => e.currentTarget.style.backgroundColor = editingId ? '#ec971f' : '#0056b3'}
            onMouseOut={(e) => e.currentTarget.style.backgroundColor = editingId ? '#f0ad4e' : '#007bff'}
          >
            {editingId ? 'ویرایش' : 'ایجاد'} نوع استوری
          </button>
        </form>
      </div>

      {error && (
        <p style={{
          color: '#dc3545',
          textAlign: 'center',
          marginBottom: '20px',
          fontSize: '16px',
        }}>
          {error}
        </p>
      )}

      <div style={{
        display: 'grid',
        gap: '20px',
      }}>
        {storyTypes.map((storyType) => (
          <div
            key={storyType._id}
            style={{
              backgroundColor: '#fff',
              padding: '20px',
              borderRadius: '8px',
              boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
            }}
          >
            <div>
              <h2 style={{
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#333',
                marginBottom: '10px',
              }}>
                {storyType.name}
              </h2>
              <img
                src={storyType.profile}
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
              
            </div>
            <div style={{
              display: 'flex',
              gap: '10px',
            }}>
              <a
                href={`/stories/${storyType._id}`}
                style={{
                  backgroundColor: '#28a745',
                  color: '#fff',
                  padding: '8px 15px',
                  borderRadius: '5px',
                  textDecoration: 'none',
                  fontSize: '14px',
                  transition: 'background-color 0.3s',
                }}
                onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#218838'}
                onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#28a745'}
              >
                مدیریت استوری‌ها
              </a>
              <button
                onClick={() => handleEdit(storyType)}
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
                onClick={() => handleDelete(storyType._id)}
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
        ))}
      </div>
    </div>
  );
}