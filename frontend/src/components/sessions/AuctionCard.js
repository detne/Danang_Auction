import React from 'react';
import { Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { AUCTION_STATUS, AUCTION_TYPE } from '../../utils/constants';
import '../../styles/AuctionCard.css';

const AuctionCard = ({ auction, timer }) => {
    const getStatusClass = (status) => {
        switch (status) {
            case AUCTION_STATUS.ONGOING: return 'status-ongoing';
            case AUCTION_STATUS.UPCOMING: return 'status-upcoming';
            case AUCTION_STATUS.ENDED: return 'status-ended';
            default: return '';
        }
    };

    const getStatusText = (status) => {
        switch (status) {
            case AUCTION_STATUS.ONGOING: return 'ĐANG DIỄN RA';
            case AUCTION_STATUS.UPCOMING: return 'CHƯA DIỄN RA';
            case AUCTION_STATUS.ENDED: return 'ĐÃ KẾT THÚC';
            default: return status;
        }
    };

    const formatDate = (str) => {
        if (!str) return "--";
        const date = new Date(str);
        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const year = date.getFullYear();
        const hours = date.getHours().toString().padStart(2, '0');
        const minutes = date.getMinutes().toString().padStart(2, '0');
        return `${hours}:${minutes} ${day}/${month}/${year}`;
    };

    return (
        <div className="auction-card">
            <div className="auction-image-container">
                <img
                    src={auction.imageUrl || "/images/upcoming-auction-default.jpg"}
                    alt={auction.title}
                    className="auction-image"
                />
                {timer && (
                    <div className="countdown-timer">
                        {["days", "hours", "minutes", "seconds"].map((unit) => (
                            <div className="timer-item" key={unit}>
                                <span className="timer-number">
                                    {timer[unit].toString().padStart(2, '0')}
                                </span>
                                <span className="timer-label">
                                    {unit === "days" ? "Ngày" : unit === "hours" ? "Giờ" : unit === "minutes" ? "Phút" : "Giây"}
                                </span>
                            </div>
                        ))}
                    </div>
                )}
                <div className={`status-badge ${getStatusClass(auction.status)}`}>
                    {getStatusText(auction.status)}
                </div>
            </div>

            <div className="auction-details">
                <h5 className="auction-title">{auction.title}</h5>

                <div className="auction-info">
                    <div className="info-row">
                        <span className="info-label">Thời gian bắt đầu:</span>
                        <span className="info-value">
                            {formatDate(0)}
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Thời gian kết thúc:</span>
                        <span className="info-value">
                            {formatDate(auction.document?.end_time)}
                        </span>
                    </div>
                    <div className="info-row">
                        <span className="info-label">Hình thức:</span>
                        <span className="info-value">
                            {auction.type === AUCTION_TYPE.PUBLIC ? "Tài sản công" : "Tự nguyện"}
                        </span>
                    </div>
                </div>

                <Button
                    variant="danger"
                    as={Link}
                    to={`/sessions/code/${auction.sessionCode}`}
                    className="w-100 mt-3"
                >
                    Chi tiết
                </Button>
            </div>
        </div>
    );
};

export default AuctionCard;
