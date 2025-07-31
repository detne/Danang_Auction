import React, { useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/Header.css';
import useLogout from '../../hooks/common/useLogout';
import axios from 'axios';

const UserAvatarDropdown = ({
                                user,
                                onLogout,
                                isDropdownOpen,
                                setIsDropdownOpen
                            }) => {
    const dropdownRef = useRef(null);
    const logout = useLogout();
    const navigate = useNavigate();

    const getAvatarText = () => user?.username?.[0]?.toUpperCase() || 'U';

    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
            setIsDropdownOpen(false);
        }
    };

    const handleMenuItemClick = () => setIsDropdownOpen(false);

    useEffect(() => {
        document.addEventListener('click', handleClickOutside);
        return () => document.removeEventListener('click', handleClickOutside);
    }, []);

    // Lấy token (kiểm tra nhiều key cho chắc ăn)
    const getToken = () => {
        return localStorage.getItem('accessToken') || localStorage.getItem('token');
    };

    // Hàm xử lý khi click "Phiên đấu giá của tôi"
    const handleMyAuctionsClick = async () => {
        try {
            const token = getToken();
            if (!token) {
                alert('Bạn chưa đăng nhập hoặc token không tồn tại!');
                setIsDropdownOpen(false);
                return;
            }
            console.log('TOKEN:', token);

            const res = await axios.get('/api/assets/mine', {
                headers: {
                    Authorization: 'Bearer ' + token
                }
            });
            const data = res.data.data;
            setIsDropdownOpen(false);
            navigate('/my-auctions', { state: { myAuctions: data } });
        } catch (err) {
            let message = 'Lấy dữ liệu phiên đấu giá thất bại!';
            if (err.response) {
                console.error('Error response:', err.response);
                if (err.response.data && err.response.data.message) {
                    message = err.response.data.message;
                } else if (typeof err.response.data === 'string') {
                    message = err.response.data;
                }
            }
            alert(message);
            setIsDropdownOpen(false);
        }
    };

    return (
        <div
            className="user-avatar-dropdown"
            ref={dropdownRef}
            onClick={e => {
                e.preventDefault();
                e.stopPropagation();
                setIsDropdownOpen(prev => !prev);
            }}
        >
            <div className="user-avatar">
                {user.avatar ? (
                    <img src={user.avatar} alt="Avatar" className="avatar-image" />
                ) : (
                    <div className="avatar-placeholder">{getAvatarText()}</div>
                )}
            </div>

            {isDropdownOpen && (
                <div className="user-dropdown-menu">
                    <div className="dropdown-user-info">
                        <div className="user-avatar-small">
                            {user.avatar ? (
                                <img src={user.avatar} alt="Avatar" className="avatar-image-small" />
                            ) : (
                                <div className="avatar-placeholder-small">
                                    {getAvatarText()}
                                </div>
                            )}
                        </div>
                        <div className="user-details">
                            <div className="user-name">
                                {user.username || 'Người dùng'}
                            </div>
                            <div className="user-email">
                                {user.email || 'user@example.com'}
                            </div>
                        </div>
                    </div>

                    <Link
                        to="/profile"
                        className="dropdown-item-custom"
                        onClick={handleMenuItemClick}
                    >
                        <i className="fas fa-user"></i> Thông tin cá nhân
                    </Link>

                    {/* Chỉ hiển thị cho ORGANIZER */}
                    {user?.role === 'ORGANIZER' && (
                        <button
                            type="button"
                            className="dropdown-item-custom"
                            onClick={handleMyAuctionsClick}
                        >
                            <i className="fas fa-gavel"></i> Phiên đấu giá của tôi
                        </button>
                    )}

                    <Link
                        to="/wallet/deposit"
                        className="dropdown-item-custom"
                        onClick={handleMenuItemClick}
                    >
                        <i className="fas fa-wallet"></i> Nạp tiền tài khoản
                    </Link>
                    <Link
                        to="/settings"
                        className="dropdown-item-custom"
                        onClick={handleMenuItemClick}
                    >
                        <i className="fas fa-cog"></i> Cài đặt
                    </Link>
                    <button
                        onClick={() => {
                            logout();
                            handleMenuItemClick();
                        }}
                        className="dropdown-item-custom logout-item"
                    >
                        <i className="fas fa-sign-out-alt"></i> Đăng xuất
                    </button>
                </div>
            )}
        </div>
    );
};

export default UserAvatarDropdown;