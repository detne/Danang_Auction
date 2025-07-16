// src/pages/ForgotPasswordPage.js
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../../services/auth';
import logo from '../../assets/logo.png';
import '../../styles/ForgotPassword.css';

const ForgotPasswordPage = () => {
    const [email, setEmail] = useState('');
    const [message, setMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email.trim()) {
            setMessage('Vui lòng nhập email');
            return;
        }

        setIsLoading(true);
        setMessage('');

        try {
            const response = await authAPI.forgotPassword(email);
            if (response.success) {
                setIsSuccess(true);
                setMessage('Mã OTP đã được gửi đến email của bạn. Vui lòng kiểm tra hộp thư.');
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
        <div className="forgot-password-page">
            <div className="forgot-password-container">
                <div className="forgot-password-modal">
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
                        <h2>Quên mật khẩu</h2>
                        <p>Nhập email của bạn để nhận mã khôi phục</p>
                    </div>

                    {!isSuccess ? (
                        <form onSubmit={handleSubmit} className="forgot-password-form">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">Email</label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Nhập địa chỉ email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="form-input"
                                    required
                                    disabled={isLoading}
                                />
                            </div>

                            <button
                                type="submit"
                                className={`submit-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? 'Đang gửi...' : 'GỬI MÃ KHÔI PHỤC'}
                            </button>

                            {message && (
                                <div className={`message ${isSuccess ? 'success' : 'error'}`}>
                                    {message}
                                </div>
                            )}
                        </form>
                    ) : (
                        <div className="success-content">
                            <div className="success-icon">✅</div>
                            <p className="success-message">{message}</p>
                            <Link to="/reset-password" className="reset-link">
                                Nhập mã OTP để đặt lại mật khẩu
                            </Link>
                        </div>
                    )}

                    <div className="form-footer">
                        <Link to="/login" className="back-link">
                            ← Quay lại đăng nhập
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ForgotPasswordPage;