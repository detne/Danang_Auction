import React, { useState, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/ForgotPassword.css';
import { forgotPassword, resetPassword } from '../services/api';

const ForgotPassword = () => {
    const navigate = useNavigate();
    const [step, setStep] = useState(1); // 1: Nhập email, 2: Nhập OTP và mật khẩu
    const [formData, setFormData] = useState({
        email: '',
        otp: '',
        newPassword: '',
        confirmPassword: '',
    });
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    const handleInputChange = useCallback((e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
        setError('');
        setSuccess('');
    }, []);

    const handleSubmitEmail = useCallback(
        async (e) => {
            e.preventDefault();
            if (!formData.email.trim()) {
                setError('Vui lòng nhập địa chỉ email.');
                return;
            }

            setIsLoading(true);
            try {
                const response = await forgotPassword({ email: formData.email });
                setSuccess('Nếu email hợp lệ, mã OTP đã được gửi. Vui lòng kiểm tra hộp thư.');
                setStep(2); // Chuyển sang bước nhập OTP
            } catch (err) {
                setError(err.message || 'Không thể gửi yêu cầu. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        },
        [formData.email]
    );

    const handleSubmitReset = useCallback(
        async (e) => {
            e.preventDefault();
            if (!formData.otp.trim() || !formData.newPassword.trim() || !formData.confirmPassword.trim()) {
                setError('Vui lòng nhập đầy đủ các trường.');
                return;
            }
            if (formData.newPassword !== formData.confirmPassword) {
                setError('Mật khẩu xác nhận không khớp.');
                return;
            }

            setIsLoading(true);
            try {
                const response = await resetPassword({
                    email: formData.email,
                    otp: formData.otp,
                    newPassword: formData.newPassword,
                    confirmPassword: formData.confirmPassword,
                });
                if (response.success) {
                    setSuccess('Đặt lại mật khẩu thành công! Bạn sẽ được chuyển về trang đăng nhập.');
                    setTimeout(() => navigate('/login'), 2000);
                } else {
                    setError(response.message || 'Không thể đặt lại mật khẩu. Vui lòng thử lại.');
                }
            } catch (err) {
                setError(err.message || 'Có lỗi xảy ra. Vui lòng thử lại.');
            } finally {
                setIsLoading(false);
            }
        },
        [formData, navigate]
    );

    const handleClose = useCallback(() => {
        navigate('/login');
    }, [navigate]);

    return (
        <div className="forgot-password-container">
            <div className="forgot-password-modal">
                <button className="close-button" onClick={handleClose} disabled={isLoading}>
                    ✕
                </button>

                <div className="logo-section">
                    <div className="logo-container">
                        <img src={logo} alt="DaNangAuction Logo" className="logo-image" />
                    </div>
                    <h1 className="company-name">DANANGAUCTION</h1>
                </div>

                {step === 1 ? (
                    <>
                        <h2 className="form-title">Quên Mật Khẩu</h2>
                        <p className="form-description">
                            Nhập địa chỉ email của bạn để nhận mã OTP.
                        </p>
                        <form onSubmit={handleSubmitEmail} className="forgot-password-form">
                            <div className="form-group">
                                <label htmlFor="email" className="form-label">
                                    Email
                                </label>
                                <input
                                    type="email"
                                    id="email"
                                    name="email"
                                    placeholder="Nhập email"
                                    value={formData.email}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    disabled={isLoading}
                                    autoComplete="email"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`submit-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? '' : 'Gửi Mã OTP'}
                            </button>

                            {error && <div className="error">{error}</div>}
                            {success && <div className="success">{success}</div>}

                            <div className="back-to-login">
                                <Link to="/login" className="back-link">
                                    Quay lại Đăng nhập
                                </Link>
                            </div>
                        </form>
                    </>
                ) : (
                    <>
                        <h2 className="form-title">Đặt Lại Mật Khẩu</h2>
                        <p className="form-description">
                            Nhập mã OTP và mật khẩu mới của bạn.
                        </p>
                        <form onSubmit={handleSubmitReset} className="forgot-password-form">
                            <div className="form-group">
                                <label htmlFor="otp" className="form-label">
                                    Mã OTP
                                </label>
                                <input
                                    type="text"
                                    id="otp"
                                    name="otp"
                                    placeholder="Nhập mã OTP"
                                    value={formData.otp}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    disabled={isLoading}
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="newPassword" className="form-label">
                                    Mật khẩu mới
                                </label>
                                <input
                                    type="password"
                                    id="newPassword"
                                    name="newPassword"
                                    placeholder="Nhập mật khẩu mới"
                                    value={formData.newPassword}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                            </div>
                            <div className="form-group">
                                <label htmlFor="confirmPassword" className="form-label">
                                    Xác nhận mật khẩu
                                </label>
                                <input
                                    type="password"
                                    id="confirmPassword"
                                    name="confirmPassword"
                                    placeholder="Xác nhận mật khẩu"
                                    value={formData.confirmPassword}
                                    onChange={handleInputChange}
                                    className="form-input"
                                    required
                                    disabled={isLoading}
                                    autoComplete="new-password"
                                />
                            </div>

                            <button
                                type="submit"
                                className={`submit-button ${isLoading ? 'loading' : ''}`}
                                disabled={isLoading}
                            >
                                {isLoading ? '' : 'Đặt Lại Mật Khẩu'}
                            </button>

                            {error && <div className="error">{error}</div>}
                            {success && <div className="success">{success}</div>}

                            <div className="back-to-login">
                                <Link to="/login" className="back-link">
                                    Quay lại Đăng nhập
                                </Link>
                            </div>
                        </form>
                    </>
                )}
            </div>
        </div>
    );
};

export default ForgotPassword;