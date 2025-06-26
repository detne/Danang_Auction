import React, { Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import { UserProvider, useUser } from './contexts/UserContext';
import './App.css';

// Lazy load các component
const Home = lazy(() => import('./pages/Home'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const SignupPage = lazy(() => import('./pages/SignupPage'));
const Profile = lazy(() => import('./components/Profile'));
const AssetDetail = lazy(() => import('./components/AssetDetail'));
const UpcomingAuctions = lazy(() => import('./components/UpcomingAuctions'));
const OngoingAuctionsSection = lazy(() => import('./components/OngoingAuctionsSection'));
const EndedAuctions = lazy(() => import('./components/EndedAuctions'));
const AdminDashboard = lazy(() => import('./components/AdminDashboard'));
const AssetManagement = lazy(() => import('./components/AssetManagement'));
const BiddingSection = lazy(() => import('./components/BiddingSection'));

// Component bảo vệ route chung
const ProtectedRoute = ({ children, allowedRoles = [], redirectTo = '/login' }) => {
    const { user, loading, error } = useUser();

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        console.error('ProtectedRoute error:', error);
        return <Navigate to="/login" replace />;
    }

    if (!user) {
        return <Navigate to={redirectTo} replace />;
    }

    if (allowedRoles.length > 0 && !allowedRoles.includes(user.role)) {
        console.log('User role:', user.role, 'not in allowed roles:', allowedRoles);
        return <Navigate to={redirectTo} replace />;
    }

    return children;
};

// Component fallback khi lazy loading
const LoadingFallback = () => <div>Loading...</div>;

const App = () => {
    return (
        <UserProvider>
            <Router>
                <div className="App">
                    <Header />
                    <Suspense fallback={<LoadingFallback />}>
                        <Routes>
                            <Route path="/" element={<Home />} />
                            <Route path="/login" element={<LoginPage />} />
                            <Route path="/signup" element={<SignupPage />} />
                            <Route
                                path="/profile"
                                element={
                                    <ProtectedRoute>
                                        <Profile />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="/asset/:id" element={<AssetDetail />} />
                            <Route path="/upcoming-auctions" element={<UpcomingAuctions />} />
                            <Route path="/ongoing-auctions" element={<OngoingAuctionsSection />} />
                            <Route path="/ended-auctions" element={<EndedAuctions />} />
                            <Route
                                path="/admin"
                                element={
                                    <ProtectedRoute allowedRoles={['ADMIN']}>
                                        <AdminDashboard />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/asset-management"
                                element={
                                    <ProtectedRoute allowedRoles={['ORGANIZER']}>
                                        <AssetManagement />
                                    </ProtectedRoute>
                                }
                            />
                            <Route
                                path="/sessions/:id/bid"
                                element={
                                    <ProtectedRoute allowedRoles={['BIDDER']}>
                                        <BiddingSection />
                                    </ProtectedRoute>
                                }
                            />
                            <Route path="*" element={<Navigate to="/" replace />} />
                        </Routes>
                    </Suspense>
                </div>
            </Router>
        </UserProvider>
    );
};

export default App;