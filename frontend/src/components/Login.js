import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';
import logo from '../assets/logo.png';

const Login = () => {
    const [formData, setFormData] = useState({
        email: '',
        password: '',
        rememberPassword: false
    });

    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = (e) => {
        // Kiểm tra an toàn để tránh lỗi nếu e không được truyền vào
        if (e && typeof e.preventDefault === 'function') {
            e.preventDefault();
        }

        console.log('Đăng nhập với:', formData);

        // Nếu rememberPassword = true, lưu thông tin đăng nhập
        if (formData.rememberPassword) {
            console.log('Lưu mật khẩu được chọn');
            // Ví dụ: Lưu thông tin đăng nhập vào localStorage (cần mã hóa trong thực tế)
            localStorage.setItem('savedEmail', formData.email);
            // Lưu ý: Không lưu mật khẩu dạng văn bản thuần trong thực tế, cần mã hóa
        } else {
            localStorage.removeItem('savedEmail');
        }

        // Logic đăng nhập thực tế (gọi API, xử lý phản hồi, v.v.) có thể được thêm ở đây
    };

    const handleClose = () => {
        // Xử lý đóng modal
        console.log('Đóng form');
    };

    return (
        <div className="login-container">
            <div className="login-modal">
                <button className="close-button" onClick={handleClose}>
                    ✕
                </button>

                <div className="logo-section">
                    <div className="logo-container">
                        <img src={logo} alt="Logo" className="logo-image" />
                    </div>
                    <h1 className="company-name">DANANGAUCTION</h1>
                </div>

                <div className="signup-prompt">
                    <span>Bạn chưa có tài khoản? </span>
                    <Link to="/signup" className="signup-link-main">Đăng Ký Ngay</Link>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Tên đăng nhập / Email</label>
                        <input
                            type="text"
                            name="email"
                            placeholder="Nhập tên đăng nhập/Email"
                            value={formData.email}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mật khẩu</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                placeholder="Mật khẩu"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                            />
                            <button
                                type="button"
                                className="password-toggle"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group checkbox-and-forgot-row">
                        <div className="remember-password-group">
                            <div className="checkbox-wrapper">
                                <input
                                    type="checkbox"
                                    id="rememberPassword"
                                    name="rememberPassword"
                                    checked={formData.rememberPassword}
                                    onChange={handleInputChange}
                                    className="checkbox-input"
                                />
                                <label htmlFor="rememberPassword" className="checkbox-label">
                                    <span className="checkbox-custom"></span>
                                    Lưu mật khẩu
                                </label>
                            </div>
                        </div>

                        <Link to="/forgot-password" className="forgot-password-link">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button type="submit" className="login-submit-button">
                        ĐĂNG NHẬP
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Login;