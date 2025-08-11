import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import '../../styles/Profile.css';

const Profile = () => {
    const { user, setUser, token } = useUser();
    const navigate = useNavigate();
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);
    const [activeTab, setActiveTab] = useState('personal');

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                const authToken = token || localStorage.getItem('token');

                if (!authToken) {
                    throw new Error('Vui lòng đăng nhập để xem thông tin hồ sơ');
                }

                const config = {
                    headers: {
                        'Authorization': `Bearer ${authToken}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000
                };

                const response = await axios.get('http://localhost:8080/api/auth/profile', config);

                if (!response.data.success) {
                    throw new Error(response.data.message || 'Không thể lấy thông tin profile');
                }

                // Lấy dữ liệu từ response.data.data (chứa tất cả thông tin)
                const profileData = response.data.data;
                
                // Sử dụng profile object (snake_case) từ API
                const profileInfo = profileData.profile;
                
                setProfile({
                    // Account Info
                    role: profileInfo.role,
                    accountType: profileInfo.account_type,
                    verified: profileInfo.verified,
                    status: profileInfo.status,
                    createdAt: profileInfo.created_at,
                    updatedAt: profileInfo.updated_at,
                    
                    // Personal Info
                    username: profileInfo.username,
                    email: profileInfo.email,
                    phoneNumber: profileInfo.phone_number,
                    firstName: profileInfo.first_name,
                    middleName: profileInfo.middle_name,
                    lastName: profileInfo.last_name,
                    fullName: profileInfo.full_name,
                    gender: profileInfo.gender,
                    dob: profileInfo.dob,
                    province: profileInfo.province,
                    district: profileInfo.district,
                    ward: profileInfo.ward,
                    detailedAddress: profileInfo.detailed_address,
                    fullAddress: profileInfo.full_address,
                    
                    // Identity Info
                    identityNumber: profileInfo.identity_number,
                    identityIssuePlace: profileInfo.identity_issue_place,
                    identityIssueDate: profileInfo.identity_issue_date,
                    identityFrontUrl: profileInfo.identity_front_url,
                    identityBackUrl: profileInfo.identity_back_url,
                    
                    // Bank Info
                    bankName: profileInfo.bank_name,
                    bankAccountNumber: profileInfo.bank_account_number,
                    bankAccountHolder: profileInfo.bank_account_holder,
                    balance: profileInfo.balance,
                    
                    // Verification Status
                    emailVerified: profileInfo.email_verified,
                    phoneVerified: profileInfo.phone_verified,
                    verifiedAt: profileInfo.verified_at
                });

                // Khởi tạo formData với dữ liệu hiện tại
                setFormData({
                    username: profileInfo.username || '',
                    email: profileInfo.email || '',
                    phoneNumber: profileInfo.phone_number || '',
                    firstName: profileInfo.first_name || '',
                    middleName: profileInfo.middle_name || '',
                    lastName: profileInfo.last_name || '',
                    gender: profileInfo.gender || '',
                    dob: profileInfo.dob || '',
                    province: profileInfo.province || '',
                    district: profileInfo.district || '',
                    ward: profileInfo.ward || '',
                    detailedAddress: profileInfo.detailed_address || '',
                    identityIssuePlace: profileInfo.identity_issue_place || '',
                    identityIssueDate: profileInfo.identity_issue_date || '',
                    identityNumber: profileInfo.identity_number || ''
                });

            } catch (err) {
                console.error('Profile fetch error:', err);

                let errorMessage = 'Không thể tải thông tin hồ sơ';

                if (err.response) {
                    switch (err.response.status) {
                        case 401:
                            errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
                            localStorage.removeItem('token');
                            break;
                        case 403:
                            errorMessage = 'Không có quyền truy cập thông tin này';
                            break;
                        case 404:
                            errorMessage = 'Không tìm thấy thông tin hồ sơ';
                            break;
                        case 500:
                            errorMessage = 'Lỗi server. Vui lòng thử lại sau';
                            break;
                        default:
                            errorMessage = err.response.data?.message || err.response.data?.error || errorMessage;
                    }
                } else if (err.request) {
                    errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng';
                } else {
                    errorMessage = err.message || errorMessage;
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [token]);

    const validateForm = () => {
        const newErrors = {};

        if (!formData.username?.trim()) {
            newErrors.username = 'Tên đăng nhập không được để trống';
        }

        if (!formData.email?.trim()) {
            newErrors.email = 'Email không được để trống';
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (!formData.phoneNumber?.trim()) {
            newErrors.phoneNumber = 'Số điện thoại không được để trống';
        } else if (!/^[0-9]{10,11}$/.test(formData.phoneNumber.replace(/\D/g, ''))) {
            newErrors.phoneNumber = 'Số điện thoại phải có 10-11 chữ số';
        }

        if (!formData.firstName?.trim()) {
            newErrors.firstName = 'Tên không được để trống';
        }

        if (!formData.gender) {
            newErrors.gender = 'Giới tính không được để trống';
        }

        if (!formData.dob) {
            newErrors.dob = 'Ngày sinh không được để trống';
        } else {
            const dobDate = new Date(formData.dob);
            const today = new Date();
            const age = today.getFullYear() - dobDate.getFullYear();

            if (age < 18 || age > 100) {
                newErrors.dob = 'Tuổi phải từ 18 đến 100';
            }
        }

        if (!formData.detailedAddress?.trim()) {
            newErrors.detailedAddress = 'Địa chỉ chi tiết không được để trống';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleFieldChange = (field, value) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Kích thước file không được vượt quá 5MB' });
                return;
            }

            if (!file.type.startsWith('image/')) {
                setMessage({ type: 'error', text: 'Chỉ được chọn file hình ảnh' });
                return;
            }

            setAvatarFile(file);
        }
    };

    const handleSave = async () => {
        if (!validateForm()) {
            setMessage({ type: 'error', text: 'Vui lòng kiểm tra lại thông tin đã nhập' });
            return;
        }

        try {
            const authToken = token || localStorage.getItem('token');
            if (!authToken) {
                throw new Error('Không tìm thấy token xác thực');
            }

            const updatedProfile = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                phone_number: formData.phoneNumber.replace(/\D/g, ''),
                first_name: formData.firstName.trim(),
                middle_name: formData.middleName?.trim() || '',
                last_name: formData.lastName?.trim() || '',
                gender: formData.gender,
                dob: formData.dob,
                province: formData.province?.trim() || '',
                district: formData.district?.trim() || '',
                ward: formData.ward?.trim() || '',
                detailed_address: formData.detailedAddress.trim(),
                identity_issue_place: formData.identityIssuePlace?.trim() || '',
                identity_issue_date: formData.identityIssueDate || '',
                identity_number: formData.identityNumber?.trim() || ''
            };

            const formDataToSend = new FormData();
            Object.entries(updatedProfile).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            if (avatarFile) {
                formDataToSend.append('avatar', avatarFile);
            }

            const response = await axios.put('http://localhost:8080/api/auth/profile', formDataToSend, {
                headers: {
                    'Authorization': `Bearer ${authToken}`,
                    'Content-Type': 'multipart/form-data'
                },
                timeout: 30000
            });

            if (response.data.success) {
                setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
                
                // Refresh profile data
                const profileData = response.data.data;
                const profileInfo = profileData.profile;
                
                setProfile({
                    // Update profile state với dữ liệu mới
                    role: profileInfo.role,
                    accountType: profileInfo.account_type,
                    verified: profileInfo.verified,
                    status: profileInfo.status,
                    createdAt: profileInfo.created_at,
                    updatedAt: profileInfo.updated_at,
                    
                    username: profileInfo.username,
                    email: profileInfo.email,
                    phoneNumber: profileInfo.phone_number,
                    firstName: profileInfo.first_name,
                    middleName: profileInfo.middle_name,
                    lastName: profileInfo.last_name,
                    fullName: profileInfo.full_name,
                    gender: profileInfo.gender,
                    dob: profileInfo.dob,
                    province: profileInfo.province,
                    district: profileInfo.district,
                    ward: profileInfo.ward,
                    detailedAddress: profileInfo.detailed_address,
                    fullAddress: profileInfo.full_address,
                    
                    identityNumber: profileInfo.identity_number,
                    identityIssuePlace: profileInfo.identity_issue_place,
                    identityIssueDate: profileInfo.identity_issue_date,
                    identityFrontUrl: profileInfo.identity_front_url,
                    identityBackUrl: profileInfo.identity_back_url,
                    
                    bankName: profileInfo.bank_name,
                    bankAccountNumber: profileInfo.bank_account_number,
                    bankAccountHolder: profileInfo.bank_account_holder,
                    balance: profileInfo.balance,
                    
                    emailVerified: profileInfo.email_verified,
                    phoneVerified: profileInfo.phone_verified,
                    verifiedAt: profileInfo.verified_at
                });
                
                setIsEditing(false);
                setAvatarFile(null);

                setTimeout(() => setMessage(null), 3000);
            } else {
                throw new Error(response.data.message || 'Cập nhật thất bại');
            }
        } catch (err) {
            console.error('Profile update error:', err);

            let errorMessage = 'Đã có lỗi xảy ra khi cập nhật hồ sơ';

            if (err.response) {
                switch (err.response.status) {
                    case 400:
                        errorMessage = err.response.data?.message || 'Dữ liệu không hợp lệ';
                        break;
                    case 401:
                        errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
                        break;
                    case 413:
                        errorMessage = 'File tải lên quá lớn';
                        break;
                    default:
                        errorMessage = err.response.data?.message || errorMessage;
                }
            } else if (err.request) {
                errorMessage = 'Không thể kết nối đến server';
            }

            setMessage({ type: 'error', text: errorMessage });
        }
    };

    const handleCancel = () => {
        if (profile) {
            setFormData({
                username: profile.username || '',
                email: profile.email || '',
                phoneNumber: profile.phoneNumber || '',
                firstName: profile.firstName || '',
                middleName: profile.middleName || '',
                lastName: profile.lastName || '',
                gender: profile.gender || '',
                dob: profile.dob || '',
                province: profile.province || '',
                district: profile.district || '',
                ward: profile.ward || '',
                detailedAddress: profile.detailedAddress || '',
                identityIssuePlace: profile.identityIssuePlace || '',
                identityIssueDate: profile.identityIssueDate || '',
                identityNumber: profile.identityNumber || ''
            });
        }
        setErrors({});
        setAvatarFile(null);
        setIsEditing(false);
        setMessage(null);
    };

    const getAvatarText = () => {
        if (profile?.firstName) return profile.firstName.charAt(0).toUpperCase();
        if (profile?.username) return profile.username.charAt(0).toUpperCase();
        return 'U';
    };

    const getUserRole = () => {
        if (profile?.role === 'BIDDER') return 'Người đấu giá';
        if (profile?.role === 'ORGANIZER') return 'Tổ chức đấu giá';
        if (profile?.role === 'ADMIN') return 'Quản trị viên';
        return 'Tổ chức mua tài sản';
    };

    const handleLogout = () => {
        localStorage.removeItem('token');
        setUser(null);
        navigate('/login');
    };

    const handleMyAuctions = async () => {
        try {
            const authToken = token || localStorage.getItem('token');
            if (!authToken) {
                setMessage({ type: 'error', text: 'Bạn chưa đăng nhập hoặc token không tồn tại!' });
                return;
            }

            const res = await axios.get('/api/assets/mine', {
                headers: {
                    Authorization: `Bearer ${authToken}`
                }
            });
            const data = res.data.data;
            navigate('/my-auctions', { state: { myAuctions: data } });
        } catch (err) {
            let errorMessage = 'Lấy dữ liệu phiên đấu giá thất bại!';
            if (err.response) {
                console.error('Error response:', err.response);
                if (err.response.data && err.response.data.message) {
                    errorMessage = err.response.data.message;
                } else if (typeof err.response.data === 'string') {
                    errorMessage = err.response.data;
                }
            }
            setMessage({ type: 'error', text: errorMessage });
        }
    };

    // Loading state
    if (loading) {
        return (
            <div className="loading-container">
                <div className="text-center">
                    <div className="loading-spinner"></div>
                    <p style={{ color: '#C40000', marginTop: '1rem' }}>Đang tải thông tin hồ sơ...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="error-container">
                <div className="text-center">
                    <div className="error-icon">⚠️</div>
                    <h2>Không thể tải thông tin</h2>
                    <p>{error}</p>
                    <button onClick={() => window.location.reload()} className="btn btn-primary">
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // No profile data
    if (!profile) {
        return (
            <div className="error-container">
                <div className="text-center">
                    <div className="error-icon">👤</div>
                    <h2>Không có thông tin hồ sơ</h2>
                    <p>Vui lòng liên hệ quản trị viên để được hỗ trợ</p>
                </div>
            </div>
        );
    }

    return (
        <div className="profile-layout">
            {/* Left Sidebar */}
            <div className="profile-sidebar">
                {/* User Profile Section */}
                <div className="sidebar-user-profile">
                    <div className="sidebar-avatar">
                        {profile.avatar ? (
                            <img src={profile.avatar} alt="Avatar" />
                        ) : (
                            <div className="sidebar-avatar-placeholder">
                                {getAvatarText()}
                            </div>
                        )}
                    </div>
                    <div className="sidebar-user-name">
                        {profile.fullName || profile.username || 'Chưa cập nhật'}
                    </div>
                    <div className="sidebar-user-role">{getUserRole()}</div>
                </div>

                {/* Navigation Menu */}
                <nav className="sidebar-nav">
                    <a href="#notifications" className="sidebar-nav-item">
                        <span className="sidebar-nav-icon">🔔</span>
                        <span className="sidebar-nav-text">THÔNG BÁO</span>
                    </a>
                    <a href="#account" className="sidebar-nav-item active">
                        <span className="sidebar-nav-icon">👤</span>
                        <span className="sidebar-nav-text">THÔNG TIN TÀI KHOẢN</span>
                    </a>
                    
                    {/* Chỉ hiển thị "Cuộc đấu giá của tôi" cho BIDDER */}
                    {profile?.role === 'BIDDER' && (
                        <button onClick={handleMyAuctions} className="sidebar-nav-item">
                            <span className="sidebar-nav-icon">🏠</span>
                            <span className="sidebar-nav-text">CUỘC ĐẤU GIÁ CỦA TÔI</span>
                        </button>
                    )}
                    
                    {/* Chỉ hiển thị "Phiên đấu giá" cho ORGANIZER */}
                    {profile?.role === 'ORGANIZER' && (
                        <button onClick={handleMyAuctions} className="sidebar-nav-item">
                            <span className="sidebar-nav-icon">📄</span>
                            <span className="sidebar-nav-text">PHIÊN ĐẤU GIÁ</span>
                        </button>
                    )}
                    
                    <a href="#my-documents" className="sidebar-nav-item">
                        <span className="sidebar-nav-icon">📁</span>
                        <span className="sidebar-nav-text">TÀI LIỆU CỦA TÔI</span>
                    </a>
                    <button onClick={handleLogout} className="sidebar-nav-item">
                        <span className="sidebar-nav-icon">🚪</span>
                        <span className="sidebar-nav-text">ĐĂNG XUẤT</span>
                    </button>
                </nav>
            </div>

            {/* Main Content Area */}
            <div className="profile-main-content">
                {/* Page Header */}
                <div className="profile-page-header">
                    <div className="profile-breadcrumb">
                        <a href="/">Trang chủ</a>
                        <span className="profile-breadcrumb-separator">/</span>
                        <span>Tài khoản</span>
                    </div>
                    <h1 className="profile-page-title">Quản lý tài khoản</h1>
                </div>

                {/* Tabs Navigation */}
                <div className="profile-tabs">
                    <button 
                        className={`profile-tab ${activeTab === 'personal' ? 'active' : ''}`}
                        onClick={() => setActiveTab('personal')}
                    >
                        Thông tin cá nhân
                    </button>
                    <button 
                        className={`profile-tab ${activeTab === 'registration' ? 'active' : ''}`}
                        onClick={() => setActiveTab('registration')}
                    >
                        Thông tin nộp phí đăng ký
                    </button>
                    <button 
                        className={`profile-tab ${activeTab === 'bank' ? 'active' : ''}`}
                        onClick={() => setActiveTab('bank')}
                    >
                        Tài khoản ngân hàng
                    </button>
                    <button 
                        className={`profile-tab ${activeTab === 'password' ? 'active' : ''}`}
                        onClick={() => setActiveTab('password')}
                    >
                        Đổi mật khẩu
                    </button>
                </div>

                {/* Tab Content */}
                <div className="profile-tab-content active">
                    {activeTab === 'personal' && (
                        <>
                            {/* Message Notification */}
                            {message && (
                                <div className={`message-notification ${message.type === 'success' ? 'message-success' : 'message-error'}`}>
                                    <span>{message.text}</span>
                                    <button onClick={() => setMessage(null)} className="message-close">✕</button>
                                </div>
                            )}

                            {/* Personal Information Section */}
                            <div className="profile-form-section">
                                <div className="section-header">
                                    <h3 className="section-title">Thông tin cá nhân</h3>
                                    <button 
                                        className="edit-link"
                                        onClick={() => setIsEditing(true)}
                                    >
                                        CHỈNH SỬA
                                    </button>
                                </div>
                                
                                <div className="profile-info-grid">
                                    {/* Left Column */}
                                    <div className="profile-info-column">
                                        <div className="info-row">
                                            <label className="info-label">Họ và tên:</label>
                                            <div className="info-value">
                                                {profile.fullName || 'Chưa cập nhật'}
                                            </div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Loại tài khoản:</label>
                                            <div className="info-value">{getUserRole()}</div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Số điện thoại:</label>
                                            <div className="info-value">{profile.phoneNumber || 'Chưa cập nhật'}</div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Ngày sinh:</label>
                                            <div className="info-value">{profile.dob || 'Chưa cập nhật'}</div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Số chứng minh thư/Thẻ căn cước/Hộ chiếu:</label>
                                            <div className="info-value">{profile.identityNumber || 'Chưa cập nhật'}</div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Nơi cấp:</label>
                                            <div className="info-value">{profile.identityIssuePlace || 'Chưa cập nhật'}</div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Ảnh CMT mặt trước/ Thẻ căn cước/ Hộ chiếu:</label>
                                            <div className="info-value">
                                                {profile.identityFrontUrl ? (
                                                    <img src={profile.identityFrontUrl} alt="CMT mặt trước" className="id-image" />
                                                ) : (
                                                    <span>Chưa cập nhật</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Trạng thái xác thực email:</label>
                                            <div className="info-value">
                                                <span className={`status-badge ${profile.emailVerified ? 'verified' : 'not-verified'}`}>
                                                    <span className="status-icon">{profile.emailVerified ? '✓' : '✗'}</span>
                                                    {profile.emailVerified ? 'Đã xác thực' : 'Chưa xác thực'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Right Column */}
                                    <div className="profile-info-column">
                                        <div className="info-row">
                                            <label className="info-label">Tên đăng nhập:</label>
                                            <div className="info-value">{profile.username || 'Chưa cập nhật'}</div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Email:</label>
                                            <div className="info-value">{profile.email || 'Chưa cập nhật'}</div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Địa chỉ:</label>
                                            <div className="info-value">
                                                {profile.fullAddress || 'Chưa cập nhật'}
                                            </div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Giới tính:</label>
                                            <div className="info-value">
                                                {profile.gender === 'MALE' ? 'Nam' : 
                                                 profile.gender === 'FEMALE' ? 'Nữ' : 
                                                 profile.gender === 'OTHER' ? 'Khác' : 'Chưa cập nhật'}
                                            </div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Ngày cấp:</label>
                                            <div className="info-value">{profile.identityIssueDate || 'Chưa cập nhật'}</div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Số dư tài khoản:</label>
                                            <div className="info-value">{profile.balance?.toLocaleString() || '0'} VND</div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Ảnh CMT mặt sau/ Thẻ căn cước/ Hộ chiếu:</label>
                                            <div className="info-value">
                                                {profile.identityBackUrl ? (
                                                    <img src={profile.identityBackUrl} alt="CMT mặt sau" className="id-image" />
                                                ) : (
                                                    <span>Chưa cập nhật</span>
                                                )}
                                            </div>
                                        </div>

                                        <div className="info-row">
                                            <label className="info-label">Trạng thái xác thực tài khoản:</label>
                                            <div className="info-value">
                                                <span className={`status-badge ${profile.verified ? 'verified' : 'not-verified'}`}>
                                                    <span className="status-icon">{profile.verified ? '✓' : '✗'}</span>
                                                    {profile.verified ? 'Đã xác thực' : 'Chưa xác thực'}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Edit Form */}
                            {isEditing && (
                                <div className="profile-form-section">
                                    <h3 className="section-title">Chỉnh sửa thông tin</h3>
                                    
                                    <div className="form-group">
                                        <label className="form-label required">Tên đăng nhập</label>
                                        <input
                                            type="text"
                                            className={`form-input ${errors.username ? 'error' : ''}`}
                                            value={formData.username}
                                            onChange={(e) => handleFieldChange('username', e.target.value)}
                                            disabled
                                        />
                                        {errors.username && <div className="error-message">{errors.username}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label required">Email</label>
                                        <input
                                            type="email"
                                            className={`form-input ${errors.email ? 'error' : ''}`}
                                            value={formData.email}
                                            onChange={(e) => handleFieldChange('email', e.target.value)}
                                        />
                                        {errors.email && <div className="error-message">{errors.email}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Họ</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.lastName}
                                            onChange={(e) => handleFieldChange('lastName', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Tên đệm</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.middleName}
                                            onChange={(e) => handleFieldChange('middleName', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label required">Tên</label>
                                        <input
                                            type="text"
                                            className={`form-input ${errors.firstName ? 'error' : ''}`}
                                            value={formData.firstName}
                                            onChange={(e) => handleFieldChange('firstName', e.target.value)}
                                        />
                                        {errors.firstName && <div className="error-message">{errors.firstName}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label required">Số điện thoại</label>
                                        <input
                                            type="tel"
                                            className={`form-input ${errors.phoneNumber ? 'error' : ''}`}
                                            value={formData.phoneNumber}
                                            onChange={(e) => handleFieldChange('phoneNumber', e.target.value)}
                                        />
                                        {errors.phoneNumber && <div className="error-message">{errors.phoneNumber}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label required">Giới tính</label>
                                        <select
                                            className={`form-select ${errors.gender ? 'error' : ''}`}
                                            value={formData.gender}
                                            onChange={(e) => handleFieldChange('gender', e.target.value)}
                                        >
                                            <option value="">Chọn giới tính</option>
                                            <option value="MALE">Nam</option>
                                            <option value="FEMALE">Nữ</option>
                                            <option value="OTHER">Khác</option>
                                        </select>
                                        {errors.gender && <div className="error-message">{errors.gender}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label required">Ngày sinh</label>
                                        <input
                                            type="date"
                                            className={`form-input ${errors.dob ? 'error' : ''}`}
                                            value={formData.dob}
                                            onChange={(e) => handleFieldChange('dob', e.target.value)}
                                        />
                                        {errors.dob && <div className="error-message">{errors.dob}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Tỉnh/Thành phố</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.province}
                                            onChange={(e) => handleFieldChange('province', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Quận/Huyện</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.district}
                                            onChange={(e) => handleFieldChange('district', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Phường/Xã</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.ward}
                                            onChange={(e) => handleFieldChange('ward', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label required">Địa chỉ chi tiết</label>
                                        <input
                                            type="text"
                                            className={`form-input ${errors.detailedAddress ? 'error' : ''}`}
                                            value={formData.detailedAddress}
                                            onChange={(e) => handleFieldChange('detailedAddress', e.target.value)}
                                        />
                                        {errors.detailedAddress && <div className="error-message">{errors.detailedAddress}</div>}
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Số chứng minh thư/Thẻ căn cước/Hộ chiếu</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.identityNumber}
                                            onChange={(e) => handleFieldChange('identityNumber', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Nơi cấp</label>
                                        <input
                                            type="text"
                                            className="form-input"
                                            value={formData.identityIssuePlace}
                                            onChange={(e) => handleFieldChange('identityIssuePlace', e.target.value)}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label className="form-label">Ngày cấp</label>
                                        <input
                                            type="date"
                                            className="form-input"
                                            value={formData.identityIssueDate}
                                            onChange={(e) => handleFieldChange('identityIssueDate', e.target.value)}
                                        />
                                    </div>

                                    <div className="action-buttons">
                                        <button className="btn btn-primary" onClick={handleSave}>
                                            💾 Lưu thay đổi
                                        </button>
                                        <button className="btn btn-outline" onClick={handleCancel}>
                                            ❌ Hủy bỏ
                                        </button>
                                    </div>
                                </div>
                            )}
                        </>
                    )}

                    {activeTab === 'registration' && (
                        <div className="profile-form-section">
                            <h3 className="section-title">Thông tin nộp phí đăng ký</h3>
                            <div className="profile-info-grid">
                                <div className="profile-info-column">
                                    <div className="info-row">
                                        <label className="info-label">Trạng thái:</label>
                                        <div className="info-value">
                                            <span className={`status-badge ${profile.verified ? 'verified' : 'not-verified'}`}>
                                                {profile.verified ? 'Đã hoàn thành' : 'Chưa hoàn thành'}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="info-row">
                                        <label className="info-label">Ngày tạo tài khoản:</label>
                                        <div className="info-value">{profile.createdAt || 'Chưa cập nhật'}</div>
                                    </div>
                                    <div className="info-row">
                                        <label className="info-label">Lần cập nhật cuối:</label>
                                        <div className="info-value">{profile.updatedAt || 'Chưa cập nhật'}</div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'bank' && (
                        <div className="profile-form-section">
                            <h3 className="section-title">Tài khoản ngân hàng</h3>
                            <div className="profile-info-grid">
                                <div className="profile-info-column">
                                    <div className="info-row">
                                        <label className="info-label">Tên ngân hàng:</label>
                                        <div className="info-value">{profile.bankName || 'Chưa cập nhật'}</div>
                                    </div>
                                    <div className="info-row">
                                        <label className="info-label">Số tài khoản:</label>
                                        <div className="info-value">{profile.bankAccountNumber || 'Chưa cập nhật'}</div>
                                    </div>
                                    <div className="info-row">
                                        <label className="info-label">Chủ tài khoản:</label>
                                        <div className="info-value">{profile.bankAccountHolder || 'Chưa cập nhật'}</div>
                                    </div>
                                    <div className="info-row">
                                        <label className="info-label">Số dư hiện tại:</label>
                                        <div className="info-value">
                                            <span className="balance-amount">
                                                {profile.balance?.toLocaleString() || '0'} VND
                                            </span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'password' && (
                        <div className="profile-form-section">
                            <h3 className="section-title">Đổi mật khẩu</h3>
                            <div className="form-group">
                                <label className="form-label" style={{ width: '172px' }}>Mật khẩu hiện tại</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Nhập mật khẩu hiện tại"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Mật khẩu mới</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Nhập mật khẩu mới"
                                />
                            </div>
                            <div className="form-group">
                                <label className="form-label">Xác nhận mật khẩu mới</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="Nhập lại mật khẩu mới"
                                />
                            </div>
                            <div className="action-buttons">
                                <button className="btn btn-primary">
                                    🔑 Đổi mật khẩu
                                </button>
                            </div>
                        </div>
                    )}
                </div>

                {/* Warning Box - chỉ hiển thị khi chưa verify */}
                {!profile.verified && (
                    <div className="warning-box">
                        <span className="warning-icon">⚠️</span>
                        <span>Bạn chưa hoàn thành tiền phí đăng ký. Nhấn vào để thanh toán.</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;