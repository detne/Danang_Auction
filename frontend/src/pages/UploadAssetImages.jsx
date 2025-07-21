// src/pages/UploadAssetImages.jsx
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { assetAPI } from '../services/asset';

const UploadAssetImages = () => {
  const { id } = useParams(); // assetId
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');

  const handleFileChange = (e) => {
    setImages(Array.from(e.target.files));
  };

  const handleUpload = async () => {
    try {
      const result = await assetAPI.uploadAssetImages(id, images);
      setMessage('Tải ảnh thành công! Tài sản đang chờ duyệt.');
      // Optional: navigate('/asset-management');
    } catch (err) {
      setMessage('Lỗi khi upload ảnh: ' + err.message);
    }
  };

  return (
    <div>
      <h3>Tải ảnh cho tài sản #{id}</h3>
      <input type="file" multiple onChange={handleFileChange} />
      <button onClick={handleUpload}>Tải ảnh</button>
      {message && <p>{message}</p>}
    </div>
  );
};

export default UploadAssetImages;
