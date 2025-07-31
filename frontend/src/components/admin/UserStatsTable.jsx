import React, { useEffect, useState } from 'react';
import { adminAPI } from '../../services/admin';
import '../../styles/UserStatsTable.css';

const UserStatsTable = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // States cho quản lý người dùng
  const [selectedTab, setSelectedTab] = useState('stats');
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserDetail, setShowUserDetail] = useState(false);
  const [showVerifyModal, setShowVerifyModal] = useState(false);
  const [verifyData, setVerifyData] = useState({ status: '', reason: '' });

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        const result = await adminAPI.getUserStatstats();
        setData(result);
      } catch (err) {
        console.error('Lỗi khi tải thống kê người dùng:', err);
        setError('Không thể tải dữ liệu');
        setData(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Lấy danh sách người dùng theo trạng thái
  const fetchUsersByStatus = async (status) => {
    try {
      setLoadingUsers(true);
      const token = localStorage.getItem('authToken');
      const result = await adminAPI.getUsersByStatus(status, token);
      setUsers(result.data || result);
    } catch (err) {
      console.error(`Lỗi khi tải danh sách người dùng ${status}:`, err);
      setUsers([]);
    } finally {
      setLoadingUsers(false);
    }
  };

  // Lấy chi tiết người dùng
  const fetchUserDetail = async (userId) => {
    try {
      const token = localStorage.getItem('authToken');
      const result = await adminAPI.getUserDetail(userId, token);
      setSelectedUser(result.data || result);
      setShowUserDetail(true);
    } catch (err) {
      console.error('Lỗi khi tải chi tiết người dùng:', err);
      alert('Không thể tải chi tiết người dùng');
    }
  };

  // Xác minh người dùng
  const handleVerifyUser = async () => {
    if (!selectedUser || !verifyData.status) {
      alert('Vui lòng chọn trạng thái xác minh');
      return;
    }

    if ((verifyData.status === 'rejected' || verifyData.status === 'update-cccd') && !verifyData.reason) {
      alert('Vui lòng nhập lý do');
      return;
    }

    try {
      const token = localStorage.getItem('authToken');
      await adminAPI.verifyUser(selectedUser.id, verifyData, token);
      alert('Xác minh thành công');
      setShowVerifyModal(false);
      setVerifyData({ status: '', reason: '' });

      if (selectedTab !== 'stats') {
        fetchUsersByStatus(selectedTab);
      }
    } catch (err) {
      console.error('Lỗi khi xác minh người dùng:', err);
      alert('Xác minh thất bại: ' + (err.response?.data?.message || err.message));
    }
  };

  // Xử lý chuyển tab
  const handleTabChange = (tab) => {
    setSelectedTab(tab);
    if (tab !== 'stats') {
      fetchUsersByStatus(tab);
    }
  };

  // Role và status mapping
  const roleMapping = {
    'BIDDER': { label: 'Người đấu giá', icon: '🏷️', color: '#3b82f6' },
    'ADMIN': { label: 'Quản trị viên', icon: '👨‍💼', color: '#ef4444' },
    'ORGANIZER': { label: 'Tổ chức viên', icon: '📋', color: '#10b981' }
  };

  const statusMapping = {
    'ACTIVE': { label: 'Hoạt động', icon: '✅', color: '#10b981' },
    'INACTIVE': { label: 'Không hoạt động', icon: '❌', color: '#ef4444' },
    'PENDING': { label: 'Chờ duyệt', icon: '⏳', color: '#f59e0b' }
  };

  const accountTypeMapping = {
    'INDIVIDUAL': { label: 'Cá nhân', icon: '👤' },
    'ORGANIZATION': { label: 'Tổ chức', icon: '🏢' }
  };

  const genderMapping = {
    'MALE': 'Nam',
    'FEMALE': 'Nữ',
    'OTHER': 'Khác'
  };

  // Format date function
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  if (loading) {
    return (
        <div className="user-stats-table">
          <div className="loading-card">
            <div className="loading-spinner"></div>
            <p>Đang tải dữ liệu...</p>
          </div>
        </div>
    );
  }

  if (error) {
    return (
        <div className="user-stats-table">
          <div className="error-card">
            <div className="error-icon">⚠️</div>
            <p>{error}</p>
          </div>
        </div>
    );
  }

  const totalUsers = Object.values(data?.byRole || {}).reduce((sum, count) => sum + count, 0);

  return (
      <div className="user-stats-table">
        {/* Header với tổng quan */}
        <div className="stats-header">
          <div className="header-content">
            <div className="header-icon">👥</div>
            <div>
              <h2>Quản lý người dùng</h2>
              <p className="subtitle">Tổng số người dùng: <span className="total-count">{totalUsers}</span></p>
            </div>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="nav-tabs">
          <button
              className={`tab-button ${selectedTab === 'stats' ? 'active' : ''}`}
              onClick={() => handleTabChange('stats')}
          >
            📊 Thống kê
          </button>
          <button
              className={`tab-button ${selectedTab === 'pending' ? 'active' : ''}`}
              onClick={() => handleTabChange('pending')}
          >
            ⏳ Chờ duyệt
          </button>
          <button
              className={`tab-button ${selectedTab === 'approved' ? 'active' : ''}`}
              onClick={() => handleTabChange('approved')}
          >
            ✅ Đã duyệt
          </button>
          <button
              className={`tab-button ${selectedTab === 'rejected' ? 'active' : ''}`}
              onClick={() => handleTabChange('rejected')}
          >
            ❌ Bị từ chối
          </button>
        </div>

        {/* Content based on selected tab */}
        {selectedTab === 'stats' ? (
            /* Stats Cards */
            <div className="stats-grid">
              {/* Thống kê theo vai trò */}
              <div className="stats-section">
                <h3 className="section-title">
                  <span className="section-icon">🎭</span>
                  Phân loại theo vai trò
                </h3>
                <div className="stats-cards">
                  {data?.byRole && Object.entries(data.byRole).map(([role, count]) => {
                    const roleInfo = roleMapping[role] || { label: role, icon: '👤', color: '#6b7280' };
                    return (
                        <div key={role} className="stat-card" style={{'--accent-color': roleInfo.color}}>
                          <div className="card-icon">{roleInfo.icon}</div>
                          <div className="card-content">
                            <div className="card-label">{roleInfo.label}</div>
                            <div className="card-value">{count}</div>
                          </div>
                          <div className="card-accent"></div>
                        </div>
                    );
                  })}
                </div>
              </div>

              {/* Thống kê theo trạng thái */}
              <div className="stats-section">
                <h3 className="section-title">
                  <span className="section-icon">📊</span>
                  Phân loại theo trạng thái
                </h3>
                <div className="stats-cards">
                  {data?.byStatus && Object.entries(data.byStatus).map(([status, count]) => {
                    const statusInfo = statusMapping[status] || { label: status, icon: '❓', color: '#6b7280' };
                    return (
                        <div key={status} className="stat-card" style={{'--accent-color': statusInfo.color}}>
                          <div className="card-icon">{statusInfo.icon}</div>
                          <div className="card-content">
                            <div className="card-label">{statusInfo.label}</div>
                            <div className="card-value">{count}</div>
                          </div>
                          <div className="card-accent"></div>
                        </div>
                    );
                  })}
                </div>
              </div>
            </div>
        ) : (
            /* User List */
            <div className="user-list-section">
              {loadingUsers ? (
                  <div className="user-loading-spinner">Đang tải danh sách người dùng...</div>
              ) : (
                  <div className="user-table">
                    <table>
                      <thead>
                      <tr>
                        <th>ID</th>
                        <th>Tên đăng nhập</th>
                        <th>Email</th>
                        <th>Số điện thoại</th>
                        <th>Vai trò</th>
                        <th>Loại tài khoản</th>
                        <th>Trạng thái xác minh</th>
                        <th>Hành động</th>
                      </tr>
                      </thead>
                      <tbody>
                      {users.map(user => (
                          <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.phone_number}</td>
                            <td>
                        <span className={`role-badge ${user.role?.toLowerCase()}`}>
                          {roleMapping[user.role]?.label || user.role}
                        </span>
                            </td>
                            <td>
                        <span className={`account-type-badge ${user.account_type?.toLowerCase()}`}>
                          {accountTypeMapping[user.account_type]?.icon} {accountTypeMapping[user.account_type]?.label || user.account_type}
                        </span>
                            </td>
                            <td>
                        <span className={`verify-badge ${user.verified ? 'verified' : 'unverified'}`}>
                          {user.verified ? '✅ Đã xác minh' : '⏳ Chưa xác minh'}
                        </span>
                            </td>
                            <td>
                              <div className="action-buttons">
                                <button
                                    className="btn-detail"
                                    onClick={() => fetchUserDetail(user.id)}
                                >
                                  👁️ Xem
                                </button>
                                {!user.verified && (
                                    <button
                                        className="btn-verify"
                                        onClick={() => {
                                          setSelectedUser(user);
                                          setShowVerifyModal(true);
                                        }}
                                    >
                                      ✅ Duyệt
                                    </button>
                                )}
                              </div>
                            </td>
                          </tr>
                      ))}
                      </tbody>
                    </table>
                    {users.length === 0 && (
                        <div className="no-data">Không có người dùng nào</div>
                    )}
                  </div>
              )}
            </div>
        )}

        {/* User Detail Modal */}
        {showUserDetail && selectedUser && (
            <div className="modal-overlay" onClick={() => setShowUserDetail(false)}>
              <div className="modal-content user-detail-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <h3>Chi tiết người dùng</h3>
                  <button className="close-btn" onClick={() => setShowUserDetail(false)}>×</button>
                </div>
                <div className="modal-body">
                  <div className="user-detail-grid">
                    <div className="detail-section">
                      <h4>Thông tin cơ bản</h4>
                      <p><strong>Tên đăng nhập:</strong> {selectedUser.username}</p>
                      <p><strong>Email:</strong> {selectedUser.email}</p>
                      <p><strong>Số điện thoại:</strong> {selectedUser.phone_number}</p>
                      <p><strong>Họ tên:</strong> {selectedUser.first_name} {selectedUser.middle_name ? selectedUser.middle_name + ' ' : ''}{selectedUser.last_name}</p>
                      <p><strong>Giới tính:</strong> {genderMapping[selectedUser.gender] || selectedUser.gender}</p>
                      <p><strong>Ngày sinh:</strong> {formatDate(selectedUser.dob)}</p>
                      <p><strong>Vai trò:</strong> {roleMapping[selectedUser.role]?.label || selectedUser.role}</p>
                      <p><strong>Loại tài khoản:</strong> {accountTypeMapping[selectedUser.account_type]?.label || selectedUser.account_type}</p>
                      <p><strong>Trạng thái:</strong> {statusMapping[selectedUser.status]?.label || selectedUser.status}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Địa chỉ</h4>
                      <p><strong>Tỉnh/Thành:</strong> {selectedUser.province}</p>
                      <p><strong>Quận/Huyện:</strong> {selectedUser.district}</p>
                      <p><strong>Phường/Xã:</strong> {selectedUser.ward}</p>
                      <p><strong>Địa chỉ chi tiết:</strong> {selectedUser.detailed_address}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Thông tin CCCD</h4>
                      <p><strong>Số CCCD:</strong> {selectedUser.identity_number}</p>
                      <p><strong>Ngày cấp:</strong> {formatDate(selectedUser.identity_issue_date)}</p>
                      <p><strong>Nơi cấp:</strong> {selectedUser.identity_issue_place}</p>
                    </div>

                    <div className="detail-section">
                      <h4>Thông tin ngân hàng</h4>
                      <p><strong>Số tài khoản:</strong> {selectedUser.bank_account_number}</p>
                      <p><strong>Ngân hàng:</strong> {selectedUser.bank_name}</p>
                      <p><strong>Chủ tài khoản:</strong> {selectedUser.bank_account_holder}</p>
                    </div>

                    {selectedUser.rejected_reason && (
                        <div className="detail-section rejected-reason">
                          <h4>Lý do từ chối</h4>
                          <p>{selectedUser.rejected_reason}</p>
                        </div>
                    )}

                    {(selectedUser.identity_front_url || selectedUser.identity_back_url) && (
                        <div className="detail-section identity-images">
                          <h4>Ảnh CCCD</h4>
                          <div className="image-grid">
                            {selectedUser.identity_front_url && (
                                <div className="image-item">
                                  <p><strong>Mặt trước:</strong></p>
                                  <img
                                      src={selectedUser.identity_front_url}
                                      alt="CCCD mặt trước"
                                      style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        marginTop: '8px'
                                      }}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                      }}
                                  />
                                  <div style={{display: 'none', color: '#999', fontStyle: 'italic'}}>
                                    Không thể tải ảnh
                                  </div>
                                </div>
                            )}
                            {selectedUser.identity_back_url && (
                                <div className="image-item">
                                  <p><strong>Mặt sau:</strong></p>
                                  <img
                                      src={selectedUser.identity_back_url}
                                      alt="CCCD mặt sau"
                                      style={{
                                        maxWidth: '100%',
                                        height: 'auto',
                                        border: '1px solid #ddd',
                                        borderRadius: '8px',
                                        marginTop: '8px'
                                      }}
                                      onError={(e) => {
                                        e.target.style.display = 'none';
                                        e.target.nextSibling.style.display = 'block';
                                      }}
                                  />
                                  <div style={{display: 'none', color: '#999', fontStyle: 'italic'}}>
                                    Không thể tải ảnh
                                  </div>
                                </div>
                            )}
                          </div>
                        </div>
                    )}

                    {!selectedUser.identity_front_url && !selectedUser.identity_back_url && (
                        <div className="detail-section">
                          <h4>Ảnh CCCD</h4>
                          <p style={{color: '#999', fontStyle: 'italic'}}>Chưa có ảnh CCCD</p>
                        </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
        )}

        {/* Verify User Modal */}
        {showVerifyModal && selectedUser && (
            <div className="modal-overlay" onClick={() => setShowVerifyModal(false)}>
              <div className="modal-content verify-modal" onClick={e => e.stopPropagation()}>
                <div className="modal-header">
                  <div className="modal-title">
                    <div className="verify-icon">🔍</div>
                    <div>
                      <h3>Xác minh người dùng</h3>
                      <p className="user-info">{selectedUser.username}</p>
                    </div>
                  </div>
                  <button className="close-btn" onClick={() => setShowVerifyModal(false)}>×</button>
                </div>

                <div className="modal-body">
                  <div className="user-summary">
                    <div className="summary-item">
                      <span className="label">Họ tên:</span>
                      <span className="value">{selectedUser.first_name} {selectedUser.middle_name ? selectedUser.middle_name + ' ' : ''}{selectedUser.last_name}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Email:</span>
                      <span className="value">{selectedUser.email}</span>
                    </div>
                    <div className="summary-item">
                      <span className="label">Số CCCD:</span>
                      <span className="value">{selectedUser.identity_number || 'Chưa có'}</span>
                    </div>
                  </div>

                  <div className="form-section">
                    <div className="form-group">
                      <label className="form-label">
                        <span className="label-icon">📋</span>
                        Trạng thái xác minh
                      </label>
                      <select
                          className="form-select"
                          value={verifyData.status}
                          onChange={e => setVerifyData(prev => ({...prev, status: e.target.value}))}
                      >
                        <option value="">-- Chọn trạng thái --</option>
                        <option value="verified">✅ Xác minh thành công</option>
                        <option value="rejected">❌ Từ chối</option>
                        <option value="update-cccd">📝 Yêu cầu cập nhật CCCD</option>
                      </select>
                    </div>

                    {(verifyData.status === 'rejected' || verifyData.status === 'update-cccd') && (
                        <div className="form-group">
                          <label className="form-label">
                            <span className="label-icon">📝</span>
                            Lý do {verifyData.status === 'rejected' ? 'từ chối' : 'yêu cầu cập nhật'}
                          </label>
                          <textarea
                              className="form-textarea"
                              value={verifyData.reason}
                              onChange={e => setVerifyData(prev => ({...prev, reason: e.target.value}))}
                              placeholder={`Nhập lý do ${verifyData.status === 'rejected' ? 'từ chối' : 'yêu cầu cập nhật'}...`}
                              rows={4}
                          />
                        </div>
                    )}
                  </div>

                  <div className="modal-actions">
                    <button className="btn-cancel" onClick={() => setShowVerifyModal(false)}>
                      <span>❌</span>
                      Hủy bỏ
                    </button>
                    <button
                        className="btn-confirm"
                        onClick={handleVerifyUser}
                        disabled={!verifyData.status}
                    >
                      <span>✓</span>
                      Xác nhận
                    </button>
                  </div>
                </div>
              </div>
            </div>
        )}
      </div>
  );
};

export default UserStatsTable;