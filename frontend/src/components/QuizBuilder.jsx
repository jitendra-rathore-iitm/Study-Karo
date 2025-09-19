import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import { 
  Plus, 
  Trash2, 
  Play, 
  Save, 
  Upload, 
  Brain, 
  BookOpen,
  Clock,
  Target,
  CheckCircle,
  XCircle,
  RotateCcw
} from 'lucide-react';

const QuizBuilder = ({ onLogout }) => {
  const [quizData, setQuizData] = useState({
    title: '',
    description: '',
    sourceText: '',
    questions: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);

  const addQuestion = () => {
    const newQuestion = {
      id: Date.now(),
      question: '',
      options: ['', '', '', ''],
      correctAnswer: 0,
      explanation: ''
    };
    setQuizData(prev => ({
      ...prev,
      questions: [...prev.questions, newQuestion]
    }));
  };

  const updateQuestion = (questionId, field, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? { ...q, [field]: value } : q
      )
    }));
  };

  const updateOption = (questionId, optionIndex, value) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.map(q => 
        q.id === questionId ? {
          ...q,
          options: q.options.map((opt, idx) => idx === optionIndex ? value : opt)
        } : q
      )
    }));
  };

  const removeQuestion = (questionId) => {
    setQuizData(prev => ({
      ...prev,
      questions: prev.questions.filter(q => q.id !== questionId)
    }));
  };

  const generateQuestions = async () => {
    if (!quizData.sourceText.trim()) {
      alert('Please provide source text to generate questions');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const generatedQuestions = [
        {
          id: Date.now() + 1,
          question: 'What is the main purpose of React hooks?',
          options: [
            'To manage state in functional components',
            'To replace class components entirely',
            'To improve performance',
            'To handle routing'
          ],
          correctAnswer: 0,
          explanation: 'React hooks allow you to use state and other React features in functional components.'
        },
        {
          id: Date.now() + 2,
          question: 'Which hook is used to perform side effects?',
          options: [
            'useState',
            'useEffect',
            'useContext',
            'useReducer'
          ],
          correctAnswer: 1,
          explanation: 'useEffect is used to perform side effects like data fetching, subscriptions, or manually changing the DOM.'
        }
      ];

      setQuizData(prev => ({
        ...prev,
        questions: [...prev.questions, ...generatedQuestions]
      }));
      setIsGenerating(false);
    }, 3000);
  };

  const saveQuiz = () => {
    // Simulate saving to backend
    console.log('Saving quiz:', quizData);
    alert('Quiz saved successfully!');
  };

  const startQuiz = () => {
    if (quizData.questions.length === 0) {
      alert('Please add at least one question');
      return;
    }
    setIsPreviewMode(true);
    setCurrentQuestionIndex(0);
  };

  const nextQuestion = () => {
    if (currentQuestionIndex < quizData.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const prevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  if (isPreviewMode) {
    const currentQuestion = quizData.questions[currentQuestionIndex];
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
            style={{
              maxWidth: '800px',
              margin: '0 auto',
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(77, 183, 255, 0.2)',
              borderRadius: '20px',
              padding: '2rem'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff' }}>
                Quiz Preview
              </h1>
              <button
                onClick={() => setIsPreviewMode(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(77, 183, 255, 0.3)',
                  color: '#4DB7FF',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Exit Preview
              </button>
            </div>

            <div style={{ marginBottom: '2rem' }}>
              <div style={{ 
                background: 'rgba(77, 183, 255, 0.1)', 
                padding: '0.5rem 1rem', 
                borderRadius: '20px', 
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                Question {currentQuestionIndex + 1} of {quizData.questions.length}
              </div>
              
              <h2 style={{ fontSize: '1.25rem', fontWeight: '600', color: '#ffffff', marginBottom: '1.5rem' }}>
                {currentQuestion.question}
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {currentQuestion.options.map((option, index) => (
                  <div
                    key={index}
                    style={{
                      padding: '1rem',
                      border: '1px solid rgba(77, 183, 255, 0.3)',
                      borderRadius: '8px',
                      background: 'rgba(255, 255, 255, 0.05)',
                      cursor: 'pointer',
                      transition: 'all 0.3s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#4DB7FF';
                      e.target.style.background = 'rgba(77, 183, 255, 0.1)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = 'rgba(77, 183, 255, 0.3)';
                      e.target.style.background = 'rgba(255, 255, 255, 0.05)';
                    }}
                  >
                    {String.fromCharCode(65 + index)}. {option}
                  </div>
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={prevQuestion}
                disabled={currentQuestionIndex === 0}
                style={{
                  background: currentQuestionIndex === 0 ? 'rgba(255, 255, 255, 0.1)' : '#4DB7FF',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: currentQuestionIndex === 0 ? 'not-allowed' : 'pointer',
                  opacity: currentQuestionIndex === 0 ? 0.5 : 1
                }}
              >
                Previous
              </button>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={() => {
                    alert('Correct answer: ' + String.fromCharCode(65 + currentQuestion.correctAnswer));
                  }}
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid #10B981',
                    color: '#10B981',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer'
                  }}
                >
                  Show Answer
                </button>
                
                <button
                  onClick={nextQuestion}
                  disabled={currentQuestionIndex === quizData.questions.length - 1}
                  style={{
                    background: currentQuestionIndex === quizData.questions.length - 1 ? 'rgba(255, 255, 255, 0.1)' : '#4DB7FF',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: currentQuestionIndex === quizData.questions.length - 1 ? 'not-allowed' : 'pointer',
                    opacity: currentQuestionIndex === quizData.questions.length - 1 ? 0.5 : 1
                  }}
                >
                  Next
                </button>
              </div>
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
          <h1 className="dashboard-title">Quiz Builder</h1>
          <p className="dashboard-subtitle">
            Create intelligent quizzes from any text or build them manually
          </p>
        </motion.div>

        {/* Quiz Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="settings-section"
        >
          <h2 className="section-title">
            <BookOpen size={24} style={{ marginRight: '0.5rem' }} />
            Quiz Information
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Quiz Title</label>
              <input
                type="text"
                value={quizData.title}
                onChange={(e) => setQuizData(prev => ({ ...prev, title: e.target.value }))}
                className="form-input"
                placeholder="Enter quiz title"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                value={quizData.description}
                onChange={(e) => setQuizData(prev => ({ ...prev, description: e.target.value }))}
                className="form-input"
                placeholder="Brief description"
              />
            </div>
          </div>
        </motion.div>

        {/* Source Text */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="settings-section"
        >
          <h2 className="section-title">
            <Brain size={24} style={{ marginRight: '0.5rem' }} />
            Source Text for AI Generation
          </h2>
          
          <div className="form-group">
            <label className="form-label">Paste your text here</label>
            <textarea
              value={quizData.sourceText}
              onChange={(e) => setQuizData(prev => ({ ...prev, sourceText: e.target.value }))}
              className="form-input"
              placeholder="Paste your study material, article, or any text you want to create questions from..."
              rows={6}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={generateQuestions}
              disabled={isGenerating || !quizData.sourceText.trim()}
              style={{
                background: isGenerating ? 'rgba(255, 255, 255, 0.1)' : '#4DB7FF',
                color: 'white',
                border: 'none',
                padding: '1rem 2rem',
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
                  <div className="spinner" style={{ width: '20px', height: '20px', borderWidth: '2px' }}></div>
                  Generating...
                </>
              ) : (
                <>
                  <Brain size={20} />
                  Generate Questions with AI
                </>
              )}
            </button>

            <button
              onClick={addQuestion}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(77, 183, 255, 0.3)',
                color: '#4DB7FF',
                padding: '1rem 2rem',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem'
              }}
            >
              <Plus size={20} />
              Add Manual Question
            </button>
          </div>
        </motion.div>

        {/* Questions List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="settings-section"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="section-title">
              <Target size={24} style={{ marginRight: '0.5rem' }} />
              Questions ({quizData.questions.length})
            </h2>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={startQuiz}
                disabled={quizData.questions.length === 0}
                style={{
                  background: quizData.questions.length === 0 ? 'rgba(255, 255, 255, 0.1)' : '#10B981',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: quizData.questions.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: quizData.questions.length === 0 ? 0.5 : 1
                }}
              >
                <Play size={16} />
                Preview Quiz
              </button>
              
              <button
                onClick={saveQuiz}
                style={{
                  background: '#4DB7FF',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <Save size={16} />
                Save Quiz
              </button>
            </div>
          </div>

          {quizData.questions.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#cccccc',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px dashed rgba(77, 183, 255, 0.3)'
            }}>
              <BookOpen size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No questions yet. Add questions manually or generate them with AI.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {quizData.questions.map((question, index) => (
                <div
                  key={question.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(77, 183, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '600' }}>
                      Question {index + 1}
                    </h3>
                    <button
                      onClick={() => removeQuestion(question.id)}
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

                  <div className="form-group">
                    <label className="form-label">Question Text</label>
                    <input
                      type="text"
                      value={question.question}
                      onChange={(e) => updateQuestion(question.id, 'question', e.target.value)}
                      className="form-input"
                      placeholder="Enter your question"
                    />
                  </div>

                  <div style={{ marginBottom: '1rem' }}>
                    <label className="form-label">Answer Options</label>
                    <div style={{ display: 'grid', gap: '0.5rem' }}>
                      {question.options.map((option, optionIndex) => (
                        <div key={optionIndex} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                          <input
                            type="radio"
                            name={`correct-${question.id}`}
                            checked={question.correctAnswer === optionIndex}
                            onChange={() => updateQuestion(question.id, 'correctAnswer', optionIndex)}
                            style={{ accentColor: '#4DB7FF' }}
                          />
                          <input
                            type="text"
                            value={option}
                            onChange={(e) => updateOption(question.id, optionIndex, e.target.value)}
                            className="form-input"
                            placeholder={`Option ${String.fromCharCode(65 + optionIndex)}`}
                            style={{ flex: 1 }}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Explanation (Optional)</label>
                    <input
                      type="text"
                      value={question.explanation}
                      onChange={(e) => updateQuestion(question.id, 'explanation', e.target.value)}
                      className="form-input"
                      placeholder="Explain why this is the correct answer"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
};

export default QuizBuilder;
