// src/routes/AppRoutes.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/routing/ProtectedRoute';

// Các trang
import HomePage from '../pages/home/Home';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import AuctionDetailByCodePage from '../pages/auctions/AuctionDetailByCodePage';

import ProfilePage from '../pages/profile/ProfilePage';
import AdminDashboard from '../pages/admin/AdminDashboard';
import AssetListPage from '../pages/organizer/AssetListPage';
import AssetFormPage from '../pages/organizer/AssetFormPage';
import AssetImageUploadPage from '../pages/organizer/AssetImageUploadPage';

import UpcomingAuctionsPage from '../pages/auctions/UpcomingAuctionsPage';
import OngoingAuctionsPage from '../pages/auctions/OngoingAuctionsPage';
import EndedAuctionsPage from '../pages/auctions/EndedAuctionsPage';
import AuctionNoticesPage from '../pages/auctions/AuctionNoticesPage';
import AnnouncementsPage from '../pages/auctions/AnnouncementsPage';
import BiddingPage from '../pages/auctions/BiddingPage';
import AssetDetailPage from '../pages/auctions/AssetDetailPage';

import NotFoundPage from '../pages/NotFoundPage';
import OtherNews from "../components/OtherNews";
import IntroductionPage from "../pages/auctions/IntroductionPage";
import ContactPage from "../pages/auctions/ContactPage";

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/reset-password" element={<ResetPasswordPage />} />
            <Route path="/introduction" element={<IntroductionPage />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* Public Asset Pages */}
            <Route path="/asset/:id" element={<AssetDetailPage />} />
            <Route path="/upcoming-auctions" element={<UpcomingAuctionsPage />} />
            <Route path="/ongoing-auctions" element={<OngoingAuctionsPage />} />
            <Route path="/ended-auctions" element={<EndedAuctionsPage />} />
            <Route path="/announcements" element={<AnnouncementsPage />} />
            <Route path="/auction-notices" element={<AuctionNoticesPage />} />
            <Route path="/other-news" element={<OtherNews />} />
            <Route path="/auctions/:sessionCode" element={<AuctionDetailByCodePage />} />

            {/* Protected Pages */}
            <Route
                path="/profile"
                element={
                    <ProtectedRoute>
                        <ProfilePage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/sessions/:id/bid"
                element={
                    <ProtectedRoute allowedRoles={['BIDDER']}>
                        <BiddingPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/asset-management"
                element={
                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                        <AssetListPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/asset-management/new"
                element={
                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                        <AssetFormPage />
                    </ProtectedRoute>
                }
            />
            <Route
                path="/asset-management/:id/upload-images"
                element={
                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                        <AssetImageUploadPage />
                    </ProtectedRoute>
                }
            />


            {/* Admin Only */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute allowedRoles={['ADMIN']}>
                        <AdminDashboard />
                    </ProtectedRoute>
                }
            />

            {/* Catch All */}
            <Route path="*" element={<NotFoundPage />} />
        </Routes>
    );
};

export default AppRoutes;
