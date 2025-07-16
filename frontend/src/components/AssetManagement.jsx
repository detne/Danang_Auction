// src/components/AssetManagement.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import useAssets from '../hooks/organizer/useAssets';
import { assetAPI } from '../services/asset';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { USER_ROLES } from '../utils/constants';
import '../styles/AssetManagement.css';

const AssetManagement = () => {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const { assets, loading: assetsLoading, error, refetch } = useAssets();

    const [formData, setFormData] = useState(getInitialFormData());
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [activeTab, setActiveTab] = useState('list');

    const categories = useMemo(() => [
        { id: 1, name: 'Bất động sản' },
        { id: 2, name: 'Xe cộ' },
        { id: 3, name: 'Thiết bị văn phòng' },
        { id: 4, name: 'Máy móc' },
        { id: 5, name: 'Khác' }
    ], []);

    const categoryMap = useMemo(() => ({
        1: 'Bất động sản',
        2: 'Xe cộ',
        3: 'Thiết bị văn phòng',
        4: 'Máy móc',
        5: 'Khác'
    }), []);

    useEffect(() => {
        if (!loading && user?.role !== USER_ROLES.ORGANIZER) navigate('/');
    }, [loading, user, navigate]);

    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    useEffect(() => {
        if (error) setMessage(error);
    }, [error]);

    const resetForm = useCallback(() => {
        setFormData(getInitialFormData());
        setEditingId(null);
        setMessage('');
        setActiveTab('list');
    }, []);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        setFormData(prev => ({
            ...prev,
            files: files
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const formDataToSend = new FormData();
            Object.keys(formData).forEach(key => {
                if (key === 'files') {
                    formData.files.forEach(file => {
                        formDataToSend.append('files', file);
                    });
                } else {
                    formDataToSend.append(key, formData[key]);
                }
            });

            let response;
            if (editingId) {
                response = await assetAPI.updateAsset(editingId, formDataToSend);
            } else {
                response = await assetAPI.createAsset(formDataToSend);
            }

            if (response.success) {
                setMessage(`${editingId ? 'Cập nhật' : 'Tạo'} tài sản thành công!`);
                resetForm();
                refetch();
            } else {
                setMessage(response.message || 'Có lỗi xảy ra');
            }
        } catch (error) {
            console.error('Error saving asset:', error);
            setMessage(`Lỗi: ${error.message || 'Không thể lưu tài sản'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleEdit = (asset) => {
        setEditingId(asset.id);
        setFormData({
            documentCode: asset.documentCode || '',
            title: asset.title || '',
            description: asset.description || '',
            categoryId: asset.categoryId || '',
            startingPrice: asset.startingPrice || '',
            stepPrice: asset.stepPrice || '',
            auctionType: asset.auctionType || 'OPEN',
            isDepositRequired: asset.isDepositRequired || false,
            depositAmount: asset.depositAmount || '',
            files: [],
            createSession: false,
            sessionCode: '',
            sessionTitle: '',
            sessionType: 'ONLINE',
            startTime: '',
            endTime: '',
        });
        setActiveTab('form');
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa tài sản này?')) return;
        setIsDeleting(true);
        try {
            const response = await assetAPI.deleteAsset(id);
            setMessage(response.success ? 'Xóa tài sản thành công!' : response.message || 'Không thể xóa tài sản.');
            if (response.success) refetch();
        } catch (error) {
            console.error(error);
            setMessage(`Lỗi: ${error.message || 'Không thể xóa tài sản.'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleNewAsset = () => {
        resetForm();
        setActiveTab('form');
    };

    const enhancedAssets = useMemo(() => {
        return assets.map(asset => ({
            ...asset,
            formattedStartingPrice: formatCurrency(asset.startingPrice),
            formattedStepPrice: formatCurrency(asset.stepPrice),
            formattedCreatedAt: formatDate(asset.createdAt),
            categoryName: categoryMap[asset.categoryId] || 'Không xác định',
        }));
    }, [assets, categoryMap]);

    if (loading || assetsLoading) {
        return (
            <div className="asset-management-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải...</p>
                </div>
            </div>
        );
    }

    if (!user || user.role !== USER_ROLES.ORGANIZER) {
        return (
            <div className="asset-management-container">
                <div className="no-access">
                    <h3>Không có quyền truy cập</h3>
                    <p>Bạn cần có quyền quản lý để truy cập trang này.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="asset-management-container">
            <div className="header-section">
                <h2>Quản lý Tài sản Đấu giá</h2>
                <div className="breadcrumb">
                    <span>Trang chủ</span>
                    <span className="breadcrumb-separator"> / </span>
                    <span className="breadcrumb-current">Quản lý tài sản</span>
                </div>
            </div>

            {message && (
                <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
                    {message}
                    <button className="message-close" onClick={() => setMessage('')}>×</button>
                </div>
            )}

            <div className="tab-section">
                <div className="tab-buttons">
                    <button
                        className={`tab-button ${activeTab === 'list' ? 'active' : ''}`}
                        onClick={() => setActiveTab('list')}
                    >
                        Danh sách tài sản ({enhancedAssets.length})
                    </button>
                    <button
                        className={`tab-button ${activeTab === 'form' ? 'active' : ''}`}
                        onClick={() => setActiveTab('form')}
                    >
                        {editingId ? 'Chỉnh sửa tài sản' : 'Thêm tài sản mới'}
                    </button>
                </div>

                <div className="tab-content">
                    {activeTab === 'list' && (
                        <div className="tab-panel">
                            <div className="list-header">
                                <h3>Danh sách Tài sản</h3>
                                <button className="btn btn-primary" onClick={handleNewAsset}>
                                    Thêm tài sản mới
                                </button>
                            </div>

                            <div className="asset-table-container">
                                <table className="asset-table">
                                    <thead>
                                    <tr>
                                        <th>Mã tài sản</th>
                                        <th>Tên tài sản</th>
                                        <th>Danh mục</th>
                                        <th>Giá khởi điểm</th>
                                        <th>Bước giá</th>
                                        <th>Ngày tạo</th>
                                        <th>Trạng thái</th>
                                        <th>Thao tác</th>
                                    </tr>
                                    </thead>
                                    <tbody>
                                    {enhancedAssets.map((asset) => (
                                        <tr key={asset.id}>
                                            <td>{asset.documentCode || `MTS-${asset.id}`}</td>
                                            <td>{asset.title}</td>
                                            <td>{asset.categoryName}</td>
                                            <td>{asset.formattedStartingPrice}</td>
                                            <td>{asset.formattedStepPrice}</td>
                                            <td>{asset.formattedCreatedAt}</td>
                                            <td>
                                                <span className={`status ${asset.status?.toLowerCase() || 'pending'}`}>
                                                    {asset.status || 'Chờ duyệt'}
                                                </span>
                                            </td>
                                            <td>
                                                <div className="action-buttons">
                                                    <button
                                                        className="btn btn-edit"
                                                        onClick={() => handleEdit(asset)}
                                                    >
                                                        Sửa
                                                    </button>
                                                    <button
                                                        className="btn btn-delete"
                                                        onClick={() => handleDelete(asset.id)}
                                                        disabled={isDeleting}
                                                    >
                                                        {isDeleting ? 'Đang xóa...' : 'Xóa'}
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    </tbody>
                                </table>

                                {enhancedAssets.length === 0 && (
                                    <div className="empty-state">
                                        <p>Chưa có tài sản nào. Hãy thêm tài sản đầu tiên!</p>
                                        <button className="btn btn-primary" onClick={handleNewAsset}>
                                            Thêm tài sản mới
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {activeTab === 'form' && (
                        <div className="tab-panel">
                            <div className="form-header">
                                <h3>{editingId ? 'Chỉnh sửa tài sản' : 'Thêm tài sản mới'}</h3>
                                <button className="btn btn-secondary" onClick={() => setActiveTab('list')}>
                                    Quay lại danh sách
                                </button>
                            </div>

                            <form onSubmit={handleSubmit} className="asset-form">
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="documentCode">Mã tài sản *</label>
                                        <input
                                            type="text"
                                            id="documentCode"
                                            name="documentCode"
                                            value={formData.documentCode}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Nhập mã tài sản"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="title">Tên tài sản *</label>
                                        <input
                                            type="text"
                                            id="title"
                                            name="title"
                                            value={formData.title}
                                            onChange={handleInputChange}
                                            required
                                            placeholder="Nhập tên tài sản"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="categoryId">Danh mục *</label>
                                        <select
                                            id="categoryId"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                            required
                                        >
                                            <option value="">Chọn danh mục</option>
                                            {categories.map(category => (
                                                <option key={category.id} value={category.id}>
                                                    {category.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="startingPrice">Giá khởi điểm (VNĐ) *</label>
                                        <input
                                            type="number"
                                            id="startingPrice"
                                            name="startingPrice"
                                            value={formData.startingPrice}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            placeholder="Nhập giá khởi điểm"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="stepPrice">Bước giá (VNĐ) *</label>
                                        <input
                                            type="number"
                                            id="stepPrice"
                                            name="stepPrice"
                                            value={formData.stepPrice}
                                            onChange={handleInputChange}
                                            required
                                            min="0"
                                            placeholder="Nhập bước giá"
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="auctionType">Loại đấu giá</label>
                                        <select
                                            id="auctionType"
                                            name="auctionType"
                                            value={formData.auctionType}
                                            onChange={handleInputChange}
                                        >
                                            <option value="OPEN">Đấu giá công khai</option>
                                            <option value="SEALED">Đấu giá bỏ phiếu kín</option>
                                        </select>
                                    </div>
                                </div>

                                <div className="form-group full-width">
                                    <label htmlFor="description">Mô tả</label>
                                    <textarea
                                        id="description"
                                        name="description"
                                        value={formData.description}
                                        onChange={handleInputChange}
                                        rows="4"
                                        placeholder="Nhập mô tả chi tiết về tài sản"
                                    />
                                </div>

                                <div className="form-group">
                                    <label>
                                        <input
                                            type="checkbox"
                                            name="isDepositRequired"
                                            checked={formData.isDepositRequired}
                                            onChange={handleInputChange}
                                        />
                                        Yêu cầu đặt cọc
                                    </label>
                                </div>

                                {formData.isDepositRequired && (
                                    <div className="form-group">
                                        <label htmlFor="depositAmount">Số tiền đặt cọc (VNĐ)</label>
                                        <input
                                            type="number"
                                            id="depositAmount"
                                            name="depositAmount"
                                            value={formData.depositAmount}
                                            onChange={handleInputChange}
                                            min="0"
                                            placeholder="Nhập số tiền đặt cọc"
                                        />
                                    </div>
                                )}

                                <div className="form-group full-width">
                                    <label htmlFor="files">Hình ảnh và tài liệu</label>
                                    <input
                                        type="file"
                                        id="files"
                                        name="files"
                                        onChange={handleFileChange}
                                        multiple
                                        accept="image/*,.pdf,.doc,.docx"
                                    />
                                    <small className="form-hint">
                                        Chọn nhiều file (hình ảnh, PDF, DOC, DOCX)
                                    </small>
                                </div>

                                <div className="form-actions">
                                    <button
                                        type="button"
                                        className="btn btn-secondary"
                                        onClick={resetForm}
                                    >
                                        Hủy
                                    </button>
                                    <button
                                        type="submit"
                                        className="btn btn-primary"
                                        disabled={isSubmitting}
                                    >
                                        {isSubmitting ? 'Đang xử lý...' : (editingId ? 'Cập nhật' : 'Tạo mới')}
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

// Helper function
const getInitialFormData = () => ({
    documentCode: '',
    title: '',
    description: '',
    categoryId: '',
    startingPrice: '',
    stepPrice: '',
    auctionType: 'OPEN',
    isDepositRequired: false,
    depositAmount: '',
    files: [],
    createSession: false,
    sessionCode: '',
    sessionTitle: '',
    sessionType: 'ONLINE',
    startTime: '',
    endTime: '',
});

export default AssetManagement;