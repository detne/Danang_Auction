import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AssetDetail from './components/AssetDetail';
import UpcomingAuctions from './components/UpcomingAuctions';
import OngoingAuctionsSection from './components/OngoingAuctionsSection';
import EndedAuctions from './components/EndedAuctions';
import Header from './components/Header';
import { UserProvider } from './contexts/UserContext';
import './App.css'; // CSS toàn cục nếu có
import './styles/AssetDetail.css'; // Import CSS của AssetDetail
import './styles/OngoingAuctionsSection.css'; // Import CSS của OngoingAuctionsSection
import './styles/Header.css'; // Đảm bảo import Header CSS nếu cần

const App = () => {
    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Header />
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route path="/login" element={<LoginPage />} />
                        <Route path="/signup" element={<SignupPage />} />
                        <Route path="/asset/:id" element={<AssetDetail />} />
                        <Route path="/upcoming-auctions" element={<UpcomingAuctions />} />
                        <Route path="/ongoing-auctions" element={<OngoingAuctionsSection />} />
                        <Route path="/ended-auctions" element={<EndedAuctions />} />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;