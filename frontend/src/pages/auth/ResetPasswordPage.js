// src/pages/ResetPasswordPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/auth';
import logo from '../../assets/logo.png';
import '../../styles/ForgotPassword.css';

const ResetPasswordPage = () => {
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: ''
    });
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate email format
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
            setMessage('Email không hợp lệ');
            return;
        }

        // Validate OTP length
        if (formData.otp.length !== 6) {
            setMessage('Mã OTP phải có 6 ký tự');
            return;
        }

        if (formData.newPassword !== formData.confirmPassword) {
            setMessage('Mật khẩu xác nhận không khớp');
            return;
        }

        if (formData.newPassword.length < 6) {
            setMessage('Mật khẩu phải có ít nhất 6 ký tự');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await authAPI.resetPassword({
                email: formData.email,
                otp: formData.otp,
                newPassword: formData.newPassword
            });

            if (response.success) {
                setMessage('Đặt lại mật khẩu thành công!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            } else {
                setMessage(response.message || 'Có lỗi xảy ra, vui lòng thử lại');
            }
        } catch (error) {
            setMessage(error.message || 'Không thể kết nối đến server');
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="reset-password-page">
            <div className="reset-password-container">
                <div className="reset-password-modal">
                    <button
                        className="close-button"
                        onClick={() => navigate('/login')}
                        disabled={isLoading}
                    >
                        ✕
                    </button>

                    <div className="logo-section">
                        <div className="logo-container">
                            <img src={logo} alt="DaNangAuction Logo" className="logo-image" />
                        </div>
                        <h1 className="company-name">DANANGAUCTION</h1>
                    </div>

                    <div className="form-header">
                        <h2>Đặt lại mật khẩu</h2>
                        <p>Nhập mã OTP và mật khẩu mới</p>
                    </div>

                    <form onSubmit={handleSubmit} className="reset-password-form">
                        <div className="form-group">
                            <label htmlFor="email" className="form-label">Email</label>
                            <input
                                type="email"
                                id="email"
                                name="email"
                                placeholder="Nhập địa chỉ email"
                                value={formData.email}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                                disabled={isLoading}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="otp" className="form-label">Mã OTP</label>
                            <input
                                type="text"
                                id="otp"
                                name="otp"
                                placeholder="Nhập mã OTP từ email"
                                value={formData.otp}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                                disabled={isLoading}
                                maxLength={6}
                            />
                        </div>

                        <div className="form-group">
                            <label htmlFor="newPassword" className="form-label">Mật khẩu mới</label>
                            <div className="password-input-wrapper">
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="Nhập mật khẩu mới"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    disabled={isLoading}
                                    minLength={6}
                                />
                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() => setShowPassword(!showPassword)}
                                    disabled={isLoading}
                                >
                                    {showPassword ? '🙈' : '👁️'}
                                </button>
                            </div>
                        </div>

                        <div className="form-group">
                            <label htmlFor="confirmPassword" className="form-label">Xác nhận mật khẩu</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                placeholder="Nhập lại mật khẩu mới"
                                value={formData.confirmPassword}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                                disabled={isLoading}
                                minLength={6}
                            />
                        </div>

                        <button
                            type="submit"
                            className={`submit-button ${isLoading ? 'loading' : ''}`}
                            disabled={isLoading}
                        >
                            {isLoading ? 'Đang xử lý...' : 'ĐẶT LẠI MẬT KHẨU'}
                        </button>

                        {message && (
                            <div className={`message ${message.includes('thành công') ? 'success' : 'error'}`}>
                                {message}
                            </div>
                        )}
                    </form>

                    <div className="form-footer">
                        <Link to="/forgot-password" className="back-link">
                            ← Gửi lại mã OTP
                        </Link>
                        <Link to="/login" className="login-link">
                            Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ResetPasswordPage;