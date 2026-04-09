import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useState } from 'react';
import {
  HiOutlineHome,
  HiOutlineUser,
  HiOutlineSearch,
  HiOutlineFolder,
  HiOutlineCog,
  HiOutlineLogout,
  HiOutlineMenu,
  HiOutlineX,
  HiOutlineLightningBolt,
  HiOutlineClipboardCheck,
} from 'react-icons/hi';

const Navbar = () => {
  const { user, logout, isAdmin, isManager } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const navLinks = [
    { to: '/dashboard', label: 'Dashboard', icon: <HiOutlineHome /> },
    { to: '/profile', label: 'Profile', icon: <HiOutlineUser /> },
    { to: '/skills', label: 'Skills', icon: <HiOutlineLightningBolt /> },
    { to: '/projects', label: 'Projects', icon: <HiOutlineFolder /> },
  ];

  if (isManager || isAdmin) {
    navLinks.push(
      { to: '/applications', label: 'Applications', icon: <HiOutlineClipboardCheck /> },
      { to: '/search', label: 'Search', icon: <HiOutlineSearch /> }
    );
  }

  if (isAdmin) {
    navLinks.push({ to: '/admin', label: 'Admin', icon: <HiOutlineCog /> });
  }

  const isActive = (path) => location.pathname === path;

  return (
    <>
      <nav className="navbar">
        <div className="navbar-brand">
          <Link to="/dashboard" className="navbar-logo">
            <span className="logo-icon">⚡</span>
            <span className="logo-text">SkillHub</span>
          </Link>
        </div>

        <div className={`navbar-links ${mobileOpen ? 'open' : ''}`}>
          {navLinks.map((link) => (
            <Link
              key={link.to}
              to={link.to}
              className={`nav-link ${isActive(link.to) ? 'active' : ''}`}
              onClick={() => setMobileOpen(false)}
            >
              <span className="nav-icon">{link.icon}</span>
              <span className="nav-label">{link.label}</span>
            </Link>
          ))}
        </div>

        <div className="navbar-user">
          <div className="user-info">
            <div className="user-avatar">
              {user?.name?.charAt(0)?.toUpperCase() || 'U'}
            </div>
            <div className="user-details">
              <span className="user-name">{user?.name}</span>
              <span className="user-role">{user?.role}</span>
            </div>
          </div>
          <button className="logout-btn" onClick={handleLogout} title="Logout">
            <HiOutlineLogout />
          </button>
        </div>

        <button
          className="mobile-toggle"
          onClick={() => setMobileOpen(!mobileOpen)}
        >
          {mobileOpen ? <HiOutlineX /> : <HiOutlineMenu />}
        </button>
      </nav>
      {mobileOpen && (
        <div className="mobile-overlay" onClick={() => setMobileOpen(false)} />
      )}
    </>
  );
};

export default Navbar;
