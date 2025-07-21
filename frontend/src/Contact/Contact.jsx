import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import '../styles/Contact.css';

const Contact = () => {
    const [darkMode, setDarkMode] = useState(localStorage.getItem('darkMode') === 'true');
    const { user } = useUser();
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        phone: '',
        message: '',
    });
    const [formStatus, setFormStatus] = useState('');

    // Đồng bộ dark mode
    useEffect(() => {
        document.body.classList.toggle('dark-mode', darkMode);
        localStorage.setItem('darkMode', darkMode);
    }, [darkMode]);

    // Xử lý thay đổi input
    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    // Xử lý gửi form (giả lập)
    const handleSubmit = (e) => {
        e.preventDefault();
        setFormStatus('Yêu cầu của bạn đã được gửi! Chúng tôi sẽ liên hệ sớm.');
        setFormData({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setFormStatus(''), 5000);
    };

    return (
        <div className="page-container">
            {/* Header */}
            <div className="page-header">
                <div className="header-content">
                    <h1 className="section-title">Liên Hệ</h1>
                    <div className="breadcrumb">
                        <Link to="/">Trang chủ</Link>
                        <span className="breadcrumb-separator">/</span>
                        <span>Liên Hệ</span>
                    </div>
                </div>
                <button className="dark-mode-toggle" onClick={() => setDarkMode(!darkMode)}>
                    {darkMode ? '☀️' : '🌙'}
                </button>
                {user?.role === 'ADMIN' && <button className="create-btn">+ Chỉnh sửa nội dung</button>}
            </div>

            {/* Main Content */}
            <div className="main-content">
                <div className="content-area">
                    {/* Thông tin liên hệ */}
                    <div className="section contact-info text-center mb-16">
                        <h2 className="text-3xl font-bold text-[#FF6B47] dark:text-[#FFA07A] mb-6">
                            Liên Hệ Với DaNangAuction
                        </h2>
                        <p className="text-lg text-gray-600 dark:text-gray-300 max-w-2xl mx-auto mb-8">
                            Chúng tôi luôn sẵn sàng hỗ trợ bạn. Vui lòng liên hệ qua thông tin dưới đây hoặc điền vào
                            biểu mẫu để gửi yêu cầu.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
                            <div className="info-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-[#FF6B47] dark:hover:border-[#FFA07A]">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Địa chỉ</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Số 76 Huỳnh Văn Nghệ, Hòa Hải, Ngũ Hành Sơn, TP. Đà Nẵng
                                </p>
                            </div>
                            <div className="info-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-[#FF6B47] dark:hover:border-[#FFA07A]">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Điện thoại</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    (+84.23) 6365 3949 <br /> 0867 523 488
                                </p>
                            </div>
                            <div className="info-item bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 border border-transparent hover:border-[#FF6B47] dark:hover:border-[#FFA07A]">
                                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Email</h3>
                                <p className="text-gray-600 dark:text-gray-300">info@danangauction.vn</p>
                            </div>
                        </div>
                    </div>

                    {/* Form liên hệ và bản đồ */}
                    <div className="section contact-form-map grid grid-cols-1 md:grid-cols-2 gap-8 mb-16">
                        {/* Bản đồ */}
                        <div className="map-container">
                            <iframe
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3835.617009846548!2d108.24509537735901!3d15.981364745197894!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3142108ff4019c01%3A0x80e467ce084bfc28!2zNzYgSHXhu7NuaCBWxINuIE5naOG7hywgSG_DoCBI4bqjaSwgTmfFqSBIw6BuaCBTxqFuLCDEkMOgIE7hurVuZyA1NTAwMDAsIFZp4buHdCBOYW0!5e0!3m2!1svi!2sus!4v1753077280701!5m2!1svi!2sus"
                                width="100%"
                                height="100%"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                                title="DaNangAuction Map"
                            ></iframe>
                        </div>

                        {/* Form liên hệ (contact-section) */}
                        <div className="contact-section bg-white dark:bg-gray-800 p-8 rounded-lg shadow-lg border border-gray-200 dark:border-gray-600">
                            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                                Gửi Yêu Cầu Của Bạn
                            </h3>
                            {formStatus && (
                                <div className="form-status bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 p-4 rounded-lg mb-6 animate-fade-in">
                                    {formStatus}
                                </div>
                            )}
                            <form onSubmit={handleSubmit}>
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                                    <div className="input-group">
                                        <label htmlFor="name" className="block text-gray-700 dark:text-gray-300 mb-2">
                                            Họ và tên
                                        </label>
                                        <input
                                            type="text"
                                            id="name"
                                            name="name"
                                            value={formData.name}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300 hover:border-blue-500 min-h-[48px]"
                                            placeholder="Nhập họ và tên"
                                            required
                                        />
                                    </div>
                                    <div className="input-group">
                                        <label htmlFor="email" className="block text-gray-700 dark:text-gray-300 mb-2">
                                            Email
                                        </label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            value={formData.email}
                                            onChange={handleInputChange}
                                            className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300 hover:border-blue-500 min-h-[48px]"
                                            placeholder="Nhập email"
                                            required
                                        />
                                    </div>
                                </div>
                                <div className="input-group mb-6">
                                    <label htmlFor="phone" className="block text-gray-700 dark:text-gray-300 mb-2">
                                        Số điện thoại
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        name="phone"
                                        value={formData.phone}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300 hover:border-blue-500 min-h-[48px]"
                                        placeholder="Nhập số điện thoại"
                                        required
                                    />
                                </div>
                                <div className="input-group mb-6">
                                    <label htmlFor="message" className="block text-gray-700 dark:text-gray-300 mb-2">
                                        Nội dung
                                    </label>
                                    <textarea
                                        id="message"
                                        name="message"
                                        value={formData.message}
                                        onChange={handleInputChange}
                                        className="w-full p-3 border rounded-lg dark:bg-gray-700 dark:border-gray-600 dark:text-white transition-all duration-300 hover:border-blue-500 min-h-[120px]"
                                        rows="5"
                                        placeholder="Nhập nội dung yêu cầu"
                                        required
                                    />
                                </div>
                                <button
                                    type="submit"
                                    className="w-full bg-gradient-to-r from-blue-600 to-blue-800 text-white font-semibold py-3 px-8 rounded-lg hover:from-blue-700 hover:to-blue-900 transition duration-300 shadow-md"
                                >
                                    Gửi yêu cầu
                                </button>
                            </form>
                        </div>
                    </div>

                    {/* Lời kêu gọi hành động */}
                    <div className="section cta-section text-center bg-gradient-to-r from-blue-600 to-blue-800 dark:from-gray-700 dark:to-gray-900 py-12 rounded-lg">
                        <h3 className="text-2xl font-bold text-white mb-4">Chưa có tài khoản?</h3>
                        <p className="text-white mb-6 max-w-2xl mx-auto">
                            Đăng ký ngay để tham gia các phiên đấu giá hấp dẫn và khám phá cơ hội sở hữu tài sản giá
                            trị với DaNangAuction!
                        </p>
                        <Link
                            to="/signup"
                            className="inline-block bg-white text-blue-600 font-semibold py-3 px-8 rounded-lg hover:bg-gray-100 transition duration-300 shadow-md"
                        >
                            Đăng ký ngay
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Contact;