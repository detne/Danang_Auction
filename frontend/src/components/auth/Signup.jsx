// components/Signup.jsx
import React, { useState } from 'react';
import logo from '../../assets/logo.png';
import { useNavigate, Link } from 'react-router-dom';
import { authAPI } from '../../services/auth';
import '../../styles/SignUp.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        accountType: 'individual', // 'individual' or 'organization'
        firstName: '',
        lastName: '',
        fullName: '',
        loginName: '',
        password: '',
        confirmPassword: '',
        email: '',
        phone: '',
        gender: '',
        birthDate: '',
        birthMonth: '',
        birthYear: '',
        address: '',
        idNumber: '',
        idIssueDate: '',
        idIssuePlace: '',
        bankAccount: '',
        bankName: '',
        bankBranch: '',
        accountHolderName: ''
    });
    const [error, setError] = useState('');
    const [passwordStrength, setPasswordStrength] = useState([]);
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
        if (error) setError(''); //clear lỗi khi người dùng gõ

        if (name === 'password') {
            checkPasswordStrength(value);
        }
    };

    const checkPasswordStrength = (password) => {
        const criteria = [
            { text: 'Tối thiểu 8 ký tự', test: password.length >= 8 },
            { text: 'Chữ hoa tồn tại hoá', test: /[A-Z]/.test(password) },
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
        try {
            const res = await authAPI.register(formData);
            if (res.success) {
                navigate('/login');
            } else {
                setError(res.message || 'Lỗi đăng ký');
            }
        } catch {
            setError('Lỗi máy chủ');
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
                {error && <p className="error-msg">{error}</p>}

                <form onSubmit={handleSubmit}>
                    {/* Account Type Selection */}
                    <div className="form-group">
                        <label>Loại tài khoản</label>
                        <div className="radio-group">
                            <label>
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="individual"
                                    checked={formData.accountType === 'individual'}
                                    onChange={handleChange}
                                />
                                Cá nhân
                            </label>
                            <label>
                                <input
                                    type="radio"
                                    name="accountType"
                                    value="organization"
                                    checked={formData.accountType === 'organization'}
                                    onChange={handleChange}
                                />
                                Tổ chức
                            </label>
                        </div>
                    </div>

                    {/* Name Fields Row */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label htmlFor="firstName">Họ</label>
                            <input
                                type="text"
                                id="firstName"
                                name="firstName"
                                value={formData.firstName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="lastName">Tên đệm</label>
                            <input
                                type="text"
                                id="lastName"
                                name="lastName"
                                value={formData.lastName}
                                onChange={handleChange}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="fullName">Tên</label>
                            <input
                                type="text"
                                id="fullName"
                                name="fullName"
                                value={formData.fullName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Login Name */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="loginName">Tên đăng nhập</label>
                            <input
                                type="text"
                                id="loginName"
                                name="loginName"
                                value={formData.loginName}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Fields */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="password">Mật khẩu</label>
                            <input
                                type="password"
                                id="password"
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Password Strength Indicator */}
                    {formData.password && (
                        <div className="password-strength">
                            {passwordStrength.map((criterion, index) => (
                                <div
                                    key={index}
                                    className={`strength-item ${criterion.test ? 'active' : ''}`}
                                >
                                    {criterion.text}
                                </div>
                            ))}
                        </div>
                    )}

                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="confirmPassword">Nhập lại mật khẩu</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Contact Information */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label htmlFor="email">Nhập địa chỉ Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                value={formData.email}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">Nhập số điện thoại</label>
                            <input
                                type="tel"
                                id="phone"
                                name="phone"
                                value={formData.phone}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="gender">Chọn giới tính</label>
                            <select
                                id="gender"
                                name="gender"
                                value={formData.gender}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Chọn giới tính</option>
                                <option value="male">Nam</option>
                                <option value="female">Nữ</option>
                                <option value="other">Khác</option>
                            </select>
                        </div>
                    </div>

                    {/* Birth Date */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label htmlFor="birthDate">Chọn ngày</label>
                            <select
                                id="birthDate"
                                name="birthDate"
                                value={formData.birthDate}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Chọn ngày</option>
                                {Array.from({length: 31}, (_, i) => (
                                    <option key={i+1} value={i+1}>{i+1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthMonth">Chọn tháng</label>
                            <select
                                id="birthMonth"
                                name="birthMonth"
                                value={formData.birthMonth}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Chọn tháng</option>
                                {Array.from({length: 12}, (_, i) => (
                                    <option key={i+1} value={i+1}>Tháng {i+1}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="birthYear">Chọn năm</label>
                            <select
                                id="birthYear"
                                name="birthYear"
                                value={formData.birthYear}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Chọn năm</option>
                                {Array.from({length: 100}, (_, i) => {
                                    const year = new Date().getFullYear() - i;
                                    return <option key={year} value={year}>{year}</option>
                                })}
                            </select>
                        </div>
                    </div>

                    {/* Address */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="address">Địa chỉ chi tiết</label>
                            <input
                                type="text"
                                id="address"
                                name="address"
                                value={formData.address}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* ID Information */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label htmlFor="idNumber">CMND/CCCD</label>
                            <input
                                type="text"
                                id="idNumber"
                                name="idNumber"
                                value={formData.idNumber}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="idIssueDate">Ngày cấp</label>
                            <input
                                type="date"
                                id="idIssueDate"
                                name="idIssueDate"
                                value={formData.idIssueDate}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="idIssuePlace">Nơi cấp</label>
                            <input
                                type="text"
                                id="idIssuePlace"
                                name="idIssuePlace"
                                value={formData.idIssuePlace}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Document Upload */}
                    <div className="form-row-2">
                        <div className="form-group">
                            <label>Tải lên ảnh mặt trước CMND/CCCD</label>
                            <div className="upload-group">
                                <div className="upload-placeholder clickable">
                                    <div className="upload-icon">📄</div>
                                    <p>Tải lên ảnh mặt trước CMND/CCCD</p>
                                </div>
                            </div>
                        </div>
                        <div className="form-group">
                            <label>Tải lên ảnh mặt sau CMND/CCCD</label>
                            <div className="upload-group">
                                <div className="upload-placeholder clickable">
                                    <div className="upload-icon">📄</div>
                                    <p>Tải lên ảnh mặt sau CMND/CCCD</p>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Bank Information */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="bankAccount">Số tài khoản ngân hàng</label>
                            <input
                                type="text"
                                id="bankAccount"
                                name="bankAccount"
                                value={formData.bankAccount}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    <div className="form-row-3">
                        <div className="form-group">
                            <label htmlFor="bankName">Chọn tên ngân hàng</label>
                            <select
                                id="bankName"
                                name="bankName"
                                value={formData.bankName}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Chọn ngân hàng</option>
                                <option value="vietcombank">Vietcombank</option>
                                <option value="techcombank">Techcombank</option>
                                <option value="bidv">BIDV</option>
                                <option value="vietinbank">VietinBank</option>
                                <option value="agribank">Agribank</option>
                                <option value="mbbank">MB Bank</option>
                                <option value="acb">ACB</option>
                                <option value="vpbank">VPBank</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="bankBranch">Chi nhánh ngân hàng</label>
                            <input
                                type="text"
                                id="bankBranch"
                                name="bankBranch"
                                value={formData.bankBranch}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="accountHolderName">Tên chủ tài khoản</label>
                            <input
                                type="text"
                                id="accountHolderName"
                                name="accountHolderName"
                                value={formData.accountHolderName}
                                onChange={handleChange}
                                required
                            />
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