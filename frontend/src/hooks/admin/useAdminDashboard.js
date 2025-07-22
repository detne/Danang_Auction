// src/hooks/useAdminDashboard.js
import { useState, useEffect } from 'react';
import { adminAPI } from '../../services/admin';

export const useAdminDashboard = () => {
    const [stats, setStats] = useState({
        totalUsers: 0,
        totalAuctions: 0,
        totalRevenue: 0,
        activeAuctions: 0
    });
    const [users, setUsers] = useState([]);
    const [auctions, setAuctions] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes, auctionsRes, categoriesRes] = await Promise.all([
                adminAPI.getSystemSummary(),
                adminAPI.getUserStats(),
                adminAPI.getAuctions(),
                adminAPI.getCategories()
            ]);

            setStats(statsRes.data || stats);
            setUsers(usersRes.data || []);
            setAuctions(auctionsRes.data || []);
            setCategories(categoriesRes.data || []);
        } catch (err) {
            setError(err.message);
            console.error('Error fetching dashboard data:', err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchDashboardData();
    }, []);

    return {
        stats,
        users,
        auctions,
        categories,
        loading,
        error,
        refetch: fetchDashboardData
    };
};