// src/components/assets/AssetImageUpload.js
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { assetAPI } from '../../services/asset';
import '../../styles/AssetManagement.css';

const AssetImageUpload = () => {
  const { id } = useParams(); // assetId
  const navigate = useNavigate();
  const { user, loading } = useUser();

  const [files, setFiles] = useState([]);
  const [previewUrls, setPreviewUrls] = useState([]);
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [images, setImages] = useState([]);

  // Kiểm tra quyền
  useEffect(() => {
    if (!loading && user?.role !== 'ORGANIZER') {
      navigate('/');
    }
  }, [loading, user, navigate]);

  // Lấy danh sách ảnh đã upload
  const fetchImages = async () => {
    try {
      const res = await assetAPI.getImages(id);
      if (res.success && res.data) setImages(res.data);
      else setImages([]);
    } catch {
      setImages([]);
    }
  };

  useEffect(() => {
    fetchImages();
    // Cleanup previews khi rời trang
    return () => previewUrls.forEach(url => URL.revokeObjectURL(url));
    // eslint-disable-next-line
  }, []);

  const handleFileChange = (e) => {
    const selectedFiles = Array.from(e.target.files);
    if (selectedFiles.length + images.length > 10) {
      setMessage('Tối đa 10 ảnh cho mỗi tài sản!');
      return;
    }
    // Validate type/size
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    for (let file of selectedFiles) {
      if (!validTypes.includes(file.type)) {
        setMessage('Chỉ chấp nhận ảnh jpg, jpeg, png, gif, webp');
        return;
      }
      if (file.size > 20 * 1024 * 1024) {
        setMessage('Ảnh không vượt quá 20MB');
        return;
      }
    }
    setFiles(prev => [...prev, ...selectedFiles]);
    setPreviewUrls(prev => [...prev, ...selectedFiles.map(file => URL.createObjectURL(file))]);
    setMessage('');
    e.target.value = '';
  };

  const handleRemoveFile = (idx) => {
    const newFiles = [...files];
    const newPreviews = [...previewUrls];
    URL.revokeObjectURL(newPreviews[idx]);
    newFiles.splice(idx, 1);
    newPreviews.splice(idx, 1);
    setFiles(newFiles);
    setPreviewUrls(newPreviews);
  };

  const handleUpload = async () => {
    if (files.length === 0) {
      setMessage('Vui lòng chọn ít nhất một ảnh để upload!');
      return;
    }
    setIsUploading(true);
    try {
      const res = await assetAPI.uploadAssetImages(id, files);
      console.log('Upload response:', res);
      if (res.success) {
        setMessage('Tải ảnh thành công!');
        setFiles([]);
        setPreviewUrls([]);
        fetchImages();
      } else {
        setMessage(res.message || 'Có lỗi khi upload ảnh');
      }
    } catch (e) {
      // Thêm log lỗi thật chi tiết
      setMessage('Lỗi kết nối hoặc upload thất bại');
      console.error('Upload error:', e);
      if (e.response) {
        console.error('Upload error details:', e.response);
        setMessage(e.response.data?.message || 'Có lỗi upload: ' + (e.response.statusText || ''));
      }
    }
    setIsUploading(false);
  };  

  return (
    <div className="asset-management-container">
      <div className="header-section">
        <h2>Tải ảnh cho tài sản</h2>
        <div className="breadcrumb">
          <span>Trang chủ</span>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-link" onClick={() => navigate('/asset-management')} style={{ cursor: 'pointer', color: '#007bff' }}>
            Quản lý tài sản
          </span>
          <span className="breadcrumb-separator"> / </span>
          <span className="breadcrumb-current">Tải ảnh</span>
        </div>
      </div>
      <div className="tab-panel">
        <button className="btn btn-secondary" onClick={() => navigate('/asset-management')}>
          Quay lại danh sách
        </button>
        <h3>Chọn ảnh để tải lên (tối đa 10 ảnh cho mỗi tài sản)</h3>

        {message && (
          <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
            {message}
            <button className="message-close" onClick={() => setMessage('')}>&times;</button>
          </div>
        )}

        <div className="form-group full-width">
          <input
            type="file"
            multiple
            accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
            onChange={handleFileChange}
            disabled={isUploading || files.length + images.length >= 10}
          />
          <small className="form-help">(Tối đa 10 ảnh, mỗi ảnh tối đa 5MB)</small>
        </div>

        {/* Preview ảnh mới */}
        {previewUrls.length > 0 && (
          <div className="preview-images">
            {previewUrls.map((url, idx) => (
              <div key={idx} className="preview-item">
                <img src={url} alt={`preview-${idx + 1}`} className="preview-thumbnail" />
                <button
                  type="button"
                  className="btn btn-danger btn-sm"
                  onClick={() => handleRemoveFile(idx)}
                  disabled={isUploading}
                >
                  Xóa
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Nút upload */}
        <div className="form-actions">
          <button
            className="btn btn-primary"
            onClick={handleUpload}
            disabled={isUploading || files.length === 0}
          >
            {isUploading ? 'Đang tải lên...' : 'Tải ảnh lên'}
          </button>
        </div>

        {/* Danh sách ảnh đã upload */}
        {images.length > 0 && (
          <>
            <h4>Ảnh đã upload:</h4>
            <div className="preview-images">
              {images.map((img, idx) => (
                <div key={idx} className="preview-item">
                  <img src={img.url} alt={`uploaded-${idx + 1}`} className="preview-thumbnail" />
                  {/* Có thể thêm nút xoá ảnh tại đây nếu API hỗ trợ */}
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default AssetImageUpload;
