// src/components/AssetManagement.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import useAssets from '../hooks/organizer/useAssets';
import { assetAPI } from '../services/asset';
import { formatCurrency } from '../utils/formatCurrency';
import { formatDate } from '../utils/formatDate';
import { USER_ROLES, AUCTION_TYPE } from '../utils/constants';
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
    const [images, setImages] = useState([]);
    const [previewUrls, setPreviewUrls] = useState([]);
    const [formErrors, setFormErrors] = useState({});

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

    const auctionTypes = useMemo(() => [
        { value: 'PUBLIC', label: 'Đấu giá công khai' },
        { value: 'PRIVATE', label: 'Đấu giá kín' }
    ], []);

    // Cleanup preview URLs when component unmounts
    useEffect(() => {
        return () => {
            previewUrls.forEach(url => URL.revokeObjectURL(url));
        };
    }, [previewUrls]);

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
        setFormErrors({});
        setActiveTab('list');
        // Cleanup old preview URLs
        previewUrls.forEach(url => URL.revokeObjectURL(url));
        setImages([]);
        setPreviewUrls([]);
    }, [previewUrls]);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        const newValue = type === 'checkbox' ? checked : value;

        setFormData(prev => ({
            ...prev,
            [name]: newValue
        }));

        // Clear error for this field when user starts typing
        if (formErrors[name]) {
            setFormErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);

        if (selectedFiles.length > 10) {
            setMessage('Chỉ được chọn tối đa 10 ảnh.');
            return;
        }

        // Validate file types
        const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
        const invalidFiles = selectedFiles.filter(file => !validTypes.includes(file.type));

        if (invalidFiles.length > 0) {
            setMessage('Chỉ được chọn file ảnh (JPEG, PNG, GIF, WebP).');
            return;
        }

        // Validate file sizes (max 5MB per file)
        const maxSize = 5 * 1024 * 1024; // 5MB
        const oversizedFiles = selectedFiles.filter(file => file.size > maxSize);

        if (oversizedFiles.length > 0) {
            setMessage('Kích thước file không được vượt quá 5MB.');
            return;
        }

        // Cleanup old preview URLs
        previewUrls.forEach(url => URL.revokeObjectURL(url));

        const previews = selectedFiles.map(file => URL.createObjectURL(file));

        setImages(selectedFiles);
        setPreviewUrls(previews);

        // Clear image error if exists
        if (formErrors.images) {
            setFormErrors(prev => ({
                ...prev,
                images: ''
            }));
        }
    };

    const handleRemoveImage = (index) => {
        const newImages = [...images];
        const newPreviews = [...previewUrls];

        // Cleanup the URL for the removed image
        URL.revokeObjectURL(newPreviews[index]);

        newImages.splice(index, 1);
        newPreviews.splice(index, 1);

        setImages(newImages);
        setPreviewUrls(newPreviews);
    };

    const validateForm = () => {
        const errors = {};
        const required = ['categoryId', 'startingPrice', 'stepPrice'];

        // Check required fields
        for (let field of required) {
            if (!formData[field]) {
                errors[field] = `Vui lòng nhập ${getFieldLabel(field)}`;
            }
        }

        // Validate numeric fields
        if (formData.startingPrice) {
            const startingPrice = parseFloat(formData.startingPrice);
            if (isNaN(startingPrice) || startingPrice <= 0) {
                errors.startingPrice = 'Giá khởi điểm phải là số dương';
            }
        }

        if (formData.stepPrice) {
            const stepPrice = parseFloat(formData.stepPrice);
            if (isNaN(stepPrice) || stepPrice <= 0) {
                errors.stepPrice = 'Bước giá phải là số dương';
            }
        }

        // Validate deposit amount if required
        if (formData.isDepositRequired) {
            if (!formData.depositAmount) {
                errors.depositAmount = 'Vui lòng nhập số tiền đặt cọc';
            } else {
                const depositAmount = parseFloat(formData.depositAmount);
                if (isNaN(depositAmount) || depositAmount <= 0) {
                    errors.depositAmount = 'Số tiền đặt cọc phải là số dương';
                }
            }
        }

        // Validate time fields
        if (formData.startTime && formData.endTime) {
            const startTime = new Date(formData.startTime);
            const endTime = new Date(formData.endTime);
            const now = new Date();

            if (startTime <= now) {
                errors.startTime = 'Thời gian bắt đầu phải sau thời gian hiện tại';
            }

            if (startTime >= endTime) {
                errors.endTime = 'Thời gian kết thúc phải sau thời gian bắt đầu';
            }
        }

        // Validate images (only for new assets)
        if (!editingId && images.length === 0) {
            errors.images = 'Vui lòng chọn ít nhất 1 ảnh cho tài sản';
        }

        setFormErrors(errors);

        if (Object.keys(errors).length > 0) {
            const firstError = Object.values(errors)[0];
            setMessage(firstError);
            return false;
        }

        return true;
    };

    const getFieldLabel = (field) => {
        const labels = {
            documentCode: 'mã tài sản',
            categoryId: 'danh mục',
            startingPrice: 'giá khởi điểm',
            stepPrice: 'bước giá',
            depositAmount: 'số tiền đặt cọc',
            startTime: 'thời gian bắt đầu',
            endTime: 'thời gian kết thúc',
            images: 'hình ảnh'
        };
        return labels[field] || field;
    };

    const handleSubmit = async (e) => {
        console.log('Submit click');
        console.log('Form data:', formData);


        e.preventDefault();

        if (!validateForm()) return;

        setIsSubmitting(true);

        try {
            // Prepare data according to API structure
            const submitData = {
                // Only include documentCode if it's provided and not empty
                categoryId: parseInt(formData.categoryId),
                startingPrice: parseFloat(formData.startingPrice),
                stepPrice: parseFloat(formData.stepPrice),
                description: formData.description?.trim() || null,
                isDepositRequired: formData.isDepositRequired,
                depositAmount: formData.isDepositRequired ? parseFloat(formData.depositAmount) : null,
                auctionType: formData.auctionType,
                registeredAt: formData.registeredAt || null,
                startTime: formData.startTime || null,
                endTime: formData.endTime || null
            };

            let response;
            if (editingId) {
                response = await assetAPI.updateAsset(editingId, submitData);
            } else {
                response = await assetAPI.createAsset(submitData);
            }

            console.log('API response:', response);

            if (response && (response.success || response.id)) {
                setMessage(`${editingId ? 'Cập nhật' : 'Tạo'} tài sản thành công!`);

                // ✅ Upload ảnh nếu là tài sản mới
                if (!editingId && images.length > 0) {
                    try {
                        const formDataImages = new FormData();
                        images.forEach(img => formDataImages.append('images', img)); // 👈 phải là "images"

                        const uploadResponse = await assetAPI.uploadAssetImages(response.data.id, images);
                        if (uploadResponse.success) {
                            setMessage('Tạo tài sản & upload ảnh thành công!');
                            // setPreviewUrls(uploadResponse.data.map(img => img.url)); // nếu cần
                        } else {
                            setMessage('Tạo tài sản thành công nhưng lỗi khi upload ảnh.');
                        }
                    } catch (uploadError) {
                        console.error('Error uploading images:', uploadError);
                        setMessage('Tài sản đã được tạo nhưng có lỗi khi upload ảnh.');
                    }
                }


                resetForm();
                refetch();
            } else {
                setMessage(response?.message || 'Có lỗi xảy ra khi lưu tài sản');
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
            categoryId: asset.categoryId || '',
            startingPrice: asset.startingPrice || '',
            stepPrice: asset.stepPrice || '',
            description: asset.description || '',
            isDepositRequired: asset.isDepositRequired || false,
            depositAmount: asset.depositAmount || '',
            auctionType: asset.auctionType || 'PUBLIC',
            startTime: asset.startTime ? formatDateTimeLocal(asset.startTime) : '',
            endTime: asset.endTime ? formatDateTimeLocal(asset.endTime) : ''
        });
        setFormErrors({});
        setActiveTab('form');
    };

    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Bạn có chắc muốn xóa tài sản này?')) return;

        setIsDeleting(true);

        try {
            const response = await assetAPI.deleteAsset(id);

            if (response.success) {
                setMessage('Xóa tài sản thành công!');
                refetch();
            } else {
                setMessage(response.message || 'Không thể xóa tài sản.');
            }
        } catch (error) {
            console.error('Error deleting asset:', error);
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
            auctionTypeName: auctionTypes.find(type => type.value === asset.auctionType)?.label || 'Không xác định'
        }));
    }, [assets, categoryMap, auctionTypes]);

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
                                            <th>Danh mục</th>
                                            <th>Giá khởi điểm</th>
                                            <th>Bước giá</th>
                                            <th>Loại đấu giá</th>
                                            <th>Đặt cọc</th>
                                            <th>Ngày tạo</th>
                                            <th>Trạng thái</th>
                                            <th>Thao tác</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {enhancedAssets.map((asset) => (
                                            <tr key={asset.id}>
                                                <td>{asset.documentCode}</td>
                                                <td>{asset.categoryName}</td>
                                                <td>{asset.formattedStartingPrice}</td>
                                                <td>{asset.formattedStepPrice}</td>
                                                <td>{asset.auctionTypeName}</td>
                                                <td>
                                                    <span className={`deposit-status ${asset.isDepositRequired ? 'required' : 'not-required'}`}>
                                                        {asset.isDepositRequired ? 'Có' : 'Không'}
                                                    </span>
                                                </td>
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
                                        <label htmlFor="categoryId">Danh mục *</label>
                                        <select
                                            id="categoryId"
                                            name="categoryId"
                                            value={formData.categoryId}
                                            onChange={handleInputChange}
                                            className={formErrors.categoryId ? 'error' : ''}
                                        >
                                            <option value="">-- Chọn danh mục --</option>
                                            {categories.map(cat => (
                                                <option key={cat.id} value={cat.id}>
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                        {formErrors.categoryId && (
                                            <span className="error-text">{formErrors.categoryId}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="startingPrice">Giá khởi điểm (VNĐ) *</label>
                                        <input
                                            type="number"
                                            id="startingPrice"
                                            name="startingPrice"
                                            value={formData.startingPrice}
                                            onChange={handleInputChange}
                                            className={formErrors.startingPrice ? 'error' : ''}
                                            required
                                            min="1000"
                                            step="1000"
                                            placeholder="Nhập giá khởi điểm"
                                        />
                                        {formErrors.startingPrice && (
                                            <span className="error-text">{formErrors.startingPrice}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="stepPrice">Bước giá (VNĐ) *</label>
                                        <input
                                            type="number"
                                            id="stepPrice"
                                            name="stepPrice"
                                            value={formData.stepPrice}
                                            onChange={handleInputChange}
                                            className={formErrors.stepPrice ? 'error' : ''}
                                            required
                                            min="1000"
                                            step="1000"
                                            placeholder="Nhập bước giá"
                                        />
                                        {formErrors.stepPrice && (
                                            <span className="error-text">{formErrors.stepPrice}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="auctionType">Loại đấu giá</label>
                                        <select
                                            id="auctionType"
                                            name="auctionType"
                                            value={formData.auctionType}
                                            onChange={handleInputChange}
                                        >
                                            {auctionTypes.map(type => (
                                                <option key={type.value} value={type.value}>
                                                    {type.label}
                                                </option>
                                            ))}
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="startTime">Thời gian bắt đầu</label>
                                        <input
                                            type="datetime-local"
                                            id="startTime"
                                            name="startTime"
                                            value={formData.startTime}
                                            onChange={handleInputChange}
                                            className={formErrors.startTime ? 'error' : ''}
                                        />
                                        {formErrors.startTime && (
                                            <span className="error-text">{formErrors.startTime}</span>
                                        )}
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="endTime">Thời gian kết thúc</label>
                                        <input
                                            type="datetime-local"
                                            id="endTime"
                                            name="endTime"
                                            value={formData.endTime}
                                            onChange={handleInputChange}
                                            className={formErrors.endTime ? 'error' : ''}
                                        />
                                        {formErrors.endTime && (
                                            <span className="error-text">{formErrors.endTime}</span>
                                        )}
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
                                    <label className="checkbox-label">
                                        <input
                                            type="checkbox"
                                            name="isDepositRequired"
                                            checked={formData.isDepositRequired}
                                            onChange={handleInputChange}
                                        />
                                        <span className="checkbox-text">Yêu cầu đặt cọc</span>
                                    </label>
                                </div>

                                {formData.isDepositRequired && (
                                    <div className="form-group">
                                        <label htmlFor="depositAmount">Số tiền đặt cọc (VNĐ) *</label>
                                        <input
                                            type="number"
                                            id="depositAmount"
                                            name="depositAmount"
                                            value={formData.depositAmount}
                                            onChange={handleInputChange}
                                            className={formErrors.depositAmount ? 'error' : ''}
                                            min="1000"
                                            step="1000"
                                            placeholder="Nhập số tiền đặt cọc"
                                            required
                                        />
                                        {formErrors.depositAmount && (
                                            <span className="error-text">{formErrors.depositAmount}</span>
                                        )}
                                    </div>
                                )}

                                <div className="form-group full-width">
                                    <label htmlFor="images">
                                        Hình ảnh {!editingId && '*'}
                                        <span className="form-help">(Tối đa 10 ảnh, mỗi ảnh tối đa 5MB)</span>
                                    </label>
                                    <input
                                        type="file"
                                        id="images"
                                        multiple
                                        accept="image/jpeg,image/jpg,image/png,image/gif,image/webp"
                                        onChange={handleImageChange}
                                        className={formErrors.images ? 'error' : ''}
                                    />
                                    {formErrors.images && (
                                        <span className="error-text">{formErrors.images}</span>
                                    )}

                                    {previewUrls.length > 0 && (
                                        <div className="preview-images">
                                            {previewUrls.map((url, index) => (
                                                <div key={index} className="preview-item">
                                                    <img src={url} alt={`Ảnh ${index + 1}`} className="preview-thumbnail" />
                                                    <button
                                                        type="button"
                                                        className="btn btn-danger btn-sm"
                                                        onClick={() => handleRemoveImage(index)}
                                                    >
                                                        Xóa
                                                    </button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
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
                                        {isSubmitting
                                            ? 'Đang xử lý...'
                                            : (editingId ? 'Cập nhật' : 'Tạo mới')}
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
    categoryId: '',
    startingPrice: '',
    stepPrice: '',
    description: '',
    isDepositRequired: false,
    depositAmount: '',
    auctionType: AUCTION_TYPE.PUBLIC,
    startTime: '',
    endTime: ''
});

export default AssetManagement;
