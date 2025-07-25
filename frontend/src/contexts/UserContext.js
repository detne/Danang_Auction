import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { authAPI } from '../services/auth';

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Lấy profile từ backend khi có token
  const fetchProfile = useCallback(async () => {
    const storedToken = localStorage.getItem('token');
    setToken(storedToken || null);
    if (!storedToken) {
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
        setToken(null);
        localStorage.removeItem('token');
        setError('Không lấy được thông tin user.');
      }
    } catch (err) {
      setUser(null);
      setToken(null);
      localStorage.removeItem('token');
      setError('Phiên đăng nhập hết hạn.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchProfile();
    const onStorage = (e) => {
      if (e.key === 'token') fetchProfile();
    };
    window.addEventListener('storage', onStorage);
    return () => window.removeEventListener('storage', onStorage);
  }, [fetchProfile]);

  // Hàm login, logout tiện dụng
  const login = useCallback(async (newToken, userData) => {
    localStorage.setItem('token', newToken);
    setToken(newToken);
    // Gọi lại fetchProfile để đồng bộ user info (hoặc setUser(userData) nếu chắc chắn userData chuẩn)
    await fetchProfile();
    setError(null);
  }, [fetchProfile]);
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    setToken(null);
    setUser(null);
    setError(null);
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser, token, loading, error, login, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
