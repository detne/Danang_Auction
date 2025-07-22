import React, { useEffect, useState } from 'react';
import { useUser } from '../../contexts/UserContext';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../../layouts/AdminLayout';

import AdminStatsOverview from '../../components/admin/AdminStatsOverview';
import UserStatsTable from '../../components/admin/UserStatsTable';
import AuctionSessionStats from '../../components/admin/AuctionSessionStats';
import MonthlyRevenueChart from '../../components/admin/MonthlyRevenueChart';
import RecentWinners from '../../components/admin/RecentWinners';
import AssetManagementAdmin from '../../components/admin/AssetManagementAdmin';
import SessionManagementAdmin from '../../components/admin/SessionManagementAdmin';
import CategoryGrid from '../../components/admin/CategoryGrid';

import { USER_ROLES } from '../../utils/constants';
import '../../styles/AdminDashboard.css';

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const { user, loading } = useUser();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && (!user || user.role !== USER_ROLES.ADMIN)) {
      navigate('/');
    }
  }, [loading, user, navigate]);

  if (loading) {
    return (
      <div className="loading-spinner">
        <div className="spinner"></div>
        Đang tải...
      </div>
    );
  }

  if (!user || user.role !== USER_ROLES.ADMIN) {
    return (
      <div className="no-access">
        <h3>Không có quyền truy cập</h3>
        <p>Bạn cần có quyền quản trị để truy cập trang này.</p>
      </div>
    );
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'overview':
        return (
          <div className="dashboard-grid">
            <AdminStatsOverview />
            <UserStatsTable />
            <AuctionSessionStats />
            <MonthlyRevenueChart />
            <RecentWinners />
          </div>
        );
        case 'users':
            return (
                <>
                    <UserStatsTable />
                    <RecentWinners />
                </>
            );

        case 'auctions':
        return <SessionManagementAdmin />;
      case 'assets':
        return <AssetManagementAdmin />;
      case 'categories':
        return <CategoryGrid />;
      case 'payments':
        return (
          <div className="card">
            <h2>💳 Quản lý thanh toán</h2>
            <p>Module đang được phát triển...</p>
          </div>
        );
      case 'reports':
        return (
          <div className="card">
            <h2>📈 Báo cáo</h2>
            <p>Module đang được phát triển...</p>
          </div>
        );
      case 'settings':
        return (
          <div className="card">
            <h2>⚙️ Cài đặt hệ thống</h2>
            <p>Module đang được phát triển...</p>
          </div>
        );
      default:
        return <div>Chọn tab để xem nội dung</div>;
    }
  };

  return (
    <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
      {renderContent()}
    </AdminLayout>
  );
};

export default AdminDashboard;