import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import { getAdminStats, getAdminUsers, getAdminAuctions, getAdminCategories } from '../services/api';
import '../styles/AdminDashboard.css';

const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState('overview');
    const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date());
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAuctions: 0,
        totalRevenue: 0,
        activeAuctions: 0
    });
    const [users, setUsers] = useState([]);
    const [auctions, setAuctions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { user, setUser } = useUser();

    // Cập nhật thời gian realtime
    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);
        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        loadDashboardData();
    }, []);

    const loadDashboardData = async () => {
        setLoading(true);
        try {
            // Simulation data cho demo
            const mockStats = {
                totalUsers: 1250,
                totalAuctions: 340,
                totalRevenue: 15750000,
                activeAuctions: 28
            };

            const mockUsers = Array.from({ length: 20 }, (_, i) => ({
                id: i + 1,
                name: `Người dùng ${i + 1}`,
                email: `user${i + 1}@example.com`,
                status: i % 3 === 0 ? 'inactive' : 'active',
                joinDate: new Date(2024, Math.floor(Math.random() * 12), Math.floor(Math.random() * 28) + 1)
                    .toLocaleDateString('vi-VN')
            }));

            const mockAuctions = Array.from({ length: 15 }, (_, i) => ({
                id: i + 1,
                title: `Đấu giá sản phẩm ${i + 1}`,
                startPrice: (i + 1) * 100000,
                currentPrice: (i + 1) * 150000,
                status: i % 4 === 0 ? 'inactive' : 'active',
                endDate: new Date(2025, 6, Math.floor(Math.random() * 30) + 1)
                    .toLocaleDateString('vi-VN')
            }));

            const mockCategories = Array.from({ length: 8 }, (_, i) => ({
                id: i + 1,
                name: `Danh mục ${i + 1}`,
                status: i % 3 === 0 ? 'inactive' : 'active',
                itemCount: Math.floor(Math.random() * 100) + 10,
                updatedAt: new Date(2025, 5, Math.floor(Math.random() * 30) + 1)
                    .toLocaleDateString('vi-VN')
            }));

            // Sử dụng dữ liệu mock hoặc từ API
            setStats(mockStats);
            setUsers(mockUsers);
            setAuctions(mockAuctions);
            setCategories(mockCategories);

        } catch (error) {
            console.error('Lỗi khi tải dữ liệu dashboard:', error);
            // Fallback to mock data
            setStats({
                totalUsers: 0,
                totalAuctions: 0,
                totalRevenue: 0,
                activeAuctions: 0
            });
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const menuItems = [
        { id: 'overview', icon: '📊', label: 'Tổng quan', count: null },
        { id: 'users', icon: '👥', label: 'Người dùng', count: stats.totalUsers },
        { id: 'auctions', icon: '🏆', label: 'Phiên đấu giá', count: stats.totalAuctions },
        { id: 'categories', icon: '📁', label: 'Danh mục', count: categories.length },
        { id: 'payments', icon: '💳', label: 'Thanh toán', count: null },
        { id: 'reports', icon: '📈', label: 'Báo cáo', count: null },
        { id: 'settings', icon: '⚙️', label: 'Cài đặt', count: null }
    ];

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const formatTime = (date) => {
        return date.toLocaleTimeString('vi-VN', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
    };

    const formatDate = (date) => {
        return date.toLocaleDateString('vi-VN', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    };

    // Filter functions
    const filteredUsers = users.filter(user => {
        const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    const filteredAuctions = auctions.filter(auction => {
        const matchesSearch = auction.title.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || auction.status === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    const renderLoadingSpinner = () => (
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

    const renderOverview = () => (
        <div className="dashboard-content">
            <div className="page-header">
                <div className="page-title">
                    <h1>Tổng quan Dashboard</h1>
                    <div className="breadcrumb">
                        <span>Trang chủ</span> / <span>Tổng quan</span>
                    </div>
                </div>
            </div>

            {loading ? renderLoadingSpinner() : (
                <>
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

                    <div className="dashboard-charts">
                        <div className="chart-container">
                            <div className="chart-header">
                                <h3>Biểu đồ doanh thu 7 ngày qua</h3>
                                <div className="chart-actions">
                                    <button className="btn-chart">Tuần</button>
                                    <button className="btn-chart active">Tháng</button>
                                    <button className="btn-chart">Năm</button>
                                </div>
                            </div>
                            <div className="chart-placeholder">
                                <div className="chart-icon">📈</div>
                                <p>Biểu đồ doanh thu</p>
                                <small>Tích hợp chart library để hiển thị dữ liệu</small>
                            </div>
                        </div>

                        <div className="chart-container">
                            <div className="chart-header">
                                <h3>Phiên đấu giá gần đây</h3>
                                <a href="#" className="view-all">Xem tất cả</a>
                            </div>
                            <div className="recent-auctions">
                                {auctions.slice(0, 5).map(auction => (
                                    <div key={auction.id} className="auction-item">
                                        <div className="auction-info">
                                            <h4>{auction.title}</h4>
                                            <p>Giá hiện tại: <span className="price">{formatCurrency(auction.currentPrice)}</span></p>
                                        </div>
                                        <div className="auction-status">
                                            <span className={`status ${auction.status}`}>
                                                {auction.status === 'active' ? 'Đang diễn ra' : 'Đã kết thúc'}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );

    const renderUsers = () => (
        <div className="dashboard-content">
            <div className="page-header">
                <div className="page-title">
                    <h1>Quản lý người dùng</h1>
                    <div className="breadcrumb">
                        <span>Trang chủ</span> / <span>Người dùng</span>
                    </div>
                </div>
                <div className="page-actions">
                    <button className="btn-primary">
                        <span>+</span>
                        Thêm người dùng
                    </button>
                </div>
            </div>

            {loading ? renderLoadingSpinner() : (
                <div className="table-container">
                    <div className="table-header">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Tìm kiếm người dùng..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="search-btn">🔍</button>
                        </div>
                        <div className="table-filters">
                            <select
                                className="filter-select"
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Đang hoạt động</option>
                                <option value="inactive">Tạm khóa</option>
                            </select>
                            <button className="btn-filter">Lọc</button>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tên người dùng</th>
                                <th>Email</th>
                                <th>Trạng thái</th>
                                <th>Ngày tham gia</th>
                                <th>Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td>{user.id}</td>
                                    <td>
                                        <div className="user-info">
                                            <div className="user-avatar">{user.name?.charAt(0)}</div>
                                            <span>{user.name}</span>
                                        </div>
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                            <span className={`status ${user.status}`}>
                                                {user.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                                            </span>
                                    </td>
                                    <td>{user.joinDate}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-action edit" title="Chỉnh sửa">✏️</button>
                                            <button className="btn-action delete" title="Xóa">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {filteredUsers.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">👥</div>
                                <h3>Không tìm thấy người dùng</h3>
                                <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const renderAuctions = () => (
        <div className="dashboard-content">
            <div className="page-header">
                <div className="page-title">
                    <h1>Quản lý phiên đấu giá</h1>
                    <div className="breadcrumb">
                        <span>Trang chủ</span> / <span>Phiên đấu giá</span>
                    </div>
                </div>
                <div className="page-actions">
                    <button className="btn-primary">
                        <span>+</span>
                        Tạo phiên đấu giá
                    </button>
                </div>
            </div>

            {loading ? renderLoadingSpinner() : (
                <div className="table-container">
                    <div className="table-header">
                        <div className="search-box">
                            <input
                                type="text"
                                placeholder="Tìm kiếm phiên đấu giá..."
                                className="search-input"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                            <button className="search-btn">🔍</button>
                        </div>
                        <div className="table-filters">
                            <select
                                className="filter-select"
                                value={selectedFilter}
                                onChange={(e) => setSelectedFilter(e.target.value)}
                            >
                                <option value="all">Tất cả trạng thái</option>
                                <option value="active">Đang diễn ra</option>
                                <option value="inactive">Đã kết thúc</option>
                            </select>
                            <button className="btn-filter">Lọc</button>
                        </div>
                    </div>

                    <div className="table-wrapper">
                        <table className="data-table">
                            <thead>
                            <tr>
                                <th>ID</th>
                                <th>Tiêu đề</th>
                                <th>Giá khởi điểm</th>
                                <th>Giá hiện tại</th>
                                <th>Trạng thái</th>
                                <th>Ngày kết thúc</th>
                                <th>Thao tác</th>
                            </tr>
                            </thead>
                            <tbody>
                            {filteredAuctions.map(auction => (
                                <tr key={auction.id}>
                                    <td>{auction.id}</td>
                                    <td>
                                        <div className="auction-title">
                                            <strong>{auction.title}</strong>
                                        </div>
                                    </td>
                                    <td className="price">{formatCurrency(auction.startPrice)}</td>
                                    <td className="price current">{formatCurrency(auction.currentPrice)}</td>
                                    <td>
                                            <span className={`status ${auction.status}`}>
                                                {auction.status === 'active' ? 'Đang diễn ra' : 'Đã kết thúc'}
                                            </span>
                                    </td>
                                    <td>{auction.endDate}</td>
                                    <td>
                                        <div className="action-buttons">
                                            <button className="btn-action view" title="Xem chi tiết">👁️</button>
                                            <button className="btn-action edit" title="Chỉnh sửa">✏️</button>
                                            <button className="btn-action delete" title="Xóa">🗑️</button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                        {filteredAuctions.length === 0 && (
                            <div className="empty-state">
                                <div className="empty-icon">🏆</div>
                                <h3>Không tìm thấy phiên đấu giá</h3>
                                <p>Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc</p>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );

    const renderCategories = () => (
        <div className="dashboard-content">
            <div className="page-header">
                <div className="page-title">
                    <h1>Quản lý danh mục</h1>
                    <div className="breadcrumb">
                        <span>Trang chủ</span> / <span>Danh mục</span>
                    </div>
                </div>
                <div className="page-actions">
                    <button className="btn-primary">
                        <span>+</span>
                        Thêm danh mục
                    </button>
                </div>
            </div>

            {loading ? renderLoadingSpinner() : (
                <div className="categories-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '20px',
                    marginTop: '20px'
                }}>
                    {categories.map(category => (
                        <div key={category.id} className="category-card" style={{
                            background: 'white',
                            padding: '20px',
                            borderRadius: '10px',
                            boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                            border: '1px solid #e9ecef'
                        }}>
                            <div className="category-header" style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                marginBottom: '15px'
                            }}>
                                <h3 style={{ margin: 0, color: '#2c3e50' }}>{category.name}</h3>
                                <span className={`status ${category.status}`}>
                                    {category.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                                </span>
                            </div>
                            <div className="category-info" style={{ marginBottom: '15px' }}>
                                <p style={{ margin: '5px 0', color: '#6c757d' }}>
                                    <strong>{category.itemCount}</strong> sản phẩm
                                </p>
                                <p style={{ margin: '5px 0', color: '#6c757d', fontSize: '14px' }}>
                                    Cập nhật: {category.updatedAt}
                                </p>
                            </div>
                            <div className="category-actions" style={{
                                display: 'flex',
                                gap: '10px'
                            }}>
                                <button className="btn-action edit" style={{
                                    flex: 1,
                                    padding: '8px 16px',
                                    background: '#e3f2fd',
                                    color: '#1976d2',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}>Chỉnh sửa</button>
                                <button className="btn-action delete" style={{
                                    flex: 1,
                                    padding: '8px 16px',
                                    background: '#ffebee',
                                    color: '#d32f2f',
                                    border: 'none',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}>Xóa</button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const renderContent = () => {
        // Reset search khi chuyển tab
        if (activeTab !== 'users' && activeTab !== 'auctions') {
            if (searchTerm) setSearchTerm('');
            if (selectedFilter !== 'all') setSelectedFilter('all');
        }

        switch (activeTab) {
            case 'overview':
                return renderOverview();
            case 'users':
                return renderUsers();
            case 'auctions':
                return renderAuctions();
            case 'categories':
                return renderCategories();
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
                return renderOverview();
        }
    };

    return (
        <div className="admin-dashboard">
            <div className={`sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
                <div className="sidebar-header">
                    <div className="logo">
                        <div className="logo-icon">🏛️</div>
                        <h2>DaNangAuction</h2>
                    </div>
                    <button
                        className="sidebar-toggle"
                        onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
                    >
                        {sidebarCollapsed ? '→' : '←'}
                    </button>
                </div>

                <nav className="sidebar-nav">
                    {menuItems.map(item => (
                        <button
                            key={item.id}
                            className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                            onClick={() => setActiveTab(item.id)}
                        >
                            <span className="nav-icon">{item.icon}</span>
                            <span className="nav-label">{item.label}</span>
                            {item.count && <span className="nav-count">{item.count}</span>}
                        </button>
                    ))}
                </nav>

                <div className="sidebar-footer">
                    <div className="admin-profile">
                        <div className="admin-avatar">A</div>
                        <div className="admin-info">
                            <p>{user?.name || 'adminUser'}</p>
                            <small>{user?.email || 'admin@danangauction.com'}</small>
                        </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                        <span>🚪</span>
                        Đăng xuất
                    </button>
                </div>
            </div>

            <div className="main-content">
                <header className="dashboard-header">
                    <div className="header-left">
                        <div className="header-title">
                            <h1>Hệ thống quản lý đấu giá</h1>
                            <p>Chào mừng trở lại, {user?.name || 'adminUser'}!</p>
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
                            <div className="user-avatar">{(user?.name || 'A').charAt(0)}</div>
                            <span className="user-name">{user?.name || 'adminUser'}</span>
                        </div>
                    </div>
                </header>

                <main className="dashboard-main">
                    {renderContent()}
                </main>
            </div>

            {/* CSS cho animation spinner */}
            <style jsx>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default AdminDashboard;