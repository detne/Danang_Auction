import React from 'react';
import useProfile from '../../hooks/profile/useProfile';
import DisplayFieldGroup from './DisplayFieldGroup';
import '../../styles/Profile.css';

const Profile = () => {
    const { profile, loading, error } = useProfile();

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div className="error-text">{error}</div>;
    if (!profile) return <div>Không có thông tin hồ sơ.</div>;

    return (
        <div className="profile-container">
            <h2>Thông tin cá nhân</h2>
            <div className="profile-content">

                {/* Tài khoản */}
                <div className="section">
                    <h3 className="section-title">Thông tin tài khoản</h3>
                    <div className="form-row">
                        <DisplayFieldGroup label="Tên đăng nhập:" field="username" value={profile.username} />
                        <DisplayFieldGroup label="Email:" field="email" value={profile.email} />
                    </div>
                    <div className="form-row">
                        <DisplayFieldGroup label="Loại tài khoản:" field="account_type" value={profile.account_type} />
                        <DisplayFieldGroup label="Vai trò:" field="role" value={profile.role} />
                    </div>
                    <div className="form-row">
                        <DisplayFieldGroup label="Trạng thái xác thực:" field="verified" value={profile.verified} />
                        <DisplayFieldGroup label="Trạng thái tài khoản:" field="status" value={profile.status} />
                    </div>
                </div>

                {/* Cá nhân */}
                <div className="section">
                    <h3 className="section-title">Thông tin cá nhân</h3>
                    <div className="form-row">
                        <DisplayFieldGroup label="Họ:" field="last_name" value={profile.last_name} />
                        <DisplayFieldGroup label="Tên đệm:" field="middle_name" value={profile.middle_name} />
                        <DisplayFieldGroup label="Tên:" field="first_name" value={profile.first_name} />
                    </div>
                    <div className="form-row">
                        <DisplayFieldGroup label="Số điện thoại:" field="phone_number" value={profile.phone_number} />
                        <DisplayFieldGroup label="Giới tính:" field="gender" value={profile.gender} />
                        <DisplayFieldGroup label="Ngày sinh:" field="dob" value={profile.dob} />
                    </div>
                </div>

                {/* Địa chỉ */}
                <div className="section">
                    <h3 className="section-title">Thông tin địa chỉ</h3>
                    <div className="form-row">
                        <DisplayFieldGroup label="Tỉnh/Thành phố:" field="province" value={profile.province} />
                        <DisplayFieldGroup label="Quận/Huyện:" field="district" value={profile.district} />
                        <DisplayFieldGroup label="Phường/Xã:" field="ward" value={profile.ward} />
                    </div>
                    <DisplayFieldGroup label="Địa chỉ chi tiết:" field="detailed_address" value={profile.detailed_address} />
                </div>

                {/* CCCD */}
                <div className="section">
                    <h3 className="section-title">Thông tin CCCD</h3>
                    <div className="form-row">
                        <DisplayFieldGroup label="Nơi cấp:" field="identity_issue_place" value={profile.identity_issue_place} />
                        <DisplayFieldGroup label="Ngày cấp:" field="identity_issue_date" value={profile.identity_issue_date} />
                    </div>
                </div>

            </div>
        </div>
    );
};

export default Profile;
