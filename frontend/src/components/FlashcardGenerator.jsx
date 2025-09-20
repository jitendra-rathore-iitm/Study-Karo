import React, { useState } from 'react';
import { motion } from 'framer-motion';
import EnhancedNavbar from './EnhancedNavbar';
import { 
  Plus, 
  Trash2, 
  Save, 
  Play, 
  RotateCcw,
  Zap,
  Brain,
  BookOpen,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Shuffle
} from 'lucide-react';

const FlashcardGenerator = ({ onLogout }) => {
  const [flashcardData, setFlashcardData] = useState({
    title: '',
    description: '',
    sourceText: '',
    flashcards: []
  });

  const [isGenerating, setIsGenerating] = useState(false);
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });

  const addFlashcard = () => {
    const newCard = {
      id: Date.now(),
      front: '',
      back: '',
      difficulty: 'Medium',
      category: 'General'
    };
    setFlashcardData(prev => ({
      ...prev,
      flashcards: [...prev.flashcards, newCard]
    }));
  };

  const updateFlashcard = (cardId, field, value) => {
    setFlashcardData(prev => ({
      ...prev,
      flashcards: prev.flashcards.map(card => 
        card.id === cardId ? { ...card, [field]: value } : card
      )
    }));
  };

  const removeFlashcard = (cardId) => {
    setFlashcardData(prev => ({
      ...prev,
      flashcards: prev.flashcards.filter(card => card.id !== cardId)
    }));
  };

  const generateFlashcards = async () => {
    if (!flashcardData.sourceText.trim()) {
      alert('Please provide source text to generate flashcards');
      return;
    }

    setIsGenerating(true);
    
    // Simulate AI generation
    setTimeout(() => {
      const generatedCards = [
        {
          id: Date.now() + 1,
          front: 'What is React?',
          back: 'React is a JavaScript library for building user interfaces, particularly web applications.',
          difficulty: 'Easy',
          category: 'React'
        },
        {
          id: Date.now() + 2,
          front: 'What is a component in React?',
          back: 'A component is a reusable piece of UI that can accept inputs (props) and return React elements.',
          difficulty: 'Medium',
          category: 'React'
        },
        {
          id: Date.now() + 3,
          front: 'What is JSX?',
          back: 'JSX is a syntax extension for JavaScript that allows you to write HTML-like code in your JavaScript files.',
          difficulty: 'Medium',
          category: 'React'
        },
        {
          id: Date.now() + 4,
          front: 'What is the virtual DOM?',
          back: 'The virtual DOM is a JavaScript representation of the real DOM that React uses to optimize updates.',
          difficulty: 'Hard',
          category: 'React'
        }
      ];

      setFlashcardData(prev => ({
        ...prev,
        flashcards: [...prev.flashcards, ...generatedCards]
      }));
      setIsGenerating(false);
    }, 3000);
  };

  const startStudyMode = () => {
    if (flashcardData.flashcards.length === 0) {
      alert('Please add at least one flashcard');
      return;
    }
    setIsStudyMode(true);
    setCurrentCardIndex(0);
    setShowAnswer(false);
    setStudyStats({ correct: 0, incorrect: 0, total: flashcardData.flashcards.length });
  };

  const nextCard = () => {
    if (currentCardIndex < flashcardData.flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const shuffleCards = () => {
    const shuffled = [...flashcardData.flashcards].sort(() => Math.random() - 0.5);
    setFlashcardData(prev => ({
      ...prev,
      flashcards: shuffled
    }));
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  const markCorrect = () => {
    setStudyStats(prev => ({
      ...prev,
      correct: prev.correct + 1
    }));
    nextCard();
  };

  const markIncorrect = () => {
    setStudyStats(prev => ({
      ...prev,
      incorrect: prev.incorrect + 1
    }));
    nextCard();
  };

  const saveFlashcards = () => {
    console.log('Saving flashcards:', flashcardData);
    alert('Flashcards saved successfully!');
  };

  if (isStudyMode) {
    const currentCard = flashcardData.flashcards[currentCardIndex];
    const progress = ((currentCardIndex + 1) / flashcardData.flashcards.length) * 100;

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
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(77, 183, 255, 0.2)',
              borderRadius: '20px',
              padding: '2rem'
            }}
          >
            {/* Study Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
              <h1 style={{ fontSize: '1.5rem', fontWeight: '700', color: '#ffffff' }}>
                Study Mode
              </h1>
              <button
                onClick={() => setIsStudyMode(false)}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(77, 183, 255, 0.3)',
                  color: '#4DB7FF',
                  padding: '0.5rem 1rem',
                  borderRadius: '8px',
                  cursor: 'pointer'
                }}
              >
                Exit Study
              </button>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#cccccc' }}>
                  Card {currentCardIndex + 1} of {flashcardData.flashcards.length}
                </span>
                <span style={{ color: '#4DB7FF' }}>
                  {Math.round(progress)}% Complete
                </span>
              </div>
              <div style={{
                width: '100%',
                height: '8px',
                background: 'rgba(255, 255, 255, 0.1)',
                borderRadius: '4px',
                overflow: 'hidden'
              }}>
                <motion.div
                  style={{
                    height: '100%',
                    background: 'linear-gradient(90deg, #4DB7FF, #00a8ff)',
                    borderRadius: '4px'
                  }}
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </div>

            {/* Stats */}
            <div style={{
              display: 'flex',
              justifyContent: 'center',
              gap: '2rem',
              marginBottom: '2rem',
              padding: '1rem',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '8px'
            }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#10B981' }}>
                  {studyStats.correct}
                </div>
                <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>Correct</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#EF4444' }}>
                  {studyStats.incorrect}
                </div>
                <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>Incorrect</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: '700', color: '#4DB7FF' }}>
                  {studyStats.total}
                </div>
                <div style={{ color: '#cccccc', fontSize: '0.9rem' }}>Total</div>
              </div>
            </div>

            {/* Flashcard */}
            <motion.div
              key={currentCardIndex}
              initial={{ opacity: 0, rotateY: 90 }}
              animate={{ opacity: 1, rotateY: 0 }}
              transition={{ duration: 0.5 }}
              style={{
                background: 'rgba(255, 255, 255, 0.1)',
                border: '1px solid rgba(77, 183, 255, 0.3)',
                borderRadius: '16px',
                padding: '3rem',
                textAlign: 'center',
                minHeight: '300px',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                marginBottom: '2rem',
                cursor: 'pointer'
              }}
              onClick={() => setShowAnswer(!showAnswer)}
            >
              <div style={{ marginBottom: '1rem' }}>
                <span style={{
                  background: 'rgba(77, 183, 255, 0.2)',
                  color: '#4DB7FF',
                  padding: '0.25rem 0.75rem',
                  borderRadius: '20px',
                  fontSize: '0.8rem',
                  fontWeight: '600'
                }}>
                  {currentCard.difficulty}
                </span>
              </div>
              
              <h2 style={{ 
                fontSize: '1.5rem', 
                fontWeight: '600', 
                color: '#ffffff',
                marginBottom: '1rem'
              }}>
                {showAnswer ? currentCard.back : currentCard.front}
              </h2>
              
              <p style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                {showAnswer ? 'Click to see question' : 'Click to reveal answer'}
              </p>
            </motion.div>

            {/* Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                style={{
                  background: currentCardIndex === 0 ? 'rgba(255, 255, 255, 0.1)' : '#4DB7FF',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: currentCardIndex === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: currentCardIndex === 0 ? 0.5 : 1
                }}
              >
                <ArrowLeft size={16} />
                Previous
              </button>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={markIncorrect}
                  style={{
                    background: 'rgba(239, 68, 68, 0.1)',
                    border: '1px solid #EF4444',
                    color: '#EF4444',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <XCircle size={16} />
                  Incorrect
                </button>
                
                <button
                  onClick={markCorrect}
                  style={{
                    background: 'rgba(16, 185, 129, 0.1)',
                    border: '1px solid #10B981',
                    color: '#10B981',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem'
                  }}
                >
                  <CheckCircle size={16} />
                  Correct
                </button>
              </div>

              <button
                onClick={nextCard}
                disabled={currentCardIndex === flashcardData.flashcards.length - 1}
                style={{
                  background: currentCardIndex === flashcardData.flashcards.length - 1 ? 'rgba(255, 255, 255, 0.1)' : '#4DB7FF',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: currentCardIndex === flashcardData.flashcards.length - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: currentCardIndex === flashcardData.flashcards.length - 1 ? 0.5 : 1
                }}
              >
                Next
                <ArrowRight size={16} />
              </button>
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
          <h1 className="dashboard-title">Flashcard Generator</h1>
          <p className="dashboard-subtitle">
            Create intelligent flashcards from any text or build them manually for effective studying
          </p>
        </motion.div>

        {/* Flashcard Set Info */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="settings-section"
        >
          <h2 className="section-title">
            <BookOpen size={24} style={{ marginRight: '0.5rem' }} />
            Flashcard Set Information
          </h2>
          
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '1.5rem' }}>
            <div className="form-group">
              <label className="form-label">Set Title</label>
              <input
                type="text"
                value={flashcardData.title}
                onChange={(e) => setFlashcardData(prev => ({ ...prev, title: e.target.value }))}
                className="form-input"
                placeholder="Enter flashcard set title"
              />
            </div>
            
            <div className="form-group">
              <label className="form-label">Description</label>
              <input
                type="text"
                value={flashcardData.description}
                onChange={(e) => setFlashcardData(prev => ({ ...prev, description: e.target.value }))}
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
              value={flashcardData.sourceText}
              onChange={(e) => setFlashcardData(prev => ({ ...prev, sourceText: e.target.value }))}
              className="form-input"
              placeholder="Paste your study material, notes, or any text you want to create flashcards from..."
              rows={6}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
            <button
              onClick={generateFlashcards}
              disabled={isGenerating || !flashcardData.sourceText.trim()}
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
                  Generate Flashcards with AI
                </>
              )}
            </button>

            <button
              onClick={addFlashcard}
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
              Add Manual Flashcard
            </button>
          </div>
        </motion.div>

        {/* Flashcards List */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="settings-section"
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
            <h2 className="section-title">
              <Zap size={24} style={{ marginRight: '0.5rem' }} />
              Flashcards ({flashcardData.flashcards.length})
            </h2>
            
            <div style={{ display: 'flex', gap: '1rem' }}>
              <button
                onClick={shuffleCards}
                disabled={flashcardData.flashcards.length === 0}
                style={{
                  background: flashcardData.flashcards.length === 0 ? 'rgba(255, 255, 255, 0.1)' : 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(77, 183, 255, 0.3)',
                  color: '#4DB7FF',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: flashcardData.flashcards.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: flashcardData.flashcards.length === 0 ? 0.5 : 1
                }}
              >
                <Shuffle size={16} />
                Shuffle
              </button>
              
              <button
                onClick={startStudyMode}
                disabled={flashcardData.flashcards.length === 0}
                style={{
                  background: flashcardData.flashcards.length === 0 ? 'rgba(255, 255, 255, 0.1)' : '#10B981',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: flashcardData.flashcards.length === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: flashcardData.flashcards.length === 0 ? 0.5 : 1
                }}
              >
                <Play size={16} />
                Start Study
              </button>
              
              <button
                onClick={saveFlashcards}
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
                Save Set
              </button>
            </div>
          </div>

          {flashcardData.flashcards.length === 0 ? (
            <div style={{
              textAlign: 'center',
              padding: '3rem',
              color: '#cccccc',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '12px',
              border: '1px dashed rgba(77, 183, 255, 0.3)'
            }}>
              <Zap size={48} style={{ marginBottom: '1rem', opacity: 0.5 }} />
              <p>No flashcards yet. Add flashcards manually or generate them with AI.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              {flashcardData.flashcards.map((card, index) => (
                <div
                  key={card.id}
                  style={{
                    background: 'rgba(255, 255, 255, 0.05)',
                    border: '1px solid rgba(77, 183, 255, 0.2)',
                    borderRadius: '12px',
                    padding: '1.5rem'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <h3 style={{ color: '#ffffff', fontSize: '1.1rem', fontWeight: '600' }}>
                      Card {index + 1}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <span style={{
                        background: 'rgba(77, 183, 255, 0.1)',
                        color: '#4DB7FF',
                        padding: '0.25rem 0.75rem',
                        borderRadius: '20px',
                        fontSize: '0.8rem',
                        fontWeight: '600'
                      }}>
                        {card.difficulty}
                      </span>
                      <button
                        onClick={() => removeFlashcard(card.id)}
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
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Front (Question)</label>
                      <textarea
                        value={card.front}
                        onChange={(e) => updateFlashcard(card.id, 'front', e.target.value)}
                        className="form-input"
                        placeholder="Enter the question or term"
                        rows={3}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Back (Answer)</label>
                      <textarea
                        value={card.back}
                        onChange={(e) => updateFlashcard(card.id, 'back', e.target.value)}
                        className="form-input"
                        placeholder="Enter the answer or definition"
                        rows={3}
                        style={{ resize: 'vertical' }}
                      />
                    </div>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                    <div className="form-group">
                      <label className="form-label">Difficulty</label>
                      <select
                        value={card.difficulty}
                        onChange={(e) => updateFlashcard(card.id, 'difficulty', e.target.value)}
                        className="model-select"
                      >
                        <option value="Easy">Easy</option>
                        <option value="Medium">Medium</option>
                        <option value="Hard">Hard</option>
                      </select>
                    </div>
                    
                    <div className="form-group">
                      <label className="form-label">Category</label>
                      <input
                        type="text"
                        value={card.category}
                        onChange={(e) => updateFlashcard(card.id, 'category', e.target.value)}
                        className="form-input"
                        placeholder="e.g., React, JavaScript"
                      />
                    </div>
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

export default FlashcardGenerator;
