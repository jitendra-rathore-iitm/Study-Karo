import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Users, BookOpen, Brain, FileText, Zap } from 'lucide-react';

const LandingPage = ({ onLogin }) => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  return (
    <div className="landing-page">
      <div className="background-pattern"></div>
      <div className="background-glow"></div>
      
      {/* Navigation */}
      <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
        <div className="navbar-content">
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
          <ul className="nav-links">
            <li><a href="#features">Features</a></li>
            <li><a href="#about">About</a></li>
            <li><a href="#contact">Contact</a></li>
          </ul>
          <button className="login-btn" onClick={onLogin}>
            Get Started
          </button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="hero-section">

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="hero-title"
        >
          Ace Your Studies with AI-Powered Learning
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="hero-subtitle"
        >
          Transform your learning experience with intelligent quiz generation, 
          resume building, and flashcard creation powered by advanced AI models.
        </motion.p>

        <motion.button
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="cta-button"
          onClick={onLogin}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Start Learning Now
          <ArrowRight size={20} />
        </motion.button>
      </section>

      {/* Features Preview */}
      <section id="features" style={{ padding: '4rem 2rem', background: 'rgba(0,0,0,0.3)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{ 
              textAlign: 'center', 
              fontSize: '2.5rem', 
              fontWeight: '700', 
              marginBottom: '3rem',
              background: 'linear-gradient(135deg, #ffffff, #4DB7FF)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}
          >
            Powerful Learning Tools
          </motion.h2>
          
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
            gap: '2rem' 
          }}>
            {[
              {
                icon: <BookOpen size={32} />,
                title: 'Smart Quiz Builder',
                description: 'Generate intelligent quizzes from any text using AI models'
              },
              {
                icon: <FileText size={32} />,
                title: 'Resume Builder',
                description: 'Create professional resumes with AI-powered suggestions'
              },
              {
                icon: <Zap size={32} />,
                title: 'Flashcard Generator',
                description: 'Generate flashcards automatically from your study material'
              },
              {
                icon: <Brain size={32} />,
                title: 'AI Models Integration',
                description: 'Choose from multiple AI models for optimal learning'
              }
            ].map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(77, 183, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '2rem',
                  textAlign: 'center',
                  transition: 'all 0.3s ease'
                }}
                whileHover={{ 
                  transform: 'translateY(-5px)',
                  borderColor: '#4DB7FF',
                  boxShadow: '0 20px 40px rgba(77, 183, 255, 0.2)'
                }}
              >
                <div style={{
                  width: '60px',
                  height: '60px',
                  background: 'linear-gradient(135deg, #4DB7FF, #00a8ff)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 1.5rem',
                  color: 'white'
                }}>
                  {feature.icon}
                </div>
                <h3 style={{ 
                  fontSize: '1.5rem', 
                  fontWeight: '700', 
                  marginBottom: '1rem',
                  color: '#ffffff'
                }}>
                  {feature.title}
                </h3>
                <p style={{ 
                  color: '#cccccc', 
                  lineHeight: '1.6' 
                }}>
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;
