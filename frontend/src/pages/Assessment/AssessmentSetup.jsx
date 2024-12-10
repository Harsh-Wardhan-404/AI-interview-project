import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Settings,
  BookOpen,
  BarChart3,
  List,
  ChevronRight,
  Sparkles
} from 'lucide-react';

function AssessmentSetup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    questionType: 'general',
    numberOfQuestions: 5,
    topic: 'daily_life',
    difficulty: 'intermediate'
  });

  const questionTypes = [
    { id: 'general', label: 'General Conversation', icon: BookOpen },
    { id: 'business', label: 'Business English', icon: BarChart3 },
    { id: 'academic', label: 'Academic English', icon: Settings },
  ];

  const topics = [
    { id: 'daily_life', label: 'Daily Life' },
    { id: 'work', label: 'Work & Career' },
    { id: 'travel', label: 'Travel & Culture' },
    { id: 'technology', label: 'Technology' },
    { id: 'environment', label: 'Environment' },
    { id: 'education', label: 'Education' },
  ];

  const difficulties = [
    { id: 'beginner', label: 'Beginner', color: 'bg-green-500' },
    { id: 'intermediate', label: 'Intermediate', color: 'bg-brand-blue' },
    { id: 'advanced', label: 'Advanced', color: 'bg-brand-purple' },
    { id: 'expert', label: 'Expert', color: 'bg-brand-orange' },
  ];

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Store setup data in localStorage to be used in GrammarAssessment
    localStorage.setItem('assessmentSetup', JSON.stringify(formData));
    navigate('/assessment/grammar');
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white rounded-2xl shadow-lg p-8">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <Sparkles className="text-brand-yellow" />
              Assessment Setup
            </h1>
            <p className="mt-2 text-gray-600">
              Customize your speaking assessment experience
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Question Type Selection */}
            <div>
              <label className="text-lg font-medium text-gray-900 mb-4 block">
                Question Type
              </label>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {questionTypes.map(type => (
                  <button
                    key={type.id}
                    type="button"
                    onClick={() => handleInputChange('questionType', type.id)}
                    className={`p-4 rounded-xl border-2 transition-all ${
                      formData.questionType === type.id
                        ? 'border-brand-blue bg-brand-blue/5'
                        : 'border-gray-200 hover:border-brand-blue/50'
                    }`}
                  >
                    <type.icon
                      className={`w-6 h-6 mb-2 ${
                        formData.questionType === type.id
                          ? 'text-brand-blue'
                          : 'text-gray-500'
                      }`}
                    />
                    <span className="block text-sm font-medium">
                      {type.label}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Number of Questions */}
            <div>
              <label className="text-lg font-medium text-gray-900 mb-4 block">
                Number of Questions
              </label>
              <input
                type="range"
                min="3"
                max="10"
                value={formData.numberOfQuestions}
                onChange={(e) =>
                  handleInputChange('numberOfQuestions', parseInt(e.target.value))
                }
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-brand-blue"
              />
              <div className="mt-2 text-center font-medium text-brand-blue">
                {formData.numberOfQuestions} Questions
              </div>
            </div>

            {/* Topic Selection */}
            <div>
              <label className="text-lg font-medium text-gray-900 mb-4 block">
                Topic
              </label>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {topics.map(topic => (
                  <button
                    key={topic.id}
                    type="button"
                    onClick={() => handleInputChange('topic', topic.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      formData.topic === topic.id
                        ? 'border-brand-purple bg-brand-purple/5 text-brand-purple'
                        : 'border-gray-200 text-gray-600 hover:border-brand-purple/50'
                    }`}
                  >
                    {topic.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Difficulty Level */}
            <div>
              <label className="text-lg font-medium text-gray-900 mb-4 block">
                Difficulty Level
              </label>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                {difficulties.map(level => (
                  <button
                    key={level.id}
                    type="button"
                    onClick={() => handleInputChange('difficulty', level.id)}
                    className={`p-3 rounded-lg border transition-all ${
                      formData.difficulty === level.id
                        ? `${level.color} text-white`
                        : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    {level.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-4 px-6 bg-gradient-to-r from-brand-blue to-brand-purple text-white rounded-xl font-medium shadow-lg hover:shadow-xl transition-all flex items-center justify-center gap-2"
            >
              Start Assessment
              <ChevronRight className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default AssessmentSetup;