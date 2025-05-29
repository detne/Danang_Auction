import React from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import { FcGoogle } from 'react-icons/fc'; // Import biểu tượng Google từ react-icons
import '../styles/Signup.css';

const Signup = () => {
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
                <form>
                    <div className="form-group">
                        <label htmlFor="fullname">Họ tên</label>
                        <input
                            type="text"
                            id="fullname"
                            placeholder="Nhập họ tên của bạn"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            placeholder="Nhập email của bạn"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="phone">Số điện thoại</label>
                        <input
                            type="tel"
                            id="phone"
                            placeholder="Nhập số điện thoại"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="dob">Ngày sinh</label>
                        <input
                            type="date"
                            id="dob"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="address">Địa chỉ</label>
                        <input
                            type="text"
                            id="address"
                            placeholder="Nhập địa chỉ của bạn"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>
                    <div className="form-group">
                        <label htmlFor="confirm-password">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirm-password"
                            placeholder="Xác nhận mật khẩu"
                            required
                        />
                    </div>
                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="agree-terms"
                            required
                        />
                        <label htmlFor="agree-terms" className="checkbox-label">Tôi đồng ý với điều khoản sử dụng</label>
                    </div>
                    <button type="submit" className="signup-btn">Đăng ký</button>
                </form>
                <div className="divider">
                    <span>Hoặc</span>
                </div>
                <button className="signup-google-btn">
                    <FcGoogle className="google-icon" /> Đăng ký bằng Google
                </button>
                <p className="login-link">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </p>
            </div>
        </div>
    );
};

export default Signup;