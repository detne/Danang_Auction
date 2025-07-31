// src/components/assets/AssetForm.jsx
import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate, useParams } from 'react-router-dom';
import { assetAPI } from '../../services/asset';
import { USER_ROLES, AUCTION_TYPE } from '../../utils/constants';
import '../../styles/AssetManagement.css';

const AssetForm = () => {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const { id } = useParams(); // id từ URL để biết là edit hay create
    const isEditing = !!id;

    const [formData, setFormData] = useState(getInitialFormData());
    const [message, setMessage] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [formErrors, setFormErrors] = useState({});

    const categories = useMemo(() => [
        { id: 1, name: 'Bất động sản' },
        { id: 2, name: 'Xe cộ' },
        { id: 3, name: 'Thiết bị văn phòng' },
        { id: 4, name: 'Máy móc' },
        { id: 5, name: 'Khác' }
    ], []);

    const auctionTypes = useMemo(() => [
        { value: 'PUBLIC', label: 'Đấu giá công khai' },
        { value: 'PRIVATE', label: 'Đấu giá kín' }
    ], []);

    // Check user permission
    useEffect(() => {
        if (!loading && user?.role !== USER_ROLES.ORGANIZER) {
            navigate('/');
        }
    }, [loading, user, navigate]);

    // Auto hide message
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => setMessage(''), 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    // Load asset data for editing
    useEffect(() => {
        const loadAsset = async () => {
            if (!isEditing) return;

            setIsLoading(true);
            try {
                const response = await assetAPI.getAssetById(id);
                if (response.success && response.data) {
                    const asset = response.data;
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
                } else {
                    setMessage('Không tìm thấy tài sản cần chỉnh sửa');
                    navigate('/asset-management');
                }
            } catch (error) {
                console.error('Error loading asset:', error);
                setMessage('Lỗi khi tải thông tin tài sản');
                navigate('/asset-management');
            } finally {
                setIsLoading(false);
            }
        };

        loadAsset();
    }, [id, isEditing, navigate]);

    const formatDateTimeLocal = (dateString) => {
        if (!dateString) return '';
        const date = new Date(dateString);
        return date.toISOString().slice(0, 16);
    };
    
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
            endTime: 'thời gian kết thúc'
        };
        return labels[field] || field;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) return;
        setIsSubmitting(true);

        try {
            const toLocalDateTimeString = (dtStr) => {
                if (!dtStr) return null;
                return dtStr.length === 16 ? dtStr + ':00' : dtStr;
            };

            const submitData = {
                category_id: parseInt(formData.categoryId),
                starting_price: parseFloat(formData.startingPrice),
                step_price: parseFloat(formData.stepPrice),
                description: formData.description?.trim() || null,
                is_deposit_required: formData.isDepositRequired,
                deposit_amount: formData.isDepositRequired ? parseFloat(formData.depositAmount) : null,
                auction_type: formData.auctionType,
                start_time: toLocalDateTimeString(formData.startTime),
                end_time: toLocalDateTimeString(formData.endTime)
            };

            let response;
            if (isEditing) {
                response = await assetAPI.updateAsset(id, submitData);
            } else {
                response = await assetAPI.createAsset(submitData);
            }

            // Sửa logic tại đây!
            if (!isEditing && response && (response.success || response.id || response.data?.id)) {
                const assetId = response.data?.id || response.id;
                setMessage('Tạo tài sản thành công! Tiếp tục tải ảnh lên.');
                setTimeout(() => {
                    navigate(`/asset-management/${assetId}/upload-images`);
                }, 800);
                return;
            }

            if (isEditing && (response.success || response.id)) {
                setMessage('Cập nhật tài sản thành công!');
                setTimeout(() => {
                    navigate('/asset-management');
                }, 800);
            } else if (!response.success) {
                setMessage(response?.message || 'Có lỗi xảy ra khi lưu tài sản');
            }
        } catch (error) {
            console.error('Error saving asset:', error);
            setMessage(`Lỗi: ${error.message || 'Không thể lưu tài sản'}`);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCancel = () => {
        if (window.confirm('Bạn có chắc muốn hủy? Dữ liệu chưa lưu sẽ bị mất.')) {
            navigate('/asset-management');
        }
    };

    if (loading || isLoading) {
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
                <h2>{isEditing ? 'Chỉnh sửa tài sản' : 'Thêm tài sản mới'}</h2>
            </div>
            <div className="breadcrumb-4" style={{ marginTop: "-12px", marginBottom: "28px", width: "1127.2px" }}>
                <span>Trang chủ</span>
                <span className="breadcrumb-separator"> / </span>
                <span
                    className="breadcrumb-link"
                    onClick={() => navigate('/asset-management')}
                    style={{ cursor: 'pointer', color: '#007bff' }}
                >
                    Quản lý tài sản
                </span>
                <span className="breadcrumb-separator"> / </span>
                <span className="breadcrumb-current">
                    {isEditing ? 'Chỉnh sửa' : 'Thêm mới'}
                </span>
            </div>

            {message && (
                <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
                    {message}
                    <button className="message-close" onClick={() => setMessage('')}>×</button>
                </div>
            )}

            <div className="tab-panel">
                <div className="form-header">
                    <h3>{isEditing ? 'Chỉnh sửa tài sản' : 'Thêm tài sản mới'}</h3>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/asset-management')}
                    >
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
                            <label htmlFor="startingPrice">Giá khởi điểm ($)*</label>
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
                            <label htmlFor="stepPrice">Bước giá ($) *</label>
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
                            <label htmlFor="startTime" style={{ width: "193.6px" }}>Thời gian bắt đầu</label>
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
                            <label htmlFor="endTime" style={{ width: "193.6px" }}>Thời gian kết thúc</label>
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
                        <label className="checkbox-label" style={{ width: "200px" }}>
                            <input
                                type="checkbox"
                                name="isDepositRequired"
                                checked={formData.isDepositRequired}
                                onChange={handleInputChange}
                            />
                            <span className="checkbox-text" >Yêu cầu đặt cọc</span>
                        </label>
                    </div>

                    {formData.isDepositRequired && (
                        <div className="form-group">
                            <label htmlFor="depositAmount" style={{ width: "193.6px" }}>Số tiền đặt cọc ($)*</label>
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

                    <div className="form-actions">
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                            disabled={isSubmitting}
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
                                : (isEditing ? 'Cập nhật' : 'Tạo mới')}
                        </button>
                    </div>
                </form>
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

export default AssetForm;