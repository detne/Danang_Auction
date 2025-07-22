import React, { useState, useCallback, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { authAPI } from '../../services/auth';
import logo from '../../assets/logo.png';
import '../../styles/Login.css';
import { USER_ROLES } from '../../utils/constants';
import { GoogleLogin } from '@react-oauth/google';
import ErrorDialogBootstrap from '../common/ErrorDialogBootstrap';

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
    const [showDialog, setShowDialog] = useState(false);
    const [loginFailed, setLoginFailed] = useState(false); // ✅ Cờ login fail

    useEffect(() => {
        if (!contextLoading && user?.role && !loginFailed) {
            if (user.role === USER_ROLES.ADMIN) {
                navigate('/admin');
            } else {
                navigate('/');
            }
        }
    }, [user, contextLoading, loginFailed, navigate]);

    const handleInputChange = useCallback((e) => {
        const { name, value, type, checked } = e.target;
        if (error) setError('');
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value,
        }));
    }, [error]);

    const handleSubmit = useCallback(async (e) => {
        e.preventDefault();

        if (!formData.username.trim()) {
            setError('Vui lòng nhập tên đăng nhập.');
            return;
        }
        if (!formData.password.trim()) {
            setError('Vui lòng nhập mật khẩu.');
            return;
        }

        setIsLoading(true);
        setError('');

        try {
            const response = await authAPI.login({
                username: formData.username.trim(),
                password: formData.password,
            });

            if (response && response.success) {
                const { access_token, expires_at, user: apiUser } = response.data;

                localStorage.setItem('token', access_token || token || jwt);
                localStorage.setItem('expiresAt', expires_at);
                localStorage.setItem('user', JSON.stringify(apiUser));

                if (formData.rememberPassword) {
                    localStorage.setItem('savedUsername', formData.username.trim());
                } else {
                    localStorage.removeItem('savedUsername');
                }

                setUser(apiUser);
                console.log('Đăng nhập thành công, vai trò:', apiUser.role);
            } else {
                setError(response?.message || 'Tên đăng nhập hoặc mật khẩu không chính xác.');
                setShowDialog(true);
                setLoginFailed(true); // ✅ Đánh dấu login thất bại
            }
        } catch (error) {
            console.error('Login error:', error);
            let errMsg = 'Đã xảy ra lỗi. Vui lòng thử lại.';
            setLoginFailed(true); // ✅ Login thất bại

            if (error.response) {
                const status = error.response.status;
                const data = error.response.data;
                if (status === 401) errMsg = 'Tên đăng nhập hoặc mật khẩu không chính xác.';
                else if (status === 400) errMsg = data?.message || 'Thông tin đăng nhập không hợp lệ.';
                else if (status === 429) errMsg = 'Quá nhiều lần thử đăng nhập. Vui lòng thử lại sau.';
                else if (status === 500) errMsg = 'Lỗi server. Vui lòng thử lại sau.';
                else errMsg = data?.message || errMsg;
            } else if (error.request) {
                errMsg = 'Không thể kết nối đến server. Vui lòng kiểm tra mạng.';
            } else {
                errMsg = error.message || errMsg;
            }

            setError(errMsg);
            setShowDialog(true);
        } finally {
            setIsLoading(false);
        }
    }, [formData, setUser]);

    const handleGoogleSuccess = useCallback(async (credentialResponse) => {
        setIsLoading(true);
        setError('');

        try {
            const response = await authAPI.googleLogin({ token: credentialResponse.credential });
            if (response.success) {
                const { access_token, expires_at, user: apiUser } = response.data;
                localStorage.setItem('token', access_token);
                localStorage.setItem('expiresAt', expires_at);
                localStorage.setItem('user', JSON.stringify(apiUser));
                setUser(apiUser);
                console.log('Đăng nhập Google thành công, vai trò:', apiUser.role);
            } else {
                setError(response.message || 'Đăng nhập Google thất bại');
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
        console.error('Google login error');
    }, []);

    const handleClose = useCallback(() => {
        navigate('/');
    }, [navigate]);

    if (contextLoading) {
        return (
            <div className="login-container">
                <div className="login-modal">
                    <div style={{ textAlign: 'center', padding: '15px' }}>
                        <div style={{ fontSize: '16px', color: '#666' }}>Đang tải...</div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="login-container">
            <div className="login-modal">
                <button className="close-button" onClick={handleClose} disabled={isLoading}>✕</button>

                <div className="logo-section">
                    <div className="logo-container">
                        <img src={logo} alt="DaNangAuction Logo" className="logo-image" />
                    </div>
                    <h1 className="company-name">DANANGAUCTION</h1>
                </div>

                <div className="signup-prompt">
                    <span>Bạn chưa có tài khoản? </span>
                    <Link to="/signup" className="signup-link-main">Đăng Ký Ngay</Link>
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

                    <div className="google-login-wrapper" style={{ marginTop: '15px' }}>
                        <GoogleLogin
                            onSuccess={handleGoogleSuccess}
                            onError={handleGoogleError}
                            theme="outline"
                            size="large"
                            width="100%"
                            text="continue_with"
                            shape="rectangular"
                            disabled={isLoading}
                        />
                    </div>
                </form>
            </div>

            {/* ✅ Popup lỗi đăng nhập (Modal) */}
            <ErrorDialogBootstrap
                show={showDialog}
                message={error}
                onClose={() => {
                    setShowDialog(false);
                    setFormData(prev => ({ ...prev, password: '' }));
                    setLoginFailed(false); // ✅ reset cờ
                    navigate('/login');    // ✅ quay về login sau khi OK
                }}
            />
        </div>
    );
};

export default Login;
