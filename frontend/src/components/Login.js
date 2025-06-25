import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import '../styles/Login.css';
import { loginUser } from '../services/api';
import { useUser } from '../contexts/UserContext';
import { GoogleLogin } from '@react-oauth/google';

const Login = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();
    const [formData, setFormData] = useState({
        username: localStorage.getItem('savedUsername') || '',
        password: '',
        rememberPassword: !!localStorage.getItem('savedUsername'),
    });
    const [showPassword, setShowPassword] = useState(false);

    const handleInputChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await loginUser({
                username: formData.username,
                password: formData.password
            });

            const success = response?.success;
            const data = response?.data;
            const message = response?.message;

            if (success && data?.accessToken) {
                localStorage.setItem('token', data.accessToken);
                localStorage.setItem('user', JSON.stringify(data.user));

                if (formData.rememberPassword) {
                    localStorage.setItem('savedUsername', formData.username);
                } else {
                    localStorage.removeItem('savedUsername');
                }

                setUser(data.user);
                // Điều hướng dựa trên vai trò
                if (data.user.role === 'ADMIN') {
                    navigate('/admin');
                } else {
                    navigate('/');
                }
            } else {
                alert(message || 'Đăng nhập thất bại');
            }
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            alert('Không thể đăng nhập. Vui lòng kiểm tra lại thông tin.');
        }
    };

    return (
        <div className="login-container">
            <div className="login-modal">
                <button className="close-button">✕</button>

                <div className="logo-section text-center">
                    <img
                        src={logo}
                        alt="DaNangAuction Logo"
                        className="mb-2"
                        style={{ width: '100px' }}
                    />
                    <h1 className="company-name">DANANGAUCTION.COM</h1>
                </div>

                <div className="signup-prompt">
                    <span>Bạn chưa có tài khoản? </span>
                    <Link to="/signup" className="signup-link-main">Đăng Ký Ngay</Link>
                </div>

                <form onSubmit={handleSubmit} className="login-form">
                    <div className="form-group">
                        <label className="form-label">Tên đăng nhập</label>
                        <input
                            type="text"
                            name="username"
                            value={formData.username}
                            onChange={handleInputChange}
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label className="form-label">Mật khẩu</label>
                        <div className="password-input-wrapper">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleInputChange}
                                required
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}>
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div className="form-group checkbox-and-forgot-row">
                        <label>
                            <input
                                type="checkbox"
                                name="rememberPassword"
                                checked={formData.rememberPassword}
                                onChange={handleInputChange}
                            />
                            Lưu mật khẩu
                        </label>
                        <Link to="/forgot-password" className="forgot-password-link">
                            Quên mật khẩu?
                        </Link>
                    </div>

                    <button type="submit" className="login-submit-button">ĐĂNG NHẬP</button>

                    <div className="google-login-wrapper" style={{ marginTop: '20px' }}>
                        <GoogleLogin
                            onSuccess={credentialResponse => {
                                console.log(credentialResponse);
                                // Gửi token lên backend để xác thực/đăng ký
                            }}
                            onError={() => {
                                console.log('Google Login Failed');
                            }}
                            width="100%"
                        />
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Login;