import React from 'react';
import { Container, Row, Col, Card, Button, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { BsBoxSeam } from 'react-icons/bs';
import useUpcomingAuctions from '../../hooks/homepage/useUpcomingAuctions';

const UpcomingAuctionsSection = () => {
  const { auctions, loading, error } = useUpcomingAuctions();

  if (loading) {
    return (
      <Container className="my-5 text-center">
        <p>Đang tải tài sản sắp đấu giá...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="my-5 text-center">
        <p className="text-danger">{error}</p>
      </Container>
    );
  }

  return (
    <Container className="my-5">
      <h2 className="text-center mb-4">Tài sản sắp đấu giá</h2>

      {auctions.length > 0 ? (
        <Row xs={1} sm={2} md={3} lg={3} className="g-4">
          {auctions.map((item) => (
            <Col key={item.id}>
              <Card className="h-100 shadow-sm border-0">
                <Card.Img
                  variant="top"
                  src={item.imageUrl}
                  alt={item.name}
                  style={{
                    height: '210px',
                    objectFit: 'cover',
                    borderTopLeftRadius: 18,
                    borderTopRightRadius: 18,
                  }}
                  onError={(e) => {
                    e.currentTarget.src = '/images/upcoming-auction-default.jpg';
                  }}
                />
                <Card.Body className="d-flex flex-column" style={{ minHeight: '210px' }}>
                  <Card.Title className="text-truncate" title={item.name}>
                    {item.name}
                  </Card.Title>
                  <Card.Text className="mb-1">
                    <strong>Thời gian mở:</strong> {item.startDate}
                  </Card.Text>
                  <Card.Text className="mb-1">
                    <strong>Mã phiên:</strong> {item.sessionCode}
                  </Card.Text>
                  <Card.Text className="mb-1">
                    <strong>Giá khởi điểm:</strong> {item.startingPrice.toLocaleString('vi-VN')} VNĐ
                  </Card.Text>
                  <Card.Text className="mb-2">
                    <strong>Trạng thái:</strong> {item.status}
                  </Card.Text>
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
                boxShadow: '0 2px 16px rgba(33, 150, 243, 0.09)',
              }}
            >
              <BsBoxSeam size={54} style={{ marginBottom: 12 }} />
              <span>Không có tài sản nào sắp đấu giá.</span>
            </Alert>
          </Col>
        </Row>
      )}

      <div className="text-center mt-4">
        <Button variant="outline-primary" as={Link} to="/upcoming-auctions">
          Xem tất cả
        </Button>
      </div>
    </Container>
  );
};

export default UpcomingAuctionsSection;
