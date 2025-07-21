// src/contexts/UserContext.js
import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authAPI } from '../services/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Lấy profile từ backend khi có token
    const fetchProfile = useCallback(async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setUser(null);
            setLoading(false);
            return;
        }
        setLoading(true);
        try {
            const data = await authAPI.getProfile();
            if (data && data.success && data.data) {
                setUser(data.data);
                setError(null);
            } else {
                setUser(null);
                localStorage.removeItem('token');
                setError('Không lấy được thông tin user.');
            }
        } catch (err) {
            setUser(null);
            localStorage.removeItem('token');
            setError('Phiên đăng nhập hết hạn.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchProfile();
        // Lắng nghe logout từ các tab khác
        const onStorage = (e) => {
            if (e.key === 'token') fetchProfile();
        };
        window.addEventListener('storage', onStorage);
        return () => window.removeEventListener('storage', onStorage);
    }, [fetchProfile]);

    // Hàm login, logout tiện dụng
    const login = useCallback((token, userData) => {
        localStorage.setItem('token', token);
        setUser(userData);
        setError(null);
    }, []);
    const logout = useCallback(() => {
        localStorage.removeItem('token');
        setUser(null);
        setError(null);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, error, login, logout }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);