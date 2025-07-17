// src/components/auth/Login.jsx
import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { authAPI } from '../../services/auth';
import logo from '../../assets/logo.png';
import '../../styles/Login.css';
import { USER_ROLES } from "../../utils/constants";
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate();
    const { user, setUser, loading: contextLoading } = useUser();
    const [formData, setFormData] = useState({
        username: localStorage.getItem('savedUsername') || '',
        password: '',
        rememberPassword: !!localStorage.getItem('savedUsername'),
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState('');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user && !contextLoading) {
            if (user.role === USER_ROLES.ADMIN) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [user, contextLoading, navigate]);

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, []);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();
        if (!formData.username.trim() || !formData.password.trim()) {
            setError('Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await authAPI.login({
                username: formData.username,
                password: formData.password,
            });

            if (response.success) {
                const { accessToken, expiresAt, user: apiUser } = response.data;
                localStorage.setItem('token', accessToken);
                localStorage.setItem('expiresAt', expiresAt);
                localStorage.setItem('user', JSON.stringify(apiUser));

                if (formData.rememberPassword) {
                    localStorage.setItem('savedUsername', formData.username);
                } else {
                    localStorage.removeItem('savedUsername');
                }

                setUser(apiUser);
            } else {
                setError(response.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            setError(error.message || 'Không thể kết nối đến server. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, [formData, setUser]);

    const handleGoogleLogin = useCallback(async () => {
        try {
            console.log('Google login clicked');
        } catch (error) {
            setError('Đăng nhập bằng Google thất bại');
        }
    }, []);

    const handleGoogleSuccess = useCallback((response) => {
        try {
            console.log('Google login successful:', response);
            // Process the response and authenticate the user
        } catch (error) {
            setError('Xử lý đăng nhập bằng Google thất bại');
        }
    }, []);

    const handleClose = useCallback(() => {
        navigate('/');
    }, [navigate]);

    if (contextLoading) {
        return (
            <div className="login-container">
                <div className="login-modal">
                    <div style={{ textAlign: 'center', padding: '20px' }}>
                        <div style={{ fontSize: '18px', color: '#666' }}>Đang tải...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-modal">
                <button className="close-button" onClick={handleClose} disabled={isLoading}>
                    ✕
                </button>

                <div className="logo-section">
                    <div className="logo-container">
                        <img src={logo} alt="DaNangAuction Logo" className="logo-image" />
                    </div>
                    <h1 className="company-name">DANANGAUCTION</h1>
                </div>

                <div className="signup-prompt">
                    <span>Bạn chưa có tài khoản? </span>
                    <Link to="/signup" className="signup-link-main">
                        Đăng Ký Ngay
                    </Link>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label htmlFor="username" className="form-label">Tên đăng nhập</label>
                        <input
                            type="text"
                            id="username"
                            name="username"
                            placeholder="Nhập tên đăng nhập"
                            value={formData.username}
                            onChange={handleInputChange}
                            className="form-input"
                            required
                            disabled={isLoading}
                            autoComplete="username"
                        />
                    </div>

                    <div className="form-group">
                        <label htmlFor="password" className="form-label">Mật khẩu</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                id="password"
                                name="password"
                                placeholder="Mật khẩu"
                                value={formData.password}
                                onChange={handleInputChange}
                                className="form-input"
                                required
                                disabled={isLoading}
                                autoComplete="current-password"
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
                                    disabled={isLoading}
                                />
                                <label htmlFor="rememberPassword" className="checkbox-label">
                                    <span className="checkbox-custom"></span>
                                    <span>Lưu mật khẩu</span>
                                </label>
                            </div>
                        </div>
                        <Link to="/forgot-password" className="forgot-password-link">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={`login-submit-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? 'Đang đăng nhập...' : 'ĐĂNG NHẬP'}
                    </button>

                    {error && <div className="error">{error}</div>}

                    {/* Google Login Button */}
                    <div className="google-login-wrapper" style={{ marginTop: '20px' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={(error) => {
                                setError('Đăng nhập bằng Google thất bại');
                                console.error('Google login error:', error);
                            }}
                            theme="outline"
                            size="large"
                            width="100%"
                            text="continue_with"
                            shape="rectangular"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;