import React from 'react';
import { Link } from 'react-router-dom';
import '../styles/Login.css';

const Login = () => {
    return (
        <div className="login-container">
            <div className="login-form">
                <h1 className="slogan">
                    <span className="slogan-highlight">DANANGAUCTION.COM</span>
                    <br />
                    Sàn đấu giá chất lượng số 1 hàng đầu Đà Nẵng
                </h1>
                <h2>ĐĂNG NHẬP</h2>
                <form>
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
                        <label htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            placeholder="Nhập mật khẩu"
                            required
                        />
                    </div>
                    <div className="form-group checkbox-group">
                        <input
                            type="checkbox"
                            id="remember-me"
                        />
                        <label htmlFor="remember-me" className="checkbox-label">Lưu mật khẩu</label>
                        <a href="#forgot-password" className="forgot-password">Quên mật khẩu?</a>
                    </div>
                    <button type="submit" className="login-btn">ĐĂNG NHẬP</button>
                </form>
                <p className="signup-link">
                    Bạn chưa có tài khoản? <Link to="/signup">Đăng ký</Link>
                </p>
            </div>
        </div>
    );
};

export default Login;