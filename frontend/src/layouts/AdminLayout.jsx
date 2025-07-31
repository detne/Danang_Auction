import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/AdminDashboard.css';
import useLogout from '../hooks/common/useLogout';

const AdminLayout = ({ children, activeTab, onTabChange }) => {
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const navigate = useNavigate();
    const { user } = useUser();
    const logout = useLogout();

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    const menuItems = [
        { id: 'overview', icon: '📊', label: 'Tổng quan' },
        { id: 'users', icon: '👥', label: 'Người dùng' },
        { id: 'auctions', icon: '🏆', label: 'Phiên đấu giá' },
        { id: 'assets', icon: '📦', label: 'Tài sản' },
        { id: 'categories', icon: '📁', label: 'Danh mục' },
        { id: 'payments', icon: '💳', label: 'Thanh toán' },
        { id: 'reports', icon: '📈', label: 'Báo cáo' },
    ];

    const formatTime = (date) => date.toLocaleTimeString('vi-VN', {
        hour: '2-digit', minute: '2-digit', second: '2-digit'
    });

    const formatDate = (date) => date.toLocaleDateString('vi-VN', {
        day: '2-digit', month: '2-digit', year: 'numeric'
    });

    return (
        <div className="admin-dashboard">
            <button
                className={`sidebar-toggle ${sidebarCollapsed ? 'collapsed' : ''}`}
                onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                aria-label={sidebarCollapsed ? 'Hiển thị sidebar' : 'Ẩn sidebar'}
                aria-expanded={!sidebarCollapsed}
            >
                {sidebarCollapsed ? '→' : '←'}
            </button>
            <div className={`sidebar-2 ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">🏛️</div>
                        <h2>DaNangAuction</h2>
                    </div>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => onTabChange(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-profile">
                        <div className="admin-avatar">A</div>
                        <div className="admin-info">
                            <p>{user?.username || 'adminUser'}</p>
                            <small>{user?.email || 'admin@danangauction.com'}</small>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={logout}>
                        <span>🚪</span>
                        Đăng xuất
                    </button>
                </div>
            </div>

            <div className="main-content-1">
                <header className="dashboard-header">
                    <div className="header-left">
                        <div className="header-title">
                            <h1>Hệ thống quản lý đấu giá</h1>
                            <p>Chào mừng trở lại, {user?.username || 'adminUser'}!</p>
                        </div>
                    </div>
                    <div className="header-right">
                        <div className="header-time">
                            <span className="flag">🇻🇳</span>
                            <div className="time-info">
                                <div className="time">{formatTime(currentTime)}</div>
                                <div className="date">{formatDate(currentTime)}</div>
                            </div>
                        </div>
                        <div className="notifications">
                            <button className="notification-btn">
                                <span className="notification-icon">🔔</span>
                                <span className="notification-count">3</span>
                            </button>
                        </div>
                        <div className="user-menu">
                            <div className="user-avatar">{(user?.username || 'A').charAt(0)}</div>
                            <span className="user-name">{user?.username || 'adminUser'}</span>
                        </div>
                    </div>
                </header>

                <main className="dashboard-main">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
