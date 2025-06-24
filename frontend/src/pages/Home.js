import React from 'react';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import PastAuctionsSection from '../components/PastAuctionsSection';
import NewsSection from '../components/NewsSection';
import PartnersSection from '../components/PartnersSection';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div>
            <Banner />
            <FeaturedProducts />
            <PastAuctionsSection />
            <NewsSection />
            <PartnersSection />
            <Footer />
        </div>
    );
};

export default Home;