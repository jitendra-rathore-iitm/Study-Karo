import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import EnhancedNavbar from './EnhancedNavbar';
import authService from '../services/authService';
import { setStorageItem, getStorageItem, validateApiKey } from '../utils/globalUtils';
import { 
  Key, 
  Brain, 
  Save, 
  Eye, 
  EyeOff, 
  CheckCircle, 
  AlertCircle,
  User,
  Mail,
  Settings as SettingsIcon,
  Shield,
  Zap
} from 'lucide-react';

const Settings = ({ onLogout }) => {
  const [settings, setSettings] = useState({
    openaiApiKey: '',
    googleApiKey: '',
    perplexityApiKey: '',
    selectedModel: 'gpt-4',
    userProfile: {
      name: '',
      email: '',
      avatar: ''
    }
  });

  const [showKeys, setShowKeys] = useState({
    openai: false,
    google: false,
    perplexity: false
  });

  const [isSaving, setIsSaving] = useState(false);
  const [saveStatus, setSaveStatus] = useState('');

  const aiModels = [
    { id: 'gpt-4', name: 'GPT-4', provider: 'OpenAI', description: 'Most capable model for complex tasks' },
    { id: 'gpt-3.5-turbo', name: 'GPT-3.5 Turbo', provider: 'OpenAI', description: 'Fast and efficient for most tasks' },
    { id: 'gemini-pro', name: 'Gemini Pro', provider: 'Google', description: 'Google\'s most capable model' },
    { id: 'gemini-1.5-pro', name: 'Gemini 1.5 Pro', provider: 'Google', description: 'Latest Gemini model with enhanced capabilities' },
    { id: 'perplexity-sonar', name: 'Perplexity Sonar', provider: 'Perplexity', description: 'Real-time web search and analysis' },
    { id: 'perplexity-online', name: 'Perplexity Online', provider: 'Perplexity', description: 'Online research and fact-checking' }
  ];

  useEffect(() => {
    // Load user data from auth service
    const user = authService.getUser();
    if (user) {
      setSettings(prev => ({
        ...prev,
        userProfile: {
          name: user.name || '',
          email: user.email || '',
          avatar: ''
        }
      }));
    }

    // Load saved settings from localStorage
    const savedSettings = getStorageItem('studykaro-settings');
    if (savedSettings) {
      setSettings(prev => ({
        ...prev,
        ...savedSettings,
        userProfile: {
          ...prev.userProfile,
          ...savedSettings.userProfile
        }
      }));
    }
  }, []);

  const handleInputChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleProfileChange = (field, value) => {
    setSettings(prev => ({
      ...prev,
      userProfile: {
        ...prev.userProfile,
        [field]: value
      }
    }));
  };

  const toggleKeyVisibility = (provider) => {
    setShowKeys(prev => ({
      ...prev,
      [provider]: !prev[provider]
    }));
  };

  const handleSave = async () => {
    setIsSaving(true);
    setSaveStatus('');

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Save to localStorage
      setStorageItem('studykaro-settings', settings);
      
      setSaveStatus('success');
      setTimeout(() => setSaveStatus(''), 3000);
    } catch (error) {
      setSaveStatus('error');
      setTimeout(() => setSaveStatus(''), 3000);
    } finally {
      setIsSaving(false);
    }
  };

  // Using the global validateApiKey utility

  return (
    <div className="settings-container">
      <EnhancedNavbar onLogout={onLogout} showUserMenu={true} />
      <div className="background-pattern"></div>
      <div className="background-glow"></div>
      
      <div className="settings-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="dashboard-header"
        >
          <h1 className="dashboard-title">Settings & Configuration</h1>
          <p className="dashboard-subtitle">
            Manage your AI models, API keys, and profile settings
          </p>
        </motion.div>

        {/* Profile Settings */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="settings-section"
        >
          <h2 className="section-title">
            <User size={24} style={{ marginRight: '0.5rem' }} />
            Profile Settings
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Full Name</label>
              <input
                type="text"
                value={settings.userProfile.name}
                onChange={(e) => handleProfileChange('name', e.target.value)}
                className="form-input"
                placeholder="Enter your full name"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Email Address</label>
              <input
                type="email"
                value={settings.userProfile.email}
                onChange={(e) => handleProfileChange('email', e.target.value)}
                className="form-input"
                placeholder="Enter your email"
              />
            </div>
          </div>
        </motion.div>

        {/* AI Model Selection */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="settings-section"
        >
          <h2 className="section-title">
            <Brain size={24} style={{ marginRight: '0.5rem' }} />
            AI Model Configuration
          </h2>
          
          <div className="form-group">
            <label className="form-label">Default AI Model</label>
            <select
              value={settings.selectedModel}
              onChange={(e) => handleInputChange('selectedModel', e.target.value)}
              className="model-select"
            >
              {aiModels.map((model) => (
                <option key={model.id} value={model.id}>
                  {model.name} ({model.provider}) - {model.description}
                </option>
              ))}
            </select>
          </div>

          <div style={{
            background: 'rgba(77, 183, 255, 0.1)',
            border: '1px solid rgba(77, 183, 255, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginTop: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Zap size={16} color="#4DB7FF" />
              <span style={{ fontWeight: '600', color: '#4DB7FF' }}>Current Model</span>
            </div>
            <p style={{ color: '#cccccc', margin: 0 }}>
              {aiModels.find(m => m.id === settings.selectedModel)?.name} - 
              {aiModels.find(m => m.id === settings.selectedModel)?.description}
            </p>
          </div>
        </motion.div>

        {/* API Keys */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="settings-section"
        >
          <h2 className="section-title">
            <Key size={24} style={{ marginRight: '0.5rem' }} />
            API Keys
          </h2>
          <p style={{ color: '#cccccc', marginBottom: '2rem' }}>
            Add your API keys to enable AI-powered features. Keys are stored securely in your browser.
          </p>

          {[
            {
              provider: 'openai',
              name: 'OpenAI API Key',
              description: 'Required for GPT models',
              key: settings.openaiApiKey,
              placeholder: 'sk-...'
            },
            {
              provider: 'google',
              name: 'Google API Key',
              description: 'Required for Gemini models',
              key: settings.googleApiKey,
              placeholder: 'AIza...'
            },
            {
              provider: 'perplexity',
              name: 'Perplexity API Key',
              description: 'Required for Perplexity models',
              key: settings.perplexityApiKey,
              placeholder: 'pplx-...'
            }
          ].map((api) => {
            const validation = validateApiKey(api.key, api.provider);
            
            return (
              <div key={api.provider} style={{ marginBottom: '2rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <label className="form-label">{api.name}</label>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    {validation.valid ? (
                      <CheckCircle size={16} color="#10B981" />
                    ) : (
                      <AlertCircle size={16} color="#EF4444" />
                    )}
                    <span style={{ 
                      fontSize: '0.8rem', 
                      color: validation.valid ? '#10B981' : '#EF4444' 
                    }}>
                      {validation.message}
                    </span>
                  </div>
                </div>
                
                <div style={{ position: 'relative' }}>
                  <input
                    type={showKeys[api.provider] ? 'text' : 'password'}
                    value={api.key}
                    onChange={(e) => handleInputChange(`${api.provider}ApiKey`, e.target.value)}
                    className="api-key-input"
                    placeholder={api.placeholder}
                  />
                  <button
                    type="button"
                    onClick={() => toggleKeyVisibility(api.provider)}
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
                    {showKeys[api.provider] ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                
                <p style={{ color: '#666', fontSize: '0.9rem', marginTop: '0.5rem' }}>
                  {api.description}
                </p>
              </div>
            );
          })}
        </motion.div>

        {/* Security Notice */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="settings-section"
        >
          <h2 className="section-title">
            <Shield size={24} style={{ marginRight: '0.5rem' }} />
            Security & Privacy
          </h2>
          
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            borderRadius: '8px',
            padding: '1rem',
            marginBottom: '1rem'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <AlertCircle size={16} color="#EF4444" />
              <span style={{ fontWeight: '600', color: '#EF4444' }}>Important Security Notice</span>
            </div>
            <ul style={{ color: '#cccccc', margin: 0, paddingLeft: '1.5rem' }}>
              <li>API keys are stored locally in your browser</li>
              <li>Never share your API keys with anyone</li>
              <li>Keys are not transmitted to our servers</li>
              <li>Clear your browser data to remove stored keys</li>
            </ul>
          </div>
        </motion.div>

        {/* Save Button */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 1.0 }}
          style={{ textAlign: 'center', marginTop: '2rem' }}
        >
          <button
            onClick={handleSave}
            disabled={isSaving}
            className="save-btn"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem',
              margin: '0 auto',
              padding: '1rem 2rem',
              fontSize: '1.1rem'
            }}
          >
            {isSaving ? (
              <>
                <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                Saving...
              </>
            ) : (
              <>
                <Save size={20} />
                Save Settings
              </>
            )}
          </button>

          {saveStatus && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              style={{
                marginTop: '1rem',
                padding: '0.75rem 1.5rem',
                borderRadius: '8px',
                background: saveStatus === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                border: `1px solid ${saveStatus === 'success' ? 'rgba(16, 185, 129, 0.3)' : 'rgba(239, 68, 68, 0.3)'}`,
                color: saveStatus === 'success' ? '#10B981' : '#EF4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.5rem'
              }}
            >
              {saveStatus === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
              {saveStatus === 'success' ? 'Settings saved successfully!' : 'Failed to save settings. Please try again.'}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default Settings;
