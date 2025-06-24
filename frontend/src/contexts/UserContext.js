import { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';

export const UserContext = createContext({
    user: null,
    setUser: () => {},
    loading: true,
});

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const data = await getUserProfile(token);
                if (data && data.username) {
                    setUser(data);
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error('Lỗi khi lấy hồ sơ người dùng:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser, loading }}>
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