import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Mail, Lock, Eye, EyeOff, User, UserPlus } from 'lucide-react';
import { useNotification } from './NotificationSystem';
import authService from '../services/authService';

const Login = ({ onLogin }) => {
  const [isLoginMode, setIsLoginMode] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { success, error } = useNotification();

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLoginMode) {
        // Login
        if (!formData.email || !formData.password) {
          error('Please fill in all required fields');
          return;
        }

        const response = await authService.login(formData.email, formData.password);
        success(`Welcome back, ${response.user.name}!`);
        onLogin(response.token);
      } else {
        // Register
        if (!formData.name || !formData.email || !formData.password || !formData.confirmPassword) {
          error('Please fill in all required fields');
          return;
        }

        if (formData.password !== formData.confirmPassword) {
          error('Passwords do not match');
          return;
        }

        if (formData.password.length < 6) {
          error('Password must be at least 6 characters long');
          return;
        }

        const response = await authService.register(formData.name, formData.email, formData.password);
        success(`Welcome to Study Karo, ${response.user.name}!`);
        onLogin(response.token);
      }
    } catch (err) {
      error(err.message || 'Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <div className="background-pattern"></div>
      <div className="background-glow"></div>
      
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="login-card"
      >
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <div className="logo" style={{ justifyContent: 'center', marginBottom: '1rem' }}>
            <div className="logo-icon"></div>
            <span style={{ 
              color: '#ffffff',
              fontWeight: '800',
              letterSpacing: '-0.5px'
            }}>
              Study Karo
            </span>
          </div>
          <h1 className="login-title">
            {isLoginMode ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p style={{ color: '#cccccc' }}>
            {isLoginMode 
              ? 'Sign in to continue your learning journey' 
              : 'Join Study Karo and start your learning adventure'
            }
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          {!isLoginMode && (
            <div className="form-group">
              <label className="form-label">
                <User size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                Full Name
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your full name"
                required={!isLoginMode}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">
              <Mail size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Email Address
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label">
              <Lock size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
              Password
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="form-input"
                placeholder="Enter your password"
                required
                style={{ paddingRight: '3rem' }}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '1rem',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'none',
                  border: 'none',
                  color: '#cccccc',
                  cursor: 'pointer',
                  padding: '0.25rem'
                }}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {!isLoginMode && (
            <div className="form-group">
              <label className="form-label">
                <Lock size={16} style={{ marginRight: '0.5rem', display: 'inline' }} />
                Confirm Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="form-input"
                  placeholder="Confirm your password"
                  required={!isLoginMode}
                  style={{ paddingRight: '3rem' }}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  style={{
                    position: 'absolute',
                    right: '1rem',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    color: '#cccccc',
                    cursor: 'pointer',
                    padding: '0.25rem'
                  }}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
            </div>
          )}

          <motion.button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {isLoading ? (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                {isLoginMode ? 'Signing In...' : 'Creating Account...'}
              </div>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem' }}>
                {isLoginMode ? <User size={20} /> : <UserPlus size={20} />}
                {isLoginMode ? 'Sign In' : 'Create Account'}
              </div>
            )}
          </motion.button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#cccccc', marginBottom: '1rem' }}>
            {isLoginMode ? "Don't have an account?" : "Already have an account?"}
            <button 
              style={{ 
                background: 'none', 
                border: 'none', 
                color: '#4DB7FF', 
                cursor: 'pointer', 
                textDecoration: 'underline',
                marginLeft: '0.5rem',
                fontWeight: '600'
              }}
              onClick={() => {
                setIsLoginMode(!isLoginMode);
                setFormData({ name: '', email: '', password: '', confirmPassword: '' });
                setShowPassword(false);
                setShowConfirmPassword(false);
              }}
            >
              {isLoginMode ? 'Create Account' : 'Sign In'}
            </button>
          </p>
          
          <button
            onClick={() => window.history.back()}
            style={{
              background: 'none',
              border: '1px solid rgba(77, 183, 255, 0.3)',
              color: '#4DB7FF',
              padding: '0.75rem 1.5rem',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto'
            }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default Login;
