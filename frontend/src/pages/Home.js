import React from 'react';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import PastAuctionsSection from '../components/PastAuctionsSection';
import NewsSection from '../components/NewsSection';
import PartnersSection from '../components/PartnersSection';

const Home = () => {
    return (
        <div>
            <Banner />
            <FeaturedProducts />
            <PastAuctionsSection />
            <NewsSection />
            <PartnersSection />
        </div>
    );
};

export default Home;