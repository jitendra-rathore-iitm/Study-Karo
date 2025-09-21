import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Menu, X, User, Settings, LogOut, BookOpen, FileText, Zap, Brain } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import authService from '../services/authService';

const Navbar = ({ onLogout }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [user, setUser] = useState(null);
  const location = useLocation();

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
    { path: '/dashboard', label: 'Dashboard', icon: <BookOpen size={20} /> },
    { path: '/resume-builder', label: 'Resume Builder', icon: <FileText size={20} /> },
    { path: '/flashcard-generator', label: 'Flashcards', icon: <Zap size={20} /> },
    { path: '/settings', label: 'Settings', icon: <Settings size={20} /> }
  ];

  const isActive = (path) => {
    return location.pathname === path;
  };

  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-content">
        <Link to="/dashboard" className="logo">
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
              <Link 
                to={item.path} 
                className={isActive(item.path) ? 'active' : ''}
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
              >
                {item.icon}
                {item.label}
              </Link>
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
        <div style={{ display: window.innerWidth > 768 ? 'flex' : 'none', alignItems: 'center', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4DB7FF' }}>
            <User size={20} />
            <span>{user?.name || 'User'}</span>
          </div>
          <button
            onClick={onLogout}
            style={{
              background: 'rgba(255, 255, 255, 0.1)',
              border: '1px solid rgba(77, 183, 255, 0.3)',
              color: '#4DB7FF',
              padding: '0.5rem 1rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <LogOut size={16} />
            Logout
          </button>
        </div>
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
            ))}
          </nav>

          <div style={{ marginTop: '2rem', paddingTop: '2rem', borderTop: '1px solid rgba(77, 183, 255, 0.2)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: '#4DB7FF', marginBottom: '1rem' }}>
              <User size={20} />
              <span>{user?.name || 'User'}</span>
            </div>
            <button
              onClick={() => {
                onLogout();
                setIsMenuOpen(false);
              }}
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
    </nav>
  );
};

export default Navbar;
