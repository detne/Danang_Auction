// src/components/admin/OverviewSection.jsx
import React from 'react';
import { useAdminDashboard } from '../../hooks/admin/useAdminDashboard';

const OverviewSection = () => {
    const { stats, loading, error } = useAdminDashboard();

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    if (loading) {
        return (
            <div style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '40px',
                gap: '15px',
                color: '#6c757d'
            }}>
                <div style={{
                    width: '24px',
                    height: '24px',
                    border: '3px solid #f3f3f3',
                    borderTop: '3px solid #FF6B47',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
                <span>Đang tải dữ liệu...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                Lỗi: {error}
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            <div className="page-header">
                <div className="page-title">
                    <h1>Tổng quan Dashboard</h1>
                    <div className="breadcrumb">
                        <span>Trang chủ</span> / <span>Tổng quan</span>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card">
                    <div className="stat-icon users">👥</div>
                    <div className="stat-content">
                        <h3>{stats.totalUsers.toLocaleString()}</h3>
                        <p>Tổng người dùng</p>
                        <div className="stat-change positive">
                            <span>+12%</span>
                            <small>so với tháng trước</small>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon auctions">🏆</div>
                    <div className="stat-content">
                        <h3>{stats.totalAuctions}</h3>
                        <p>Tổng phiên đấu giá</p>
                        <div className="stat-change positive">
                            <span>+8%</span>
                            <small>so với tháng trước</small>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon revenue">💰</div>
                    <div className="stat-content">
                        <h3>{formatCurrency(stats.totalRevenue)}</h3>
                        <p>Doanh thu</p>
                        <div className="stat-change positive">
                            <span>+25%</span>
                            <small>so với tháng trước</small>
                        </div>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon active">🔥</div>
                    <div className="stat-content">
                        <h3>{stats.activeAuctions}</h3>
                        <p>Đấu giá đang diễn ra</p>
                        <div className="stat-change neutral">
                            <span>Realtime</span>
                            <small>cập nhật liên tục</small>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OverviewSection;