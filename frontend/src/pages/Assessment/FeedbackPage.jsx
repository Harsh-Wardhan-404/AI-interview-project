import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getIdealAnswer } from '../../services/api';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);
  const [idealAnswers, setIdealAnswers] = useState({});
  const [loadingIdealAnswer, setLoadingIdealAnswer] = useState({});

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
      
      // Parse the response data if it's a string
      let parsedData;
      try {
        parsedData = typeof result.data === 'string' ? JSON.parse(result.data) : result.data;
      } catch (e) {
        console.error('Error parsing ideal answer response:', e);
        parsedData = {
          ideal_answer: 'Error parsing response',
          user_strengths: 'Unable to analyze',
          areas_for_improvement: 'Unable to analyze',
          improvement_suggestions: 'Unable to analyze'
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

  if (!assessmentData) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>No feedback data available.</p>
        <button 
          onClick={() => navigate('/dashboard')}
          className="mt-4 px-4 py-2 bg-brand-blue text-white rounded hover:opacity-90"
        >
          Return to Dashboard
        </button>
      </div>
    );
  }

  // Calculate overall statistics and performance percentages
  const overallStats = assessmentData.feedback.reduce((acc, questionFeedback) => {
    if (questionFeedback) {
      acc.totalGrammarErrors += questionFeedback.grammar.error_count;
      acc.totalPronunciationErrors += questionFeedback.pronunciation.error_count;
      if (questionFeedback.fluency) {
        acc.totalFluencyScore += questionFeedback.fluency.fluency_score;
        acc.fluencyCount += 1;
      }
      if (questionFeedback.vocabulary) {
        acc.totalVocabularyScore += questionFeedback.vocabulary.vocabulary_score;
        acc.totalAdvancedWords += questionFeedback.vocabulary.total_advanced_words;
        acc.vocabularyCount += 1;
      }
      if (questionFeedback.correctness) {
        acc.totalCorrectnessScore += questionFeedback.correctness.score;
        acc.correctnessCount += 1;
      }
    }
    return acc;
  }, { 
    totalGrammarErrors: 0, 
    totalPronunciationErrors: 0,
    totalFluencyScore: 0,
    fluencyCount: 0,
    totalVocabularyScore: 0,
    totalAdvancedWords: 0,
    vocabularyCount: 0,
    totalCorrectnessScore: 0,
    correctnessCount: 0
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

  // Calculate overall score (weighted average)
  const overallScore = Math.round(
    (grammarPerformance * 0.2) +
    (pronunciationPerformance * 0.2) +
    (fluencyPerformance * 0.2) +
    (vocabularyPerformance * 0.2) +
    (correctnessPerformance * 0.2)
  );

  const getHealthBarColor = (percentage) => {
    if (percentage >= 80) return 'bg-brand-blue';
    if (percentage >= 60) return 'bg-brand-yellow';
    if (percentage >= 40) return 'bg-brand-orange';
    return 'bg-brand-red';
  };

  const getScoreGrade = (score) => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Very Good';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Fair';
    return 'Needs Improvement';
  };

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Assessment Feedback</h1>
      
      {/* Overall Feedback Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Overall Performance</h2>
        <div className="grid grid-cols-2 gap-8">
          {/* Overall Score - Left Side */}
          <div className="flex flex-col items-center justify-center">
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-center">
                  <div className="text-5xl font-bold text-brand-blue">{overallScore}</div>
                  <div className="text-sm text-gray-500 mt-1">out of 100</div>
                  <div className="text-lg font-medium text-brand-purple mt-2">
                    {getScoreGrade(overallScore)}
                  </div>
                </div>
              </div>
              <svg className="w-full h-full transform -rotate-90">
                <circle
                  className="text-gray-200"
                  strokeWidth="8"
                  stroke="currentColor"
                  fill="transparent"
                  r="70"
                  cx="96"
                  cy="96"
                />
                <circle
                  className="text-brand-blue"
                  strokeWidth="8"
                  strokeDasharray={440}
                  strokeDashoffset={440 - (440 * overallScore) / 100}
                  strokeLinecap="round"
                  stroke="currentColor"
                  fill="transparent"
                  r="70"
                  cx="96"
                  cy="96"
                />
              </svg>
            </div>
            <div className="mt-4 text-center">
              <p className="text-sm text-gray-600">
                Based on Grammar, Pronunciation, Fluency, Vocabulary, and Answer Correctness
              </p>
            </div>
          </div>

          {/* Performance Metrics - Right Side */}
          <div className="space-y-4">
            {/* Grammar Performance */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-sm font-medium text-gray-800">Grammar</h3>
                <span className="text-xs font-medium text-brand-blue">
                  {grammarPerformance.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getHealthBarColor(grammarPerformance)} transition-all duration-500`}
                  style={{ width: `${grammarPerformance}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {overallStats.totalGrammarErrors} mistakes
              </p>
            </div>

            {/* Pronunciation Performance */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-sm font-medium text-gray-800">Pronunciation</h3>
                <span className="text-xs font-medium text-brand-purple">
                  {pronunciationPerformance.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getHealthBarColor(pronunciationPerformance)} transition-all duration-500`}
                  style={{ width: `${pronunciationPerformance}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {overallStats.totalPronunciationErrors} challenges
              </p>
            </div>

            {/* Fluency Performance */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-sm font-medium text-gray-800">Fluency</h3>
                <span className="text-xs font-medium text-brand-blue">
                  {fluencyPerformance.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getHealthBarColor(fluencyPerformance)} transition-all duration-500`}
                  style={{ width: `${fluencyPerformance}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Speech flow analysis
              </p>
            </div>

            {/* Vocabulary Performance */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-sm font-medium text-gray-800">Vocabulary</h3>
                <span className="text-xs font-medium text-brand-purple">
                  {vocabularyPerformance.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getHealthBarColor(vocabularyPerformance)} transition-all duration-500`}
                  style={{ width: `${vocabularyPerformance}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                {overallStats.totalAdvancedWords} advanced words used
              </p>
            </div>

            {/* Answer Correctness Performance */}
            <div className="bg-gray-50 p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1.5">
                <h3 className="text-sm font-medium text-gray-800">Answer Correctness</h3>
                <span className="text-xs font-medium text-brand-blue">
                  {correctnessPerformance.toFixed(1)}%
                </span>
              </div>
              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                <div 
                  className={`h-full ${getHealthBarColor(correctnessPerformance)} transition-all duration-500`}
                  style={{ width: `${correctnessPerformance}%` }}
                />
              </div>
              <p className="text-xs text-gray-600 mt-1">
                Based on relevance and word count
              </p>
            </div>
          </div>
        </div>

        <button
          onClick={() => setShowDetailedFeedback(!showDetailedFeedback)}
          className="w-full mt-6 px-6 py-2.5 bg-brand-blue text-white rounded-lg hover:opacity-90 transition-colors text-sm"
        >
          {showDetailedFeedback ? 'Hide Detailed Feedback' : 'Show Detailed Feedback'}
        </button>
      </div>

      {/* Detailed Feedback Section */}
      {showDetailedFeedback && (
        <div className="space-y-6">
          {assessmentData.questions.map((question, index) => (
            <div key={index} className="bg-white rounded-lg shadow-md p-6">
              <div className="mb-4">
                <h2 className="text-xl font-semibold mb-2">Question {index + 1}:</h2>
                <p className="text-gray-700 mb-4">{question}</p>
                
                {assessmentData.feedback[index] ? (
                  <div className="space-y-4">
                    <div className="text-gray-600">
                      Your answer: {assessmentData.feedback[index].text}
                    </div>

                    {/* Ideal Answer Button */}
                    <div className="mt-4">
                      <button
                        onClick={() => handleGetIdealAnswer(question, assessmentData.feedback[index].text, index)}
                        disabled={loadingIdealAnswer[index]}
                        className="px-4 py-2 bg-brand-purple text-white rounded-lg hover:opacity-90 transition-colors text-sm disabled:opacity-50"
                      >
                        {loadingIdealAnswer[index] ? 'Loading...' : 'Show Ideal Answer'}
                      </button>
                    </div>

                    {/* Ideal Answer Display */}
                    {idealAnswers[index] && (
                      <div className="bg-purple-50 p-4 rounded-lg mt-4">
                        <h3 className="font-semibold text-brand-purple mb-3">Ideal Answer Analysis</h3>
                        <div className="space-y-3">
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Ideal Answer:</h4>
                            <p className="text-sm text-gray-600 mt-1">{String(idealAnswers[index].ideal_answer)}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Your Strengths:</h4>
                            <p className="text-sm text-gray-600 mt-1">{String(idealAnswers[index].user_strengths)}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Areas for Improvement:</h4>
                            <p className="text-sm text-gray-600 mt-1">{String(idealAnswers[index].areas_for_improvement)}</p>
                          </div>
                          <div>
                            <h4 className="text-sm font-medium text-gray-700">Improvement Suggestions:</h4>
                            <p className="text-sm text-gray-600 mt-1">{String(idealAnswers[index].improvement_suggestions)}</p>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Answer Correctness Feedback */}
                    {assessmentData.feedback[index].correctness && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm">Answer Assessment</h3>
                          <span className="bg-blue-100 text-brand-blue px-2 py-0.5 rounded-full text-xs">
                            {assessmentData.feedback[index].correctness.score}% score
                          </span>
                        </div>
                        <div className="mt-2">
                          <div className="text-sm text-gray-700 whitespace-pre-line">
                            {assessmentData.feedback[index].correctness.detailed_feedback}
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Grammar Feedback */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">Grammar Assessment</h3>
                        <span className="bg-red-100 text-brand-red px-2 py-0.5 rounded-full text-xs">
                          {assessmentData.feedback[index].grammar.error_count} mistakes
                        </span>
                      </div>
                      <ul className="list-disc pl-5 space-y-2">
                        {assessmentData.feedback[index].grammar.errors.map((error, i) => (
                          <li key={i} className="text-gray-700 text-sm">
                            <span className="text-brand-red">{error.word}</span> → 
                            <span className="text-brand-blue ml-2">{error.suggestion}</span>
                            <p className="text-xs text-gray-600 mt-1">{error.explanation}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pronunciation Feedback */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-sm">Pronunciation Assessment</h3>
                        <span className="bg-purple-100 text-brand-purple px-2 py-0.5 rounded-full text-xs">
                          {assessmentData.feedback[index].pronunciation.error_count} challenges
                        </span>
                      </div>
                      <ul className="list-disc pl-5 space-y-2">
                        {assessmentData.feedback[index].pronunciation.errors.map((error, i) => (
                          <li key={i} className="text-gray-700 text-sm">
                            <span className="font-medium">{error.word}</span>
                            <span className="text-brand-blue ml-2">/{error.phonetic}/</span>
                            <p className="text-xs text-gray-600 mt-1">{error.explanation}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Fluency Feedback */}
                    {assessmentData.feedback[index].fluency && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm">Fluency Assessment</h3>
                          <span className="bg-blue-100 text-brand-blue px-2 py-0.5 rounded-full text-xs">
                            {assessmentData.feedback[index].fluency.fluency_score}% fluent
                          </span>
                        </div>
                        {assessmentData.feedback[index].fluency.pause_count > 0 && (
                          <div className="mt-2">
                            <p className="text-sm text-gray-700">
                              Detected {assessmentData.feedback[index].fluency.pause_count} significant pauses
                            </p>
                            <ul className="list-disc pl-5 space-y-2 mt-2">
                              {assessmentData.feedback[index].fluency.pause_details.map((pause, i) => (
                                <li key={i} className="text-xs text-gray-600">
                                  {pause.duration}s pause between "{pause.word_before}" and "{pause.word_after}"
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Vocabulary Feedback */}
                    {assessmentData.feedback[index].vocabulary && (
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold text-sm">Vocabulary Assessment</h3>
                          <span className="bg-purple-100 text-brand-purple px-2 py-0.5 rounded-full text-xs">
                            {assessmentData.feedback[index].vocabulary.vocabulary_score}% score
                          </span>
                        </div>
                        <div className="mt-2">
                          <p className="text-sm text-gray-700">
                            Used {assessmentData.feedback[index].vocabulary.total_advanced_words} advanced words
                          </p>
                          {assessmentData.feedback[index].vocabulary.unique_advanced_words.length > 0 && (
                            <div className="mt-2">
                              <p className="text-xs font-medium text-gray-700">Advanced words used:</p>
                              <div className="flex flex-wrap gap-1.5 mt-1">
                                {assessmentData.feedback[index].vocabulary.unique_advanced_words.map((word, i) => (
                                  <span key={i} className="inline-block px-2 py-0.5 text-xs bg-purple-50 text-brand-purple rounded">
                                    {word}
                                  </span>
                                ))}
                              </div>
                            </div>
                          )}
                          <p className="text-xs text-gray-600 mt-2">
                            {assessmentData.feedback[index].vocabulary.feedback}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="text-gray-500 italic text-sm">No feedback available for this question</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => navigate('/dashboard')}
          className="px-6 py-2.5 bg-brand-blue text-white rounded-lg hover:opacity-90 transition-colors text-sm"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;