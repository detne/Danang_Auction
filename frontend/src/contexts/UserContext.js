import { createContext, useContext, useEffect, useState } from 'react';
import { getUserProfile } from '../services/api';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    const fetchUser = async () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const data = await getUserProfile(token);
                if (data && data.username) {
                    setUser(data);
                }
            } catch (error) {
                console.error('Lỗi khi lấy hồ sơ người dùng:', error);
                localStorage.removeItem('token');
                setUser(null);
            }
        }
    };

    useEffect(() => {
        fetchUser();
    }, []);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => useContext(UserContext);
