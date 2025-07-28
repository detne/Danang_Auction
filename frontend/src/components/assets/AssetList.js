// src/components/assets/AssetList.jsx
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import useAssets from '../../hooks/organizer/useAssets';
import { assetAPI } from '../../services/asset';
import { formatCurrency } from '../../utils/formatCurrency';
import { formatDate } from '../../utils/formatDate';
import { USER_ROLES, AUCTION_DOCUMENT_STATUS } from '../../utils/constants';
import '../../styles/AssetList.css';
import { FaEdit, FaTrash, FaUpload, FaEye } from 'react-icons/fa';

const auctionTypeMap = {
    PUBLIC: 'PUBLIC',
    PRIVATE: 'PRIVATE'
};

const statusMap = {
    PENDING_CREATE: 'Chờ tạo',
    PENDING_APPROVAL: 'Chờ duyệt',
    APPROVED: 'Đã duyệt',
    REJECTED: 'Từ chối'
};

const AssetList = () => {
    const { user, loading } = useUser();
    const navigate = useNavigate();
    const { assets, loading: assetsLoading, error, refetch } = useAssets();
    const [message, setMessage] = useState('');
    const [isDeleting, setIsDeleting] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);

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

    const handleEdit = (asset) => {
        navigate(`/asset-management/edit/${asset.id}`);
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
            setMessage(`Lỗi: ${error.message || 'Không thể xóa tài sản.'}`);
        } finally {
            setIsDeleting(false);
        }
    };

    const handleNewAsset = () => {
        navigate('/asset-management/new');
    };

    const handleUploadImages = (id) => {
        navigate(`/asset-management/${id}/upload-images`);
    };

    const handleViewDetail = (id) => {
        navigate(`/asset-management/detail/${id}`);
    };

    // Phân trang
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = assets.slice(indexOfFirstItem, indexOfLastItem);
    const totalPages = Math.ceil(assets.length / itemsPerPage);

    if (loading || assetsLoading) {
        return (
            <div className="asset-management-container">
                <div className="loading-container">
                    <div className="loading-spinner"></div>
                    <p>Đang tải dữ liệu...</p>
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
                <h1 className="page-title">Quản lý Tài sản Đấu giá</h1>
                <div className="breadcrumb">
                    <span>Trang chủ</span>
                    <span className="breadcrumb-separator"> / </span>
                    <span className="breadcrumb-current">Quản lý tài sản</span>
                </div>
            </div>

            {message && (
                <div className={`alert-message ${message.includes('thành công') ? 'success' : 'error'}`}>
                    <div className="alert-content">
                        <i className={`alert-icon ${message.includes('thành công') ? 'icon-success' : 'icon-error'}`}></i>
                        <span>{message}</span>
                        <button className="alert-close" onClick={() => setMessage('')}>×</button>
                    </div>
                </div>
            )}

            <div className="content-panel">
                <div className="panel-header">
                    <div className="header-info">
                        <h2>Danh sách Tài sản</h2>
                        <span className="total-count">Tổng cộng: {assets.length} tài sản</span>
                    </div>
                    <button className="btn btn-primary btn-add" onClick={handleNewAsset}>
                        <i className="icon-plus"></i>
                        Thêm tài sản mới
                    </button>
                </div>

                <div className="table-wrapper">
                    <div className="table-container">
                        <table className="modern-table">
                            <thead>
                                <tr>
                                    <th className="col-code">Mã tài sản</th>
                                    <th className="col-type">Loại đấu giá</th>
                                    <th className="col-deposit">Tiền đặt cọc</th>
                                    <th className="col-description">Mô tả</th>
                                    <th className="col-start">Thời gian bắt đầu</th>
                                    <th className="col-end">Thời gian kết thúc</th>
                                    <th className="col-starting">Giá khởi điểm</th>
                                    <th className="col-step">Bước giá</th>
                                    <th className="col-status">Trạng thái</th>
                                    <th className="col-actions">Thao tác</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((asset, index) => (
                                    <tr key={asset.id} className={index % 2 === 0 ? 'row-even' : 'row-odd'}>
                                        <td className="col-code">
                                            <div className="asset-code">
                                                <strong>{asset.document_code || asset.documentCode}</strong>
                                            </div>
                                        </td>
                                        <td className="col-type">
                                            <span className={`auction-type ${(asset.auction_type || asset.auctionType)?.toLowerCase()}`}>
                                                {auctionTypeMap[asset.auction_type || asset.auctionType] || 'Chưa xác định'}
                                            </span>
                                        </td>
                                        <td className="col-deposit">
                                            <div className="price-value">
                                                {(asset.deposit_amount || asset.depositAmount)
                                                    ? formatCurrency(asset.deposit_amount || asset.depositAmount)
                                                    : <span className="no-value">Không yêu cầu</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="col-description">
                                            <div className="description-text" title={asset.description}>
                                                {asset.description ?
                                                    (asset.description.length > 50
                                                        ? `${asset.description.substring(0, 50)}...`
                                                        : asset.description
                                                    ) :
                                                    <span className="no-value">Chưa có mô tả</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="col-start">
                                            <div className="datetime">
                                                {(asset.start_time || asset.startTime)
                                                    ? formatDate(asset.start_time || asset.startTime)
                                                    : <span className="no-value">Chưa xác định</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="col-end">
                                            <div className="datetime">
                                                {(asset.end_time || asset.endTime)
                                                    ? formatDate(asset.end_time || asset.endTime)
                                                    : <span className="no-value">Chưa xác định</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="col-starting">
                                            <div className="price-value starting-price">
                                                {(asset.starting_price || asset.startingPrice)
                                                    ? formatCurrency(asset.starting_price || asset.startingPrice)
                                                    : <span className="no-value">Chưa xác định</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="col-step">
                                            <div className="price-value">
                                                {(asset.step_price || asset.stepPrice)
                                                    ? formatCurrency(asset.step_price || asset.stepPrice)
                                                    : <span className="no-value">Chưa xác định</span>
                                                }
                                            </div>
                                        </td>
                                        <td className="col-status">
                                            <span className={`status-badge status-${(asset.status || AUCTION_DOCUMENT_STATUS.PENDING_CREATE).toLowerCase()}`}>
                                                {statusMap[asset.status?.toUpperCase()] || asset.status || 'Chờ tạo'}
                                            </span>
                                        </td>


                                        <td className="col-actions">
                                            <div className="action-buttons">
                                                <button className="btn btn-sm btn-view"
                                                    onClick={() => handleViewDetail(asset.id)}
                                                    title="Xem chi tiết">
                                                    <FaEye /> Xem
                                                </button>
                                                {asset.status === 'PENDING_CREATE' && (
                                                    <button className="btn btn-sm btn-edit"
                                                        onClick={() => handleEdit(asset)}
                                                        title="Chỉnh sửa">
                                                        <FaEdit /> Sửa
                                                    </button>
                                                )}
                                                <button className="btn btn-sm btn-upload"
                                                    onClick={() => handleUploadImages(asset.id)}
                                                    title="Tải ảnh">
                                                    <FaUpload /> Ảnh
                                                </button>
                                                <button className="btn btn-sm btn-delete"
                                                    onClick={() => handleDelete(asset.id)}
                                                    disabled={isDeleting}
                                                    title="Xóa">
                                                    <FaTrash /> Xoá
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>

                        {assets.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">
                                    <i className="icon-empty"></i>
                                </div>
                                <h3>Chưa có tài sản nào</h3>
                                <p>Hãy thêm tài sản đầu tiên để bắt đầu quản lý đấu giá!</p>
                                <button className="btn btn-primary" onClick={handleNewAsset}>
                                    <i className="icon-plus"></i>
                                    Thêm tài sản mới
                                </button>
                            </div>
                        )}
                    </div>
                </div>

                {/* Phân trang */}
                {totalPages > 1 && (
                    <div className="pagination">
                        <button
                            className="btn btn-pagination"
                            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            disabled={currentPage === 1}
                        >
                            <i className="icon-prev"></i>
                            Trước
                        </button>

                        <div className="pagination-info">
                            <span>Trang {currentPage} / {totalPages}</span>
                            <span className="separator">|</span>
                            <span>Hiển thị {indexOfFirstItem + 1} - {Math.min(indexOfLastItem, assets.length)} / {assets.length}</span>
                        </div>

                        <button
                            className="btn btn-pagination"
                            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            disabled={currentPage === totalPages}
                        >
                            Sau
                            <i className="icon-next"></i>
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default AssetList;