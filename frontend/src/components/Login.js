import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Login.css';
import { useUser } from '../contexts/UserContext';
import { GoogleLogin } from '@react-oauth/google';

const API_BASE = process.env.REACT_APP_API_BASE;
const Login = () => {
    const navigate = useNavigate();
    const { user, setUser, loading: contextLoading, error: contextError } = useUser();
    const [formData, setFormData] = useState({
        username: localStorage.getItem('savedUsername') || '',
        password: '',
        rememberPassword: !!localStorage.getItem('savedUsername'),
    });
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState(contextError || '');
    const [isLoading, setIsLoading] = useState(false);

    useEffect(() => {
        if (user && !contextLoading) {
            if (user.role === 'ADMIN') {
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
            const response = await fetch(`${API_BASE}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    username: formData.username,
                    password: formData.password,
                }),
            });
            const data = await response.json();

            if (data.success) {
                const { accessToken, expiresAt, user: apiUser } = data.data;
                localStorage.setItem('token', accessToken);
                localStorage.setItem('expiresAt', expiresAt);
                localStorage.setItem('user', JSON.stringify(apiUser));

                if (formData.rememberPassword) {
                    localStorage.setItem('savedUsername', formData.username);
                } else {
                    localStorage.removeItem('savedUsername');
                }

                setUser(apiUser);
                console.log('Đăng nhập thành công, vai trò:', apiUser.role);
            } else {
                setError(data.message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error.message);
            setError('Không thể kết nối đến server. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, [formData.username, formData.password, formData.rememberPassword, setUser]);

    const handleGoogleSuccess = useCallback(async (credentialResponse) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await fetch(`${API_BASE}/auth/google`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ token: credentialResponse.credential }),
            });
            const data = await response.json();

            if (data.success) {
                const { accessToken, expiresAt, user: apiUser } = data.data;
                localStorage.setItem('token', accessToken);
                localStorage.setItem('expiresAt', expiresAt);
                localStorage.setItem('user', JSON.stringify(apiUser));
                setUser(apiUser);
                console.log('Đăng nhập Google thành công, vai trò:', apiUser.role);
            } else {
                setError(data.message || 'Đăng nhập Google thất bại');
            }
        } catch (error) {
            console.error('Lỗi Google Login:', error.message);
            setError('Đăng nhập Google không thành công. Vui lòng thử lại.');
        } finally {
            setIsLoading(false);
        }
    }, [setUser]);

    const handleGoogleError = useCallback(() => {
        setError('Đăng nhập bằng Google thất bại.');
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
                                aria-label={showPassword ? 'Ẩn mật khẩu' : 'Hiện mật khẩu'}
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
                        <Link
                            to="/forgot-password"
                            className="forgot-password-link"
                            style={{
                                pointerEvents: isLoading ? 'none' : 'auto',
                                opacity: isLoading ? 0.6 : 1
                            }}
                        >
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        className={`login-submit-button ${isLoading ? 'loading' : ''}`}
                        disabled={isLoading}
                    >
                        {isLoading ? '' : 'ĐĂNG NHẬP'}
                    </button>

                    {error && <div className="error">{error}</div>}

                    <div className="google-login-wrapper" style={{ marginTop: '20px' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            width="100%"
                            disabled={isLoading}
                            theme="outline"
                            size="large"
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

