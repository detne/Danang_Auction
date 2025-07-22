import { createContext, useContext, useEffect, useState } from 'react';
import { authAPI } from '../services/auth';

export const UserContext = createContext({
    user: null,
    setUser: () => {},
    loading: true,
    error: null,
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError(null);
            const data = await authAPI.getProfile(token);
            console.log('Fetched user data:', data); // Debug
            if (data && data.user && data.user.username && data.user.role) {
                setUser(data.user); // Giả định API trả về { user: { username, role, ... } }
            } else {
                setUser(null);
                localStorage.removeItem('token');
                setError('Dữ liệu người dùng không hợp lệ');
            }
        } catch (error) {
            console.error('Lỗi khi lấy hồ sơ người dùng:', error.message);
            localStorage.removeItem('token');
            setUser(null);
            setError('Không thể tải thông tin người dùng. Vui lòng đăng nhập lại.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUser();
        const interval = setInterval(fetchUser, 15 * 60 * 1000); // Làm mới mỗi 15 phút
        return () => clearInterval(interval);
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading, error }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};