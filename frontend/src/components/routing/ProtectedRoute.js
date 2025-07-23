// src/components/routing/ProtectedRoute.jsx
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';

const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
    const { user, loading } = useUser();
    const location = useLocation();

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                Đang tải...
            </div>
        );
    }

    // Nếu chưa đăng nhập và không phải trang login thì chuyển hướng
    if (!user) {
        if (location.pathname === redirectTo) {
            return children; // Cho phép hiển thị login/signup khi đang ở đó
        }
        return <Navigate to={redirectTo} replace />;
    }

    // Kiểm tra quyền
    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

export default ProtectedRoute;