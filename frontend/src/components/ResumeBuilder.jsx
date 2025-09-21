import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedNavbar from './EnhancedNavbar';
import { 
  Plus, 
  Trash2, 
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
  Star,
  Code,
  Users,
  Calendar,
  BookOpen,
  Target
} from 'lucide-react';

const ResumeBuilder = ({ onLogout }) => {
  const [resumeData, setResumeData] = useState({
    personalInfo: {
      fullName: 'JAY',
      email: 'jay.sample@email.com',
      phone: '(123) 456-7890',
      location: 'Mumbai, India',
      linkedin: 'https://linkedin.com/in/jay-dev',
      github: 'https://github.com/jay-dev'
    },
    education: [
      {
        id: 1,
        program: 'B.Tech. in Computer Science and Engineering',
        institute: 'Indian Institute of Technology, Bombay',
        cgpa: '8.85 / 10',
        year: '2025'
      },
      {
        id: 2,
        program: 'AISSE Class XII (CBSE)',
        institute: 'St. John\'s High School',
        cgpa: '96%',
        year: '2021'
      }
    ],
    experience: [
      {
        id: 1,
        company: 'Innovate Corp.',
        position: 'Software Development Engineer Intern',
        duration: 'May \'24 - Jul \'24',
        description: 'Developed a scalable microservice for real-time data processing, improving system efficiency by 20%.\nDesigned and implemented RESTful APIs for a new customer-facing analytics dashboard.\nWrote comprehensive unit and integration tests, increasing code coverage from 75% to 92%.'
      },
      {
        id: 2,
        company: 'Data Insights Ltd.',
        position: 'Machine Learning Intern',
        duration: 'Dec \'23 - Feb \'24',
        description: 'Built and trained a predictive model using Scikit-learn to forecast sales with 90% accuracy.\nPerformed exploratory data analysis on large datasets to identify key user behavior patterns.\nCreated data visualizations and dashboards using Matplotlib and Seaborn for team presentations.'
      }
    ],
    projects: [
      {
        id: 1,
        title: 'AI-Powered Chatbot',
        duration: 'Sep \'23 - Nov \'23',
        technologies: 'Natural Language Processing',
        description: 'Developed a customer service chatbot using NLP models to understand and respond to user queries.\nAchieved a 95% accuracy in intent recognition by fine-tuning a pre-trained language model.'
      },
      {
        id: 2,
        title: 'Real-Time Stock Market Dashboard',
        duration: 'Mar \'23 - May \'23',
        technologies: 'Web Development & Data Visualization',
        description: 'Created a dynamic web dashboard to visualize real-time stock market data using React and D3.js.\nIntegrated with a financial data API to fetch and display live stock prices and historical trends.'
      }
    ],
    skills: {
      programmingLanguages: 'Python, C++, Java, JavaScript, SQL',
      frameworks: 'React, Node.js, TensorFlow, PyTorch, Scikit-learn, Pandas',
      software: 'Git, Docker, MySQL, MongoDB',
      courses: 'Data Structures & Algorithms, Object-Oriented Programming, Operating Systems, Database Management Systems, Machine Learning, Artificial Intelligence, Computer Networks, Software Engineering'
    },
    achievements: [],
    positions: [
      {
        id: 1,
        title: 'Coordinator, Tech Fest',
        organization: 'IIT Bombay',
        duration: 'Jun \'23 - Mar \'24',
        description: 'Led a team of 15 students to organize the annual university tech festival with over 5000+ attendees.'
      },
      {
        id: 2,
        title: 'Mentor, Coding Club',
        organization: 'IIT Bombay',
        duration: 'Aug \'22 - May \'23',
        description: 'Mentored 20+ junior students in competitive programming and algorithm design.'
      }
    ],
    extracurricular: []
  });

  const [activeSection, setActiveSection] = useState('personal');
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);

  const sections = [
    { id: 'personal', label: 'Personal Info', icon: <User size={20} /> },
    { id: 'education', label: 'Education', icon: <GraduationCap size={20} /> },
    { id: 'experience', label: 'Experience', icon: <Briefcase size={20} /> },
    { id: 'projects', label: 'Projects', icon: <Code size={20} /> },
    { id: 'skills', label: 'Skills', icon: <BookOpen size={20} /> },
    { id: 'achievements', label: 'Achievements', icon: <Award size={20} /> },
    { id: 'positions', label: 'Positions', icon: <Target size={20} /> },
    { id: 'extracurricular', label: 'Extracurricular', icon: <Users size={20} /> }
  ];

  const updatePersonalInfo = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const addItem = (section) => {
    const newItem = {
      id: Date.now(),
      ...getDefaultItem(section)
    };
    setResumeData(prev => ({
      ...prev,
      [section]: [...prev[section], newItem]
    }));
  };

  const removeItem = (section, id) => {
    setResumeData(prev => ({
      ...prev,
      [section]: prev[section].filter(item => item.id !== id)
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

  const updateSkills = (field, value) => {
    setResumeData(prev => ({
      ...prev,
      skills: { ...prev.skills, [field]: value }
    }));
  };

  const getDefaultItem = (section) => {
    const defaults = {
      education: { program: '', institute: '', cgpa: '', year: '' },
      experience: { company: '', position: '', duration: '', description: '' },
      projects: { title: '', duration: '', description: '', technologies: '' },
      achievements: { title: '', year: '', description: '' },
      positions: { title: '', organization: '', duration: '', description: '' },
      extracurricular: { activity: '', description: '' }
    };
    return defaults[section] || {};
  };

  const downloadResume = async () => {
    setIsGenerating(true);
    try {
      // Create HTML content for PDF
      const htmlContent = generateResumeHTML();
      
      // Create a new window with the HTML content
      const printWindow = window.open('', '_blank');
      printWindow.document.write(htmlContent);
      printWindow.document.close();
      
      // Wait for content to load, then print
      printWindow.onload = () => {
        printWindow.print();
        printWindow.close();
      };
      
    } catch (error) {
      console.error('Error generating resume:', error);
      alert('Error generating resume. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };

  const generateResumeHTML = () => {
    return `
      <!DOCTYPE html>
      <html lang="en">
      <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${resumeData.personalInfo.fullName || 'Resume'}</title>
          <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 0;
                  padding: 20px;
                  background-color: #f4f4f4;
                  color: #333;
              }
              .resume-container {
                  max-width: 850px;
                  margin: auto;
                  background-color: #fff;
                  padding: 30px;
                  border: 1px solid #ddd;
                  box-shadow: 0 0 15px rgba(0,0,0,0.1);
              }
              .header {
                  text-align: center;
                  margin-bottom: 20px;
              }
              .header h1 {
                  margin: 0;
                  font-size: 2.5em;
                  letter-spacing: 2px;
              }
              .header p {
                  margin: 5px 0;
                  font-size: 0.9em;
              }
              .header a {
                  color: #333;
                  text-decoration: none;
              }
              .resume-table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-bottom: 20px;
              }
              .resume-table th, .resume-table td {
                  border: 1px solid #444;
                  padding: 8px;
                  text-align: left;
                  vertical-align: top;
              }
              .resume-table th {
                  background-color: #808080;
                  color: #fff;
                  font-size: 1.1em;
                  text-align: center;
              }
              .resume-table .col-1 { width: 40%; }
              .resume-table .col-2 { width: 40%; }
              .resume-table .col-3 { width: 20%; }
              .resume-table ul {
                  margin: 0;
                  padding-left: 20px;
              }
              .resume-table ul li {
                  margin-bottom: 5px;
              }
              .sub-heading {
                  font-weight: bold;
                  font-style: italic;
                  display: block;
                  margin-bottom: 5px;
              }
              @media print {
                  body { background-color: white; }
                  .resume-container { box-shadow: none; border: none; }
              }
          </style>
      </head>
      <body>
          <div class="resume-container">
              <div class="header">
                  <h1>${resumeData.personalInfo.fullName || 'YOUR NAME'}</h1>
                  <p>
                      <a href="mailto:${resumeData.personalInfo.email}">${resumeData.personalInfo.email}</a>
                      ${resumeData.personalInfo.phone ? ` | ${resumeData.personalInfo.phone}` : ''}
                      ${resumeData.personalInfo.linkedin ? ` | <a href="${resumeData.personalInfo.linkedin}">linkedin.com/in/yourprofile</a>` : ''}
                      ${resumeData.personalInfo.github ? ` | <a href="${resumeData.personalInfo.github}">github.com/yourusername</a>` : ''}
                  </p>
              </div>

              ${resumeData.education.length > 0 ? `
              <table class="resume-table">
                  <thead>
                      <tr>
                          <th colspan="4">EDUCATION AND SCHOLASTIC ACHIEVEMENTS</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${resumeData.education.map(edu => `
                          <tr>
                              <td class="col-1"><strong>${edu.program}</strong></td>
                              <td class="col-2">${edu.institute}</td>
                              <td class="col-3" style="text-align:center;">${edu.cgpa}</td>
                              <td class="col-3" style="text-align:center;">${edu.year}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
              ` : ''}

              ${resumeData.experience.length > 0 ? `
              <table class="resume-table">
                  <thead>
                      <tr>
                          <th colspan="3">PROFESSIONAL EXPERIENCE</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${resumeData.experience.map(exp => `
                          <tr>
                              <td class="col-1">
                                  <strong>${exp.position}</strong>
                                  <span class="sub-heading">${exp.company}</span>
                              </td>
                              <td class="col-2">
                                  <ul>
                                      ${exp.description.split('\n').map(line => `<li>${line}</li>`).join('')}
                                  </ul>
                              </td>
                              <td class="col-3" style="text-align:center;">${exp.duration}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
              ` : ''}

              ${resumeData.projects.length > 0 ? `
              <table class="resume-table">
                  <thead>
                      <tr>
                          <th colspan="3">PROJECTS</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${resumeData.projects.map(project => `
                          <tr>
                              <td class="col-1">
                                  <strong>${project.title}</strong>
                                  <span class="sub-heading">${project.technologies}</span>
                              </td>
                              <td class="col-2">
                                  <ul>
                                      ${project.description.split('\n').map(line => `<li>${line}</li>`).join('')}
                                  </ul>
                              </td>
                              <td class="col-3" style="text-align:center;">${project.duration}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
              ` : ''}

              ${(resumeData.skills.programmingLanguages || resumeData.skills.frameworks || resumeData.skills.software) ? `
              <table class="resume-table">
                  <thead>
                      <tr>
                          <th colspan="2">PROGRAMMING LANGUAGES AND SOFTWARE</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${resumeData.skills.programmingLanguages ? `
                          <tr>
                              <td style="width: 30%;"><strong>Programming Languages</strong></td>
                              <td>${resumeData.skills.programmingLanguages}</td>
                          </tr>
                      ` : ''}
                      ${resumeData.skills.frameworks ? `
                          <tr>
                              <td><strong>Software & Frameworks</strong></td>
                              <td>${resumeData.skills.frameworks}</td>
                          </tr>
                      ` : ''}
                  </tbody>
              </table>
              ` : ''}

              ${resumeData.skills.courses ? `
              <table class="resume-table">
                  <thead>
                      <tr>
                          <th colspan="4">COURSEWORK</th>
                      </tr>
                  </thead>
                  <tbody>
                      <tr>
                          <td>${resumeData.skills.courses}</td>
                      </tr>
                  </tbody>
              </table>
              ` : ''}

              ${resumeData.positions.length > 0 ? `
              <table class="resume-table">
                  <thead>
                      <tr>
                          <th colspan="3">POSITIONS OF RESPONSIBILITY</th>
                      </tr>
                  </thead>
                  <tbody>
                      ${resumeData.positions.map(pos => `
                          <tr>
                              <td class="col-1"><strong>${pos.title}</strong></td>
                              <td class="col-2">${pos.description}</td>
                              <td class="col-3" style="text-align:center;">${pos.duration}</td>
                          </tr>
                      `).join('')}
                  </tbody>
              </table>
              ` : ''}
          </div>
      </body>
      </html>
    `;
  };

    return (
    <div className="resume-builder">
      <EnhancedNavbar onLogout={onLogout} showUserMenu={true} />
      <div className="background-pattern"></div>
      <div className="background-glow"></div>
      
      {isPreviewMode ? (
        <div style={{ padding: '2rem', background: '#f5f5f5', minHeight: '100vh' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
            <h1 style={{ color: '#333', margin: 0 }}>Resume Preview</h1>
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
              Back to Editor
            </button>
          </div>
          <div style={{ 
            background: 'white', 
            color: 'black', 
            padding: '2rem', 
            fontFamily: 'Arial, sans-serif',
            maxWidth: '800px',
            margin: '0 auto',
            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '24px', fontWeight: 'bold', margin: 0 }}>
                {resumeData.personalInfo.fullName || 'Your Name'}
              </h1>
              <div style={{ marginTop: '0.5rem' }}>
                <span>{resumeData.personalInfo.email}</span>
                {resumeData.personalInfo.phone && <span> | {resumeData.personalInfo.phone}</span>}
                {resumeData.personalInfo.location && <span> | {resumeData.personalInfo.location}</span>}
        </div>
      </div>
            <div style={{ 
              background: '#f4f4f4',
              padding: '20px',
              fontFamily: 'Arial, sans-serif',
              color: '#333'
            }}>
              <div style={{
                maxWidth: '850px',
                margin: 'auto',
                backgroundColor: '#fff',
                padding: '30px',
                border: '1px solid #ddd',
                boxShadow: '0 0 15px rgba(0,0,0,0.1)'
              }}>
                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: '20px' }}>
                  <h1 style={{ margin: 0, fontSize: '2.5em', letterSpacing: '2px' }}>
                    {resumeData.personalInfo.fullName}
                  </h1>
                  <p style={{ margin: '5px 0', fontSize: '0.9em' }}>
                    <a href={`mailto:${resumeData.personalInfo.email}`} style={{ color: '#333', textDecoration: 'none' }}>
                      {resumeData.personalInfo.email}
                    </a>
                    {resumeData.personalInfo.phone && ` | ${resumeData.personalInfo.phone}`}
                    {resumeData.personalInfo.linkedin && (
                      <span> | <a href={resumeData.personalInfo.linkedin} style={{ color: '#333', textDecoration: 'none' }}>
                        linkedin.com/in/jay-dev
                      </a></span>
                    )}
                    {resumeData.personalInfo.github && (
                      <span> | <a href={resumeData.personalInfo.github} style={{ color: '#333', textDecoration: 'none' }}>
                        github.com/jay-dev
                      </a></span>
                    )}
                  </p>
                </div>

                {/* Education Section */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>
                      <th colSpan="4" style={{
                        border: '1px solid #444',
                        padding: '8px',
                        backgroundColor: '#808080',
                        color: '#fff',
                        fontSize: '1.1em',
                        textAlign: 'center'
                      }}>
                        EDUCATION AND SCHOLASTIC ACHIEVEMENTS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeData.education.map((edu, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '40%' }}>
                          <strong>{edu.program}</strong>
                        </td>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '40%' }}>
                          {edu.institute}
                        </td>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '10%', textAlign: 'center' }}>
                          {edu.cgpa}
                        </td>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '10%', textAlign: 'center' }}>
                          {edu.year}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Professional Experience */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>
                      <th colSpan="3" style={{
                        border: '1px solid #444',
                        padding: '8px',
                        backgroundColor: '#808080',
                        color: '#fff',
                        fontSize: '1.1em',
                        textAlign: 'center'
                      }}>
                        PROFESSIONAL EXPERIENCE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeData.experience.map((exp, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '30%' }}>
                          <strong>{exp.position}</strong>
                          <div style={{ fontWeight: 'bold', fontStyle: 'italic', marginTop: '5px' }}>
                            {exp.company}
                          </div>
                        </td>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '50%' }}>
                          <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {exp.description.split('\n').map((line, i) => (
                              <li key={i} style={{ marginBottom: '5px' }}>{line}</li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '20%', textAlign: 'center' }}>
                          {exp.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Projects */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>
                      <th colSpan="3" style={{
                        border: '1px solid #444',
                        padding: '8px',
                        backgroundColor: '#808080',
                        color: '#fff',
                        fontSize: '1.1em',
                        textAlign: 'center'
                      }}>
                        PROJECTS
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeData.projects.map((project, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '30%' }}>
                          <strong>{project.title}</strong>
                          <div style={{ fontWeight: 'bold', fontStyle: 'italic', marginTop: '5px' }}>
                            {project.technologies}
                          </div>
                        </td>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '50%' }}>
                          <ul style={{ margin: 0, paddingLeft: '20px' }}>
                            {project.description.split('\n').map((line, i) => (
                              <li key={i} style={{ marginBottom: '5px' }}>{line}</li>
                            ))}
                          </ul>
                        </td>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '20%', textAlign: 'center' }}>
                          {project.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {/* Skills */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>
                      <th colSpan="2" style={{
                        border: '1px solid #444',
                        padding: '8px',
                        backgroundColor: '#808080',
                        color: '#fff',
                        fontSize: '1.1em',
                        textAlign: 'center'
                      }}>
                        PROGRAMMING LANGUAGES AND SOFTWARE
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #444', padding: '8px', width: '30%' }}>
                        <strong>Programming Languages</strong>
                      </td>
                      <td style={{ border: '1px solid #444', padding: '8px', width: '70%' }}>
                        {resumeData.skills.programmingLanguages}
                      </td>
                    </tr>
                    <tr>
                      <td style={{ border: '1px solid #444', padding: '8px' }}>
                        <strong>Software & Frameworks</strong>
                      </td>
                      <td style={{ border: '1px solid #444', padding: '8px' }}>
                        {resumeData.skills.frameworks}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Coursework */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>
                      <th colSpan="4" style={{
                        border: '1px solid #444',
                        padding: '8px',
                        backgroundColor: '#808080',
                        color: '#fff',
                        fontSize: '1.1em',
                        textAlign: 'center'
                      }}>
                        COURSEWORK
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td style={{ border: '1px solid #444', padding: '8px' }}>
                        {resumeData.skills.courses}
                      </td>
                    </tr>
                  </tbody>
                </table>

                {/* Positions of Responsibility */}
                <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '20px' }}>
                  <thead>
                    <tr>
                      <th colSpan="3" style={{
                        border: '1px solid #444',
                        padding: '8px',
                        backgroundColor: '#808080',
                        color: '#fff',
                        fontSize: '1.1em',
                        textAlign: 'center'
                      }}>
                        POSITIONS OF RESPONSIBILITY
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {resumeData.positions.map((pos, index) => (
                      <tr key={index}>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '30%' }}>
                          <strong>{pos.title}</strong>
                        </td>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '50%' }}>
                          {pos.description}
                        </td>
                        <td style={{ border: '1px solid #444', padding: '8px', width: '20%', textAlign: 'center' }}>
                          {pos.duration}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      ) : (
      <div className="dashboard-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
          className="dashboard-header"
        >
          <h1 className="dashboard-title">Resume Builder</h1>
          <p className="dashboard-subtitle">
            Create a professional resume with our easy-to-use builder
          </p>
          <div style={{ 
                    display: 'flex',
            gap: '1rem', 
            marginTop: '2rem',
            justifyContent: 'center',
            flexWrap: 'wrap'
          }}>
            <motion.button
                onClick={() => setIsPreviewMode(true)}
                whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] } }}
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
                justifyContent: 'center',
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, box-shadow'
                }}
              >
                <Eye size={16} />
                Preview Resume
            </motion.button>
            
            <motion.button
              onClick={downloadResume}
              disabled={isGenerating}
                whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                whileTap={{ scale: 0.98, transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] } }}
                style={{
                background: isGenerating ? 'rgba(255, 255, 255, 0.1)' : '#4DB7FF',
                  border: 'none',
                  color: 'white',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                justifyContent: 'center',
                opacity: isGenerating ? 0.7 : 1,
                  transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                  willChange: 'transform, box-shadow, opacity'
              }}
            >
              {isGenerating ? (
                <>
                  <div className="spinner" style={{ width: '16px', height: '16px', borderWidth: '2px' }}></div>
                    Generating PDF...
                </>
              ) : (
                <>
                  <Download size={16} />
                  Download PDF
                </>
              )}
            </motion.button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
          className="settings-section"
        >
          <div style={{ display: 'flex', gap: '2rem', minHeight: '600px' }}>
            <div style={{ 
              width: '250px', 
              background: 'rgba(255, 255, 255, 0.05)', 
              borderRadius: '12px', 
              padding: '1.5rem',
                border: '1px solid rgba(77, 183, 255, 0.2)'
            }}>
              <h3 style={{ 
                color: '#ffffff', 
                fontSize: '1.1rem',
                  fontWeight: '600', 
                  marginBottom: '1rem'
              }}>
                Resume Sections
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {sections.map((section) => (
                  <motion.button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                      whileHover={{ scale: 1.02, y: -1, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                      whileTap={{ scale: 0.98, transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] } }}
                style={{
                      background: activeSection === section.id ? '#4DB7FF' : 'transparent',
                      border: 'none',
                      color: activeSection === section.id ? 'white' : '#cccccc',
                  padding: '0.75rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                      gap: '0.75rem',
                      textAlign: 'left',
                        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                        willChange: 'transform, background-color, color',
                      fontSize: '0.9rem'
                    }}
                  >
                    {section.icon}
                    {section.label}
                  </motion.button>
                ))}
                </div>
            </div>

            <div style={{ flex: 1, background: 'rgba(255, 255, 255, 0.05)', borderRadius: '12px', padding: '2rem', border: '1px solid rgba(77, 183, 255, 0.2)' }}>
              <AnimatePresence mode="wait">
          <motion.div
                  key={activeSection}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                >
            {activeSection === 'personal' && (
              <div>
                <h2 className="section-title">
                          <User size={24} />
                  Personal Information
                </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                  <div className="form-group">
                          <label className="form-label">Full Name *</label>
                    <input
                      type="text"
                      value={resumeData.personalInfo.fullName}
                      onChange={(e) => updatePersonalInfo('fullName', e.target.value)}
                      className="form-input"
                      placeholder="Enter your full name"
                            required
                    />
                  </div>
                  <div className="form-group">
                            <label className="form-label">Email Address *</label>
                    <input
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo('email', e.target.value)}
                      className="form-input"
                              placeholder="your.email@example.com"
                            required
                    />
                  </div>
                  <div className="form-group">
                            <label className="form-label">Phone Number</label>
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
                            <label className="form-label">LinkedIn Profile</label>
                    <input
                      type="url"
                      value={resumeData.personalInfo.linkedin}
                      onChange={(e) => updatePersonalInfo('linkedin', e.target.value)}
                      className="form-input"
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  </div>
                  <div className="form-group">
                            <label className="form-label">GitHub Profile</label>
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
                  {activeSection === 'education' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                  <h2 className="section-title">
                            <GraduationCap size={24} />
                          Education
                  </h2>
                        <motion.button
                            onClick={() => addItem('education')}
                            whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                            whileTap={{ scale: 0.98, transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] } }}
                    style={{
                            background: '#4DB7FF',
                      color: 'white',
                      border: 'none',
                      padding: '0.75rem 1.5rem',
                      borderRadius: '8px',
                            cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.5rem',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              willChange: 'transform, box-shadow'
                          }}
                        >
                          <Plus size={16} />
                          Add Education
                        </motion.button>
                      </div>
                      {resumeData.education.length === 0 ? (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                            style={{ textAlign: 'center', padding: '3rem', color: '#cccccc' }}
                        >
                          <GraduationCap size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                          <p>No education entries added yet. Add your academic background.</p>
                        </motion.div>
                      ) : (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                          {resumeData.education.map((edu, index) => (
                            <motion.div
                              key={edu.id}
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                              style={{
                                background: 'rgba(255, 255, 255, 0.05)',
                                border: '1px solid rgba(77, 183, 255, 0.2)',
                                borderRadius: '12px',
                                padding: '1.5rem'
                              }}
                            >
                              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                <h3 style={{ color: '#ffffff', margin: 0 }}>Education Entry</h3>
                                <motion.button
                                  onClick={() => removeItem('education', edu.id)}
                                  whileHover={{ scale: 1.1 }}
                                  whileTap={{ scale: 0.9 }}
                                  style={{
                                      background: 'none',
                        border: 'none',
                                      color: '#ff6b6b',
                            cursor: 'pointer',
                                      padding: '0.25rem'
                          }}
                        >
                          <Trash2 size={16} />
                                </motion.button>
                      </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                  <div className="form-group">
                                    <label className="form-label">Program/Degree *</label>
                                    <input
                                      type="text"
                                      value={edu.program}
                                      onChange={(e) => updateSection('education', edu.id, 'program', e.target.value)}
                                      className="form-input"
                                      placeholder="B.Tech in Computer Science"
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Institute *</label>
                                  <input
                                    type="text"
                                      value={edu.institute}
                                      onChange={(e) => updateSection('education', edu.id, 'institute', e.target.value)}
                                    className="form-input"
                                      placeholder="IIT Madras"
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">CGPA/Percentage</label>
                                  <input
                                    type="text"
                                      value={edu.cgpa}
                                      onChange={(e) => updateSection('education', edu.id, 'cgpa', e.target.value)}
                                    className="form-input"
                                      placeholder="8.25/10 or 95%"
                                  />
                                </div>
                                <div className="form-group">
                                    <label className="form-label">Year</label>
                                  <input
                                    type="text"
                                      value={edu.year}
                                      onChange={(e) => updateSection('education', edu.id, 'year', e.target.value)}
                                    className="form-input"
                                      placeholder="2024"
                                  />
                                </div>
                              </div>
                            </motion.div>
                          ))}
                        </div>
                      )}
                    </div>
                  )}
                  {activeSection === 'skills' && (
                    <div>
                        <h2 className="section-title">
                          <BookOpen size={24} />
                          Skills & Coursework
                        </h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
                                <div className="form-group">
                            <label className="form-label">Programming Languages</label>
                                  <input
                                    type="text"
                              value={resumeData.skills.programmingLanguages}
                              onChange={(e) => updateSkills('programmingLanguages', e.target.value)}
                                    className="form-input"
                              placeholder="Python, C++, Java, JavaScript, SQL"
                                  />
                                </div>
                                <div className="form-group">
                            <label className="form-label">Frameworks & Libraries</label>
                                  <input
                                    type="text"
                              value={resumeData.skills.frameworks}
                              onChange={(e) => updateSkills('frameworks', e.target.value)}
                                    className="form-input"
                              placeholder="TensorFlow, PyTorch, React, Node.js, Django"
                                  />
                                </div>
                                <div className="form-group">
                            <label className="form-label">Software & Tools</label>
                                  <input
                                    type="text"
                              value={resumeData.skills.software}
                              onChange={(e) => updateSkills('software', e.target.value)}
                                    className="form-input"
                              placeholder="AutoCAD, Arduino IDE, Proteus, MySQL, Git"
                                  />
                                </div>
                                <div className="form-group">
                            <label className="form-label">Relevant Courses</label>
                                  <textarea
                              value={resumeData.skills.courses}
                              onChange={(e) => updateSkills('courses', e.target.value)}
                              className="textarea-input"
                              placeholder="Machine Learning, Data Structures, Algorithms, etc."
                                    rows={3}
                                  />
                                </div>
                              </div>
                        </div>
                      )}
                    {activeSection === 'experience' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <h2 className="section-title">
                            <Briefcase size={24} />
                            Professional Experience
                          </h2>
                          <motion.button
                            onClick={() => addItem('experience')}
                            whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                            whileTap={{ scale: 0.98, transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] } }}
                            style={{
                              background: '#4DB7FF',
                              color: 'white',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              willChange: 'transform, box-shadow'
                            }}
                          >
                            <Plus size={16} />
                            Add Experience
                          </motion.button>
                        </div>
                        {resumeData.experience.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                            style={{ textAlign: 'center', padding: '3rem', color: '#cccccc' }}
                          >
                            <Briefcase size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>No work experience added yet. Add your professional background.</p>
                          </motion.div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {resumeData.experience.map((exp, index) => (
                              <motion.div
                                key={exp.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(77, 183, 255, 0.2)',
                                  borderRadius: '12px',
                                  padding: '1.5rem'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                  <h3 style={{ color: '#ffffff', margin: 0 }}>Experience Entry</h3>
                                  <motion.button
                                    onClick={() => removeItem('experience', exp.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#ff6b6b',
                                      cursor: 'pointer',
                                      padding: '0.25rem'
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </motion.button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                  <div className="form-group">
                                    <label className="form-label">Company/Organization *</label>
                                    <input
                                      type="text"
                                      value={exp.company}
                                      onChange={(e) => updateSection('experience', exp.id, 'company', e.target.value)}
                                      className="form-input"
                                      placeholder="Company Name"
                                      required
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label className="form-label">Position/Title *</label>
                                    <input
                                      type="text"
                                      value={exp.position}
                                      onChange={(e) => updateSection('experience', exp.id, 'position', e.target.value)}
                                      className="form-input"
                                      placeholder="Software Engineer"
                                      required
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label className="form-label">Duration</label>
                                    <input
                                      type="text"
                                      value={exp.duration}
                                      onChange={(e) => updateSection('experience', exp.id, 'duration', e.target.value)}
                                      className="form-input"
                                      placeholder="May 2023 - Jul 2023"
                                    />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Description & Achievements</label>
                                  <textarea
                                    value={exp.description}
                                    onChange={(e) => updateSection('experience', exp.id, 'description', e.target.value)}
                                    className="textarea-input"
                                    placeholder="Describe your responsibilities and achievements..."
                                    rows={4}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {activeSection === 'projects' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <h2 className="section-title">
                            <Code size={24} />
                            Projects
                          </h2>
                          <motion.button
                            onClick={() => addItem('projects')}
                            whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                            whileTap={{ scale: 0.98, transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] } }}
                            style={{
                              background: '#4DB7FF',
                              color: 'white',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              willChange: 'transform, box-shadow'
                            }}
                          >
                            <Plus size={16} />
                            Add Project
                          </motion.button>
                        </div>
                        {resumeData.projects.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                            style={{ textAlign: 'center', padding: '3rem', color: '#cccccc' }}
                          >
                            <Code size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>No projects added yet. Showcase your technical skills and achievements.</p>
                          </motion.div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {resumeData.projects.map((project, index) => (
                              <motion.div
                                key={project.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(77, 183, 255, 0.2)',
                                  borderRadius: '12px',
                                  padding: '1.5rem'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                  <h3 style={{ color: '#ffffff', margin: 0 }}>Project Entry</h3>
                                  <motion.button
                                    onClick={() => removeItem('projects', project.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#ff6b6b',
                                      cursor: 'pointer',
                                      padding: '0.25rem'
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </motion.button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                  <div className="form-group">
                                    <label className="form-label">Project Title *</label>
                                    <input
                                      type="text"
                                      value={project.title}
                                      onChange={(e) => updateSection('projects', project.id, 'title', e.target.value)}
                                      className="form-input"
                                      placeholder="Machine Learning Project"
                                      required
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label className="form-label">Duration</label>
                                    <input
                                      type="text"
                                      value={project.duration}
                                      onChange={(e) => updateSection('projects', project.id, 'duration', e.target.value)}
                                      className="form-input"
                                      placeholder="Feb 2023 - Mar 2023"
                                    />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Technologies Used</label>
                                  <input
                                    type="text"
                                    value={project.technologies}
                                    onChange={(e) => updateSection('projects', project.id, 'technologies', e.target.value)}
                                    className="form-input"
                                    placeholder="Python, TensorFlow, OpenCV, etc."
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Description & Achievements</label>
                                  <textarea
                                    value={project.description}
                                    onChange={(e) => updateSection('projects', project.id, 'description', e.target.value)}
                                    className="textarea-input"
                                    placeholder="Describe your project, technologies used, and key achievements..."
                                    rows={4}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {activeSection === 'positions' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <h2 className="section-title">
                            <Target size={24} />
                            Positions of Responsibility
                          </h2>
                          <motion.button
                            onClick={() => addItem('positions')}
                            whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                            whileTap={{ scale: 0.98, transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] } }}
                            style={{
                              background: '#4DB7FF',
                              color: 'white',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              willChange: 'transform, box-shadow'
                            }}
                          >
                            <Plus size={16} />
                            Add Position
                          </motion.button>
                        </div>
                        {resumeData.positions.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                            style={{ textAlign: 'center', padding: '3rem', color: '#cccccc' }}
                          >
                            <Target size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>No positions added yet. Add your leadership roles and responsibilities.</p>
                          </motion.div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {resumeData.positions.map((pos, index) => (
                              <motion.div
                                key={pos.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(77, 183, 255, 0.2)',
                                  borderRadius: '12px',
                                  padding: '1.5rem'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                  <h3 style={{ color: '#ffffff', margin: 0 }}>Position Entry</h3>
                                  <motion.button
                                    onClick={() => removeItem('positions', pos.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#ff6b6b',
                                      cursor: 'pointer',
                                      padding: '0.25rem'
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </motion.button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                  <div className="form-group">
                                    <label className="form-label">Position Title *</label>
                                    <input
                                      type="text"
                                      value={pos.title}
                                      onChange={(e) => updateSection('positions', pos.id, 'title', e.target.value)}
                                      className="form-input"
                                      placeholder="Coordinator, Tech Fest"
                                      required
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label className="form-label">Organization</label>
                                    <input
                                      type="text"
                                      value={pos.organization}
                                      onChange={(e) => updateSection('positions', pos.id, 'organization', e.target.value)}
                                      className="form-input"
                                      placeholder="IIT Bombay"
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label className="form-label">Duration</label>
                                    <input
                                      type="text"
                                      value={pos.duration}
                                      onChange={(e) => updateSection('positions', pos.id, 'duration', e.target.value)}
                                      className="form-input"
                                      placeholder="Jun 2023 - Mar 2024"
                                    />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Description</label>
                                  <textarea
                                    value={pos.description}
                                    onChange={(e) => updateSection('positions', pos.id, 'description', e.target.value)}
                                    className="textarea-input"
                                    placeholder="Describe your role and responsibilities..."
                                    rows={3}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {activeSection === 'achievements' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <h2 className="section-title">
                            <Award size={24} />
                            Achievements
                          </h2>
                          <motion.button
                            onClick={() => addItem('achievements')}
                            whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                            whileTap={{ scale: 0.98, transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] } }}
                            style={{
                              background: '#4DB7FF',
                              color: 'white',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              willChange: 'transform, box-shadow'
                            }}
                          >
                            <Plus size={16} />
                            Add Achievement
                          </motion.button>
                        </div>
                        {resumeData.achievements.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                            style={{ textAlign: 'center', padding: '3rem', color: '#cccccc' }}
                          >
                            <Award size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>No achievements added yet. Add your awards and accomplishments.</p>
                          </motion.div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {resumeData.achievements.map((ach, index) => (
                              <motion.div
                                key={ach.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(77, 183, 255, 0.2)',
                                  borderRadius: '12px',
                                  padding: '1.5rem'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                  <h3 style={{ color: '#ffffff', margin: 0 }}>Achievement Entry</h3>
                                  <motion.button
                                    onClick={() => removeItem('achievements', ach.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#ff6b6b',
                                      cursor: 'pointer',
                                      padding: '0.25rem'
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </motion.button>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                  <div className="form-group">
                                    <label className="form-label">Achievement Title *</label>
                                    <input
                                      type="text"
                                      value={ach.title}
                                      onChange={(e) => updateSection('achievements', ach.id, 'title', e.target.value)}
                                      className="form-input"
                                      placeholder="Dean's Merit Scholarship"
                                      required
                                    />
                                  </div>
                                  <div className="form-group">
                                    <label className="form-label">Year</label>
                                    <input
                                      type="text"
                                      value={ach.year}
                                      onChange={(e) => updateSection('achievements', ach.id, 'year', e.target.value)}
                                      className="form-input"
                                      placeholder="2023"
                                    />
                                  </div>
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Description</label>
                                  <textarea
                                    value={ach.description}
                                    onChange={(e) => updateSection('achievements', ach.id, 'description', e.target.value)}
                                    className="textarea-input"
                                    placeholder="Describe your achievement..."
                                    rows={3}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    {activeSection === 'extracurricular' && (
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                          <h2 className="section-title">
                            <Users size={24} />
                            Extra-Curricular Activities
                          </h2>
                          <motion.button
                            onClick={() => addItem('extracurricular')}
                            whileHover={{ scale: 1.02, y: -2, transition: { duration: 0.2, ease: [0.4, 0, 0.2, 1] } }}
                            whileTap={{ scale: 0.98, transition: { duration: 0.1, ease: [0.4, 0, 0.2, 1] } }}
                            style={{
                              background: '#4DB7FF',
                              color: 'white',
                              border: 'none',
                              padding: '0.75rem 1.5rem',
                              borderRadius: '8px',
                              cursor: 'pointer',
                              display: 'flex',
                              alignItems: 'center',
                              gap: '0.5rem',
                              transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                              willChange: 'transform, box-shadow'
                            }}
                          >
                            <Plus size={16} />
                            Add Activity
                          </motion.button>
                        </div>
                        {resumeData.extracurricular.length === 0 ? (
                          <motion.div
                            initial={{ opacity: 0, scale: 0.9 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.4, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                            style={{ textAlign: 'center', padding: '3rem', color: '#cccccc' }}
                          >
                            <Users size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
                            <p>No activities added yet. Add your extracurricular activities.</p>
                          </motion.div>
                        ) : (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                            {resumeData.extracurricular.map((extra, index) => (
                              <motion.div
                                key={extra.id}
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.4, delay: index * 0.1, ease: [0.4, 0, 0.2, 1], willChange: 'opacity, transform' }}
                                style={{
                                  background: 'rgba(255, 255, 255, 0.05)',
                                  border: '1px solid rgba(77, 183, 255, 0.2)',
                                  borderRadius: '12px',
                                  padding: '1.5rem'
                                }}
                              >
                                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                                  <h3 style={{ color: '#ffffff', margin: 0 }}>Activity Entry</h3>
                                  <motion.button
                                    onClick={() => removeItem('extracurricular', extra.id)}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    style={{
                                      background: 'none',
                                      border: 'none',
                                      color: '#ff6b6b',
                                      cursor: 'pointer',
                                      padding: '0.25rem'
                                    }}
                                  >
                                    <Trash2 size={16} />
                                  </motion.button>
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Activity Name *</label>
                                  <input
                                    type="text"
                                    value={extra.activity}
                                    onChange={(e) => updateSection('extracurricular', extra.id, 'activity', e.target.value)}
                                    className="form-input"
                                    placeholder="Sports, Music, Volunteering, etc."
                                    required
                                  />
                                </div>
                                <div className="form-group">
                                  <label className="form-label">Description</label>
                                  <textarea
                                    value={extra.description}
                                    onChange={(e) => updateSection('extracurricular', extra.id, 'description', e.target.value)}
                                    className="textarea-input"
                                    placeholder="Describe your involvement and achievements..."
                                    rows={3}
                                  />
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                        </motion.div>
                </AnimatePresence>
                                </div>
                              </div>
                            </motion.div>
                        </div>
                      )}
    </div>
  );
};

export default ResumeBuilder;