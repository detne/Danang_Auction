import React, { useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import '../../styles/Header.css';

const UserAvatarDropdown = ({ user, onLogout, isDropdownOpen, setIsDropdownOpen }) => {
    const dropdownRef = useRef(null);

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

    return (
        <div className="user-avatar-dropdown" ref={dropdownRef} onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            setIsDropdownOpen(prev => !prev);
        }}>
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
                                <div className="avatar-placeholder-small">{getAvatarText()}</div>
                            )}
                        </div>
                        <div className="user-details">
                            <div className="user-name">{user.username || 'Người dùng'}</div>
                            <div className="user-email">{user.email || 'user@example.com'}</div>
                        </div>
                    </div>

                    <Link to="/profile" className="dropdown-item-custom" onClick={handleMenuItemClick}>
                        <i className="fas fa-user"></i> Thông tin cá nhân
                    </Link>
                    <Link to="/my-auctions" className="dropdown-item-custom" onClick={handleMenuItemClick}>
                        <i className="fas fa-gavel"></i> Phiên đấu giá của tôi
                    </Link>
                    <Link to="/wallet/deposit" className="dropdown-item-custom" onClick={handleMenuItemClick}>
                        <i className="fas fa-wallet"></i> Nạp tiền tài khoản
                    </Link>
                    <Link to="/settings" className="dropdown-item-custom" onClick={handleMenuItemClick}>
                        <i className="fas fa-cog"></i> Cài đặt
                    </Link>
                    <button
                        onClick={() => {
                            onLogout();
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
