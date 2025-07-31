import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/auth';
import '../../styles/SignUp.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        accountType: 'PERSONAL',
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        password: '',
        confirmPassword: '',
        email: '',
        phoneNumber: '',
        gender: '',
        dob: '',
        province: '',
        district: '',
        ward: '',
        detailedAddress: '',
        identityNumber: '',
        identityIssueDate: '',
        identityIssuePlace: '',
        bankAccountNumber: '',
        bankName: '',
        bankAccountHolder: '',
    });

    const [frontImage, setFrontImage] = useState(null);
    const [backImage, setBackImage] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState(''); // Thêm state cho thông báo thành công
    const [passwordStrength, setPasswordStrength] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError('');
        if (successMessage) setSuccessMessage(''); // Clear success message khi user thay đổi input
        if (name === 'password') checkPasswordStrength(value);
    };

    const handleFileChange = (e, type) => {
        if (type === "front") setFrontImage(e.target.files[0]);
        else setBackImage(e.target.files[0]);
    };

    const checkPasswordStrength = (password) => {
        const criteria = [
            { text: 'Tối thiểu 8 ký tự', test: password.length >= 8 },
            { text: 'Chữ hoa tồn tại', test: /[A-Z]/.test(password) },
            { text: 'Chữ ký tự viết thường', test: /[a-z]/.test(password) },
            { text: 'Chữ số', test: /\d/.test(password) },
            { text: 'Chữ ký tự đặc biệt', test: /[!@#$%^&*(),.?":{}|<>]/.test(password) }
        ];
        setPasswordStrength(criteria);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }
        if (!frontImage || !backImage) {
            setError('Vui lòng tải lên ảnh mặt trước và mặt sau CCCD');
            return;
        }

        setIsLoading(true);
        setError('');
        setSuccessMessage('');

        try {
            const data = new FormData();
            Object.keys(formData).forEach(key => {
                if (key !== "confirmPassword") {
                    data.append(key, formData[key]);
                }
            });
            data.append('files', frontImage);
            data.append('files', backImage);

            const res = await authAPI.register(data);
            if (res.data && res.data.success === true) {
                setError('');
                setSuccessMessage('Đăng ký thành công! Đang chuyển hướng đến trang đăng nhập...');

                // Delay 2 giây để người dùng có thể đọc thông báo thành công
                setTimeout(() => {
                    navigate('/login', {
                        state: {
                            message: 'Đăng ký thành công! Vui lòng đăng nhập với tài khoản vừa tạo.',
                            username: formData.username // Truyền username để tự động fill vào form login
                        }
                    });
                }, 2000);
                return;
            }
            setError(res.data?.message || 'Lỗi đăng ký');
        } catch (err) {
            setError(
                err?.response?.data?.message ||
                (err?.response?.data?.errors && Object.values(err.response.data.errors).join(' | ')) ||
                'Lỗi máy chủ'
            );
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="signup-container">
            <div className="signup-form">
                <img src={logo} alt="DaNangAuction Logo" className="signup-logo" />
                <h1 className="slogan">
                    <span className="slogan-highlight">DANANGAUCTION.COM</span>
                    <br />
                    Sàn đấu giá chất lượng số 1 hàng đầu Đà Nẵng
                </h1>
                <h2>Đăng ký tài khoản</h2>

                {/* Hiển thị thông báo lỗi */}
                {error && <p className="error-msg">{error}</p>}

                {/* Hiển thị thông báo thành công */}
                {successMessage && <p className="success-msg">{successMessage}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Account Type */}
                    <div className="form-group">
                        <label>Loại tài khoản</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="PERSONAL"
                                    checked={formData.accountType === 'PERSONAL'}
                                    onChange={handleChange}
                                />
                                Cá nhân
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="ORGANIZATION"
                                    checked={formData.accountType === 'ORGANIZATION'}
                                    onChange={handleChange}
                                />
                                Tổ chức
                            </label>
                        </div>
                    </div>

                    {/* Name Fields Row */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label>Họ</label>
                            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Tên đệm</label>
                            <input type="text" name="middleName" value={formData.middleName} onChange={handleChange} />
                        </div>
                        <div className="form-group">
                            <label>Tên</label>
                            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Login Name */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label>Tên đăng nhập</label>
                            <input type="text" name="username" value={formData.username} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label>Mật khẩu</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required />
                        </div>
                    </div>
                    {formData.password && (
                        <div className="password-strength">
                            {passwordStrength.map((criterion, index) => (
                                <div key={index} className={`strength-item ${criterion.test ? 'active' : ''}`}>
                                    {criterion.text}
                                </div>
                            ))}
                        </div>
                    )}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label style={{ width: "168.8px" }}>Nhập lại mật khẩu</label>
                            <input type="password" name="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label>Email</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Số điện thoại</label>
                            <input type="tel" name="phoneNumber" value={formData.phoneNumber} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Giới tính</label>
                            <select name="gender" value={formData.gender} onChange={handleChange} required>
                                <option value="">Chọn giới tính</option>
                                <option value="MALE">Nam</option>
                                <option value="FEMALE">Nữ</option>
                                <option value="OTHER">Khác</option>
                            </select>
                        </div>
                    </div>

                    {/* Ngày sinh */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label>Ngày sinh</label>
                            <input type="date" name="dob" value={formData.dob} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Địa chỉ */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label>Tỉnh/Thành phố</label>
                            <input type="text" name="province" value={formData.province} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Quận/Huyện</label>
                            <input type="text" name="district" value={formData.district} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Phường/Xã</label>
                            <input type="text" name="ward" value={formData.ward} onChange={handleChange} required />
                        </div>
                        <div className="form-group" style={{ flex: "2 1 100%" }}>
                            <label>Địa chỉ chi tiết</label>
                            <input type="text" name="detailedAddress" value={formData.detailedAddress} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* ID Information */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label>CMND/CCCD</label>
                            <input type="text" name="identityNumber" value={formData.identityNumber} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Ngày cấp</label>
                            <input type="date" name="identityIssueDate" value={formData.identityIssueDate} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Nơi cấp</label>
                            <input type="text" name="identityIssuePlace" value={formData.identityIssuePlace} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Document Upload */}
                    <div className="form-row-2">
                        <div className="form-group">
                            <label>Ảnh mặt trước CMND/CCCD</label>
                            <input type="file" accept="image/*" onChange={e => handleFileChange(e, "front")} required />
                        </div>
                        <div className="form-group">
                            <label>Ảnh mặt sau CMND/CCCD</label>
                            <input type="file" accept="image/*" onChange={e => handleFileChange(e, "back")} required />
                        </div>
                    </div>

                    {/* Bank Information */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label>Số tài khoản ngân hàng</label>
                            <input type="text" name="bankAccountNumber" value={formData.bankAccountNumber} onChange={handleChange} required />
                        </div>
                        <div className="form-group">
                            <label>Tên ngân hàng</label>
                            <input
                                type="text"
                                name="bankName"
                                style={{ height: "50px", transform: "translate(0px, 19.816px)" }}
                                value={formData.bankName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>Tên chủ tài khoản</label>
                            <input type="text" name="bankAccountHolder" value={formData.bankAccountHolder} onChange={handleChange} required />
                        </div>
                    </div>

                    {/* Terms and Conditions */}
                    <div className="terms-section">
                        <div className="terms-checkbox-inline">
                            <input type="checkbox" id="agree-terms" required />
                            <div className="terms-description">
                                Tôi cam kết tuân thủ Quyền và trách nhiệm của Người tham gia đấu giá
                            </div>
                        </div>
                    </div>

                    <button type="submit" className="signup-btn" disabled={isLoading}>
                        {isLoading ? 'Đang xử lý...' : 'ĐĂNG KÝ TÀI KHOẢN'}
                    </button>
                </form>

                <div className="social-login-section">
                    <p className="already-account">
                        Bạn đã có tài khoản?
                        <Link to="/login" className="login-link">Đăng nhập</Link>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Signup;