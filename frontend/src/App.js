import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Home from './pages/Home';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import AssetDetail from './components/AssetDetail';
import UpcomingAuctions from './components/UpcomingAuctions';
import OngoingAuctionsSection from './components/OngoingAuctionsSection';
import EndedAuctions from './components/EndedAuctions';
import AdminDashboard from './components/AdminDashboard';
import Header from './components/Header';
import { UserProvider, useUser } from './contexts/UserContext';
import './App.css';
import './styles/AssetDetail.css';
import './styles/OngoingAuctionsSection.css';
import './styles/Header.css';
import './styles/AdminDashboard.css';

// Component bảo vệ route admin
const ProtectedAdminRoute = ({ children }) => {
    const { user, loading } = useUser();
    if (loading) {
        return <div>Loading...</div>;
    }
    if (!user || user.role !== 'ADMIN') {
        return <Navigate to="/login" replace />;
    }
    return children;
};

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
                        <Route
                            path="/admin"
                            element={
                                <ProtectedAdminRoute>
                                    <AdminDashboard />
                                </ProtectedAdminRoute>
                            }
                        />
                        <Route path="*" element={<Navigate to="/" replace />} />
                    </Routes>
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;