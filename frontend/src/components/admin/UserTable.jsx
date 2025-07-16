// src/components/admin/UserTable.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/admin';
import { formatDate } from '../../utils/formatDate';

const UserTable = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('all');

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const response = await adminAPI.getUsers();
                if (response.success) {
                    setUsers(response.data || []);
                } else {
                    setError('Không thể tải danh sách người dùng');
                }
            } catch (err) {
                setError(err.message || 'Lỗi khi tải người dùng');
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, []);

    const filteredUsers = users.filter(user => {
        const matchesSearch = user.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            user.email?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = selectedFilter === 'all' || user.status === selectedFilter;
        return matchesSearch && matchesFilter;
    });

    if (loading) {
        return (
            <div className="dashboard-content">
                <div className="page-header">
                    <div className="page-title">
                        <h1>Quản lý người dùng</h1>
                        <div className="breadcrumb">
                            <span>Trang chủ</span> / <span>Người dùng</span>
                        </div>
                    </div>
                </div>
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
            </div>
        );
    }

    if (error) {
        return (
            <div className="dashboard-content">
                <div className="page-header">
                    <div className="page-title">
                        <h1>Quản lý người dùng</h1>
                        <div className="breadcrumb">
                            <span>Trang chủ</span> / <span>Người dùng</span>
                        </div>
                    </div>
                </div>
                <div style={{ color: 'red', textAlign: 'center', padding: '20px' }}>
                    Lỗi: {error}
                </div>
            </div>
        );
    }

    return (
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
                            <th>Vai trò</th>
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
                                        <div className="user-avatar">{user.username?.charAt(0) || 'U'}</div>
                                        <span>{user.username || 'N/A'}</span>
                                    </div>
                                </td>
                                <td>{user.email || 'N/A'}</td>
                                <td>
                    <span className={`role-badge ${user.role?.toLowerCase()}`}>
                      {user.role || 'N/A'}
                    </span>
                                </td>
                                <td>
                    <span className={`status ${user.status || 'inactive'}`}>
                      {user.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
                    </span>
                                </td>
                                <td>{formatDate(user.createdAt)}</td>
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
        </div>
    );
};

export default UserTable;
