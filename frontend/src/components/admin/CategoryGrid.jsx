// src/components/admin/CategoryGrid.jsx
import React, { useState, useEffect } from 'react';
import { adminAPI } from '../../services/admin';

const CategoryGrid = () => {
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                setLoading(true);
                const response = await adminAPI.getCategories();
                if (response.success) {
                    setCategories(response.data || []);
                } else {
                    setError('Không thể tải danh sách danh mục');
                }
            } catch (err) {
                setError(err.message || 'Lỗi khi tải danh mục');
            } finally {
                setLoading(false);
            }
        };

        fetchCategories();
    }, []);

    if (loading) {
        return (
            <div className="dashboard-content">

                <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    padding: '40px',
                    gap: '15px',
                    color: '#6c757d'
                }}>
                    <div style={{
                        width: '24px',
                        height: '24px',
                        border: '3px solid #f3f3f3',
                        borderTop: '3px solid #FF6B47',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <span>Đang tải dữ liệu...</span>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard-content">
            <div className="page-header">
                <div className="page-actions">
                    <button className="btn-primary">
                        <span>+</span>
                        Thêm danh mục
                    </button>
                </div>
            </div>

            <div className="categories-grid" style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                gap: '20px',
                marginTop: '20px'
            }}>
                {categories.map(category => (
                    <div key={category.id} className="category-card" style={{
                        background: 'white',
                        padding: '20px',
                        borderRadius: '10px',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)',
                        border: '1px solid #e9ecef'
                    }}>
                        <div className="category-header" style={{
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            marginBottom: '15px'
                        }}>
                            <h3 style={{ margin: 0, color: '#2c3e50' }}>{category.name || 'N/A'}</h3>
                            <span className={`status ${category.status || 'active'}`}>
                {category.status === 'active' ? 'Hoạt động' : 'Tạm khóa'}
              </span>
                        </div>
                        <div className="category-info" style={{ marginBottom: '15px' }}>
                            <p style={{ margin: '5px 0', color: '#6c757d' }}>
                                <strong>{category.itemCount || 0}</strong> sản phẩm
                            </p>
                            <p style={{ margin: '5px 0', color: '#6c757d', fontSize: '14px' }}>
                                Cập nhật: {category.updatedAt ? new Date(category.updatedAt).toLocaleDateString('vi-VN') : 'N/A'}
                            </p>
                        </div>
                        <div className="category-actions" style={{
                            display: 'flex',
                            gap: '10px'
                        }}>
                            <button className="btn-action edit" style={{
                                flex: 1,
                                padding: '8px 16px',
                                background: '#e3f2fd',
                                color: '#1976d2',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}>Chỉnh sửa</button>
                            <button className="btn-action delete" style={{
                                flex: 1,
                                padding: '8px 16px',
                                background: '#ffebee',
                                color: '#d32f2f',
                                border: 'none',
                                borderRadius: '6px',
                                cursor: 'pointer'
                            }}>Xóa</button>
                        </div>
                    </div>
                ))}
            </div>

            {categories.length === 0 && !loading && (
                <div className="empty-state">
                    <div className="empty-icon">📁</div>
                    <h3>Chưa có danh mục nào</h3>
                    <p>Hãy tạo danh mục đầu tiên</p>
                </div>
            )}
        </div>
    );
};

export default CategoryGrid;