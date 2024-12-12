import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { getIdealAnswer } from '../../services/api';
import OverallPerformance from '../../components/Feedback/OverallPerformance';
import DetailedFeedback from '../../components/Feedback/DetailedFeedback/DetailedFeedback';
import { saveAssessment } from '../../services/assessmentService';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const [idealAnswers, setIdealAnswers] = useState({});
  const [loadingIdealAnswer, setLoadingIdealAnswer] = useState({});
  const [expandedQuestion, setExpandedQuestion] = useState(null);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);

  useEffect(() => {
    const storedData = localStorage.getItem('assessmentFeedback');
    if (storedData) {
      setAssessmentData(JSON.parse(storedData));
    }
  }, []);

  const handleGetIdealAnswer = async (question, answer, index) => {
    try {
      setLoadingIdealAnswer(prev => ({ ...prev, [index]: true }));
      const result = await getIdealAnswer(question, answer);

      let parsedData;
      try {
        parsedData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
      } catch (e) {
        console.error('Error parsing ideal answer response try again:', e);
        parsedData = {
          ideal_answer: 'Error parsing response try again...',
          user_strengths: 'Unable to analyze try again...',
          areas_for_improvement: 'Unable to analyze try again...',
          improvement_suggestions: 'Unable to analyze try again...'
        };
      }

      setIdealAnswers(prev => ({
        ...prev,
        [index]: parsedData
      }));
    } catch (error) {
      console.error('Error getting ideal answer:', error);
      setIdealAnswers(prev => ({
        ...prev,
        [index]: {
          ideal_answer: 'Failed to get ideal answer',
          user_strengths: 'Error occurred',
          areas_for_improvement: 'Error occurred',
          improvement_suggestions: 'Please try again later'
        }
      }));
    } finally {
      setLoadingIdealAnswer(prev => ({ ...prev, [index]: false }));
    }
  };

  const handleSaveAssessment = async () => {
    try {
      setIsSaving(true);
      setUploadProgress(0);

      const savedAssessment = await saveAssessment(
        assessmentData,
        (progress) => setUploadProgress(progress)
      );

      console.log("Assessment data ready to save:", savedAssessment);
      alert("Assessment saved successfully!");
    } catch (error) {
      console.error("Error saving assessment:", error);
      alert(`Failed to save assessment: ${error.message}`);
    } finally {
      setIsSaving(false);
      setUploadProgress(0);
    }
  };

  if (!assessmentData) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="container mx-auto p-6 text-center"
      >
        <p>No feedback data available.</p>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-brand-blue text-white rounded hover:opacity-90"
        >
          Return to Dashboard
        </motion.button>
      </motion.div>
    );
  }

  // Calculate overall statistics and performance percentages
  const overallStats = assessmentData.feedback.reduce((acc, questionFeedback) => {
    if (questionFeedback) {
      // Add null checks for each property
      acc.totalGrammarErrors += questionFeedback.grammar?.error_count || 0;
      acc.totalPronunciationErrors += questionFeedback.pronunciation?.error_count || 0;

      if (questionFeedback.fluency) {
        acc.totalFluencyScore += questionFeedback.fluency.fluency_score || 0;
        acc.totalFillerWords += questionFeedback.fluency.filler_word_count || 0;
        acc.fluencyCount += 1;
      }

      if (questionFeedback.vocabulary) {
        acc.totalVocabularyScore += questionFeedback.vocabulary.vocabulary_score || 0;
        acc.totalAdvancedWords += questionFeedback.vocabulary.total_advanced_words || 0;
        acc.vocabularyCount += 1;
      }

      if (questionFeedback.correctness) {
        acc.totalCorrectnessScore += questionFeedback.correctness.score || 0;
        acc.correctnessCount += 1;
      }

      if (questionFeedback.pause_count !== undefined) {
        acc.totalPauses += questionFeedback.pause_count;
        acc.pauseCount += 1;
      }
    }
    return acc;
  }, {
    totalGrammarErrors: 0,
    totalPronunciationErrors: 0,
    totalFluencyScore: 0,
    totalFillerWords: 0,
    fluencyCount: 0,
    totalVocabularyScore: 0,
    totalAdvancedWords: 0,
    vocabularyCount: 0,
    totalCorrectnessScore: 0,
    correctnessCount: 0,
    totalPauses: 0,
    pauseCount: 0,
    totalQuestions: assessmentData.questions.length
  });

  const totalQuestions = assessmentData.questions.length;

  // Calculate performance percentages
  const grammarPerformance = Math.max(0, Math.min(100, 100 - (overallStats.totalGrammarErrors / totalQuestions * 20)));
  const pronunciationPerformance = Math.max(0, Math.min(100, 100 - (overallStats.totalPronunciationErrors / totalQuestions * 20)));
  const fluencyPerformance = overallStats.fluencyCount > 0
    ? overallStats.totalFluencyScore / overallStats.fluencyCount
    : 100;
  const vocabularyPerformance = overallStats.vocabularyCount > 0
    ? overallStats.totalVocabularyScore / overallStats.vocabularyCount
    : 50;
  const correctnessPerformance = overallStats.correctnessCount > 0
    ? overallStats.totalCorrectnessScore / overallStats.correctnessCount
    : 0;
  const pausePerformance = overallStats.pauseCount > 0
    ? Math.max(0, Math.min(100, 100 - (overallStats.totalPauses / overallStats.pauseCount * 10)))
    : 100;

  const overallScore = Math.round(
    (grammarPerformance * 0.166) +
    (pronunciationPerformance * 0.166) +
    (fluencyPerformance * 0.166) +
    (vocabularyPerformance * 0.166) +
    (correctnessPerformance * 0.166) +
    (pausePerformance * 0.166)
  );

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="container mx-auto p-6"
    >
      <motion.h1
        initial={{ y: -20 }}
        animate={{ y: 0 }}
        className="text-3xl font-bold mb-6"
      >
        Assessment Feedback
      </motion.h1>

      {/* Overall Performance Section */}
      <OverallPerformance
        overallScore={overallScore}
        overallStats={overallStats}
        grammarPerformance={grammarPerformance}
        pronunciationPerformance={pronunciationPerformance}
        fluencyPerformance={fluencyPerformance}
        vocabularyPerformance={vocabularyPerformance}
        correctnessPerformance={correctnessPerformance}
        pausePerformance={pausePerformance}
        showDetailedFeedback={showDetailedFeedback}
        setShowDetailedFeedback={setShowDetailedFeedback}
      />

      {/* Detailed Feedback Section */}
      <DetailedFeedback
        showDetailedFeedback={showDetailedFeedback}
        assessmentData={assessmentData}
        expandedQuestion={expandedQuestion}
        setExpandedQuestion={setExpandedQuestion}
        handleGetIdealAnswer={handleGetIdealAnswer}
        loadingIdealAnswer={loadingIdealAnswer}
        idealAnswers={idealAnswers}
      />

      {/* Save Assessment Button */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="mt-8 flex flex-col items-center gap-4"
      >
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleSaveAssessment}
          disabled={isSaving}
          className={`px-6 py-2.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all duration-300 text-sm flex items-center gap-2 ${isSaving ? 'opacity-50 cursor-not-allowed' : ''}`}
        >
          {isSaving ? (
            <>
              <svg className="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Saving Assessment...
            </>
          ) : (
            'Save Assessment'
          )}
        </motion.button>

        {uploadProgress > 0 && uploadProgress < 100 && (
          <div className="w-full max-w-md bg-gray-200 rounded-full h-2.5">
            <div
              className="bg-green-600 h-2.5 rounded-full transition-all duration-300"
              style={{ width: `${uploadProgress}%` }}
            ></div>
          </div>
        )}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 bg-brand-blue text-white rounded-lg hover:opacity-90 transition-all duration-300 text-sm"
        >
          Return to Dashboard
        </motion.button>
      </motion.div>
    </motion.div>
  );
};

export default FeedbackPage;