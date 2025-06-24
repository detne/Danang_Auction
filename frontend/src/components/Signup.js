// components/Signup.js
import React, { useState } from 'react';
import logo from '../assets/logo.jpg';
import { useNavigate } from 'react-router-dom';
import { registerUser } from '../services/api';
import { FcGoogle } from 'react-icons/fc';
import '../styles/SignUp.css';

const Signup = () => {
    const [formData, setFormData] = useState({
        fullname: '', email: '', phone: '', dob: '', address: '', password: '', confirmPassword: '',
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.id]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError('Mật khẩu không khớp');
            return;
        }
        try {
            const res = await registerUser(formData);
            if (res.message === 'Register successful') {
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
                    <div className="form-group">
                        <label htmlFor="fullname">Họ tên</label>
                        <input type="text" id="fullname" value={formData.fullname} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={formData.email} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Số điện thoại</label>
                        <input type="tel" id="phone" value={formData.phone} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Ngày sinh</label>
                        <input type="date" id="dob" value={formData.dob} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Địa chỉ</label>
                        <input type="text" id="address" value={formData.address} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input type="password" id="password" value={formData.password} onChange={handleChange} required />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                        <input type="password" id="confirmPassword" value={formData.confirmPassword} onChange={handleChange} required />
                    </div>
                    <div className="form-group checkbox-group">
                        <input type="checkbox" id="agree-terms" required />
                        <label htmlFor="agree-terms" className="checkbox-label">Tôi đồng ý với điều khoản sử dụng</label>
                    </div>
                    <button type="submit" className="signup-btn">Đăng ký</button>
                </form>
                <div className="divider"><span>Hoặc</span></div>
                <button className="signup-google-btn">
                    <FcGoogle className="google-icon" /> Đăng ký bằng Google
                </button>
                <p className="login-link">
                    Đã có tài khoản? <a href="/login">Đăng nhập</a>
                </p>
            </div>
        </div>
    );
};

export default Signup;
