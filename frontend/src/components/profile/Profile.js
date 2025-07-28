import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import EditableFieldGroup from './EditableFieldGroup';
import DisplayFieldGroup from './DisplayFieldGroup';
import '../../styles/Profile.css';

const Profile = () => {
    const { user, updateUser } = useUser(); // Thêm updateUser nếu có
    const [isEditing, setIsEditing] = useState(false);
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [message, setMessage] = useState(null);
    const [formData, setFormData] = useState({});
    const [errors, setErrors] = useState({});
    const [avatarFile, setAvatarFile] = useState(null);

    // Fetch user profile
    useEffect(() => {
        const fetchProfile = async () => {
            try {
                setLoading(true);
                setError(null);

                // Kiểm tra token từ nhiều nguồn
                const token = user?.token || localStorage.getItem('token') || sessionStorage.getItem('token');

                if (!token) {
                    throw new Error('Vui lòng đăng nhập để xem thông tin hồ sơ');
                }

                console.log('Fetching profile with token:', token ? 'Token exists' : 'No token');

                // Cấu hình axios với baseURL nếu cần
                const config = {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                    timeout: 10000 // 10 seconds timeout
                };

                // Thử các endpoint khác nhau
                let response;
                try {
                    response = await axios.get('http://localhost:8080/api/auth/profile', config);
                } catch (err) {
                    // Nếu endpoint đầu không work, thử endpoint khác
                    if (err.response?.status === 404) {
                        response = await axios.get('http://localhost:8080/api/auth/profile', config);
                    } else {
                        throw err;
                    }
                }

                console.log('Profile response:', response.data);

                // Xử lý response data
                const profileData = response.data.data || response.data.user || response.data;

                if (!profileData) {
                    throw new Error('Không nhận được dữ liệu hồ sơ từ server');
                }

                setProfile(profileData);
                setFormData({
                    username: profileData.username || '',
                    email: profileData.email || '',
                    phoneNumber: profileData.phoneNumber || '',
                    firstName: profileData.firstName || '',
                    middleName: profileData.middleName || '',
                    lastName: profileData.lastName || '',
                    gender: profileData.gender || '',
                    dob: profileData.dob || '',
                    province: profileData.province || '',
                    district: profileData.district || '',
                    ward: profileData.ward || '',
                    detailedAddress: profileData.detailedAddress || '',
                    identityIssuePlace: profileData.identityIssuePlace || '',
                    identityIssueDate: profileData.identityIssueDate || ''
                });

            } catch (err) {
                console.error('Profile fetch error:', err);

                let errorMessage = 'Không thể tải thông tin hồ sơ';

                if (err.response) {
                    // Server responded with error status
                    switch (err.response.status) {
                        case 401:
                            errorMessage = 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại';
                            // Clear token and redirect to login
                            localStorage.removeItem('token');
                            sessionStorage.removeItem('token');
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
                    // Network error
                    errorMessage = 'Không thể kết nối đến server. Vui lòng kiểm tra kết nối mạng';
                } else {
                    errorMessage = err.message || errorMessage;
                }

                setError(errorMessage);
            } finally {
                setLoading(false);
            }
        };

        if (user || localStorage.getItem('token') || sessionStorage.getItem('token')) {
            fetchProfile();
        } else {
            setError('Vui lòng đăng nhập để xem thông tin hồ sơ');
            setLoading(false);
        }
    }, [user]);

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
            // Validate date format and age
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
        // Clear error for this field when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({ ...prev, [field]: null }));
        }
    };

    const handleAvatarChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            // Validate file size (max 5MB)
            if (file.size > 5 * 1024 * 1024) {
                setMessage({ type: 'error', text: 'Kích thước file không được vượt quá 5MB' });
                return;
            }

            // Validate file type
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
        setLoading(true);

        try {
            const token = user?.token || localStorage.getItem('token') || sessionStorage.getItem('token');
            if (!token) {
                throw new Error('Không tìm thấy token xác thực');
            }

            const updatedProfile = {
                username: formData.username.trim(),
                email: formData.email.trim(),
                phoneNumber: formData.phoneNumber.replace(/\D/g, ''), // Remove non-digits
                firstName: formData.firstName.trim(),
                middleName: formData.middleName?.trim() || '',
                lastName: formData.lastName?.trim() || '',
                gender: formData.gender,
                dob: formData.dob,
                province: formData.province?.trim() || '',
                district: formData.district?.trim() || '',
                ward: formData.ward?.trim() || '',
                detailedAddress: formData.detailedAddress.trim(),
                identityIssuePlace: formData.identityIssuePlace?.trim() || '',
                identityIssueDate: formData.identityIssueDate || ''
            };

            const formDataToSend = new FormData();
            Object.entries(updatedProfile).forEach(([key, value]) => {
                formDataToSend.append(key, value);
            });

            if (avatarFile) {
                formDataToSend.append('avatar', avatarFile);
            }

            console.log("Data being sent to server:", updatedProfile);

            let response;
            try {
                response = await axios.put('http://localhost:8080/api/auth/profile', formDataToSend, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'multipart/form-data'
                    },
                    timeout: 30000 // 30 seconds for file upload
                });
            } catch (err) {
                // Try alternative endpoint
                if (err.response?.status === 404) {
                    response = await axios.put('http://localhost:8080/api/auth/profile', formDataToSend, {
                        headers: {
                            'Authorization': `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        },
                        timeout: 30000
                    });
                } else {
                    throw err;
                }
            }

            const responseData = response.data.data || response.data.user || response.data;

            if (response.data.success !== false) {
                setMessage({ type: 'success', text: 'Cập nhật hồ sơ thành công!' });
                setProfile(responseData);
                setIsEditing(false);
                setAvatarFile(null);

                // Update user context if available
                if (updateUser && typeof updateUser === 'function') {
                    updateUser(responseData);
                }

                // Auto hide success message after 3 seconds
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
        // Reset form data to original profile data
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
                identityIssueDate: profile.identityIssueDate || ''
            });
        }
        setErrors({});
        setAvatarFile(null);
        setIsEditing(false);
        setMessage(null);
    };

    // Loading state
    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="text-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto"></div>
                    <p className="mt-4 text-gray-600">Đang tải thông tin hồ sơ...</p>
                </div>
            </div>
        );
    }

    // Error state
    if (error) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <div className="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Không thể tải thông tin</h2>
                    <p className="text-gray-600 mb-4">{error}</p>
                    <button
                        onClick={() => window.location.reload()}
                        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
                    >
                        Thử lại
                    </button>
                </div>
            </div>
        );
    }

    // No profile data
    if (!profile) {
        return (
            <div className="min-h-screen bg-gray-100 flex justify-center items-center">
                <div className="text-center bg-white p-8 rounded-lg shadow-lg max-w-md">
                    <div className="text-gray-400 text-6xl mb-4">👤</div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">Không có thông tin hồ sơ</h2>
                    <p className="text-gray-600 mb-4">Vui lòng liên hệ quản trị viên để được hỗ trợ</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-lg p-6">
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center">Thông tin cá nhân</h2>

                {/* Avatar Section */}
                <div className="flex justify-center mb-6">
                    <div className="relative">
                        <img
                            src={profile.avatar || '/assets/profile/default-avatar.png'}
                            alt="Avatar"
                            className="w-32 h-32 rounded-full object-cover border-4 border-gray-200"
                            onError={(e) => {
                                e.target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTI4IiBoZWlnaHQ9IjEyOCIgdmlld0JveD0iMCAwIDEyOCAxMjgiIGZpbGw9Im5vbmUiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+CjxyZWN0IHdpZHRoPSIxMjgiIGhlaWdodD0iMTI4IiBmaWxsPSIjRjNGNEY2Ii8+CjxwYXRoIGQ9Ik02NCA0OEM3MS43MzIgNDggNzggNDEuNzMyIDc4IDM0UzcxLjczMiAyMCA2NCAyMFM1MCAyNi4yNjggNTAgMzRTNTYuMjY4IDQ4IDY0IDQ4WiIgZmlsbD0iIzlDQTNBRiIvPgo8cGF0aCBkPSJNMTA4IDEwOEM5OCA5OCA4NC41IDkyIDY0IDkyUzMwIDk4IDIwIDEwOEgxMDhaIiBmaWxsPSIjOUNBM0FGIi8+Cjwvc3ZnPg==';
                            }}
                        />
                        {isEditing && (
                            <div className="absolute bottom-0 right-0">
                                <label className="cursor-pointer bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition-colors">
                                    <input
                                        type="file"
                                        accept="image/*"
                                        className="hidden"
                                        onChange={handleAvatarChange}
                                    />
                                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.536L16.732 3.732z" />
                                    </svg>
                                </label>
                            </div>
                        )}
                    </div>
                </div>

                {/* Message Notification */}
                {message && (
                    <div className={`mb-4 p-4 rounded-lg text-white flex items-center justify-between ${message.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
                        <span>{message.text}</span>
                        <button
                            onClick={() => setMessage(null)}
                            className="text-white hover:text-gray-200 ml-4"
                        >
                            ✕
                        </button>
                    </div>
                )}

                {/* Profile Sections */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* Account Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Thông tin tài khoản</h3>
                        <div className="space-y-4">
                            {isEditing ? (
                                <>
                                    <EditableFieldGroup
                                        label="Tên đăng nhập"
                                        field="username"
                                        value={formData.username}
                                        onChange={handleFieldChange}
                                        error={errors.username}
                                        disabled
                                    />
                                    <EditableFieldGroup
                                        label="Email"
                                        field="email"
                                        value={formData.email}
                                        onChange={handleFieldChange}
                                        error={errors.email}
                                    />
                                    <DisplayFieldGroup label="Loại tài khoản" field="accountType" value={profile.accountType} />
                                    <DisplayFieldGroup label="Vai trò" field="role" value={profile.role} />
                                    <DisplayFieldGroup
                                        label="Trạng thái xác thực"
                                        field="verified"
                                        value={profile.verified ? 'Đã xác thực' : 'Chưa xác thực'}
                                    />
                                    <DisplayFieldGroup label="Trạng thái tài khoản" field="status" value={profile.status} />
                                </>
                            ) : (
                                <>
                                    <DisplayFieldGroup label="Tên đăng nhập" field="username" value={profile.username} />
                                    <DisplayFieldGroup label="Email" field="email" value={profile.email} />
                                    <DisplayFieldGroup label="Loại tài khoản" field="accountType" value={profile.accountType} />
                                    <DisplayFieldGroup label="Vai trò" field="role" value={profile.role} />
                                    <DisplayFieldGroup
                                        label="Trạng thái xác thực"
                                        field="verified"
                                        value={profile.verified ? 'Đã xác thực' : 'Chưa xác thực'}
                                    />
                                    <DisplayFieldGroup label="Trạng thái tài khoản" field="status" value={profile.status} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Personal Information */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Thông tin cá nhân</h3>
                        <div className="space-y-4">
                            {isEditing ? (
                                <>
                                    <EditableFieldGroup
                                        label="Họ"
                                        field="lastName"
                                        value={formData.lastName}
                                        onChange={handleFieldChange}
                                    />
                                    <EditableFieldGroup
                                        label="Tên đệm"
                                        field="middleName"
                                        value={formData.middleName}
                                        onChange={handleFieldChange}
                                    />
                                    <EditableFieldGroup
                                        label="Tên"
                                        field="firstName"
                                        value={formData.firstName}
                                        onChange={handleFieldChange}
                                        error={errors.firstName}
                                    />
                                    <EditableFieldGroup
                                        label="Số điện thoại"
                                        field="phoneNumber"
                                        value={formData.phoneNumber}
                                        onChange={handleFieldChange}
                                        error={errors.phoneNumber}
                                    />
                                    <EditableFieldGroup
                                        label="Giới tính"
                                        field="gender"
                                        value={formData.gender}
                                        onChange={handleFieldChange}
                                        error={errors.gender}
                                    />
                                    <EditableFieldGroup
                                        label="Ngày sinh"
                                        field="dob"
                                        value={formData.dob}
                                        onChange={handleFieldChange}
                                        error={errors.dob}
                                    />
                                </>
                            ) : (
                                <>
                                    <DisplayFieldGroup label="Họ" field="lastName" value={profile.lastName} />
                                    <DisplayFieldGroup label="Tên đệm" field="middleName" value={profile.middleName} />
                                    <DisplayFieldGroup label="Tên" field="firstName" value={profile.firstName} />
                                    <DisplayFieldGroup label="Số điện thoại" field="phoneNumber" value={profile.phoneNumber} />
                                    <DisplayFieldGroup label="Giới tính" field="gender" value={profile.gender} />
                                    <DisplayFieldGroup label="Ngày sinh" field="dob" value={profile.dob} />
                                </>
                            )}
                        </div>
                    </div>

                    {/* Address & ID Information */}
                    <div className="bg-gray-50 p-4 rounded-lg md:col-span-2">
                        <h3 className="text-xl font-semibold text-gray-700 mb-4">Thông tin địa chỉ & CCCD</h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                            {isEditing ? (
                                <>
                                    <EditableFieldGroup
                                        label="Tỉnh/Thành phố"
                                        field="province"
                                        value={formData.province}
                                        onChange={handleFieldChange}
                                    />
                                    <EditableFieldGroup
                                        label="Quận/Huyện"
                                        field="district"
                                        value={formData.district}
                                        onChange={handleFieldChange}
                                    />
                                    <EditableFieldGroup
                                        label="Phường/Xã"
                                        field="ward"
                                        value={formData.ward}
                                        onChange={handleFieldChange}
                                    />
                                    <EditableFieldGroup
                                        label="Địa chỉ chi tiết"
                                        field="detailedAddress"
                                        value={formData.detailedAddress}
                                        onChange={handleFieldChange}
                                        error={errors.detailedAddress}
                                    />
                                    <EditableFieldGroup
                                        label="Nơi cấp CCCD"
                                        field="identityIssuePlace"
                                        value={formData.identityIssuePlace}
                                        onChange={handleFieldChange}
                                    />
                                    <EditableFieldGroup
                                        label="Ngày cấp CCCD"
                                        field="identityIssueDate"
                                        value={formData.identityIssueDate}
                                        onChange={handleFieldChange}
                                    />
                                </>
                            ) : (
                                <>
                                    <DisplayFieldGroup label="Tỉnh/Thành phố" field="province" value={profile.province} />
                                    <DisplayFieldGroup label="Quận/Huyện" field="district" value={profile.district} />
                                    <DisplayFieldGroup label="Phường/Xã" field="ward" value={profile.ward} />
                                    <DisplayFieldGroup label="Địa chỉ chi tiết" field="detailedAddress" value={profile.detailedAddress} />
                                    <DisplayFieldGroup label="Nơi cấp CCCD" field="identityIssuePlace" value={profile.identityIssuePlace} />
                                    <DisplayFieldGroup label="Ngày cấp CCCD" field="identityIssueDate" value={profile.identityIssueDate} />
                                </>
                            )}
                        </div>
                        {!isEditing && (
                            <Link to="/auction-history" className="text-blue-500 hover:underline mt-4 inline-block">
                                Xem lịch sử đấu giá
                            </Link>
                        )}
                    </div>
                </div>

                {/* Action Buttons */}
                <div className="mt-6 flex justify-end space-x-4">
                    {isEditing ? (
                        <>
                            <button
                                className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                                onClick={handleSave}
                                disabled={loading}
                            >
                                {loading ? 'Đang lưu...' : 'Lưu'}
                            </button>
                            <button
                                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors"
                                onClick={handleCancel}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                        </>
                    ) : (
                        <button
                            className="px-6 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
                            onClick={() => setIsEditing(true)}
                        >
                            Chỉnh sửa
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;