import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X, User, Settings, LogOut, BookOpen, FileText, Zap, Brain, ChevronDown } from 'lucide-react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import authService from '../services/authService';
import { smoothScrollTo } from '../utils/globalUtils';

const EnhancedNavbar = ({ onLogout, showUserMenu = true }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    // Get user data
    const userData = authService.getUser();
    setUser(userData);
  }, []);

  const navItems = [
    { path: '/dashboard', label: 'Home', icon: <BookOpen size={20} /> },
    { path: '/features', label: 'Features', icon: <Brain size={20} />, isScroll: true }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  const handleLogout = () => {
    onLogout();
    setIsUserMenuOpen(false);
    setIsMenuOpen(false);
  };

  const handleFeaturesClick = (e) => {
    e.preventDefault();
    
    // If we're not on the dashboard, navigate to dashboard first
    if (location.pathname !== '/dashboard') {
      navigate('/dashboard');
      // Wait for navigation to complete, then scroll to features
      setTimeout(() => {
        const featuresElement = document.getElementById('features');
        if (featuresElement) {
          featuresElement.scrollIntoView({ 
            behavior: 'smooth', 
            block: 'start' 
          });
        }
      }, 300);
    } else {
      // If we're already on dashboard, just scroll to features
      const featuresElement = document.getElementById('features');
      if (featuresElement) {
        featuresElement.scrollIntoView({ 
          behavior: 'smooth', 
          block: 'start' 
        });
      }
    }
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <Link to={showUserMenu ? "/dashboard" : "/"} className="logo">
          <div className="logo-icon"></div>
          <span style={{ 
            color: '#ffffff',
            fontWeight: '800',
            letterSpacing: '-0.5px'
          }}>
            Study Karo
          </span>
        </Link>

        {/* Desktop Navigation */}
        <ul className="nav-links" style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}>
          {navItems.map((item) => (
            <li key={item.path}>
              {item.isScroll ? (
                <a 
                  href="#features"
                  onClick={handleFeaturesClick}
                  className={isActive(item.path) ? 'active' : ''}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none' }}
                >
                  {item.icon}
                  {item.label}
                </a>
              ) : (
                <Link 
                  to={item.path} 
                  className={isActive(item.path) ? 'active' : ''}
                  style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )}
            </li>
          ))}
        </ul>

        {/* Mobile Menu Button */}
        <button
          className="login-btn"
          onClick={() => setIsMenuOpen(!isMenuOpen)}
          style={{ display: window.innerWidth <= 768 ? 'flex' : 'none', alignItems: 'center', gap: '0.5rem' }}
        >
          <Menu size={20} />
          Menu
        </button>

        {/* Desktop User Menu */}
        {showUserMenu && user && (
          <div style={{ display: window.innerWidth > 768 ? 'flex' : 'none', alignItems: 'center', gap: '1rem' }}>
            {/* User Dropdown */}
            <div style={{ position: 'relative' }}>
              <button
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(77, 183, 255, 0.3)',
                  color: '#4DB7FF',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(77, 183, 255, 0.2)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                }}
              >
                <User size={16} />
                <span>{user.name || 'User'}</span>
                <ChevronDown size={16} />
              </button>

              {/* User Dropdown Menu */}
              <AnimatePresence>
                {isUserMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: -10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    style={{
                      position: 'absolute',
                      top: '100%',
                      right: 0,
                      marginTop: '0.5rem',
                      background: 'rgba(10, 10, 10, 0.95)',
                      backdropFilter: 'blur(20px)',
                      border: '1px solid rgba(77, 183, 255, 0.2)',
                      borderRadius: '12px',
                      padding: '0.5rem',
                      minWidth: '200px',
                      zIndex: 1000,
                      boxShadow: '0 10px 30px rgba(0, 0, 0, 0.3)'
                    }}
                  >
                    <div style={{
                      padding: '0.75rem 1rem',
                      borderBottom: '1px solid rgba(77, 183, 255, 0.2)',
                      marginBottom: '0.5rem'
                    }}>
                      <div style={{ color: '#ffffff', fontWeight: '600', fontSize: '0.9rem' }}>
                        {user.name || 'User'}
                      </div>
                      <div style={{ color: '#cccccc', fontSize: '0.8rem' }}>
                        {user.email}
                      </div>
                    </div>
                    
                    <Link
                      to="/settings"
                      onClick={() => setIsUserMenuOpen(false)}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        color: '#ffffff',
                        textDecoration: 'none',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(77, 183, 255, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'transparent';
                      }}
                    >
                      <Settings size={16} />
                      Settings
                    </Link>
                    
                    <button
                      onClick={handleLogout}
                      style={{
                        width: '100%',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.75rem',
                        padding: '0.75rem 1rem',
                        background: 'none',
                        border: 'none',
                        color: '#ff6b6b',
                        cursor: 'pointer',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        textAlign: 'left'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(255, 107, 107, 0.1)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'none';
                      }}
                    >
                      <LogOut size={16} />
                      Logout
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        )}

        {/* Show Login button if not authenticated */}
        {!showUserMenu && (
          <button 
            className="login-btn" 
            onClick={() => navigate('/login')}
            style={{ display: window.innerWidth > 768 ? 'flex' : 'none' }}
          >
            Get Started
          </button>
        )}
      </div>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0, x: '100%' }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: '100%' }}
          transition={{ duration: 0.3 }}
          style={{
            position: 'fixed',
            top: 0,
            right: 0,
            width: '300px',
            height: '100vh',
            background: 'rgba(10, 10, 10, 0.95)',
            backdropFilter: 'blur(20px)',
            borderLeft: '1px solid rgba(77, 183, 255, 0.2)',
            zIndex: 1001,
            padding: '2rem'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <div className="logo">
              <div className="logo-icon"></div>
              <span style={{ 
                color: '#ffffff',
                fontWeight: '800',
                letterSpacing: '-0.5px'
              }}>
                Study Karo
              </span>
            </div>
            <button
              onClick={() => setIsMenuOpen(false)}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                cursor: 'pointer',
                padding: '0.5rem'
              }}
            >
              <X size={24} />
            </button>
          </div>

          <nav style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {navItems.map((item) => (
              item.isScroll ? (
                <a
                  key={item.path}
                  href="#features"
                  onClick={(e) => {
                    e.preventDefault();
                    handleFeaturesClick(e);
                    setIsMenuOpen(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    color: isActive(item.path) ? '#4DB7FF' : '#ffffff',
                    background: isActive(item.path) ? 'rgba(77, 183, 255, 0.1)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {item.icon}
                  {item.label}
                </a>
              ) : (
                <Link
                  key={item.path}
                  to={item.path}
                  onClick={() => setIsMenuOpen(false)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem',
                    padding: '1rem',
                    borderRadius: '8px',
                    color: isActive(item.path) ? '#4DB7FF' : '#ffffff',
                    background: isActive(item.path) ? 'rgba(77, 183, 255, 0.1)' : 'transparent',
                    textDecoration: 'none',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {item.icon}
                  {item.label}
                </Link>
              )
            ))}
          </nav>

          {showUserMenu && user && (
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(77, 183, 255, 0.2)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4DB7FF', marginBottom: '1rem' }}>
                <User size={20} />
                <span>{user?.name || 'User'}</span>
              </div>
              <button
                onClick={handleLogout}
                style={{
                  width: '100%',
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(77, 183, 255, 0.3)',
                  color: '#4DB7FF',
                  padding: '0.75rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: '0.5rem'
                }}
              >
                <LogOut size={16} />
                Logout
              </button>
            </div>
          )}

          {!showUserMenu && (
            <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(77, 183, 255, 0.2)' }}>
              <button
                onClick={() => {
                  navigate('/login');
                  setIsMenuOpen(false);
                }}
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #4DB7FF, #00a8ff)',
                  border: 'none',
                  color: '#ffffff',
                  padding: '1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '600',
                  fontSize: '1rem'
                }}
              >
                Get Started
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Mobile Menu Backdrop */}
      {isMenuOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setIsMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0, 0, 0, 0.5)',
            zIndex: 1000
          }}
        />
      )}

      {/* Click outside to close user menu */}
      {isUserMenuOpen && (
        <div
          onClick={() => setIsUserMenuOpen(false)}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            zIndex: 999
          }}
        />
      )}
    </nav>
  );
};

export default EnhancedNavbar;
