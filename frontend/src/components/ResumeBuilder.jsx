import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedNavbar from './EnhancedNavbar';
import { 
  Plus, 
  Trash2, 
  Save, 
  Download, 
  Eye, 
  FileText,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  GraduationCap,
  Award,
  Brain,
  Edit,
  CheckCircle
} from 'lucide-react';

const ResumeBuilder = ({ onLogout }) => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
      website: ''
    },
    summary: '',
    experience: [],
    education: [],
    skills: [],
    projects: [],
    certifications: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [activeSection, setActiveSection] = useState('personal');

  const addExperience = () => {
    const newExperience = {
      id: Date.now(),
      company: '',
      position: '',
      location: '',
      startDate: '',
      endDate: '',
      current: false,
      description: '',
      achievements: []
    };
    setResumeData(prev => ({
      ...prev,
      experience: [...prev.experience, newExperience]
    }));
  };

  const addEducation = () => {
    const newEducation = {
      id: Date.now(),
      institution: '',
      degree: '',
      field: '',
      location: '',
      startDate: '',
      endDate: '',
      gpa: '',
      achievements: []
    };
    setResumeData(prev => ({
      ...prev,
      education: [...prev.education, newEducation]
    }));
  };

  const addProject = () => {
    const newProject = {
      id: Date.now(),
      name: '',
      description: '',
      technologies: [],
      link: '',
      github: ''
    };
    setResumeData(prev => ({
      ...prev,
      projects: [...prev.projects, newProject]
    }));
  };

  const addSkill = () => {
    const newSkill = {
      id: Date.now(),
      name: '',
      level: 'Intermediate'
    };
    setResumeData(prev => ({
      ...prev,
      skills: [...prev.skills, newSkill]
    }));
  };

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: {
        ...prev.personalInfo,
        [field]: value
      }
    }));
  };

  const updateSection = (section, id, field, value) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].map(item => 
        item.id === id ? { ...item, [field]: value } : item
      )
    }));
  };

  const removeItem = (section, id) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
    }));
  };

  const generateWithAI = async (section) => {
    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      if (section === 'summary') {
        setResumeData(prev => ({
          ...prev,
          summary: `Experienced software developer with 5+ years of expertise in full-stack development, specializing in React, Node.js, and cloud technologies. Proven track record of delivering scalable solutions and leading cross-functional teams. Passionate about creating innovative applications that solve real-world problems.`
        }));
      } else if (section === 'skills') {
        const generatedSkills = [
          { id: Date.now() + 1, name: 'JavaScript', level: 'Expert' },
          { id: Date.now() + 2, name: 'React', level: 'Expert' },
          { id: Date.now() + 3, name: 'Node.js', level: 'Advanced' },
          { id: Date.now() + 4, name: 'Python', level: 'Intermediate' },
          { id: Date.now() + 5, name: 'AWS', level: 'Intermediate' }
        ];
        setResumeData(prev => ({
          ...prev,
          skills: [...prev.skills, ...generatedSkills]
        }));
      }
      setIsGenerating(false);
    }, 2000);
  };

  const saveResume = () => {
    console.log('Saving resume:', resumeData);
    alert('Resume saved successfully!');
  };

  const downloadResume = () => {
    // In a real app, this would generate a PDF
    alert('Resume download feature coming soon!');
  };

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: <User size={20} /> },
    { id: 'summary', label: 'Summary', icon: <FileText size={20} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={20} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={20} /> },
    { id: 'skills', label: 'Skills', icon: <Award size={20} /> },
    { id: 'projects', label: 'Projects', icon: <FileText size={20} /> }
  ];

  if (isPreviewMode) {
    return (
      <div className="dashboard">
        <EnhancedNavbar onLogout={onLogout} showUserMenu={true} />
        <div className="background-pattern"></div>
        <div className="background-glow"></div>
        
        <div className="dashboard-content">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              background: 'white',
              color: '#333',
              padding: '3rem',
              borderRadius: '12px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '2rem', fontWeight: '700', color: '#333' }}>
                Resume Preview
              </h1>
              <button
                onClick={() => setIsPreviewMode(false)}
                style={{
                  background: '#4DB7FF',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Edit Resume
              </button>
            </div>

            {/* Resume Content */}
            <div style={{ lineHeight: '1.6' }}>
              {/* Header */}
              <div style={{ textAlign: 'center', marginBottom: '2rem', borderBottom: '2px solid #4DB7FF', paddingBottom: '1rem' }}>
                <h1 style={{ fontSize: '2.5rem', fontWeight: '700', marginBottom: '0.5rem' }}>
                  {resumeData.personalInfo.fullName || 'Your Name'}
                </h1>
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
                  {resumeData.personalInfo.email && <span>{resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && <span>{resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && <span>{resumeData.personalInfo.location}</span>}
                </div>
              </div>

              {/* Summary */}
              {resumeData.summary && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#4DB7FF' }}>
                    Professional Summary
                  </h2>
                  <p>{resumeData.summary}</p>
                </div>
              )}

              {/* Experience */}
              {resumeData.experience.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#4DB7FF' }}>
                    Professional Experience
                  </h2>
                  {resumeData.experience.map((exp, index) => (
                    <div key={exp.id} style={{ marginBottom: '1.5rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                        <div>
                          <h3 style={{ fontSize: '1.2rem', fontWeight: '600' }}>{exp.position}</h3>
                          <p style={{ color: '#666' }}>{exp.company} • {exp.location}</p>
                        </div>
                        <span style={{ color: '#666' }}>
                          {exp.startDate} - {exp.current ? 'Present' : exp.endDate}
                        </span>
                      </div>
                      {exp.description && <p>{exp.description}</p>}
                    </div>
                  ))}
                </div>
              )}

              {/* Skills */}
              {resumeData.skills.length > 0 && (
                <div style={{ marginBottom: '2rem' }}>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: '600', marginBottom: '1rem', color: '#4DB7FF' }}>
                    Skills
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
                    {resumeData.skills.map((skill) => (
                      <span
                        key={skill.id}
                        style={{
                          background: '#4DB7FF',
                          color: 'white',
                          padding: '0.25rem 0.75rem',
                          borderRadius: '20px',
                          fontSize: '0.9rem'
                        }}
                      >
                        {skill.name}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      <Navbar onLogout={onLogout} />
      <div className="background-pattern"></div>
      <div className="background-glow"></div>
      
      <div className="dashboard-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="dashboard-header"
        >
          <h1 className="dashboard-title">Resume Builder</h1>
          <p className="dashboard-subtitle">
            Create a professional resume with AI-powered suggestions and templates
          </p>
        </motion.div>

        <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '2rem' }}>
          {/* Sidebar */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(77, 183, 255, 0.2)',
              borderRadius: '16px',
              padding: '1.5rem',
              height: 'fit-content'
            }}
          >
            <h3 style={{ fontSize: '1.2rem', fontWeight: '600', marginBottom: '1.5rem', color: '#ffffff' }}>
              Resume Sections
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.75rem',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: 'none',
                    background: activeSection === section.id ? 'rgba(77, 183, 255, 0.2)' : 'transparent',
                    color: activeSection === section.id ? '#4DB7FF' : '#cccccc',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.3s ease'
                  }}
                >
                  {section.icon}
                  {section.label}
                </button>
              ))}
            </div>

            <div style={{ marginTop: '2rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <button
                onClick={() => setIsPreviewMode(true)}
                style={{
                  background: 'rgba(16, 185, 129, 0.1)',
                  border: '1px solid #10B981',
                  color: '#10B981',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}
              >
                <Eye size={16} />
                Preview
              </button>
              
              <button
                onClick={saveResume}
                style={{
                  background: '#4DB7FF',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}
              >
                <Save size={16} />
                Save
              </button>
              
              <button
                onClick={downloadResume}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(77, 183, 255, 0.3)',
                  color: '#4DB7FF',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  justifyContent: 'center'
                }}
              >
                <Download size={16} />
                Download
              </button>
            </div>
          </motion.div>

          {/* Main Content */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="settings-section"
          >
            {activeSection === 'personal' && (
              <div>
                <h2 className="section-title">
                  <User size={24} style={{ marginRight: '0.5rem' }} />
                  Personal Information
                </h2>
                
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div className="form-group">
                    <label className="form-label">Full Name</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      className="form-input"
                      placeholder="Enter your full name"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Email</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="form-input"
                      placeholder="your.email@example.com"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Phone</label>
                    <input
                      type="tel"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo('phone', e.target.value)}
                      className="form-input"
                      placeholder="+1 (555) 123-4567"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">Location</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo('location', e.target.value)}
                      className="form-input"
                      placeholder="City, State"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">LinkedIn</label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      className="form-input"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  
                  <div className="form-group">
                    <label className="form-label">GitHub</label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.github}
                      onChange={(e) => updatePersonalInfo('github', e.target.value)}
                      className="form-input"
                      placeholder="https://github.com/yourusername"
                    />
                  </div>
                </div>
              </div>
            )}

            {activeSection === 'summary' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 className="section-title">
                    <FileText size={24} style={{ marginRight: '0.5rem' }} />
                    Professional Summary
                  </h2>
                  <button
                    onClick={() => generateWithAI('summary')}
                    disabled={isGenerating}
                    style={{
                      background: isGenerating ? 'rgba(255, 255, 255, 0.1)' : '#4DB7FF',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                      cursor: isGenerating ? 'not-allowed' : 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                      opacity: isGenerating ? 0.7 : 1
                    }}
                  >
                    {isGenerating ? (
                      <>
                        <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                        Generating...
                      </>
                    ) : (
                      <>
                        <Brain size={16} />
                        Generate with AI
                      </>
                    )}
                  </button>
                </div>
                
                <div className="form-group">
                  <label className="form-label">Summary</label>
                  <textarea
                    value={resumeData.summary}
                    onChange={(e) => setResumeData(prev => ({ ...prev, summary: e.target.value }))}
                    className="form-input"
                    placeholder="Write a compelling professional summary that highlights your key strengths and career objectives..."
                    rows={6}
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>
            )}

            {activeSection === 'skills' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 className="section-title">
                    <Award size={24} style={{ marginRight: '0.5rem' }} />
                    Skills
                  </h2>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <button
                      onClick={() => generateWithAI('skills')}
                      disabled={isGenerating}
                      style={{
                        background: isGenerating ? 'rgba(255, 255, 255, 0.1)' : '#4DB7FF',
                        color: 'white',
                        border: 'none',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: isGenerating ? 'not-allowed' : 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        opacity: isGenerating ? 0.7 : 1
                      }}
                    >
                      {isGenerating ? (
                        <>
                          <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                          Generating...
                        </>
                      ) : (
                        <>
                          <Brain size={16} />
                          Generate with AI
                        </>
                      )}
                    </button>
                    
                    <button
                      onClick={addSkill}
                      style={{
                        background: 'rgba(255, 255, 255, 0.1)',
                        border: '1px solid rgba(77, 183, 255, 0.3)',
                        color: '#4DB7FF',
                        padding: '0.75rem 1.5rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem'
                      }}
                    >
                      <Plus size={16} />
                      Add Skill
                    </button>
                  </div>
                </div>

                {resumeData.skills.length === 0 ? (
                  <div style={{
                    textAlign: 'center',
                    padding: '3rem',
                    color: '#cccccc',
                    background: 'rgba(255, 255, 255, 0.05)',
                    borderRadius: '12px',
                    border: '1px dashed rgba(77, 183, 255, 0.3)'
                  }}>
                    <Award size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                    <p>No skills added yet. Add skills manually or generate them with AI.</p>
                  </div>
                ) : (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {resumeData.skills.map((skill) => (
                      <div
                        key={skill.id}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '1rem',
                          padding: '1rem',
                          background: 'rgba(255, 255, 255, 0.05)',
                          border: '1px solid rgba(77, 183, 255, 0.2)',
                          borderRadius: '8px'
                        }}
                      >
                        <input
                          type="text"
                          value={skill.name}
                          onChange={(e) => updateSection('skills', skill.id, 'name', e.target.value)}
                          className="form-input"
                          placeholder="Skill name"
                          style={{ flex: 1 }}
                        />
                        <select
                          value={skill.level}
                          onChange={(e) => updateSection('skills', skill.id, 'level', e.target.value)}
                          className="model-select"
                          style={{ width: '150px' }}
                        >
                          <option value="Beginner">Beginner</option>
                          <option value="Intermediate">Intermediate</option>
                          <option value="Advanced">Advanced</option>
                          <option value="Expert">Expert</option>
                        </select>
                        <button
                          onClick={() => removeItem('skills', skill.id)}
                          style={{
                            background: 'rgba(239, 68, 68, 0.1)',
                            border: '1px solid #EF4444',
                            color: '#EF4444',
                            padding: '0.5rem',
                            borderRadius: '6px',
                            cursor: 'pointer'
                          }}
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Add other sections similarly */}
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default ResumeBuilder;
