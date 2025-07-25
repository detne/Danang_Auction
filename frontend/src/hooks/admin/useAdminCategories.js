// src/hooks/useAdminCategories.js
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/admin';

const useAdminCategories = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await adminAPI.getCategories();
                if (res.success) {
                    setCategories(res.data);
                } else {
                    setError(res.message || 'Không thể tải danh mục');
                }
            } catch (err) {
                setError(err.message || 'Lỗi khi tải danh mục');
            } finally {
                setLoading(false);
            }
        };
        fetchCategories();
    }, []);

    return { categories, loading, error };
};

export default useAdminCategories;
