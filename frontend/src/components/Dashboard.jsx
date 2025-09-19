import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import Navbar from './Navbar';
import { 
  BookOpen, 
  FileText, 
  Zap, 
  Brain, 
  TrendingUp, 
  Clock, 
  Star,
  Plus,
  BarChart3,
  Target,
  Award
} from 'lucide-react';

const Dashboard = ({ onLogout }) => {
  const [stats, setStats] = useState({
    totalQuizzes: 0,
    totalResumes: 0,
    totalFlashcards: 0,
    studyStreak: 0
  });

  const [recentActivity, setRecentActivity] = useState([]);

  useEffect(() => {
    // Simulate loading stats
    setStats({
      totalQuizzes: 12,
      totalResumes: 3,
      totalFlashcards: 45,
      studyStreak: 7
    });

    setRecentActivity([
      { id: 1, type: 'quiz', title: 'Python Fundamentals Quiz', time: '2 hours ago', status: 'completed' },
      { id: 2, type: 'resume', title: 'Software Engineer Resume', time: '1 day ago', status: 'updated' },
      { id: 3, type: 'flashcard', title: 'Data Structures Flashcards', time: '2 days ago', status: 'created' },
      { id: 4, type: 'quiz', title: 'React Components Quiz', time: '3 days ago', status: 'completed' }
    ]);
  }, []);

  const features = [
    {
      title: 'Quiz Builder',
      description: 'Create intelligent quizzes from any text using AI models',
      icon: <BookOpen size={32} />,
      path: '/quiz-builder',
      color: 'from-blue-500 to-cyan-500',
      stats: stats.totalQuizzes
    },
    {
      title: 'Resume Builder',
      description: 'Build professional resumes with AI-powered suggestions',
      icon: <FileText size={32} />,
      path: '/resume-builder',
      color: 'from-green-500 to-emerald-500',
      stats: stats.totalResumes
    },
    {
      title: 'Flashcard Generator',
      description: 'Generate flashcards automatically from study material',
      icon: <Zap size={32} />,
      path: '/flashcard-generator',
      color: 'from-purple-500 to-pink-500',
      stats: stats.totalFlashcards
    },
    {
      title: 'AI Models',
      description: 'Configure and manage your AI model preferences',
      icon: <Brain size={32} />,
      path: '/settings',
      color: 'from-orange-500 to-red-500',
      stats: '3 Active'
    }
  ];

  const quickActions = [
    { title: 'New Quiz', icon: <Plus size={20} />, path: '/quiz-builder' },
    { title: 'New Resume', icon: <Plus size={20} />, path: '/resume-builder' },
    { title: 'New Flashcards', icon: <Plus size={20} />, path: '/flashcard-generator' },
    { title: 'View Analytics', icon: <BarChart3 size={20} />, path: '/dashboard' }
  ];

  return (
    <div className="dashboard">
      <Navbar onLogout={onLogout} />
      <div className="background-pattern"></div>
      <div className="background-glow"></div>
      
      <div className="dashboard-content">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="dashboard-header"
        >
          <h1 className="dashboard-title">Welcome back, Student! 👋</h1>
          <p className="dashboard-subtitle">
            Ready to continue your learning journey? Let's build something amazing today.
          </p>
        </motion.div>

        {/* Stats Overview */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
            gap: '1.5rem',
            marginBottom: '3rem'
          }}
        >
          {[
            { label: 'Total Quizzes', value: stats.totalQuizzes, icon: <BookOpen size={24} />, color: '#4DB7FF' },
            { label: 'Resumes Created', value: stats.totalResumes, icon: <FileText size={24} />, color: '#10B981' },
            { label: 'Flashcards', value: stats.totalFlashcards, icon: <Zap size={24} />, color: '#8B5CF6' },
            { label: 'Study Streak', value: `${stats.studyStreak} days`, icon: <TrendingUp size={24} />, color: '#F59E0B' }
          ].map((stat, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.05 }}
              style={{
                background: 'rgba(255, 255, 255, 0.05)',
                border: '1px solid rgba(77, 183, 255, 0.2)',
                borderRadius: '16px',
                padding: '1.5rem',
                display: 'flex',
                alignItems: 'center',
                gap: '1rem',
                transition: 'all 0.3s ease'
              }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                background: stat.color,
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}>
                {stat.icon}
              </div>
              <div>
                <div style={{ fontSize: '2rem', fontWeight: '700', color: '#ffffff' }}>
                  {stat.value}
                </div>
                <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                  {stat.label}
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Quick Actions */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          style={{ marginBottom: '3rem' }}
        >
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            marginBottom: '1.5rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Target size={24} />
            Quick Actions
          </h2>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1rem'
          }}>
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.path}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(77, 183, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '1rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.75rem',
                  color: '#ffffff',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(77, 183, 255, 0.1)';
                  e.target.style.borderColor = '#4DB7FF';
                  e.target.style.transform = 'translateY(-2px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                  e.target.style.borderColor = 'rgba(77, 183, 255, 0.2)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: '#4DB7FF',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {action.icon}
                </div>
                <span style={{ fontWeight: '600' }}>{action.title}</span>
              </Link>
            ))}
          </div>
        </motion.div>

        {/* Main Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="features-grid"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Link
                to={feature.path}
                style={{ textDecoration: 'none', color: 'inherit' }}
              >
                <div className="feature-card">
                  <div className="feature-icon">
                    {feature.icon}
                  </div>
                  <h3 className="feature-title">{feature.title}</h3>
                  <p className="feature-description">{feature.description}</p>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginTop: '1.5rem'
                  }}>
                    <span style={{
                      background: 'rgba(77, 183, 255, 0.1)',
                      color: '#4DB7FF',
                      padding: '0.25rem 0.75rem',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: '600'
                    }}>
                      {feature.stats}
                    </span>
                    <div style={{
                      width: '30px',
                      height: '30px',
                      background: '#4DB7FF',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      →
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Recent Activity */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          style={{ marginTop: '3rem' }}
        >
          <h2 style={{ 
            fontSize: '1.5rem', 
            fontWeight: '700', 
            marginBottom: '1.5rem',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            gap: '0.5rem'
          }}>
            <Clock size={24} />
            Recent Activity
          </h2>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(77, 183, 255, 0.2)',
            borderRadius: '16px',
            padding: '1.5rem'
          }}>
            {recentActivity.map((activity, index) => (
              <div
                key={activity.id}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  padding: '1rem 0',
                  borderBottom: index < recentActivity.length - 1 ? '1px solid rgba(77, 183, 255, 0.1)' : 'none'
                }}
              >
                <div style={{
                  width: '40px',
                  height: '40px',
                  background: activity.type === 'quiz' ? '#4DB7FF' : 
                             activity.type === 'resume' ? '#10B981' : '#8B5CF6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white'
                }}>
                  {activity.type === 'quiz' ? <BookOpen size={20} /> :
                   activity.type === 'resume' ? <FileText size={20} /> : <Zap size={20} />}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: '600', color: '#ffffff', marginBottom: '0.25rem' }}>
                    {activity.title}
                  </div>
                  <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                    {activity.time} • {activity.status}
                  </div>
                </div>
                <div style={{
                  background: activity.status === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(77, 183, 255, 0.1)',
                  color: activity.status === 'completed' ? '#10B981' : '#4DB7FF',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {activity.status}
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Dashboard;
