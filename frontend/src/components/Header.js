import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Navbar, Nav, NavDropdown, Form, FormControl, Button, Image, Dropdown } from 'react-bootstrap';
import logo from '../assets/logo.png';
import flagLogo from '../assets/logo_co.png';
import { useUser } from '../contexts/UserContext';
import '../styles/Header.css';

const Header = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const { user, setUser, loading } = useUser();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState('');

    useEffect(() => {
        const timer = setInterval(() => setCurrentTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        navigate('/login');
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
        }
    };

    const formattedTime = currentTime.toLocaleTimeString('vi-VN', { hour12: false });
    const formattedDate = currentTime.toLocaleDateString('vi-VN', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
    });

    // Tạo avatar từ chữ cái đầu của tên người dùng
    const getAvatarText = () => {
        if (user?.username) {
            return user.username.charAt(0).toUpperCase();
        }
        return 'U';
    };

    if (loading) {
        return <div>Đang tải...</div>;
    }

    return (
        <Navbar expand="lg" bg="light" variant="light" className="shadow-sm py-2 px-3" sticky="top">
            <Container fluid>
                <Navbar.Brand as={Link} to="/" className="d-flex align-items-center gap-2">
                    <Image src={logo} alt="DaNangAuction Logo" width="60" height="50" />
                    <span className="fw-bold fs-5 text-dark">DaNangAuction</span>
                </Navbar.Brand>

                <Navbar.Toggle aria-controls="main-navbar-nav" />
                <Navbar.Collapse id="main-navbar-nav">
                    <Nav className="mx-auto gap-3" as="ul">
                        <NavDropdown title="Tài sản đấu giá" className="fw-semibold text-dark" as="li">
                            <NavDropdown.Item href="#state-assets">Tài sản nhà nước</NavDropdown.Item>
                            <NavDropdown.Item href="#real-estate">Bất động sản</NavDropdown.Item>
                            <NavDropdown.Item href="#vehicles">Phương tiện - xe cộ</NavDropdown.Item>
                            <NavDropdown.Item href="#art">Sưu tầm - nghệ thuật</NavDropdown.Item>
                            <NavDropdown.Item href="#luxury">Hàng hiệu xa xỉ</NavDropdown.Item>
                            <NavDropdown.Item href="#other-assets">Tài sản khác</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Phiên đấu giá" className="fw-semibold text-dark" as="li">
                            <NavDropdown.Item as={Link} to="/upcoming-auctions">Phiên sắp diễn ra</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/ongoing-auctions">Đang diễn ra</NavDropdown.Item>
                            <NavDropdown.Item as={Link} to="/ended-auctions">Đã kết thúc</NavDropdown.Item>
                        </NavDropdown>

                        <NavDropdown title="Tin tức" className="fw-semibold text-dark" as="li">
                            <NavDropdown.Item href="#announcements">Thông báo</NavDropdown.Item>
                            <NavDropdown.Item href="#auction-notices">Thông báo đấu giá</NavDropdown.Item>
                            <NavDropdown.Item href="#other-news">Tin khác</NavDropdown.Item>
                        </NavDropdown>

                        <Nav.Link href="#about" className="fw-semibold text-dark">Giới thiệu</Nav.Link>
                        <Nav.Link href="#contact" className="fw-semibold text-dark">Liên hệ</Nav.Link>
                    </Nav>

                    <div className="d-flex align-items-center gap-3">
                        <div className="d-flex align-items-center gap-2">
                            <Image src={flagLogo} width={18} height={12} alt="VN flag" />
                            <div className="d-flex flex-column" style={{ fontSize: '13px', fontWeight: 600 }}>
                                <span>{formattedTime}</span>
                                <span>{formattedDate}</span>
                            </div>
                        </div>

                        <Form className="d-flex align-items-center" onSubmit={handleSearch}>
                            <FormControl
                                type="search"
                                placeholder="Tìm kiếm..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="me-2"
                                style={{
                                    height: '36px',
                                    borderRadius: '6px',
                                    fontSize: '14px',
                                    padding: '4px 10px',
                                    border: '1px solid #ccc',
                                    minWidth: '180px',
                                }}
                            />
                            <Button type="submit" variant="outline-primary" size="sm">Tìm</Button>
                        </Form>

                        {user ? (
                            <div className="d-flex align-items-center gap-2">
                                <Dropdown align="end">
                                    <Dropdown.Toggle
                                        as="div"
                                        className="user-avatar-dropdown"
                                        bsPrefix="custom-dropdown-toggle"
                                    >
                                        <div className="user-avatar">
                                            {user.avatar ? (
                                                <img src={user.avatar} alt="Avatar" className="avatar-image" />
                                            ) : (
                                                <div className="avatar-placeholder">
                                                    {getAvatarText()}
                                                </div>
                                            )}
                                        </div>
                                    </Dropdown.Toggle>

                                    <Dropdown.Menu className="user-dropdown-menu">
                                        <div className="dropdown-user-info">
                                            <div className="user-avatar-small">
                                                {user.avatar ? (
                                                    <img src={user.avatar} alt="Avatar" className="avatar-image-small" />
                                                ) : (
                                                    <div className="avatar-placeholder-small">
                                                        {getAvatarText()}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="user-details">
                                                <div className="user-name">{user.username || 'Người dùng'}</div>
                                                <div className="user-email">{user.email || 'user@example.com'}</div>
                                            </div>
                                        </div>
                                        <Dropdown.Divider />
                                        <Dropdown.Item as={Link} to="/profile" className="dropdown-item-custom">
                                            <i className="fas fa-user me-2"></i>
                                            Thông tin cá nhân
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/my-auctions" className="dropdown-item-custom">
                                            <i className="fas fa-gavel me-2"></i>
                                            Phiên đấu giá của tôi
                                        </Dropdown.Item>
                                        <Dropdown.Item as={Link} to="/settings" className="dropdown-item-custom">
                                            <i className="fas fa-cog me-2"></i>
                                            Cài đặt
                                        </Dropdown.Item>
                                        <Dropdown.Divider />
                                        <Dropdown.Item onClick={handleLogout} className="dropdown-item-custom logout-item">
                                            <i className="fas fa-sign-out-alt me-2"></i>
                                            Đăng xuất
                                        </Dropdown.Item>
                                    </Dropdown.Menu>
                                </Dropdown>
                            </div>
                        ) : (
                            <Button variant="danger" size="sm" as={Link} to="/login" className="px-3 fw-bold">
                                Đăng nhập
                            </Button>
                        )}
                    </div>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
};

export default Header;