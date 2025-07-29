import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from '../components/routing/ProtectedRoute';

// Public Pages
import HomePage from '../pages/home/Home';
import LoginPage from '../pages/auth/LoginPage';
import SignupPage from '../pages/auth/SignupPage';
import ForgotPasswordPage from '../pages/auth/ForgotPasswordPage';
import ResetPasswordPage from '../pages/auth/ResetPasswordPage';
import IntroductionPage from '../pages/auctions/IntroductionPage';
import ContactPage from '../pages/auctions/ContactPage';
import OtherNews from "../components/OtherNews";

// Asset Pages (Public)
import UpcomingAuctionsPage from '../pages/auctions/UpcomingAuctionsPage';
import OngoingAuctionsPage from '../pages/auctions/OngoingAuctionsPage';
import EndedAuctionsPage from '../pages/auctions/EndedAuctionsPage';
import AuctionNoticesPage from '../pages/auctions/AuctionNoticesPage';
import AnnouncementsPage from '../pages/auctions/AnnouncementsPage';
import AssetDetailPage from '../pages/auctions/AssetDetailPage';
import SessionDetailPage from '../pages/auctions/SessionDetailPage';
import BiddingSection from '../components/common/BiddingSection';

// User Pages
import ProfilePage from '../pages/profile/ProfilePage';
import DepositPage from '../pages/payment/DepositPage';
import TransactionHistoryPage from '../pages/payment/TransactionHistoryPage';
import BiddingPage from '../pages/auctions/BiddingPage';

// Organizer Pages
import AssetListPage from '../pages/organizer/AssetListPage';
import AssetFormPage from '../pages/organizer/AssetFormPage';
import AssetImageUploadPage from '../pages/organizer/AssetImageUploadPage';

// Admin Pages
import AdminDashboard from '../pages/admin/AdminDashboard';

// Fallback Page
import NotFoundPage from '../pages/NotFoundPage';

const AppRoutes = () => {
    return (
        <Routes>
            {/* Public Pages */}
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/sessions/code/:sessionCode" element={<SessionDetailPage />} />
            <Route path="/sessions/:id/bid" element={<BiddingSection />} />
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

      {/* Protected User Pages */}
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
      <Route
        path="/wallet/history"
        element={
          <ProtectedRoute>
            <TransactionHistoryPage />
          </ProtectedRoute>
        }
      />

      {/* Bidder Pages */}
      <Route
        path="/sessions/:id/bid"
        element={
          <ProtectedRoute allowedRoles={['BIDDER']}>
            <BiddingPage />
          </ProtectedRoute>
        }
      />

      {/* Organizer Pages */}
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

      {/* Admin Pages */}
      <Route
        path="/admin"
        element={
          <ProtectedRoute allowedRoles={['ADMIN']}>
            <AdminDashboard />
          </ProtectedRoute>
        }
      />

      {/* Fallback Page */}
      <Route path="*" element={<NotFoundPage />} />
    </Routes>
  );
};

export default AppRoutes;