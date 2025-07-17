// src/pages/Home.js
import React from 'react';
import Banner from '../../components/homepage/Banner';
import FeaturedProducts from '../../components/homepage/FeaturedProducts';
import PastAuctionsSection from '../../components/sessions/PastAuctionsSection';
import NewsSection from '../../components/sessions/NewsSection';
import PartnersSection from '../../components/sessions/PartnersSection';
import '../../styles/Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <Banner />
            <FeaturedProducts />
            <PastAuctionsSection />
            <NewsSection />
            <PartnersSection />
        </div>
    );
};

export default Home;