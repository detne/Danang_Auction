import React, { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom'; // Thêm Link
import { getUpcomingAssets } from '../services/api';
import Tranh_co from '../assets/FeaturedProducts/Tranh_co.png';
import Dong_ho_vang from '../assets/FeaturedProducts/Dong_ho_vang.png';
import Nhan_kim_cuong from '../assets/FeaturedProducts/Nhan_kim_cuong.png';
import Dien_thoai_cu from '../assets/FeaturedProducts/Dien_thoai_cu.png';
import '../styles/FeaturedProducts.css';

const FeaturedProducts = () => {
    const navigate = useNavigate();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Dữ liệu tĩnh làm fallback với thời gian đếm ngược điều chỉnh
    const fallbackProducts = [
        {
            id: 1,
            name: 'Tranh cổ',
            price: 5000000,
            image: Tranh_co,
            endTime: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000) // 15 ngày từ bây giờ
        },
        {
            id: 2,
            name: 'Đồng hồ vàng',
            price: 15000000,
            image: Dong_ho_vang,
            endTime: new Date(Date.now() + 8 * 24 * 60 * 60 * 1000) // 8 ngày từ bây giờ
        },
        {
            id: 3,
            name: 'Nhẫn kim cương',
            price: 25000000,
            image: Nhan_kim_cuong,
            endTime: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000) // 12 ngày từ bây giờ
        },
        {
            id: 4,
            name: 'Điện thoại cũ',
            price: 8000000,
            image: Dien_thoai_cu,
            endTime: new Date(Date.now() + 2 * 60 * 60 * 1000) // Đã hết hạn 2 giờ trước
        },
    ];

    useEffect(() => {
        const fetchData = async () => {
            try {
                setLoading(true);
                const response = await getUpcomingAssets();
                const productList = Array.isArray(response?.data) ? response.data : [];
                const enrichedProducts = productList.map(item => ({
                    id: item.id || `fallback-${Math.random()}`,
                    name: item.name || 'Tài sản không tên',
                    price: item.startPrice || 0,
                    image: item.imageUrl || (item.imageFile ? `/assets/FeaturedProducts/${item.imageFile}` : null),
                    endTime: new Date(item.endDateTime || new Date()),
                })).filter(product => product.image); // Loại bỏ sản phẩm không có ảnh
                setProducts(enrichedProducts.length > 0 ? enrichedProducts : fallbackProducts);
            } catch (error) {
                console.error('Lỗi khi tải dữ liệu tài sản:', error);
                setError('Không thể tải dữ liệu từ server. Sử dụng dữ liệu mặc định.');
                setProducts(fallbackProducts);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const getTimeLeft = (endTime) => {
        const now = new Date();
        const diff = endTime - now;
        if (diff <= 0) return 'Đã kết thúc';

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

        if (days > 0) {
            return `${days} ngày ${hours} giờ`;
        } else if (hours > 0) {
            return `${hours} giờ ${minutes} phút`;
        } else {
            return `${minutes} phút`;
        }
    };

    if (loading) return <div>Đang tải...</div>;
    if (error) return <div style={{ color: 'red' }}>{error}</div>;

    return (
        <section className="featured-products">
            <h2>Tài sản sắp được đấu giá</h2>
            <div className="products">
                {products.length > 0 ? (
                    products.map((product) => (
                        <div key={product.id} className="product">
                            <img src={product.image} alt={product.name} />
                            <h3>{product.name}</h3>
                            <p className="price">{product.price.toLocaleString()} VNĐ</p>
                            <p className={`time-left ${getTimeLeft(product.endTime) === 'Đã kết thúc' ? 'expired' : ''}`}>
                                Thời gian còn lại: {getTimeLeft(product.endTime)}
                            </p>
                            <button
                                onClick={() => navigate(`/asset/${product.id}`)}
                                disabled={getTimeLeft(product.endTime) === 'Đã kết thúc'}
                                className={getTimeLeft(product.endTime) === 'Đã kết thúc' ? 'disabled' : ''}
                            >
                                {getTimeLeft(product.endTime) === 'Đã kết thúc' ? 'Đã kết thúc' : 'Chi tiết'}
                            </button>
                        </div>
                    ))
                ) : (
                    <p>Không có sản phẩm nào để hiển thị.</p>
                )}
            </div>
            <div className="view-all-container">
                <Link to="/upcoming-auctions" className="view-all-btn">Xem tất cả</Link> {/* Sử dụng Link */}
            </div>
        </section>
    );
};

export default FeaturedProducts;