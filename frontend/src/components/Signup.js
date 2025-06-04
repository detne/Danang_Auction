import React, { useState } from 'react';
import logo from '../assets/logo.png';
import { Link } from 'react-router-dom';
import '../styles/Signup.css';

const Signup = () => {
    const [frontIdImage, setFrontIdImage] = useState(null);
    const [backIdImage, setBackIdImage] = useState(null);

    const handleFrontIdUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setFrontIdImage(file);
        }
    };

    const handleBackIdUpload = (event) => {
        const file = event.target.files[0];
        if (file) {
            setBackIdImage(file);
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
                <h2>Đăng ký Tài Khoản</h2>

                <form>
                    {/* Row 1: Họ, Tên đệm, Tên */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label htmlFor="last-name">HỌ</label>
                            <input
                                type="text"
                                id="last-name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="middle-name">TÊN ĐỆM</label>
                            <input
                                type="text"
                                id="middle-name"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="first-name">TÊN</label>
                            <input
                                type="text"
                                id="first-name"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 2: Tên đăng nhập */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="username">TÊN ĐĂNG NHẬP</label>
                            <input
                                type="text"
                                id="username"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 3: Mật khẩu */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="password">MẬT KHẨU</label>
                            <input
                                type="password"
                                id="password"
                                required
                            />
                        </div>
                    </div>

                    {/* Password strength indicators */}
                    <div className="password-strength">
                        <span className="strength-item">Tối thiểu 8 ký tự</span>
                        <span className="strength-item">Chữ hoa và viết thường</span>
                        <span className="strength-item">Chữ số và ký tự đặc biệt</span>
                        <span className="strength-item">Chữ số</span>
                        <span className="strength-item">Chữ ký tự đặc biệt</span>
                    </div>

                    {/* Row 4: Nhập lại mật khẩu */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="confirm-password">NHẬP LẠI MẬT KHẨU</label>
                            <input
                                type="password"
                                id="confirm-password"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 5: Email, SĐT, Giới tính */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label htmlFor="email">NHẬP EMAIL</label>
                            <input
                                type="email"
                                id="email"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="phone">NHẬP SĐT</label>
                            <input
                                type="tel"
                                id="phone"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label>GIỚI TÍNH</label>
                            <div className="radio-group">
                                <label>
                                    <input type="radio" name="gender" value="male" required />
                                    Nam
                                </label>
                                <label>
                                    <input type="radio" name="gender" value="female" required />
                                    Nữ
                                </label>
                                <label>
                                    <input type="radio" name="gender" value="other" required />
                                    Khác
                                </label>
                            </div>
                        </div>
                    </div>

                    {/* Row 6: Ngày sinh (sửa lại cho hợp lý) */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="birth-date">NGÀY SINH</label>
                            <input
                                type="date"
                                id="birth-date"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 7: Tỉnh/Thành phố, Quận/Huyện, Xã/Phường */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label htmlFor="province">TỈNH/THÀNH PHỐ</label>
                            <select id="province" required>
                                <option value="">Chọn tỉnh/thành phố</option>
                                <option value="da-nang">Đà Nẵng</option>
                                <option value="ho-chi-minh">Hồ Chí Minh</option>
                                <option value="ha-noi">Hà Nội</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="district">QUẬN/HUYỆN</label>
                            <select id="district" required>
                                <option value="">Chọn quận/huyện</option>
                                <option value="hai-chau">Hải Châu</option>
                                <option value="thanh-khe">Thanh Khê</option>
                                <option value="son-tra">Sơn Trà</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label htmlFor="ward">XÃ/PHƯỜNG</label>
                            <select id="ward" required>
                                <option value="">Chọn xã/phường</option>
                                <option value="hoa-cuong-bac">Hòa Cường Bắc</option>
                                <option value="hoa-cuong-nam">Hòa Cường Nam</option>
                            </select>
                        </div>
                    </div>

                    {/* Row 8: Địa chỉ chi tiết */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="address">ĐỊA CHỈ CHI TIẾT</label>
                            <input
                                type="text"
                                id="address"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 9: CCCD/CMND, Ngày cấp, Nơi cấp */}
                    <div className="form-row-3">
                        <div className="form-group">
                            <label htmlFor="cccd">CCCD/CMND</label>
                            <input
                                type="text"
                                id="cccd"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="issue-date">NGÀY CẤP</label>
                            <input
                                type="date"
                                id="issue-date"
                                required
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="issue-place">NƠI CẤP</label>
                            <input
                                type="text"
                                id="issue-place"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 10: Upload ảnh CCCD - có thể click để chọn */}
                    <div className="form-row-2">
                        <div className="form-group upload-group">
                            <label>TẢI LÊN ẢNH MẶT TRƯỚC CMND/CCCD</label>
                            <input
                                type="file"
                                id="front-id-upload"
                                accept="image/*"
                                onChange={handleFrontIdUpload}
                                style={{ display: 'none' }}
                            />
                            <div
                                className="upload-placeholder clickable"
                                onClick={() => document.getElementById('front-id-upload').click()}
                            >
                                <div className="upload-icon">📄</div>
                                <p>
                                    {frontIdImage
                                        ? `Đã chọn: ${frontIdImage.name}`
                                        : 'Click để chọn ảnh mặt trước CMND/CCCD'
                                    }
                                </p>
                            </div>
                        </div>
                        <div className="form-group upload-group">
                            <label>TẢI LÊN ẢNH MẶT SAU CMND/CCCD</label>
                            <input
                                type="file"
                                id="back-id-upload"
                                accept="image/*"
                                onChange={handleBackIdUpload}
                                style={{ display: 'none' }}
                            />
                            <div
                                className="upload-placeholder clickable"
                                onClick={() => document.getElementById('back-id-upload').click()}
                            >
                                <div className="upload-icon">💳</div>
                                <p>
                                    {backIdImage
                                        ? `Đã chọn: ${backIdImage.name}`
                                        : 'Click để chọn ảnh mặt sau CMND/CCCD'
                                    }
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Row 11: Số tài khoản ngân hàng */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="bank-account">SỐ TÀI KHOẢN NGÂN HÀNG</label>
                            <input
                                type="text"
                                id="bank-account"
                                required
                            />
                        </div>
                    </div>

                    {/* Row 12: Tên ngân hàng */}
                    <div className="form-row-1">
                        <div className="form-group">
                            <label htmlFor="bank-name">TÊN NGÂN HÀNG</label>
                            <input
                                type="text"
                                id="bank-name"
                                required
                            />
                        </div>
                    </div>

                    {/* Terms and conditions with checkbox - sửa lại như ảnh 5 */}
                    <div className="terms-section">
                        <div className="terms-checkbox-inline">
                            <input type="checkbox" id="terms-agreement" required />
                            <p className="terms-description">
                                Tôi cam kết tuân thủ Quyền và trách nhiệm của Người tham gia đấu giá (Quy định theo tài sàn đấu giá), Chính sách bảo mật
                                thông tin khách hàng, Cơ chế giải quyết tranh chấp, Quy chế hoạt động tại website đấu giá trực tuyến DANANGAUCTION.com
                            </p>
                        </div>
                    </div>

                    <button type="submit" className="signup-btn">ĐĂNG KÝ</button>

                    {/* Social login section với logo thật */}
                    <div className="social-login-section">
                        <p className="already-account">
                            Đã có tài khoản? <Link to="/login" className="login-link">Đăng nhập</Link>
                        </p>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default Signup;