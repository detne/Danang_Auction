import React, { useState, useEffect } from 'react';
import { useUser } from '../contexts/UserContext';
import { getUserProfile } from '../services/api';
import '../styles/Profile.css';

const Profile = () => {
    const { user, setUser } = useUser();
    const [profile, setProfile] = useState({
        username: '',
        email: '',
        phone_number: '',
        first_name: '',
        middle_name: '',
        last_name: '',
        gender: '',
        dob: '',
        province: '',
        district: '',
        ward: '',
        detailed_address: '',
        identity_issue_place: '',
        identity_issue_date: '',
        account_type: '',
        role: '',
        verified: false,
        status: ''
    });
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(false);

    // Lấy thông tin hồ sơ khi component mount
    useEffect(() => {
        const fetchProfile = async () => {
            setLoading(true);
            try {
                const response = await getUserProfile();
                if (response.success) {
                    setProfile({
                        username: response.data.username || '',
                        email: response.data.email || '',
                        phone_number: response.data.phone_number || '',
                        first_name: response.data.first_name || '',
                        middle_name: response.data.middle_name || '',
                        last_name: response.data.last_name || '',
                        gender: response.data.gender || '',
                        dob: response.data.dob || '',
                        province: response.data.province || '',
                        district: response.data.district || '',
                        ward: response.data.ward || '',
                        detailed_address: response.data.detailed_address || '',
                        identity_issue_place: response.data.identity_issue_place || '',
                        identity_issue_date: response.data.identity_issue_date || '',
                        account_type: response.data.account_type || '',
                        role: response.data.role || '',
                        verified: response.data.verified || false,
                        status: response.data.status || ''
                    });
                    setUser(response.data); // Cập nhật user trong context
                } else {
                    setMessage('Không thể tải thông tin hồ sơ.');
                }
            } catch (error) {
                setMessage('Lỗi khi tải thông tin hồ sơ. Vui lòng thử lại.');
            } finally {
                setLoading(false);
            }
        };
        if (user) {
            fetchProfile();
        }
    }, [user, setUser]);

    // Hàm format giá trị hiển thị
    const formatDisplayValue = (field, value) => {
        switch (field) {
            case 'gender':
                return value === 'male' ? 'Nam' : value === 'female' ? 'Nữ' : value === 'other' ? 'Khác' : value;
            case 'verified':
                return value ? 'Đã xác thực' : 'Chưa xác thực';
            case 'account_type':
                return value === 'individual' ? 'Cá nhân' : value === 'organization' ? 'Tổ chức' : value;
            case 'status':
                return value === 'active' ? 'Hoạt động' : value === 'inactive' ? 'Không hoạt động' : value === 'suspended' ? 'Tạm khóa' : value;
            case 'dob':
            case 'identity_issue_date':
                return value ? new Date(value).toLocaleDateString('vi-VN') : '';
            default:
                return value || 'Chưa cập nhật';
        }
    };

    return (
        <div className="profile-container">
            <h2>Thông tin cá nhân</h2>
            {loading && <p className="loading">Đang tải...</p>}
            {message && <p className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>{message}</p>}

            <div className="profile-content">
                {/* Thông tin tài khoản */}
                <div className="section">
                    <h3 className="section-title">Thông tin tài khoản</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tên đăng nhập:</label>
                            <div className="display-field">{formatDisplayValue('username', profile.username)}</div>
                        </div>
                        <div className="form-group">
                            <label>Email:</label>
                            <div className="display-field">{formatDisplayValue('email', profile.email)}</div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Loại tài khoản:</label>
                            <div className="display-field">{formatDisplayValue('account_type', profile.account_type)}</div>
                        </div>
                        <div className="form-group">
                            <label>Vai trò:</label>
                            <div className="display-field">{formatDisplayValue('role', profile.role)}</div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Trạng thái xác thực:</label>
                            <div className={`display-field status-badge ${profile.verified ? 'verified' : 'unverified'}`}>
                                {formatDisplayValue('verified', profile.verified)}
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Trạng thái tài khoản:</label>
                            <div className={`display-field status-badge ${profile.status}`}>
                                {formatDisplayValue('status', profile.status)}
                            </div>
                        </div>
                    </div>
                </div>

                {/* Thông tin cá nhân */}
                <div className="section">
                    <h3 className="section-title">Thông tin cá nhân</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Họ:</label>
                            <div className="display-field">{formatDisplayValue('last_name', profile.last_name)}</div>
                        </div>
                        <div className="form-group">
                            <label>Tên đệm:</label>
                            <div className="display-field">{formatDisplayValue('middle_name', profile.middle_name)}</div>
                        </div>
                        <div className="form-group">
                            <label>Tên:</label>
                            <div className="display-field">{formatDisplayValue('first_name', profile.first_name)}</div>
                        </div>
                    </div>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Số điện thoại:</label>
                            <div className="display-field">{formatDisplayValue('phone_number', profile.phone_number)}</div>
                        </div>
                        <div className="form-group">
                            <label>Giới tính:</label>
                            <div className="display-field">{formatDisplayValue('gender', profile.gender)}</div>
                        </div>
                        <div className="form-group">
                            <label>Ngày sinh:</label>
                            <div className="display-field">{formatDisplayValue('dob', profile.dob)}</div>
                        </div>
                    </div>
                </div>

                {/* Thông tin địa chỉ */}
                <div className="section">
                    <h3 className="section-title">Thông tin địa chỉ</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Tỉnh/Thành phố:</label>
                            <div className="display-field">{formatDisplayValue('province', profile.province)}</div>
                        </div>
                        <div className="form-group">
                            <label>Quận/Huyện:</label>
                            <div className="display-field">{formatDisplayValue('district', profile.district)}</div>
                        </div>
                        <div className="form-group">
                            <label>Phường/Xã:</label>
                            <div className="display-field">{formatDisplayValue('ward', profile.ward)}</div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label>Địa chỉ chi tiết:</label>
                        <div className="display-field">{formatDisplayValue('detailed_address', profile.detailed_address)}</div>
                    </div>
                </div>

                {/* Thông tin CCCD */}
                <div className="section">
                    <h3 className="section-title">Thông tin CCCD</h3>
                    <div className="form-row">
                        <div className="form-group">
                            <label>Nơi cấp:</label>
                            <div className="display-field">{formatDisplayValue('identity_issue_place', profile.identity_issue_place)}</div>
                        </div>
                        <div className="form-group">
                            <label>Ngày cấp:</label>
                            <div className="display-field">{formatDisplayValue('identity_issue_date', profile.identity_issue_date)}</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;