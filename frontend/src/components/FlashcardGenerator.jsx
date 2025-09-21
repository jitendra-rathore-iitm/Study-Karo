import React, { useState, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import EnhancedNavbar from './EnhancedNavbar';
import modelManager from '../services/modelManager';
import { useNotification } from './NotificationSystem';
import { 
  Plus, 
  Trash2, 
  Play, 
  RotateCcw,
  Zap,
  Brain,
  BookOpen,
  CheckCircle,
  XCircle,
  ArrowLeft,
  ArrowRight,
  Shuffle,
  Upload,
  FileText,
  Eye,
  EyeOff,
  X,
  ChevronLeft,
  ChevronRight,
  Download,
  RefreshCw
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
  const { success, error } = useNotification();
  const [studyStats, setStudyStats] = useState({
    correct: 0,
    incorrect: 0,
    total: 0
  });

  // Enhanced progress tracking states
  const [generationProgress, setGenerationProgress] = useState(0);
  const [generationStep, setGenerationStep] = useState('');
  const [aiResponseComplete, setAiResponseComplete] = useState(false);

  // Enhanced states for PDF and advanced features
  const [pdfFile, setPdfFile] = useState(null);
  const [isProcessingPDF, setIsProcessingPDF] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [extractedContent, setExtractedContent] = useState('');
  const [processingStep, setProcessingStep] = useState('');
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isViewingCard, setIsViewingCard] = useState(false);
  const [viewingCardIndex, setViewingCardIndex] = useState(0);
  const [cardFlipped, setCardFlipped] = useState(false);
  
  const fileInputRef = useRef(null);

  // PDF Processing Functions
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.type !== 'application/pdf') {
      error('Please upload a PDF file');
      return;
    }
    
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
      error('File size must be less than 10MB');
      return;
    }
    
    setPdfFile(file);
    processPDF(file);
  };

  const processPDF = async (file) => {
    setIsProcessingPDF(true);
    setProcessingStep('Uploading PDF...');
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('pdf', file);

      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) {
            clearInterval(progressInterval);
            return 90;
          }
          return prev + 10;
        });
      }, 200);

      setProcessingStep('Extracting text from PDF...');
      
      const response = await fetch('http://localhost:5001/api/pdf/extract', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        },
        body: formData
      });

      clearInterval(progressInterval);
      setUploadProgress(100);

      if (!response.ok) {
        throw new Error('Failed to process PDF');
      }

      const result = await response.json();
      
      if (result.success) {
        setExtractedContent(result.text);
        setFlashcardData(prev => ({
          ...prev,
          sourceText: result.text,
          title: prev.title || file.name.replace('.pdf', '')
        }));
        setProcessingStep('PDF processed successfully!');
        success('PDF processed successfully!');
      } else {
        throw new Error(result.error || 'Failed to extract text from PDF');
      }
    } catch (err) {
      console.error('PDF processing error:', err);
      error('Failed to process PDF: ' + err.message);
    } finally {
      setIsProcessingPDF(false);
      setProcessingStep('');
      setUploadProgress(0);
    }
  };

  // Removed manual flashcard creation - now PDF-only

  // Removed manual flashcard editing - now read-only generated cards

  const generateFlashcards = async () => {
    if (!extractedContent.trim()) {
      error('No PDF content available for flashcard generation');
      return;
    }

    // Check if model is configured
    const modelInfo = modelManager.getModelInfo();
    if (!modelInfo.hasApiKey) {
      error('Please configure your AI model and API key in Settings first');
      return;
    }

    // Reset states
    setIsGenerating(true);
    setGenerationProgress(0);
    setGenerationStep('');
    setAiResponseComplete(false);

    try {
      // Step 1: Initialize AI processing (0-10%)
      setGenerationStep('Initializing AI analysis...');
      setGenerationProgress(5);
      await new Promise(resolve => setTimeout(resolve, 500));

      // Step 2: Preparing content for AI (10-20%)
      setGenerationStep('Preparing content for AI analysis...');
      setGenerationProgress(15);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Smart content truncation for faster processing
      let processedContent = extractedContent;
      
      // If content is very large, extract key sections
      if (extractedContent.length > 3000) {
        // Extract first 1000 chars, middle 1000 chars, and last 1000 chars
        const firstPart = extractedContent.substring(0, 1000);
        const middleStart = Math.floor(extractedContent.length / 2) - 500;
        const middlePart = extractedContent.substring(middleStart, middleStart + 1000);
        const lastPart = extractedContent.substring(extractedContent.length - 1000);
        
        processedContent = `${firstPart}\n\n[... middle content ...]\n\n${middlePart}\n\n[... end content ...]\n\n${lastPart}`;
      } else if (extractedContent.length > 2000) {
        processedContent = extractedContent.substring(0, 2000);
      }

      // Strict English-only prompt with JSON format enforcement
      const enhancedPrompt = `IMPORTANT: Respond ONLY in English. Create 8-10 exam flashcards from this content. Use ONLY the exact JSON format below.

Content: ${processedContent}

REQUIREMENTS:
- Write ALL text in English only
- Use exact JSON format with proper quotes and commas
- Include exactly 8-10 cards
- Each card must have all required fields

JSON FORMAT (copy exactly):
{
  "title": "Subject Title in English",
  "description": "Brief description in English",
  "cards": [
    {
      "question": "Clear question in English",
      "answer": "Concise answer in English",
      "difficulty": "Easy",
      "category": "Definition",
      "keyPoints": ["Point 1", "Point 2"],
      "examRelevance": "High"
    }
  ]
}`;

      // Step 3: Sending request to AI (20-30%)
      setGenerationStep('Sending request to AI model...');
      setGenerationProgress(25);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Step 4: AI is processing (30-80%)
      setGenerationStep('AI is analyzing content and generating flashcards...');
      
      // Start progress simulation for AI processing
      const progressInterval = setInterval(() => {
        setGenerationProgress(prev => {
          if (prev < 75) {
            return prev + Math.random() * 3; // Random increment between 0-3%
          }
          return prev;
        });
      }, 200);

      // Call AI with retry logic for better reliability
      let result;
      let retryCount = 0;
      const maxRetries = 2;
      
      while (retryCount <= maxRetries) {
        try {
          setGenerationStep(`AI processing... (Attempt ${retryCount + 1}/${maxRetries + 1})`);
          
          const aiPromise = modelManager.generateContent(enhancedPrompt, {
            maxTokens: 1500, // Further reduced for speed
            temperature: 0.1, // Very low for fastest, most consistent output
            top_p: 0.8, // More focused sampling
            frequency_penalty: 0.2,
            presence_penalty: 0.2
          });

          // Wait for AI response with timeout
          result = await Promise.race([
            aiPromise,
            new Promise((_, reject) => 
              setTimeout(() => reject(new Error('AI response timeout')), 20000) // 20 second timeout
            )
          ]);
          
          break; // Success, exit retry loop
          
        } catch (error) {
          retryCount++;
          if (retryCount > maxRetries) {
            throw error; // Re-throw if all retries failed
          }
          
          // Wait before retry
          setGenerationStep(`Retrying AI request... (${retryCount}/${maxRetries})`);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }
      }

      // Clear progress interval
      clearInterval(progressInterval);

      // Step 5: AI response received (80-90%)
      setGenerationStep('AI response received, validating output...');
      setGenerationProgress(85);
      await new Promise(resolve => setTimeout(resolve, 300));

      // Validate AI response
      if (!result || !result.content) {
        throw new Error('AI returned empty or invalid response');
      }

      // Clean and validate AI response
      let cleanedContent = result.content.trim();
      
      // Remove any markdown formatting or extra text
      cleanedContent = cleanedContent.replace(/```json\s*/g, '').replace(/```\s*/g, '');
      
      // Find JSON object in response
      const jsonMatch = cleanedContent.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        cleanedContent = jsonMatch[0];
      }

      // Parse and validate JSON
      let parsedData;
      try {
        parsedData = JSON.parse(cleanedContent);
      } catch (parseError) {
        console.error('JSON Parse Error:', parseError);
        console.error('AI Response:', result.content);
        throw new Error('AI response is not valid JSON format. Please try again.');
      }

      // Validate required fields and structure
      if (!parsedData || typeof parsedData !== 'object') {
        throw new Error('AI response is not a valid object');
      }

      if (!parsedData.cards || !Array.isArray(parsedData.cards)) {
        throw new Error('AI response does not contain cards array');
      }

      if (parsedData.cards.length === 0) {
        throw new Error('AI response contains no flashcards');
      }

      // Validate each card has required fields
      const validCards = parsedData.cards.filter(card => 
        card && 
        typeof card.question === 'string' && 
        typeof card.answer === 'string' &&
        card.question.trim().length > 0 &&
        card.answer.trim().length > 0
      );

      if (validCards.length === 0) {
        throw new Error('No valid flashcards found in AI response');
      }

      // Use only valid cards
      parsedData.cards = validCards;

      // Mark AI response as complete
      setAiResponseComplete(true);

      // Step 6: Processing flashcards (90-95%)
      setGenerationStep('Processing generated flashcards...');
      setGenerationProgress(92);
      await new Promise(resolve => setTimeout(resolve, 200));

      // Process and validate each card
      const generatedCards = parsedData.cards.map((card, index) => {
        // Ensure all text is in English and properly formatted
        const cleanQuestion = (card.question || '').toString().trim();
        const cleanAnswer = (card.answer || '').toString().trim();
        
        // Validate required fields
        if (!cleanQuestion || !cleanAnswer) {
          console.warn(`Skipping invalid card ${index + 1}:`, card);
          return null;
        }

        return {
          id: Date.now() + index + 1,
          front: cleanQuestion,
          back: cleanAnswer,
          difficulty: ['Easy', 'Medium', 'Hard'].includes(card.difficulty) ? card.difficulty : 'Medium',
          category: ['Definition', 'Formula', 'Fact', 'Process', 'Analysis', 'Application'].includes(card.category) 
            ? card.category : 'Generated',
          keyPoints: Array.isArray(card.keyPoints) ? card.keyPoints.filter(point => 
            typeof point === 'string' && point.trim().length > 0
          ) : [],
          examRelevance: ['High', 'Medium', 'Low'].includes(card.examRelevance) 
            ? card.examRelevance : 'Medium'
        };
      }).filter(card => card !== null); // Remove null cards

      // Fallback: Create basic flashcards if AI response is invalid
      if (generatedCards.length === 0) {
        console.warn('AI response invalid, creating fallback flashcards');
        
        // Create basic flashcards from content
        const contentLines = processedContent.split('\n').filter(line => line.trim().length > 10);
        const fallbackCards = contentLines.slice(0, 5).map((line, index) => ({
          id: Date.now() + index + 1,
          front: `What is the main concept in: "${line.substring(0, 50)}..."?`,
          back: line.trim(),
          difficulty: 'Medium',
          category: 'Definition',
          keyPoints: [],
          examRelevance: 'Medium'
        }));

        if (fallbackCards.length > 0) {
          generatedCards.push(...fallbackCards);
        } else {
          throw new Error('Unable to create flashcards from content. Please try with different content.');
        }
      }

      // Step 7: Finalizing (95-100%)
      setGenerationStep('Finalizing flashcard set...');
      setGenerationProgress(98);
      await new Promise(resolve => setTimeout(resolve, 200));

      setFlashcardData(prev => ({
        ...prev,
        flashcards: generatedCards,
        title: parsedData.title || 'PDF Flashcards',
        description: parsedData.description || 'Flashcards generated from PDF content'
      }));

      // Complete
      setGenerationStep('Flashcards generated successfully!');
      setGenerationProgress(100);
      await new Promise(resolve => setTimeout(resolve, 500));

      success(`Generated ${generatedCards.length} exam-focused flashcards successfully!`);

    } catch (err) {
      console.error('Error generating flashcards:', err);
      
      // Reset progress on error
      setGenerationProgress(0);
      setGenerationStep('');
      setAiResponseComplete(false);
      
      if (err.message.includes('timeout')) {
        error('AI request timed out. Try with a shorter PDF or check your internet connection. The system will retry automatically.');
      } else if (err.message.includes('JSON')) {
        error('AI returned invalid JSON format. The system will try to fix this automatically or create basic flashcards.');
      } else if (err.message.includes('API key')) {
        error('Invalid API key. Please check your settings.');
      } else if (err.message.includes('rate limit')) {
        error('API rate limit exceeded. Please wait a moment and try again.');
      } else if (err.message.includes('quota')) {
        error('API quota exceeded. Please check your API usage limits.');
      } else if (err.message.includes('No valid flashcards')) {
        error('AI response format was invalid. Creating basic flashcards from content instead.');
      } else {
        error(`Failed to generate flashcards: ${err.message}. Please try again with a shorter PDF.`);
      }
    } finally {
      setIsGenerating(false);
      // Reset progress after a delay
      setTimeout(() => {
        setGenerationProgress(0);
        setGenerationStep('');
        setAiResponseComplete(false);
      }, 2000);
    }
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
      // Don't auto-reset showAnswer - let user control it
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      // Don't auto-reset showAnswer - let user control it
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
    setShowAnswer(false); // Reset answer when marking correct
    nextCard();
  };

  const markIncorrect = () => {
    setStudyStats(prev => ({
      ...prev,
      incorrect: prev.incorrect + 1
    }));
    setShowAnswer(false); // Reset answer when marking incorrect
    nextCard();
  };

  const resetAnswer = () => {
    setShowAnswer(false);
  };


  // Enhanced flashcard viewing functions
  const openCardViewer = (index) => {
    setViewingCardIndex(index);
    setIsViewingCard(true);
    setCardFlipped(false);
  };

  const closeCardViewer = () => {
    setIsViewingCard(false);
    setCardFlipped(false);
  };

  const flipCard = () => {
    setCardFlipped(!cardFlipped);
  };

  const resetCardView = () => {
    setCardFlipped(false);
  };

  const nextViewingCard = () => {
    if (viewingCardIndex < flashcardData.flashcards.length - 1) {
      setViewingCardIndex(viewingCardIndex + 1);
      // Don't auto-reset cardFlipped - let user control it
    }
  };

  const prevViewingCard = () => {
    if (viewingCardIndex > 0) {
      setViewingCardIndex(viewingCardIndex - 1);
      // Don't auto-reset cardFlipped - let user control it
    }
  };

  // Enhanced Flashcard Viewer Component
  const FlashcardViewer = () => {
    if (!isViewingCard) return null;
    
    const currentCard = flashcardData.flashcards[viewingCardIndex];
    
    return (
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'rgba(0, 0, 0, 0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000,
            padding: '2rem'
          }}
          onClick={closeCardViewer}
        >
          <motion.div
            initial={{ scale: 0.8, rotateY: -90 }}
            animate={{ scale: 1, rotateY: 0 }}
            exit={{ scale: 0.8, rotateY: 90 }}
            transition={{ duration: 0.5, type: "spring", stiffness: 300 }}
            style={{
              background: 'linear-gradient(135deg, rgba(77, 183, 255, 0.1), rgba(0, 168, 255, 0.1))',
              border: '2px solid rgba(77, 183, 255, 0.3)',
              borderRadius: '20px',
              padding: '3rem',
              maxWidth: '600px',
              width: '100%',
              maxHeight: '80vh',
              overflow: 'auto',
              position: 'relative',
              cursor: 'default'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              onClick={closeCardViewer}
              style={{
                position: 'absolute',
                top: '1rem',
                right: '1rem',
                background: 'rgba(239, 68, 68, 0.1)',
                border: '1px solid #EF4444',
                color: '#EF4444',
                padding: '0.5rem',
                borderRadius: '50%',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: '40px',
                height: '40px'
              }}
            >
              <X size={20} />
            </button>

            {/* Enhanced Card Header with Exam Focus */}
            <div style={{ marginBottom: '2rem', textAlign: 'center' }}>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '0.8rem', marginBottom: '1rem', flexWrap: 'wrap' }}>
                {/* Difficulty Badge */}
                <span style={{
                  background: currentCard.difficulty === 'Easy' ? 'rgba(34, 197, 94, 0.2)' : 
                             currentCard.difficulty === 'Medium' ? 'rgba(251, 191, 36, 0.2)' : 
                             'rgba(239, 68, 68, 0.2)',
                  color: currentCard.difficulty === 'Easy' ? '#22C55E' : 
                         currentCard.difficulty === 'Medium' ? '#FBBF24' : 
                         '#EF4444',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  border: `1px solid ${currentCard.difficulty === 'Easy' ? '#22C55E' : 
                                         currentCard.difficulty === 'Medium' ? '#FBBF24' : 
                                         '#EF4444'}20`
                }}>
                  {currentCard.difficulty}
                </span>
                
                {/* Category Badge */}
                <span style={{
                  background: 'rgba(77, 183, 255, 0.2)',
                  color: '#4DB7FF',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.9rem',
                  fontWeight: '600',
                  border: '1px solid rgba(77, 183, 255, 0.3)'
                }}>
                  {currentCard.category}
                </span>
                
                {/* Exam Relevance Badge */}
                {currentCard.examRelevance && (
                  <span style={{
                    background: currentCard.examRelevance === 'High' ? 'rgba(239, 68, 68, 0.2)' : 
                               currentCard.examRelevance === 'Medium' ? 'rgba(251, 191, 36, 0.2)' : 
                               'rgba(34, 197, 94, 0.2)',
                    color: currentCard.examRelevance === 'High' ? '#EF4444' : 
                           currentCard.examRelevance === 'Medium' ? '#FBBF24' : 
                           '#22C55E',
                    padding: '0.5rem 1rem',
                    borderRadius: '20px',
                    fontSize: '0.9rem',
                    fontWeight: '600',
                    border: `1px solid ${currentCard.examRelevance === 'High' ? '#EF4444' : 
                                           currentCard.examRelevance === 'Medium' ? '#FBBF24' : 
                                           '#22C55E'}20`
                  }}>
                    📚 {currentCard.examRelevance} Priority
                  </span>
                )}
              </div>
              <h3 style={{ color: '#ffffff', fontSize: '1.2rem', fontWeight: '600' }}>
                Card {viewingCardIndex + 1} of {flashcardData.flashcards.length}
              </h3>
            </div>

            {/* Flipable Card */}
            <motion.div
              style={{
                perspective: '1000px',
                marginBottom: '2rem'
              }}
            >
              <motion.div
                animate={{ rotateY: cardFlipped ? 180 : 0 }}
                transition={{ duration: 0.6, type: "spring", stiffness: 300 }}
                style={{
                  transformStyle: 'preserve-3d',
                  position: 'relative',
                  width: '100%',
                  minHeight: '300px'
                }}
              >
                {/* Enhanced Front of Card with Exam Focus */}
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    background: currentCard.examRelevance === 'High' ? 
                      'linear-gradient(135deg, rgba(239, 68, 68, 0.1), rgba(185, 28, 28, 0.05))' :
                      currentCard.examRelevance === 'Medium' ?
                      'linear-gradient(135deg, rgba(251, 191, 36, 0.1), rgba(180, 83, 9, 0.05))' :
                      'linear-gradient(135deg, rgba(77, 183, 255, 0.1), rgba(0, 168, 255, 0.05))',
                    border: currentCard.examRelevance === 'High' ? 
                      '2px solid rgba(239, 68, 68, 0.4)' :
                      currentCard.examRelevance === 'Medium' ?
                      '2px solid rgba(251, 191, 36, 0.4)' :
                      '2px solid rgba(77, 183, 255, 0.4)',
                    borderRadius: '20px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: currentCard.examRelevance === 'High' ? 
                      '0 8px 32px rgba(239, 68, 68, 0.2)' :
                      currentCard.examRelevance === 'Medium' ?
                      '0 8px 32px rgba(251, 191, 36, 0.2)' :
                      '0 8px 32px rgba(77, 183, 255, 0.2)'
                  }}
                  onClick={flipCard}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    {currentCard.examRelevance === 'High' ? 
                      <Brain size={32} color="#EF4444" /> :
                      currentCard.examRelevance === 'Medium' ?
                      <BookOpen size={32} color="#FBBF24" /> :
                      <Eye size={32} color="#4DB7FF" />
                    }
                  </div>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    color: '#ffffff',
                    marginBottom: '1rem',
                    lineHeight: '1.4'
                  }}>
                    {currentCard.front}
                  </h2>
                  <p style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem',
                    fontStyle: 'italic'
                  }}>
                    {currentCard.examRelevance === 'High' ? 
                      '🔥 High Priority - Click to reveal answer' :
                      currentCard.examRelevance === 'Medium' ?
                      '📚 Medium Priority - Click to reveal answer' :
                      'Click to reveal answer'
                    }
                  </p>
                </motion.div>

                {/* Enhanced Back of Card with Exam Focus */}
                <motion.div
                  style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    backfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    background: currentCard.examRelevance === 'High' ? 
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.15), rgba(5, 150, 105, 0.1))' :
                      currentCard.examRelevance === 'Medium' ?
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.12), rgba(5, 150, 105, 0.08))' :
                      'linear-gradient(135deg, rgba(16, 185, 129, 0.08), rgba(5, 150, 105, 0.05))',
                    border: currentCard.examRelevance === 'High' ? 
                      '2px solid rgba(16, 185, 129, 0.5)' :
                      currentCard.examRelevance === 'Medium' ?
                      '2px solid rgba(16, 185, 129, 0.4)' :
                      '2px solid rgba(16, 185, 129, 0.3)',
                    borderRadius: '20px',
                    padding: '2rem',
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    textAlign: 'center',
                    cursor: 'pointer',
                    boxShadow: currentCard.examRelevance === 'High' ? 
                      '0 8px 32px rgba(16, 185, 129, 0.3)' :
                      currentCard.examRelevance === 'Medium' ?
                      '0 8px 32px rgba(16, 185, 129, 0.2)' :
                      '0 8px 32px rgba(16, 185, 129, 0.1)'
                  }}
                  onClick={flipCard}
                >
                  <div style={{ marginBottom: '1rem' }}>
                    {currentCard.examRelevance === 'High' ? 
                      <CheckCircle size={32} color="#10B981" /> :
                      currentCard.examRelevance === 'Medium' ?
                      <BookOpen size={32} color="#10B981" /> :
                      <EyeOff size={32} color="#10B981" />
                    }
                  </div>
                  <h2 style={{ 
                    fontSize: '1.5rem', 
                    fontWeight: '600', 
                    color: '#ffffff',
                    marginBottom: '1rem',
                    lineHeight: '1.4'
                  }}>
                    {currentCard.back}
                  </h2>
                  <p style={{ 
                    color: '#cccccc', 
                    fontSize: '0.9rem',
                    fontStyle: 'italic'
                  }}>
                    {currentCard.examRelevance === 'High' ? 
                      '✅ High Priority Answer - Click to see question' :
                      currentCard.examRelevance === 'Medium' ?
                      '📖 Medium Priority Answer - Click to see question' :
                      'Click to see question'
                    }
                  </p>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Key Points (if available) */}
            {currentCard.keyPoints && currentCard.keyPoints.length > 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                style={{
                  background: 'rgba(255, 255, 255, 0.05)',
                  border: '1px solid rgba(77, 183, 255, 0.2)',
                  borderRadius: '12px',
                  padding: '1.5rem',
                  marginBottom: '2rem'
                }}
              >
                <h4 style={{ color: '#4DB7FF', fontSize: '1rem', fontWeight: '600', marginBottom: '1rem' }}>
                  Key Points:
                </h4>
                <ul style={{ color: '#cccccc', paddingLeft: '1.5rem' }}>
                  {currentCard.keyPoints.map((point, index) => (
                    <li key={index} style={{ marginBottom: '0.5rem' }}>
                      {point}
                    </li>
                  ))}
                </ul>
              </motion.div>
            )}

            {/* Navigation Controls */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <button
                onClick={prevViewingCard}
                disabled={viewingCardIndex === 0}
                style={{
                  background: viewingCardIndex === 0 ? 'rgba(255, 255, 255, 0.1)' : '#4DB7FF',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: viewingCardIndex === 0 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: viewingCardIndex === 0 ? 0.5 : 1
                }}
              >
                <ChevronLeft size={16} />
                Previous
              </button>

              <button
                onClick={flipCard}
                style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  border: '1px solid rgba(77, 183, 255, 0.3)',
                  color: '#4DB7FF',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  transition: 'all 0.3s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = 'rgba(77, 183, 255, 0.2)';
                  e.target.style.transform = 'translateY(-1px)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                  e.target.style.transform = 'translateY(0)';
                }}
              >
                <RefreshCw size={16} />
                {cardFlipped ? 'Show Question' : 'Show Answer'}
              </button>

              <button
                onClick={nextViewingCard}
                disabled={viewingCardIndex === flashcardData.flashcards.length - 1}
                style={{
                  background: viewingCardIndex === flashcardData.flashcards.length - 1 ? 'rgba(255, 255, 255, 0.1)' : '#4DB7FF',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '8px',
                  cursor: viewingCardIndex === flashcardData.flashcards.length - 1 ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  opacity: viewingCardIndex === flashcardData.flashcards.length - 1 ? 0.5 : 1
                }}
              >
                Next
                <ChevronRight size={16} />
              </button>
            </div>
          </motion.div>
        </motion.div>
      </AnimatePresence>
    );
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

              <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
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
                    gap: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.2)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(239, 68, 68, 0.1)';
                    e.target.style.transform = 'translateY(0)';
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
                    gap: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(16, 185, 129, 0.2)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(16, 185, 129, 0.1)';
                    e.target.style.transform = 'translateY(0)';
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
      <EnhancedNavbar onLogout={onLogout} showUserMenu={true} />
      <div className="background-pattern"></div>
      <div className="background-glow"></div>
      
      {/* Enhanced Flashcard Viewer */}
      <FlashcardViewer />
      
      <div className="dashboard-content">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="dashboard-header"
        >
          <h1 className="dashboard-title">PDF Flashcard Generator</h1>
          <p className="dashboard-subtitle">
            Upload a PDF document and let AI create intelligent flashcards with key terms, definitions, and important concepts
          </p>
        </motion.div>

        {/* Flashcard Set Info - Auto-generated from PDF */}
        {flashcardData.title && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="settings-section"
          >
            <h2 className="section-title">
              <BookOpen size={24} style={{ marginRight: '0.5rem' }} />
              {flashcardData.title}
            </h2>
            {flashcardData.description && (
              <p style={{ color: '#cccccc', marginBottom: '1.5rem' }}>
                {flashcardData.description}
              </p>
            )}
          </motion.div>
        )}

        {/* PDF Upload Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="settings-section"
        >
          <h2 className="section-title">
            <Upload size={24} style={{ marginRight: '0.5rem' }} />
            Upload PDF Document
          </h2>
          
          <div
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            style={{
              border: dragActive ? '2px dashed #4DB7FF' : '2px dashed rgba(77, 183, 255, 0.3)',
              borderRadius: '12px',
              padding: '2rem',
              textAlign: 'center',
              background: dragActive ? 'rgba(77, 183, 255, 0.05)' : 'rgba(255, 255, 255, 0.02)',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              marginBottom: '1rem'
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
              style={{ display: 'none' }}
            />
            
            {isProcessingPDF ? (
              <div>
                <div className="spinner" style={{ width: '40px', height: '40px', borderWidth: '3px', margin: '0 auto 1rem' }}></div>
                <p style={{ color: '#4DB7FF', marginBottom: '0.5rem' }}>{processingStep}</p>
                <div style={{
                  width: '100%',
                  height: '8px',
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '4px',
                  overflow: 'hidden',
                  marginBottom: '1rem'
                }}>
                  <motion.div
                    style={{
                      height: '100%',
                      background: 'linear-gradient(90deg, #4DB7FF, #00a8ff)',
                      borderRadius: '4px'
                    }}
                    initial={{ width: 0 }}
                    animate={{ width: `${uploadProgress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                <p style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                  {uploadProgress}% Complete
                </p>
              </div>
            ) : pdfFile ? (
              <div>
                <FileText size={48} color="#10B981" style={{ marginBottom: '1rem' }} />
                <p style={{ color: '#10B981', fontWeight: '600', marginBottom: '0.5rem' }}>
                  {pdfFile.name}
                </p>
                <p style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                  PDF processed successfully! Text extracted and ready for flashcard generation.
                </p>
              </div>
            ) : (
              <div>
                <Upload size={48} color="#4DB7FF" style={{ marginBottom: '1rem' }} />
                <p style={{ color: '#4DB7FF', fontWeight: '600', marginBottom: '0.5rem' }}>
                  Drop your PDF here or click to browse
                </p>
                <p style={{ color: '#cccccc', fontSize: '0.9rem' }}>
                  Supports PDF files up to 10MB. AI will extract text and identify key information.
                </p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Generate Button - Only show when PDF is processed */}
        {extractedContent && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="settings-section"
          >
            <div style={{ textAlign: 'center' }}>
              <button
                onClick={generateFlashcards}
                disabled={isGenerating || !extractedContent.trim()}
                style={{
                  background: isGenerating ? 'rgba(255, 255, 255, 0.1)' : '#4DB7FF',
                  color: 'white',
                  border: 'none',
                  padding: '1.5rem 3rem',
                  borderRadius: '12px',
                  cursor: isGenerating ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '1rem',
                  opacity: isGenerating ? 0.7 : 1,
                  fontSize: '1.1rem',
                  fontWeight: '600',
                  margin: '0 auto',
                  transition: 'all 0.3s ease',
                  boxShadow: isGenerating ? 'none' : '0 8px 25px rgba(77, 183, 255, 0.3)'
                }}
                onMouseEnter={(e) => {
                  if (!isGenerating) {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 12px 35px rgba(77, 183, 255, 0.4)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isGenerating) {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 8px 25px rgba(77, 183, 255, 0.3)';
                  }
                }}
              >
                {isGenerating ? (
                  <>
                    <div className="spinner" style={{ width: '24px', height: '24px', borderWidth: '3px' }}></div>
                    {generationStep || 'Generating Flashcards...'}
                  </>
                ) : (
                  <>
                    <Brain size={24} />
                    Generate Flashcards from PDF
                  </>
                )}
              </button>

              {/* Enhanced Progress Bar */}
              {isGenerating && (
                <div style={{ marginTop: '1.5rem', width: '100%' }}>
                  <div style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    marginBottom: '0.75rem' 
                  }}>
                    <span style={{ 
                      color: '#4DB7FF', 
                      fontSize: '1rem', 
                      fontWeight: '600' 
                    }}>
                      {generationStep}
                    </span>
                    <span style={{ 
                      color: '#ffffff', 
                      fontSize: '1rem', 
                      fontWeight: '600' 
                    }}>
                      {Math.round(generationProgress)}%
                    </span>
                  </div>
                  
                  <div style={{
                    width: '100%',
                    height: '12px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '6px',
                    overflow: 'hidden',
                    border: '1px solid rgba(77, 183, 255, 0.2)'
                  }}>
                    <motion.div
                      style={{
                        height: '100%',
                        background: aiResponseComplete ? 
                          'linear-gradient(90deg, #10B981, #059669)' :
                          'linear-gradient(90deg, #4DB7FF, #00a8ff)',
                        borderRadius: '6px',
                        boxShadow: aiResponseComplete ? 
                          '0 0 15px rgba(16, 185, 129, 0.6)' :
                          '0 0 15px rgba(77, 183, 255, 0.6)'
                      }}
                      initial={{ width: '0%' }}
                      animate={{ width: `${generationProgress}%` }}
                      transition={{ duration: 0.3, ease: 'easeOut' }}
                    />
                  </div>
                  
                  {aiResponseComplete && (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      style={{
                        marginTop: '0.75rem',
                        padding: '0.75rem',
                        background: 'rgba(16, 185, 129, 0.1)',
                        border: '1px solid rgba(16, 185, 129, 0.3)',
                        borderRadius: '8px',
                        textAlign: 'center'
                      }}
                    >
                      <span style={{ 
                        color: '#10B981', 
                        fontSize: '0.9rem', 
                        fontWeight: '600' 
                      }}>
                        ✅ AI Response Complete - Processing Flashcards...
                      </span>
                    </motion.div>
                  )}
                </div>
              )}
              <p style={{ color: '#cccccc', marginTop: '1rem', fontSize: '0.9rem' }}>
                AI will analyze the PDF content and create up to 12 exam-focused flashcards with critical concepts, key definitions, formulas, and important facts prioritized for exam success.
              </p>
            </div>
          </motion.div>
        )}

        {/* Generated Flashcards */}
        {flashcardData.flashcards.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="settings-section"
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h2 className="section-title">
                <Zap size={24} style={{ marginRight: '0.5rem' }} />
                Generated Flashcards ({flashcardData.flashcards.length})
              </h2>
              
              <div style={{ display: 'flex', gap: '1rem' }}>
                <button
                  onClick={shuffleCards}
                  style={{
                    background: 'rgba(255, 255, 255, 0.1)',
                    border: '1px solid rgba(77, 183, 255, 0.3)',
                    color: '#4DB7FF',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = 'rgba(77, 183, 255, 0.1)';
                    e.target.style.transform = 'translateY(-1px)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = 'rgba(255, 255, 255, 0.1)';
                    e.target.style.transform = 'translateY(0)';
                  }}
                >
                  <Shuffle size={16} />
                  Shuffle
                </button>
                
                <button
                  onClick={startStudyMode}
                  style={{
                    background: '#10B981',
                    color: 'white',
                    border: 'none',
                    padding: '0.75rem 1.5rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.3s ease',
                    boxShadow: '0 4px 15px rgba(16, 185, 129, 0.3)'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 6px 20px rgba(16, 185, 129, 0.4)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = '0 4px 15px rgba(16, 185, 129, 0.3)';
                  }}
                >
                  <Play size={16} />
                  Start Study
                </button>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '1.5rem' }}>
              {flashcardData.flashcards.map((card, index) => (
                <motion.div
                  key={card.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  style={{
                    background: card.examRelevance === 'High' ? 
                      'linear-gradient(135deg, rgba(239, 68, 68, 0.08), rgba(185, 28, 28, 0.04))' :
                      card.examRelevance === 'Medium' ?
                      'linear-gradient(135deg, rgba(251, 191, 36, 0.08), rgba(180, 83, 9, 0.04))' :
                      'linear-gradient(135deg, rgba(255, 255, 255, 0.05), rgba(77, 183, 255, 0.02))',
                    border: card.examRelevance === 'High' ? 
                      '2px solid rgba(239, 68, 68, 0.3)' :
                      card.examRelevance === 'Medium' ?
                      '2px solid rgba(251, 191, 36, 0.3)' :
                      '1px solid rgba(77, 183, 255, 0.2)',
                    borderRadius: '16px',
                    padding: '1.5rem',
                    cursor: 'pointer',
                    transition: 'all 0.3s ease',
                    position: 'relative',
                    boxShadow: card.examRelevance === 'High' ? 
                      '0 4px 20px rgba(239, 68, 68, 0.15)' :
                      card.examRelevance === 'Medium' ?
                      '0 4px 20px rgba(251, 191, 36, 0.15)' :
                      '0 2px 10px rgba(77, 183, 255, 0.1)'
                  }}
                  onClick={() => openCardViewer(index)}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-5px) scale(1.02)';
                    if (card.examRelevance === 'High') {
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.5)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(239, 68, 68, 0.25)';
                    } else if (card.examRelevance === 'Medium') {
                      e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.5)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(251, 191, 36, 0.25)';
                    } else {
                      e.currentTarget.style.borderColor = 'rgba(77, 183, 255, 0.4)';
                      e.currentTarget.style.boxShadow = '0 8px 25px rgba(77, 183, 255, 0.15)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    if (card.examRelevance === 'High') {
                      e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.3)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(239, 68, 68, 0.15)';
                    } else if (card.examRelevance === 'Medium') {
                      e.currentTarget.style.borderColor = 'rgba(251, 191, 36, 0.3)';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(251, 191, 36, 0.15)';
                    } else {
                      e.currentTarget.style.borderColor = 'rgba(77, 183, 255, 0.2)';
                      e.currentTarget.style.boxShadow = '0 2px 10px rgba(77, 183, 255, 0.1)';
                    }
                  }}
                >
                  {/* Card Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                    <h3 style={{ color: '#ffffff', fontSize: '1rem', fontWeight: '600' }}>
                      Card {index + 1}
                    </h3>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{
                        background: card.difficulty === 'Easy' ? 'rgba(34, 197, 94, 0.1)' : 
                                   card.difficulty === 'Medium' ? 'rgba(251, 191, 36, 0.1)' : 
                                   'rgba(239, 68, 68, 0.1)',
                        color: card.difficulty === 'Easy' ? '#22C55E' : 
                               card.difficulty === 'Medium' ? '#FBBF24' : 
                               '#EF4444',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: '600'
                      }}>
                        {card.difficulty}
                      </span>
                      <span style={{
                        background: 'rgba(77, 183, 255, 0.1)',
                        color: '#4DB7FF',
                        padding: '0.25rem 0.5rem',
                        borderRadius: '12px',
                        fontSize: '0.7rem',
                        fontWeight: '600'
                      }}>
                        {card.category}
                      </span>
                      {card.examRelevance && (
                        <span style={{
                          background: card.examRelevance === 'High' ? 'rgba(239, 68, 68, 0.1)' : 
                                     card.examRelevance === 'Medium' ? 'rgba(251, 191, 36, 0.1)' : 
                                     'rgba(34, 197, 94, 0.1)',
                          color: card.examRelevance === 'High' ? '#EF4444' : 
                                 card.examRelevance === 'Medium' ? '#FBBF24' : 
                                 '#22C55E',
                          padding: '0.25rem 0.5rem',
                          borderRadius: '12px',
                          fontSize: '0.7rem',
                          fontWeight: '600'
                        }}>
                          {card.examRelevance === 'High' ? '🔥' : 
                           card.examRelevance === 'Medium' ? '📚' : '📖'} {card.examRelevance}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Card Content Preview */}
                  <div style={{ marginBottom: '1rem' }}>
                    <div style={{ marginBottom: '0.75rem' }}>
                      <label style={{ color: '#4DB7FF', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem', display: 'block' }}>
                        Question:
                      </label>
                      <p style={{ 
                        color: '#ffffff', 
                        fontSize: '0.9rem', 
                        lineHeight: '1.4',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {card.front}
                      </p>
                    </div>
                    
                    <div>
                      <label style={{ color: '#10B981', fontSize: '0.8rem', fontWeight: '600', marginBottom: '0.25rem', display: 'block' }}>
                        Answer:
                      </label>
                      <p style={{ 
                        color: '#cccccc', 
                        fontSize: '0.85rem', 
                        lineHeight: '1.4',
                        margin: 0,
                        display: '-webkit-box',
                        WebkitLineClamp: 2,
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden'
                      }}>
                        {card.back}
                      </p>
                    </div>
                  </div>

                  {/* View Button */}
                  <div style={{ textAlign: 'center' }}>
                    <button
                      style={{
                        background: 'rgba(77, 183, 255, 0.1)',
                        border: '1px solid #4DB7FF',
                        color: '#4DB7FF',
                        padding: '0.5rem 1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        fontSize: '0.8rem',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        margin: '0 auto',
                        transition: 'all 0.3s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = 'rgba(77, 183, 255, 0.2)';
                        e.target.style.transform = 'scale(1.05)';
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = 'rgba(77, 183, 255, 0.1)';
                        e.target.style.transform = 'scale(1)';
                      }}
                    >
                      <Eye size={14} />
                      View Full Card
                    </button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default FlashcardGenerator;
