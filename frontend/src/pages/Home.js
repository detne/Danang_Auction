import React from 'react';
import Header from '../components/Header';
import Banner from '../components/Banner';
import FeaturedProducts from '../components/FeaturedProducts';
import PastAuctionsSection from '../components/PastAuctionsSection';
import NewsSection from '../components/NewsSection';
import PartnersSection from '../components/PartnersSection';
import Footer from '../components/Footer';

const Home = () => {
    return (
        <div>
            <Header />
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