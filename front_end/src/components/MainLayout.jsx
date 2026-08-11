import React, { useState, useRef, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  UserOutlined,
  LogoutOutlined,
  DashboardOutlined,
  TeamOutlined,
  KeyOutlined,
} from '@ant-design/icons';
import { message } from 'antd';

const MainLayout = ({ userRole, children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem('user') || '{}');
  const dropdownRef = useRef(null);

  const handleLogout = () => {
    localStorage.clear();
    message.success('Logged out successfully!');
    navigate('/');
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setUserDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const isActive = (path) => location.pathname === path;

  const dashboardPath =
    userRole === 'super_admin'
      ? '/super-admin'
      : userRole === 'admin'
      ? '/admin'
      : '/employee';

  const profilePath =
    userRole === 'super_admin' || userRole === 'admin'
      ? '/admin/profile'
      : '/employee/profile';

  const changePasswordPath =
    userRole === 'super_admin' || userRole === 'admin'
      ? '/admin/change-password'
      : '/employee/change-password';

  return (
    <div className="layout-wrapper">
      {/* Top Header */}
      <header className="layout-header">
        <div
          className="header-brand"
          onClick={() => navigate(dashboardPath)}
        >
          <img src="/jamtech.png" alt="Jamtech Technologies" className="brand-logo" />
        </div>

        <div className="header-user-container" ref={dropdownRef}>
          <button
            className="user-profile-btn"
            onClick={() => setUserDropdownOpen(!userDropdownOpen)}
          >
            <UserOutlined />
            <span className="user-name">{user.full_name || 'User'}</span>
          </button>
          {userDropdownOpen && (
            <div className="user-dropdown-menu">
              <div
                className="dropdown-item"
                onClick={() => {
                  navigate(profilePath);
                  setUserDropdownOpen(false);
                }}
              >
                <UserOutlined /> Profile
              </div>
              <div
                className="dropdown-item"
                onClick={() => {
                  navigate(changePasswordPath);
                  setUserDropdownOpen(false);
                }}
              >
                <KeyOutlined /> Change Password
              </div>
              <div className="dropdown-divider"></div>
              <div className="dropdown-item logout-item" onClick={handleLogout}>
                <LogoutOutlined /> Logout
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="layout-body">
        {/* Left Sidebar */}
        <aside className="layout-sidebar">
          <nav className="sidebar-menu">
            {userRole === 'super_admin' ? (
              <>
                <a
                  className={`sidebar-link ${isActive('/super-admin') ? 'active' : ''}`}
                  onClick={() => navigate('/super-admin')}
                >
                  <DashboardOutlined className="sidebar-icon" />
                  <span>Dashboard</span>
                </a>
                <a
                  className={`sidebar-link ${isActive('/admin/users') ? 'active' : ''}`}
                  onClick={() => navigate('/admin/users')}
                >
                  <TeamOutlined className="sidebar-icon" />
                  <span>Users List</span>
                </a>
              </>
            ) : userRole === 'admin' ? (
              <>
                <a
                  className={`sidebar-link ${isActive('/admin') ? 'active' : ''}`}
                  onClick={() => navigate('/admin')}
                >
                  <DashboardOutlined className="sidebar-icon" />
                  <span>Dashboard</span>
                </a>
                <a
                  className={`sidebar-link ${isActive('/admin/users') ? 'active' : ''}`}
                  onClick={() => navigate('/admin/users')}
                >
                  <TeamOutlined className="sidebar-icon" />
                  <span>Users List</span>
                </a>
              </>
            ) : (
              <>
                <a
                  className={`sidebar-link ${isActive('/employee') ? 'active' : ''}`}
                  onClick={() => navigate('/employee')}
                >
                  <DashboardOutlined className="sidebar-icon" />
                  <span>Dashboard</span>
                </a>
              </>
            )}
          </nav>
        </aside>

        {/* Main Content View */}
        <main className="layout-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MainLayout;
