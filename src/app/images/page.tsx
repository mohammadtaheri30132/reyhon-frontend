'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import ImageModal from '../../components/ImageModal';
import '../../styles/image-manager.css';

export default function ImageManager() {


  return (
    <div className="image-manager-container">
      <Header />
      <div className="image-manager-content">
        <h2>مدیریت تصاویر</h2>
        
       
      </div>
    </div>
  );
}