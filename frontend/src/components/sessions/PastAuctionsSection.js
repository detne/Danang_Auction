import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import usePastAuctionsSection from '../../hooks/homepage/usePastAuctionsSection';
import { BsBoxSeam } from 'react-icons/bs';

const PastAuctionsSection = () => {
    const { items: soldItems, loading, error } = usePastAuctionsSection();
    const [imageFallbacks, setImageFallbacks] = useState({});

    // Khi soldItems thay đổi, cập nhật fallback cho ảnh
    useEffect(() => {
        const fallbacks = {};
        soldItems.forEach(item => {
            fallbacks[item.id] = item.imageUrl || "/images/past-auction-default.jpg";
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

    return (
        <Container className="my-5">
            <h2 className="text-center mb-4">Tài sản đã đấu giá</h2>
            {soldItems.length > 0 ? (
                <Row xs={1} sm={2} md={3} lg={3} className="g-4">
                    {soldItems.map((item) => (
                        <Col key={item.id}>
                            <Card className="h-100 shadow-sm border-0">
                                <Card.Img
                                    variant="top"
                                    src={imageFallbacks[item.id]}
                                    alt={item.name}
                                    style={{ height: '210px', objectFit: 'cover', borderTopLeftRadius: 18, borderTopRightRadius: 18 }}
                                    onError={e => e.currentTarget.src = '/images/past-auction-default.jpg'}
                                />
                                <Card.Body className="d-flex flex-column" style={{ minHeight: '210px' }}>
                                    <Card.Title className="text-truncate" title={item.name}>{item.name}</Card.Title>
                                    <Card.Text className="mb-1"><strong>Ngày đấu giá:</strong> {item.soldDate}</Card.Text>
                                    <Card.Text className="mb-1"><strong>Mã phiên:</strong> {item.sessionCode}</Card.Text>
                                    <Card.Text className="mb-2"><strong>Trạng thái:</strong> {item.status}</Card.Text>
                                    <div className="mt-auto text-center">
                                        <Button
                                            variant="danger"
                                            as={Link}
                                            to={`/sessions/code/${item.sessionCode}`}
                                        >
                                            Chi tiết
                                        </Button>
                                    </div>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            ) : (
                <Row className="justify-content-center">
                    <Col xs={12} md={8} lg={6}>
                        <Alert
                            variant="info"
                            className="d-flex flex-column align-items-center justify-content-center"
                            style={{
                                minHeight: 220,
                                background: 'linear-gradient(90deg, #e3f2fd 0%, #ffffff 100%)',
                                border: '1px solid #b6dbf6',
                                borderRadius: 18,
                                fontSize: 22,
                                color: '#2196f3',
                                boxShadow: '0 2px 16px rgba(33, 150, 243, 0.09)'
                            }}
                        >
                            <BsBoxSeam size={54} style={{ marginBottom: 12 }} />
                            <span>Không có tài sản nào đã đấu giá.</span>
                        </Alert>
                    </Col>
                </Row>
            )}
            <div className="text-center mt-4">
                <Button variant="outline-primary" as={Link} to="/ended-auctions">
                    Xem tất cả
                </Button>
            </div>
        </Container>
    );
};

export default PastAuctionsSection;
