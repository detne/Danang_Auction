import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import usePastAuctionsSection from '../../hooks/homepage/usePastAuctionsSection';
import '../../styles/PastAuctionsSection.css'; // Đảm bảo import đúng

const PastAuctionsSection = () => {
    const { items: soldItems, loading, error } = usePastAuctionsSection();

    const [imageFallbacks, setImageFallbacks] = useState({});

    useEffect(() => {
        const fallbacks = {};
        soldItems.forEach(item => {
            fallbacks[item.id] = (
                item.imageUrl && item.imageUrl !== 'null' && item.imageUrl !== 'undefined'
                    ? item.imageUrl
                    : '/images/past-auction-default.jpg'
            );
        });
        setImageFallbacks(fallbacks);
    }, [soldItems]);

    const handleImageError = (id) => {
        setImageFallbacks(prev => ({
            ...prev,
            [id]: '/images/past-auction-default.jpg'
        }));
    };

    if (loading) {
        return (
            <Container className="text-center my-5">
                <Spinner animation="border" variant="primary" />
                <p className="mt-2">Đang tải dữ liệu...</p>
            </Container>
        );
    }

    if (error) {
        return (
            <Container className="text-center my-5">
                <Alert variant="danger">{error}</Alert>
            </Container>
        );
    }

    const displayedItems = soldItems.slice(0, 3);

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Tài sản đã đấu giá</h2>
            <Row xs={1} sm={2} md={3} lg={3} className="g-4">
                {displayedItems.length > 0 ? (
                    displayedItems.map((item) => (
                        <Col key={item.id}>
                            <Card className="h-100 shadow-sm">
                                <Card.Img
                                    variant="top"
                                    src={imageFallbacks[item.id]}
                                    alt={item.name}
                                    style={{ height: '200px', objectFit: 'cover' }}
                                    onError={() => handleImageError(item.id)}
                                />
                                <Card.Body className="d-flex flex-column" style={{ minHeight: '250px' }}>
                                    <Card.Title className="text-truncate" title={item.name}>{item.name}</Card.Title>
                                    <Card.Text className="mb-1 text-danger fw-bold">
                                        Giá cuối cùng: {item.finalPrice?.toLocaleString('vi-VN') || '0'} VNĐ
                                    </Card.Text>
                                    <Card.Text className="mb-1">Ngày đấu giá: {item.soldDate}</Card.Text>
                                    <Card.Text className="mb-2">
                                        Người thắng: {item.winner && item.winner !== 'null null' ? item.winner : 'Ẩn danh'}
                                    </Card.Text>
                                    <div className="mt-auto text-center">
                                        <Button variant="danger" as={Link} to={`/auctions/${item.sessionCode}`}>
                                            Chi tiết
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))
                ) : (
                    <Col>
                        <Alert variant="info" className="text-center">
                            Không có tài sản nào đã đấu giá.
                        </Alert>
                    </Col>
                )}
            </Row>

            <div className="text-center mt-4">
                <Link to="/ended-auctions" className="view-all-btn">
                    Xem tất cả
                </Link>
            </div>
        </Container>
    );
};

export default PastAuctionsSection;