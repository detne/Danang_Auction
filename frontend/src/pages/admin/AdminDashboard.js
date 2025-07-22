// src/pages/admin/AdminDashboard.js
import React, { useState, useEffect } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';
import UserTable from '../../components/admin/UserTable';
import AuctionTable from '../../components/admin/AuctionTable';
import CategoryGrid from '../../components/admin/CategoryGrid';
import useAdminStats from '../../hooks/admin/useAdminStats';
import { USER_ROLES } from '../../utils/constants';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const { user, loading } = useUser();
    const navigate = useNavigate();

    // SỬ DỤNG CHUẨN HOOK
    const { summary, loading: statsLoading, error } = useAdminStats();
    console.log("[DEBUG] summary object:", summary);

    useEffect(() => {
        if (!loading && (!user || user.role !== USER_ROLES.ADMIN)) {
            navigate('/');
        }
    }, [loading, user, navigate]);

    const renderOverview = () => (
        <div className="dashboard-overview">
            <h2 style={{ fontSize: 28, marginBottom: 18, color: '#1f2d3d', fontWeight: 800 }}>Tổng quan hệ thống</h2>
            {statsLoading ? (
                <div>Đang tải số liệu...</div>
            ) : error ? (
                <div className="error">{error}</div>
            ) : (
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-label">Tổng số user:</span>
                        <span className="stat-value">{summary?.totalUsers ?? 0}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Tổng số phiên đấu giá:</span>
                        <span className="stat-value">{summary?.totalSessions ?? 0}</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Tổng doanh thu:</span>
                        <span className="stat-value">{summary?.totalRevenue?.toLocaleString('vi-VN') ?? 0} VNĐ</span>
                    </div>
                    <div className="stat-card">
                        <span className="stat-label">Tổng số tài sản:</span>
                        <span className="stat-value">{summary?.totalAssets ?? 0}</span>
                    </div>
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        switch (activeTab) {
            case 'users':
                return <UserTable />;
            case 'auctions':
                return <AuctionTable />;
            case 'overview':
                return renderOverview();
            case 'categories':
                return <CategoryGrid />;
            case 'payments':
                return (
                    <div className="dashboard-content">
                        <div className="page-header">
                            <div className="page-title">
                                <h1>Quản lý thanh toán</h1>
                                <div className="breadcrumb">
                                    <span>Trang chủ</span> / <span>Thanh toán</span>
                                </div>
                            </div>
                        </div>
                        <div className="empty-state">
                            <div className="empty-icon">💳</div>
                            <h3>Module thanh toán</h3>
                            <p>Tính năng đang được phát triển...</p>
                        </div>
                    </div>
                );
            case 'reports':
                return (
                    <div className="dashboard-content">
                        <div className="page-header">
                            <div className="page-title">
                                <h1>Báo cáo</h1>
                                <div className="breadcrumb">
                                    <span>Trang chủ</span> / <span>Báo cáo</span>
                                </div>
                            </div>
                        </div>
                        <div className="empty-state">
                            <div className="empty-icon">📈</div>
                            <h3>Module báo cáo</h3>
                            <p>Tính năng đang được phát triển...</p>
                        </div>
                    </div>
                );
            case 'settings':
                return (
                    <div className="dashboard-content">
                        <div className="page-header">
                            <div className="page-title">
                                <h1>Cài đặt hệ thống</h1>
                                <div className="breadcrumb">
                                    <span>Trang chủ</span> / <span>Cài đặt</span>
                                </div>
                            </div>
                        </div>
                        <div className="empty-state">
                            <div className="empty-icon">⚙️</div>
                            <h3>Module cài đặt</h3>
                            <p>Tính năng đang được phát triển...</p>
                        </div>
                    </div>
                );
            default:
                return <AuctionTable />;
        }
    };

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                Đang tải...
            </div>
        );
    }

    if (!user || user.role !== USER_ROLES.ADMIN) {
        return (
            <div className="no-access">
                <h3>Không có quyền truy cập</h3>
                <p>Bạn cần có quyền quản lý để truy cập trang này.</p>
            </div>
        );
    }

    return (
        <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
            {renderContent()}
        </AdminLayout>
    );
};

export default AdminDashboard;
