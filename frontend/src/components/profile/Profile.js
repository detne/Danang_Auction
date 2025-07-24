import React, {useState} from 'react';
import useProfile from '../../hooks/profile/useProfile';
import DisplayFieldGroup from './DisplayFieldGroup';
import EditableFieldGroup from './EditableFieldGroup';
import '../../styles/Profile.css';
import { authAPI } from '../../services/auth';

const Profile = () => {
    const {profile, loading, error} = useProfile();
    const [editMode, setEditMode] = useState(false);
    const [form, setForm] = useState({});
    const [saveLoading, setSaveLoading] = useState(false);
    const [saveError, setSaveError] = useState('');
    const [saveSuccess, setSaveSuccess] = useState('');
    const [avatarFile, setAvatarFile] = useState(null);
    const [avatarPreview, setAvatarPreview] = useState("");

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;
        setAvatarFile(file);
        setAvatarPreview(URL.createObjectURL(file)); // Hiện preview
    };

    // Khi nhấn nút chỉnh sửa
    const handleEdit = () => {
        setForm(profile);
        setEditMode(true);
        setSaveError('');
        setSaveSuccess('');
    };
    // Khi thay đổi trường dữ liệu
    const handleChange = (field, value) => {
        setForm(prev => ({...prev, [field]: value}));
    };
    // Khi nhấn lưu
    const handleSave = async () => {
        setSaveLoading(true);
        setSaveError('');
        setSaveSuccess('');
        try {
            let avatarUrl = profile.avatar;
            // Nếu có file avatar mới thì upload trước
            if (avatarFile) {
                const formData = new FormData();
                formData.append("avatar", avatarFile);
                // Gọi API upload avatar (phải do backend support)
                const res = await authAPI.uploadAvatar(formData);
                avatarUrl = res.avatarUrl; // hoặc field backend trả về
            }
            // Gửi profile mới (kèm avatar mới nếu có)
            await authAPI.updateProfile({ ...form, avatar: avatarUrl });
            setEditMode(false);
            setSaveSuccess('Cập nhật thành công!');
            window.location.reload();
        } catch (e) {
            setSaveError('Lưu thất bại, vui lòng thử lại.');
        } finally {
            setSaveLoading(false);
        }
    };

    // Khi nhấn hủy
    const handleCancel = () => {
        setEditMode(false);
        setForm({});
        setSaveError('');
        setSaveSuccess('');
    };
    // Các trường bạn muốn cho phép chỉnh sửa
    const editableFields = [
        { label: "Họ", field: "last_name" },
        { label: "Tên đệm", field: "middle_name" },
        { label: "Tên", field: "first_name" },
        { label: "Email", field: "email" },
        { label: "Số điện thoại", field: "phone_number" },
        { label: "Giới tính", field: "gender" },
        { label: "Ngày sinh", field: "dob" },
        { label: "Tỉnh/Thành phố", field: "province" },
        { label: "Quận/Huyện", field: "district" },
        { label: "Phường/Xã", field: "ward" },
        { label: "Địa chỉ chi tiết", field: "detailed_address" },
        { label: "Nơi cấp", field: "identity_issue_place" },
        { label: "Ngày cấp", field: "identity_issue_date" },
    ];

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div className="error-text">{error}</div>;
    if (!profile) return <div>Không có thông tin hồ sơ.</div>;

    return (
        <div className="profile-container">
            <h1>Profile</h1>
            {saveError && <div className="message-error">{saveError}</div>}
            {saveSuccess && <div className="message-success">{saveSuccess}</div>}

            <div className="profile-avatar-container">
                <div style={{ position: "relative" }}>
                    <img
                        className="profile-avatar"
                        src={avatarPreview || profile.avatar || '/default-avatar.png'}
                        alt="avatar"
                    />
                    {editMode && (
                        <label className="avatar-upload-btn">
                            <i className="fa fa-camera" />
                            <input
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={handleAvatarChange}
                                disabled={saveLoading}
                            />
                        </label>
                    )}
                </div>
                <h4>
                    {profile.last_name} {profile.middle_name} {profile.first_name}
                    <span className="online-badge">● Online</span>
                </h4>

            </div>


            <div className="profile-content-2x2">
                {/* Hàng 1 */}
                <div className="profile-row">
                    {/* Cột 1: Thông tin tài khoản */}
                    <div className="section-6">
                        <h3 className="section-title-6">Thông tin tài khoản</h3>
                        {editMode ? (
                            <EditableFieldGroup label="Email:" field="email" value={form.email} onChange={handleChange} />
                        ) : (
                            <>
                                <DisplayFieldGroup label="Tên đăng nhập:" field="username" value={profile.username}/>
                                <DisplayFieldGroup label="Email:" field="email" value={profile.email}/>
                            </>
                        )}
                        <DisplayFieldGroup label="Loại tài khoản:" field="account_type" value={editMode ? form.account_type : profile.account_type}/>
                        <DisplayFieldGroup label="Vai trò:" field="role" value={editMode ? form.role : profile.role}/>
                        <DisplayFieldGroup label="Trạng thái xác thực:" field="verified" value={editMode ? form.verified : profile.verified}/>
                        <DisplayFieldGroup label="Trạng thái tài khoản:" field="status" value={editMode ? form.status : profile.status}/>
                    </div>
                    {/* Cột 2: Thông tin cá nhân */}
                    <div className="section-6">
                        <h3 className="section-title-6">Thông tin cá nhân</h3>
                        {editMode ? (
                            <>
                                <EditableFieldGroup label="Họ:" field="last_name" value={form.last_name} onChange={handleChange}/>
                                <EditableFieldGroup label="Tên đệm:" field="middle_name" value={form.middle_name} onChange={handleChange}/>
                                <EditableFieldGroup label="Tên:" field="first_name" value={form.first_name} onChange={handleChange}/>
                                <EditableFieldGroup label="Số điện thoại:" field="phone_number" value={form.phone_number} onChange={handleChange}/>
                                <EditableFieldGroup label="Giới tính:" field="gender" value={form.gender} onChange={handleChange}/>
                                <EditableFieldGroup label="Ngày sinh:" field="dob" value={form.dob} onChange={handleChange}/>
                            </>
                        ) : (
                            <>
                                <DisplayFieldGroup label="Họ:" field="last_name" value={profile.last_name}/>
                                <DisplayFieldGroup label="Tên đệm:" field="middle_name" value={profile.middle_name}/>
                                <DisplayFieldGroup label="Tên:" field="first_name" value={profile.first_name}/>
                                <DisplayFieldGroup label="Số điện thoại:" field="phone_number" value={profile.phone_number}/>
                                <DisplayFieldGroup label="Giới tính:" field="gender" value={profile.gender}/>
                                <DisplayFieldGroup label="Ngày sinh:" field="dob" value={profile.dob}/>
                            </>
                        )}
                    </div>
                </div>
                {/* Hàng 2 */}
                <div className="profile-row">
                    {/* Cột 1: Thông tin địa chỉ */}
                    <div className="section-6">
                        <h3 className="section-title-6">Thông tin địa chỉ</h3>
                        {editMode ? (
                            <>
                                <EditableFieldGroup label="Tỉnh/Thành phố:" field="province" value={form.province} onChange={handleChange}/>
                                <EditableFieldGroup label="Quận/Huyện:" field="district" value={form.district} onChange={handleChange}/>
                                <EditableFieldGroup label="Phường/Xã:" field="ward" value={form.ward} onChange={handleChange}/>
                                <EditableFieldGroup label="Địa chỉ chi tiết:" field="detailed_address" value={form.detailed_address} onChange={handleChange}/>
                            </>
                        ) : (
                            <>
                                <DisplayFieldGroup label="Tỉnh/Thành phố:" field="province" value={profile.province}/>
                                <DisplayFieldGroup label="Quận/Huyện:" field="district" value={profile.district}/>
                                <DisplayFieldGroup label="Phường/Xã:" field="ward" value={profile.ward}/>
                                <DisplayFieldGroup label="Địa chỉ chi tiết:" field="detailed_address" value={profile.detailed_address}/>
                            </>
                        )}
                    </div>
                    {/* Cột 2: Thông tin CCCD */}
                    <div className="section-6">
                        <h3 className="section-title-6">Thông tin CCCD</h3>
                        {editMode ? (
                            <>
                                <EditableFieldGroup label="Nơi cấp:" field="identity_issue_place" value={form.identity_issue_place} onChange={handleChange}/>
                                <EditableFieldGroup label="Ngày cấp:" field="identity_issue_date" value={form.identity_issue_date} onChange={handleChange}/>
                            </>
                        ) : (
                            <>
                                <DisplayFieldGroup label="Nơi cấp:" field="identity_issue_place" value={profile.identity_issue_place}/>
                                <DisplayFieldGroup label="Ngày cấp:" field="identity_issue_date" value={profile.identity_issue_date}/>
                            </>
                        )}
                    </div>
                </div>
                {/* Nút ở dưới cùng, căn phải */}
                <div className="profile-actions" style={{ justifyContent: "flex-start" }}>
                    {editMode ? (
                        <>
                            <button className="btn btn-primary" type="button" onClick={handleSave} disabled={saveLoading}>Lưu</button>
                            <button className="btn btn-cancel" type="button" onClick={handleCancel}>Hủy</button>
                        </>
                    ) : (
                        <button className="btn btn-primary" onClick={handleEdit}>Chỉnh sửa</button>
                    )}
                </div>
            </div>

        </div>
    );
};

export default Profile;