// src/pages/Home.js
import Banner from '../../components/homepage/Banner';
import UpcomingAuctionsSection from '../../components/homepage/UpcomingAuctionsSection'; 
import PastAuctionsSection from '../../components/sessions/PastAuctionsSection';
import NewsSection from '../../components/sessions/NewsSection';
import PartnersSection from '../../components/sessions/PartnersSection';
import '../../styles/Home.css';

const Home = () => {
    return (
        <div className="home-page">
            <Banner />
            <UpcomingAuctionsSection /> 
            <PastAuctionsSection />
            <NewsSection />
            <PartnersSection />
        </div>
    );
};

export default Home;
