import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const FeedbackPage = () => {
  const navigate = useNavigate();
  const [assessmentData, setAssessmentData] = useState(null);
  const [showDetailedFeedback, setShowDetailedFeedback] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('assessmentFeedback');
    if (storedData) {
      setAssessmentData(JSON.parse(storedData));
    }
  }, []);

  if (!assessmentData) {
    return (
      <div className="container mx-auto p-6 text-center">
        <p>No feedback data available.</p>
        <button 
          onClick={() => navigate('/assessments')}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Assessment
        </button>
      </div>
    );
  }

  // Calculate overall statistics
  const overallStats = assessmentData.feedback.reduce((acc, questionFeedback) => {
    if (questionFeedback) {
      acc.totalGrammarErrors += questionFeedback.grammar.error_count;
      acc.totalPronunciationErrors += questionFeedback.pronunciation.error_count;
    }
    return acc;
  }, { totalGrammarErrors: 0, totalPronunciationErrors: 0 });

  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold mb-6">Assessment Feedback</h1>
      
      {/* Overall Feedback Section */}
      <div className="bg-white rounded-lg shadow-md p-6 mb-6">
        <h2 className="text-2xl font-semibold mb-4">Overall Performance</h2>
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-blue-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-blue-800">Grammar Mistakes</h3>
            <p className="text-3xl font-bold text-blue-600 mt-2">
              {overallStats.totalGrammarErrors}
            </p>
          </div>
          <div className="bg-purple-50 p-4 rounded-lg">
            <h3 className="text-lg font-medium text-purple-800">Pronunciation Challenges</h3>
            <p className="text-3xl font-bold text-purple-600 mt-2">
              {overallStats.totalPronunciationErrors}
            </p>
          </div>
        </div>
        <button
          onClick={() => setShowDetailedFeedback(!showDetailedFeedback)}
          className="w-full mt-6 px-6 py-3 bg-gray-800 text-white rounded-lg hover:bg-gray-700 transition-colors"
        >
          {showDetailedFeedback ? 'Hide Detailed Feedback' : 'Show Detailed Feedback'}
        </button>
      </div>

      {/* Detailed Feedback Section */}
      {showDetailedFeedback && (
        <div className="space-y-8">
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

                    {/* Grammar Feedback */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Grammar Assessment</h3>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          {assessmentData.feedback[index].grammar.error_count} mistakes
                        </span>
                      </div>
                      <ul className="list-disc pl-5 space-y-2">
                        {assessmentData.feedback[index].grammar.errors.map((error, i) => (
                          <li key={i} className="text-gray-700">
                            <span className="text-red-600">{error.word}</span> → 
                            <span className="text-green-600 ml-2">{error.suggestion}</span>
                            <p className="text-sm text-gray-600 mt-1">{error.explanation}</p>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Pronunciation Feedback */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">Pronunciation Assessment</h3>
                        <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm">
                          {assessmentData.feedback[index].pronunciation.error_count} challenges
                        </span>
                      </div>
                      <ul className="list-disc pl-5 space-y-2">
                        {assessmentData.feedback[index].pronunciation.errors.map((error, i) => (
                          <li key={i} className="text-gray-700">
                            <span className="font-medium">{error.word}</span>
                            <span className="text-blue-600 ml-2">/{error.phonetic}/</span>
                            <p className="text-sm text-gray-600 mt-1">{error.explanation}</p>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                ) : (
                  <p className="text-gray-500 italic">No feedback available for this question</p>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="mt-8 flex justify-center">
        <button 
          onClick={() => navigate('/assessments')}
          className="px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
        >
          Return to Assessment
        </button>
      </div>
    </div>
  );
};

export default FeedbackPage;