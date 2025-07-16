// // src/components/Profile.js
// import React from 'react';
// import useProfile from '../hooks/profile/useProfile';
// import '../styles/Profile.css';
//
// const Profile = () => {
//     const { profile, loading, error } = useProfile();
//
//     // Hàm format giá trị hiển thị
//     const formatDisplayValue = (field, value) => {
//         switch (field) {
//             case 'gender':
//                 return value === 'male' ? 'Nam' : value === 'female' ? 'Nữ' : value === 'other' ? 'Khác' : value;
//             case 'verified':
//                 return value ? 'Đã xác thực' : 'Chưa xác thực';
//             case 'account_type':
//                 return value === 'individual' ? 'Cá nhân' : value === 'organization' ? 'Tổ chức' : value;
//             case 'status':
//                 return value === 'active' ? 'Hoạt động' : value === 'inactive' ? 'Không hoạt động' : value === 'suspended' ? 'Tạm khóa' : value;
//             case 'dob':
//             case 'identity_issue_date':
//                 return value ? new Date(value).toLocaleDateString('vi-VN') : '';
//             default:
//                 return value || 'Chưa cập nhật';
//         }
//     };
//
//     if (loading) return <div>Đang tải...</div>;
//     if (error) return <div style={{ color: 'red', textAlign: 'center' }}>{error}</div>;
//     if (!profile) return <div>Không có thông tin hồ sơ.</div>;
//
//     return (
//         <div className="profile-container">
//             <h2>Thông tin cá nhân</h2>
//
//             <div className="profile-content">
//                 {/* Thông tin tài khoản */}
//                 <div className="section">
//                     <h3 className="section-title">Thông tin tài khoản</h3>
//                     <div className="form-row">
//                         <div className="form-group">
//                             <label>Tên đăng nhập:</label>
//                             <div className="display-field">{formatDisplayValue('username', profile.username)}</div>
//                         </div>
//                         <div className="form-group">
//                             <label>Email:</label>
//                             <div className="display-field">{formatDisplayValue('email', profile.email)}</div>
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group">
//                             <label>Loại tài khoản:</label>
//                             <div className="display-field">{formatDisplayValue('account_type', profile.account_type)}</div>
//                         </div>
//                         <div className="form-group">
//                             <label>Vai trò:</label>
//                             <div className="display-field">{formatDisplayValue('role', profile.role)}</div>
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group">
//                             <label>Trạng thái xác thực:</label>
//                             <div className={`display-field status-badge ${profile.verified ? 'verified' : 'unverified'}`}>
//                                 {formatDisplayValue('verified', profile.verified)}
//                             </div>
//                         </div>
//                         <div className="form-group">
//                             <label>Trạng thái tài khoản:</label>
//                             <div className={`display-field status-badge ${profile.status}`}>
//                                 {formatDisplayValue('status', profile.status)}
//                             </div>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Thông tin cá nhân */}
//                 <div className="section">
//                     <h3 className="section-title">Thông tin cá nhân</h3>
//                     <div className="form-row">
//                         <div className="form-group">
//                             <label>Họ:</label>
//                             <div className="display-field">{formatDisplayValue('last_name', profile.last_name)}</div>
//                         </div>
//                         <div className="form-group">
//                             <label>Tên đệm:</label>
//                             <div className="display-field">{formatDisplayValue('middle_name', profile.middle_name)}</div>
//                         </div>
//                         <div className="form-group">
//                             <label>Tên:</label>
//                             <div className="display-field">{formatDisplayValue('first_name', profile.first_name)}</div>
//                         </div>
//                     </div>
//                     <div className="form-row">
//                         <div className="form-group">
//                             <label>Số điện thoại:</label>
//                             <div className="display-field">{formatDisplayValue('phone_number', profile.phone_number)}</div>
//                         </div>
//                         <div className="form-group">
//                             <label>Giới tính:</label>
//                             <div className="display-field">{formatDisplayValue('gender', profile.gender)}</div>
//                         </div>
//                         <div className="form-group">
//                             <label>Ngày sinh:</label>
//                             <div className="display-field">{formatDisplayValue('dob', profile.dob)}</div>
//                         </div>
//                     </div>
//                 </div>
//
//                 {/* Thông tin địa chỉ */}
//                 <div className="section">
//                     <h3 className="section-title">Thông tin địa chỉ</h3>
//                     <div className="form-row">
//                         <div className="form-group">
//                             <label>Tỉnh/Thành phố:</label>
//                             <div className="display-field">{formatDisplayValue('province', profile.province)}</div>
//                         </div>
//                         <div className="form-group">
//                             <label>Quận/Huyện:</label>
//                             <div className="display-field">{formatDisplayValue('district', profile.district)}</div>
//                         </div>
//                         <div className="form-group">
//                             <label>Phường/Xã:</label>
//                             <div className="display-field">{formatDisplayValue('ward', profile.ward)}</div>
//                         </div>
//                     </div>
//                     <div className="form-group">
//                         <label>Địa chỉ chi tiết:</label>
//                         <div className="display-field">{formatDisplayValue('detailed_address', profile.detailed_address)}</div>
//                     </div>
//                 </div>
//
//                 {/* Thông tin CCCD */}
//                 <div className="section">
//                     <h3 className="section-title">Thông tin CCCD</h3>
//                     <div className="form-row">
//                         <div className="form-group">
//                             <label>Nơi cấp:</label>
//                             <div className="display-field">{formatDisplayValue('identity_issue_place', profile.identity_issue_place)}</div>
//                         </div>
//                         <div className="form-group">
//                             <label>Ngày cấp:</label>
//                             <div className="display-field">{formatDisplayValue('identity_issue_date', profile.identity_issue_date)}</div>
//                         </div>
//                     </div>
//                 </div>
//             </div>
//         </div>
//     );
// };
//
// export default Profile;