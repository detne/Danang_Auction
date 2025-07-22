// src/hooks/useAdminUsers.js
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/admin';

const useAdminUsers = () => {
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const res = await adminAPI.getUserStats();
                if (res.success) {
                    setUsers(res.data);
                } else {
                    setError(res.message || 'Không thể tải danh sách người dùng');
                }
            } catch (err) {
                setError(err.message || 'Lỗi khi tải người dùng');
            } finally {
                setLoading(false);
            }
        };
        fetchUsers();
    }, []);

    return { users, loading, error };
};

export default useAdminUsers;