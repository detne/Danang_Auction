import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import { createAsset, deleteAsset, getAssets, updateAsset } from '../services/api';
import '../styles/AssetManagement.css';

const AssetManagement = () => {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const [assets, setAssets] = useState([]);
    const [formData, setFormData] = useState({
        // Thông tin tài sản
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

        // Thông tin phiên đấu giá (tùy chọn)
        createSession: false,
        sessionCode: '',
        sessionTitle: '',
        sessionType: 'ONLINE',
        startTime: '',
        endTime: '',
    });
    const [editingId, setEditingId] = useState(null);
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    // Danh sách categories (có thể fetch từ API)
    const categories = [
        { id: 1, name: 'Bất động sản' },
        { id: 2, name: 'Xe cộ' },
        { id: 3, name: 'Thiết bị văn phòng' },
        { id: 4, name: 'Máy móc' },
        { id: 5, name: 'Khác' }
    ];

    useEffect(() => {
        if (!loading && user && user.role !== 'ORGANIZER') {
            navigate('/');
        } else if (!loading && user) {
            fetchAssets();
        }
    }, [loading, user, navigate]);

    // Auto-hide message after 5 seconds
    useEffect(() => {
        if (message) {
            const timer = setTimeout(() => {
                setMessage('');
            }, 5000);
            return () => clearTimeout(timer);
        }
    }, [message]);

    const fetchAssets = async () => {
        setIsLoading(true);
        try {
            const response = await getAssets();
            const formattedAssets = response.map(asset => ({
                id: asset.id,
                documentCode: asset.documentCode,
                title: asset.title || asset.description,
                description: asset.description,
                categoryId: asset.categoryId,
                startingPrice: asset.startingPrice,
                stepPrice: asset.stepPrice,
                auctionType: asset.auctionType || 'OPEN',
                isDepositRequired: asset.isDepositRequired || false,
                depositAmount: asset.depositAmount || 0,
                createdAt: asset.createdAt,
                updatedAt: asset.updatedAt,
                status: asset.status || 'ACTIVE'
            }));
            setAssets(formattedAssets);
        } catch (error) {
            console.error('Error fetching assets:', error);
            setMessage('Không thể tải danh sách tài sản. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files);
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

        const validFiles = files.filter(file => {
            if (file.size > maxSize) {
                setMessage(`File ${file.name} quá lớn. Kích thước tối đa là 5MB.`);
                return false;
            }
            if (!allowedTypes.includes(file.type)) {
                setMessage(`File ${file.name} không được hỗ trợ. Chỉ chấp nhận ảnh, PDF và Word.`);
                return false;
            }
            return true;
        });

        setFormData((prev) => ({ ...prev, files: validFiles }));
    };

    const resetForm = () => {
        setFormData({
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
        setEditingId(null);
        setMessage('');
    };

    const validateForm = () => {
        const errors = [];

        if (!formData.documentCode.trim()) {
            errors.push('Mã tài sản là bắt buộc.');
        }

        if (!formData.title.trim()) {
            errors.push('Tiêu đề là bắt buộc.');
        }

        if (!formData.description.trim()) {
            errors.push('Mô tả là bắt buộc.');
        }

        if (!formData.startingPrice || parseFloat(formData.startingPrice) <= 0) {
            errors.push('Giá khởi điểm phải lớn hơn 0.');
        }

        if (!formData.stepPrice || parseFloat(formData.stepPrice) <= 0) {
            errors.push('Bước giá phải lớn hơn 0.');
        }

        if (formData.isDepositRequired && (!formData.depositAmount || parseFloat(formData.depositAmount) <= 0)) {
            errors.push('Số tiền đặt cọc phải lớn hơn 0 khi yêu cầu đặt cọc.');
        }

        if (formData.createSession) {
            if (!formData.sessionCode.trim()) {
                errors.push('Mã phiên đấu giá là bắt buộc.');
            }

            if (!formData.sessionTitle.trim()) {
                errors.push('Tiêu đề phiên đấu giá là bắt buộc.');
            }

            if (!formData.startTime) {
                errors.push('Thời gian bắt đầu là bắt buộc.');
            }

            if (!formData.endTime) {
                errors.push('Thời gian kết thúc là bắt buộc.');
            }

            if (formData.startTime && formData.endTime) {
                const startDate = new Date(formData.startTime);
                const endDate = new Date(formData.endTime);
                const now = new Date();

                if (startDate <= now) {
                    errors.push('Thời gian bắt đầu phải sau thời gian hiện tại.');
                }

                if (startDate >= endDate) {
                    errors.push('Thời gian kết thúc phải sau thời gian bắt đầu.');
                }

                const duration = (endDate - startDate) / (1000 * 60); // minutes
                if (duration < 30) {
                    errors.push('Phiên đấu giá phải kéo dài ít nhất 30 phút.');
                }
            }
        }

        return errors;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const errors = validateForm();
        if (errors.length > 0) {
            setMessage(errors.join(' '));
            return;
        }

        setIsLoading(true);
        const formDataToSend = new FormData();

        // Thông tin tài sản
        formDataToSend.append('documentCode', formData.documentCode.trim());
        formDataToSend.append('title', formData.title.trim());
        formDataToSend.append('description', formData.description.trim());
        formDataToSend.append('categoryId', formData.categoryId);
        formDataToSend.append('startingPrice', formData.startingPrice);
        formDataToSend.append('stepPrice', formData.stepPrice);
        formDataToSend.append('auctionType', formData.auctionType);
        formDataToSend.append('isDepositRequired', formData.isDepositRequired);
        if (formData.isDepositRequired) {
            formDataToSend.append('depositAmount', formData.depositAmount);
        }

        // Files
        formData.files.forEach((file) => formDataToSend.append('files', file));

        // Thông tin phiên đấu giá (nếu có)
        if (formData.createSession) {
            formDataToSend.append('createSession', true);
            formDataToSend.append('sessionCode', formData.sessionCode.trim());
            formDataToSend.append('sessionTitle', formData.sessionTitle.trim());
            formDataToSend.append('sessionType', formData.sessionType);
            formDataToSend.append('startTime', formData.startTime);
            formDataToSend.append('endTime', formData.endTime);
        }

        if (user && user.id) {
            formDataToSend.append('userId', user.id);
        }

        try {
            let response;
            if (editingId) {
                response = await updateAsset(editingId, formDataToSend);
            } else {
                response = await createAsset(formDataToSend);
            }

            const successMessage = editingId
                ? 'Cập nhật tài sản thành công!'
                : `Tạo tài sản thành công!${formData.createSession ? ' Phiên đấu giá đã được tạo kèm theo.' : ''}`;

            setMessage(successMessage);
            resetForm();
            fetchAssets();
        } catch (error) {
            console.error('Error saving asset:', error);
            setMessage(`Lỗi: ${error.message || 'Vui lòng thử lại.'}`);
        } finally {
            setIsLoading(false);
        }
    };

    const handleEdit = (asset) => {
        setEditingId(asset.id);
        setFormData({
            documentCode: asset.documentCode,
            title: asset.title || '',
            description: asset.description,
            categoryId: asset.categoryId || '',
            startingPrice: asset.startingPrice,
            stepPrice: asset.stepPrice,
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

        // Scroll to form
        document.querySelector('.asset-form').scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    };

    const handleDelete = async (id) => {
        if (window.confirm('Bạn có chắc muốn xóa tài sản này? Hành động này không thể hoàn tác.')) {
            setIsLoading(true);
            try {
                await deleteAsset(id);
                setMessage('Xóa tài sản thành công!');
                fetchAssets();
            } catch (error) {
                console.error('Error deleting asset:', error);
                setMessage(`Lỗi: ${error.message || 'Không thể xóa tài sản. Vui lòng thử lại.'}`);
            } finally {
                setIsLoading(false);
            }
        }
    };

    const handleCancel = () => {
        if (window.confirm('Bạn có chắc muốn hủy? Tất cả thông tin đã nhập sẽ bị mất.')) {
            resetForm();
        }
    };

    const formatPrice = (price) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(price);
    };

    const formatDate = (dateString) => {
        if (!dateString) return '';
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const getAuctionTypeText = (type) => {
        switch (type) {
            case 'OPEN': return 'Công khai';
            case 'SEALED': return 'Kín';
            case 'REVERSE': return 'Ngược';
            default: return type;
        }
    };

    const getCategoryName = (categoryId) => {
        const category = categories.find(cat => cat.id.toString() === categoryId.toString());
        return category ? category.name : 'Không xác định';
    };

    if (loading || isLoading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                Đang tải...
            </div>
        );
    }

    if (!user || user.role !== 'ORGANIZER') {
        return (
            <div className="no-access">
                <h3>Không có quyền truy cập</h3>
                <p>Bạn cần có quyền quản lý để truy cập trang này.</p>
            </div>
        );
    }

    return (
        <div className="asset-management-container">
            <h2>Quản lý Tài sản Đấu giá</h2>

            {message && (
                <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
                    {message}
                    <button
                        className="message-close"
                        onClick={() => setMessage('')}
                        aria-label="Đóng thông báo"
                    >
                        ×
                    </button>
                </div>
            )}

            <form onSubmit={handleSubmit} className="asset-form">
                {/* Thông tin tài sản */}
                <div className="form-section">
                    <h4>📋 Thông tin tài sản</h4>

                    <div className="form-group">
                        <label>Mã tài sản *</label>
                        <input
                            type="text"
                            name="documentCode"
                            value={formData.documentCode}
                            onChange={handleInputChange}
                            placeholder="Nhập mã tài sản (VD: TS001)"
                            required
                            maxLength={20}
                        />
                    </div>

                    <div className="form-group">
                        <label>Tiêu đề *</label>
                        <input
                            type="text"
                            name="title"
                            value={formData.title}
                            onChange={handleInputChange}
                            placeholder="Nhập tiêu đề tài sản"
                            required
                            maxLength={100}
                        />
                    </div>

                    <div className="form-group">
                        <label>Danh mục</label>
                        <select
                            name="categoryId"
                            value={formData.categoryId}
                            onChange={handleInputChange}
                        >
                            <option value="">Chọn danh mục</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Mô tả *</label>
                        <textarea
                            name="description"
                            value={formData.description}
                            onChange={handleInputChange}
                            placeholder="Nhập mô tả chi tiết về tài sản (trạng thái, đặc điểm, lịch sử...)"
                            required
                            maxLength={1000}
                        />
                        <small>{formData.description.length}/1000 ký tự</small>
                    </div>
                </div>

                {/* Thông tin đấu giá */}
                <div className="form-section">
                    <h4>💰 Thông tin đấu giá</h4>

                    <div className="form-group">
                        <label>Loại đấu giá</label>
                        <select
                            name="auctionType"
                            value={formData.auctionType}
                            onChange={handleInputChange}
                        >
                            <option value="OPEN">Đấu giá công khai</option>
                            <option value="SEALED">Đấu giá kín</option>
                            <option value="REVERSE">Đấu giá ngược</option>
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Giá khởi điểm (VNĐ) *</label>
                        <input
                            type="number"
                            name="startingPrice"
                            value={formData.startingPrice}
                            onChange={handleInputChange}
                            placeholder="0"
                            min="1000"
                            step="1000"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Bước giá (VNĐ) *</label>
                        <input
                            type="number"
                            name="stepPrice"
                            value={formData.stepPrice}
                            onChange={handleInputChange}
                            placeholder="0"
                            min="1000"
                            step="1000"
                            required
                        />
                    </div>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            name="isDepositRequired"
                            id="isDepositRequired"
                            checked={formData.isDepositRequired}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="isDepositRequired">Yêu cầu đặt cọc</label>
                    </div>

                    {formData.isDepositRequired && (
                        <div className="form-group">
                            <label>Số tiền đặt cọc (VNĐ) *</label>
                            <input
                                type="number"
                                name="depositAmount"
                                value={formData.depositAmount}
                                onChange={handleInputChange}
                                placeholder="0"
                                min="1000"
                                step="1000"
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Tải ảnh/tài liệu</label>
                        <input
                            type="file"
                            multiple
                            onChange={handleFileChange}
                            accept="image/*,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                        />
                        <small>Chấp nhận ảnh (JPG, PNG, GIF), PDF, Word. Tối đa 5MB mỗi file.</small>
                        {formData.files.length > 0 && (
                            <div className="file-list">
                                {formData.files.map((file, index) => (
                                    <span key={index} className="file-item">
                                        {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                {/* Thông tin phiên đấu giá */}
                <div className="form-section">
                    <h4>🕒 Phiên đấu giá (tùy chọn)</h4>

                    <div className="checkbox-group">
                        <input
                            type="checkbox"
                            name="createSession"
                            id="createSession"
                            checked={formData.createSession}
                            onChange={handleInputChange}
                        />
                        <label htmlFor="createSession">Tạo phiên đấu giá kèm theo</label>
                    </div>

                    {formData.createSession && (
                        <>
                            <div className="form-group">
                                <label>Mã phiên *</label>
                                <input
                                    type="text"
                                    name="sessionCode"
                                    value={formData.sessionCode}
                                    onChange={handleInputChange}
                                    placeholder="Nhập mã phiên đấu giá (VD: PH001)"
                                    maxLength={20}
                                />
                            </div>

                            <div className="form-group">
                                <label>Tiêu đề phiên *</label>
                                <input
                                    type="text"
                                    name="sessionTitle"
                                    value={formData.sessionTitle}
                                    onChange={handleInputChange}
                                    placeholder="Nhập tiêu đề phiên đấu giá"
                                    maxLength={100}
                                />
                            </div>

                            <div className="form-group">
                                <label>Loại phiên</label>
                                <select
                                    name="sessionType"
                                    value={formData.sessionType}
                                    onChange={handleInputChange}
                                >
                                    <option value="ONLINE">Trực tuyến</option>
                                    <option value="OFFLINE">Trực tiếp</option>
                                    <option value="HYBRID">Kết hợp</option>
                                </select>
                            </div>

                            <div className="form-group">
                                <label>Thời gian bắt đầu *</label>
                                <input
                                    type="datetime-local"
                                    name="startTime"
                                    value={formData.startTime}
                                    onChange={handleInputChange}
                                    min={new Date().toISOString().slice(0, 16)}
                                />
                            </div>

                            <div className="form-group">
                                <label>Thời gian kết thúc *</label>
                                <input
                                    type="datetime-local"
                                    name="endTime"
                                    value={formData.endTime}
                                    onChange={handleInputChange}
                                    min={formData.startTime}
                                />
                            </div>
                        </>
                    )}
                </div>

                <div className="form-actions">
                    <button
                        type="submit"
                        className="btn btn-primary"
                        disabled={isLoading}
                    >
                        {isLoading ? (
                            <>
                                <span className="spinner-small"></span>
                                {editingId ? 'Đang cập nhật...' : 'Đang tạo...'}
                            </>
                        ) : (
                            editingId ? 'Cập nhật tài sản' : 'Tạo mới tài sản'
                        )}
                    </button>
                    {editingId && (
                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                            disabled={isLoading}
                        >
                            Hủy chỉnh sửa
                        </button>
                    )}
                </div>
            </form>

            <h3>Danh sách Tài sản ({assets.length})</h3>
            <div className="asset-table-container">
                {assets.length > 0 ? (
                    <table className="asset-table">
                        <thead>
                        <tr>
                            <th>Mã tài sản</th>
                            <th>Tiêu đề</th>
                            <th>Danh mục</th>
                            <th>Mô tả</th>
                            <th>Giá khởi điểm</th>
                            <th>Bước giá</th>
                            <th>Loại đấu giá</th>
                            <th>Đặt cọc</th>
                            <th>Ngày tạo</th>
                            <th>Hành động</th>
                        </tr>
                        </thead>
                        <tbody>
                        {assets.map((asset) => (
                            <tr key={asset.id}>
                                <td><strong>{asset.documentCode}</strong></td>
                                <td>{asset.title}</td>
                                <td>{getCategoryName(asset.categoryId)}</td>
                                <td>
                                    <div className="description-cell">
                                        {asset.description.length > 50
                                            ? `${asset.description.substring(0, 50)}...`
                                            : asset.description}
                                    </div>
                                </td>
                                <td>{formatPrice(asset.startingPrice)}</td>
                                <td>{formatPrice(asset.stepPrice)}</td>
                                <td>
                                        <span className={`badge ${asset.auctionType?.toLowerCase()}`}>
                                            {getAuctionTypeText(asset.auctionType)}
                                        </span>
                                </td>
                                <td>
                                    {asset.isDepositRequired ? (
                                        <span className="deposit-required">
                                                ✅ {formatPrice(asset.depositAmount)}
                                            </span>
                                    ) : (
                                        <span className="no-deposit">❌</span>
                                    )}
                                </td>
                                <td>{formatDate(asset.createdAt)}</td>
                                <td>
                                    <div className="table-actions">
                                        <button
                                            className="btn btn-warning"
                                            onClick={() => handleEdit(asset)}
                                            disabled={isLoading}
                                            title="Chỉnh sửa tài sản"
                                        >
                                            Sửa
                                        </button>
                                        <button
                                            className="btn btn-danger"
                                            onClick={() => handleDelete(asset.id)}
                                            disabled={isLoading}
                                            title="Xóa tài sản"
                                        >
                                            Xóa
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                ) : (
                    <div className="empty-state">
                        <h4>Chưa có tài sản nào</h4>
                        <p>Hãy tạo tài sản đầu tiên của bạn bằng cách điền vào biểu mẫu trên.</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetManagement;