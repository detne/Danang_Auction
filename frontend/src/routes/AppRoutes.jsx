import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

// Pages
import HomePage from '../pages/home/Home';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';

import ProfilePage from '../pages/profile/ProfilePage';

import AdminDashboardPage from '../pages/admin/AdminDashboard';
import AssetManagementPage from '../pages/organizer/AssetManagementPage';

import UpcomingAuctionsPage from '../pages/auctions/UpcomingAuctionsPage';
import OngoingAuctionsPage from '../pages/auctions/OngoingAuctionsPage';
import EndedAuctionsPage from '../pages/auctions/EndedAuctionsPage';
import AuctionNoticesPage from '../pages/auctions/AuctionNoticesPage';
import AnnouncementsPage from '../pages/auctions/AnnouncementsPage';
import BiddingPage from '../pages/auctions/BiddingPage';
import AssetDetailPage from '../pages/auctions/AssetDetailPage';
import SessionDetailPage from '../pages/auctions/SessionDetailPage';
import DepositPage from '../pages/payment/DepositPage';

import NotFoundPage from '../pages/NotFoundPage';

// Protected Route Wrapper
const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
    const { user, loading } = useUser();

    if (loading) {
        return (
            <div className="loading-spinner">
                <div className="spinner"></div>
                Đang tải...
            </div>
        );
    }

    if (!user) return <Navigate to={redirectTo} replace />;

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        return <Navigate to="/" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/sessions/code/:sessionCode" element={<SessionDetailPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />

            {/* Asset/Auction Routes */}
            <Route path="/asset/:id" element={<AssetDetailPage />} />
            <Route path="/upcoming-auctions" element={<UpcomingAuctionsPage />} />
            <Route path="/ongoing-auctions" element={<OngoingAuctionsPage />} />
            <Route path="/ended-auctions" element={<EndedAuctionsPage />} />

            {/* News / Info Pages */}
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/auction-notices" element={<AuctionNoticesPage />} />

            {/* Protected: Any Logged-in User */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/wallet/deposit"
                element={
                    <ProtectedRoute>
                        <DepositPage />
                    </ProtectedRoute>
                }
            />

            {/* Bidder Only */}
            <Route
                path="/sessions/:id/bid"
                element={
                    <ProtectedRoute allowedRoles={['BIDDER']}>
                        <BiddingPage />
                    </ProtectedRoute>
                }
            />

            {/* Organizer Only */}
            <Route
                path="/asset-management"
                element={
                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                        <AssetManagementPage />
                    </ProtectedRoute>
                }
            />

            {/* Admin Only */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboardPage />
                    </ProtectedRoute>
                }
            />

            {/* Catch All */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
