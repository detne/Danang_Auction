// src/hooks/common/useLogout.js
import { useNavigate } from 'react-router-dom';
import { useUser } from '../../contexts/UserContext';
import { authAPI } from '../../services/auth';

const useLogout = () => {
    const navigate = useNavigate();
    const { setUser } = useUser();

    const logout = async () => {
        try {
            await authAPI.logout();
        } catch (error) {
            console.warn('Logout failed:', error.response?.data?.message || error.message);
        } finally {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            setUser(null);
            navigate('/login');
        }
    };

    return logout;
};

export default useLogout;
