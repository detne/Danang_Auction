import React from 'react';
import PropTypes from 'prop-types';
import '../../styles/CountdownTimer.css';

const CountdownTimer = ({ status }) => {
    let text = '';
    switch (status) {
        case 'Đã kết thúc':
            text = 'Phiên đã kết thúc';
            break;
        case 'Đang diễn ra':
            text = 'Đang diễn ra';
            break;
        case 'Chưa diễn ra':
            text = 'Sắp diễn ra';
            break;
        default:
            text = 'Không xác định';
    }

    return (
        <div className={`countdown-timer ${status.replace(/\s/g, '-').toLowerCase()}`}>
            {text}
        </div>
    );
};

CountdownTimer.propTypes = {
    status: PropTypes.string.isRequired,
};

export default CountdownTimer;
