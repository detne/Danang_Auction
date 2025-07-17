// src/pages/AuctionsPage.js
import React from 'react';
import OngoingAuctionsSection from '../../components/sessions/OngoingAuctionsSection';

const AuctionsPage = () => {
    return (
        <div className="auctions-page">
            <OngoingAuctionsSection />
        </div>
    );
};

export default AuctionsPage;