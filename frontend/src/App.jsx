import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import LandingPage from './components/LandingPage';
import Dashboard from './components/Dashboard';
import Login from './components/Login';
import Settings from './components/Settings';
import QuizBuilder from './components/QuizBuilder';
import ResumeBuilder from './components/ResumeBuilder';
import FlashcardGenerator from './components/FlashcardGenerator';
import NotificationProvider from './components/NotificationSystem';
import authService from './services/authService';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in
    const checkAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          // Verify token is still valid
          await authService.getCurrentUser();
          setIsAuthenticated(true);
        }
      } catch (error) {
        // Token is invalid, clear it
        authService.logout();
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuth();
  }, []);

  const handleLogin = (token) => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
  };

  if (isLoading) {
    return (
      <div className="loading-screen">
        <motion.div
          className="loading-spinner"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        >
          <div className="spinner"></div>
        </motion.div>
        <motion.h2
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          Study Karo
        </motion.h2>
      </div>
    );
  }

  return (
    <NotificationProvider>
      <Router>
        <div className="App">
          <AnimatePresence mode="wait">
            <Routes>
            <Route 
              path="/" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <LandingPage />
              } 
            />
            <Route 
              path="/login" 
              element={
                isAuthenticated ? 
                <Navigate to="/dashboard" replace /> : 
                <Login onLogin={handleLogin} />
              } 
            />
            <Route 
              path="/dashboard" 
              element={
                isAuthenticated ? 
                <Dashboard onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/quiz-builder" 
              element={
                isAuthenticated ? 
                <QuizBuilder onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/resume-builder" 
              element={
                isAuthenticated ? 
                <ResumeBuilder onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/flashcard-generator" 
              element={
                isAuthenticated ? 
                <FlashcardGenerator onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />
            <Route 
              path="/settings" 
              element={
                isAuthenticated ? 
                <Settings onLogout={handleLogout} /> : 
                <Navigate to="/login" replace />
              } 
            />
            </Routes>
          </AnimatePresence>
        </div>
      </Router>
    </NotificationProvider>
  );
}

export default App;