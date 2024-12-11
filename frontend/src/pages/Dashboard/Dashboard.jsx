import React from "react";
import { useNavigate } from "react-router-dom";
import {
  Mic,
  VideoIcon,
  BookOpen,
  MessageSquare,
  ChevronRight,
} from "lucide-react";

function Dashboard() {
  const navigate = useNavigate();

  const assessmentTypes = [
    {
      title: "Speaking Assessment",
      icon: <Mic className="w-8 h-8" />,
      description:
        "Evaluate your spoken English skills with AI-powered analysis",
      color: "bg-brand-blue",
      count: "3 Tests Available",
      path: "assessment/setup",
    },
    {
      title: "Video Interview",
      icon: <VideoIcon className="w-8 h-8" />,
      description: "Practice interview scenarios with real-time feedback",
      color: "bg-brand-purple",
      count: "5 Scenarios",
    },
    {
      title: "Reading Comprehension",
      icon: <BookOpen className="w-8 h-8" />,
      description: "Test your reading and understanding abilities",
      color: "bg-brand-orange",
      count: "4 Tests Available",
    },
    {
      title: "Conversation Practice",
      icon: <MessageSquare className="w-8 h-8" />,
      description: "Practice daily conversations and improve fluency",
      color: "bg-brand-yellow",
      count: "8 Topics",
    },
  ];

  const handleAssessmentClick = (path) => {
    if (path) {
      navigate(path);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            Welcome back, User!
          </h1>
          <p className="text-gray-600 mt-2">
            Choose an assessment to get started
          </p>
        </div>

        {/* Assessment Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          {assessmentTypes.map((assessment, index) => (
            <div
              key={index}
              className="bg-white p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleAssessmentClick(assessment.path)}
            >
              <div className="flex items-start justify-between">
                <div
                  className={`${assessment.color} p-3 rounded-lg text-white`}
                >
                  {assessment.icon}
                </div>
                <span className="text-sm text-gray-500">
                  {assessment.count}
                </span>
              </div>
              <h3 className="text-xl font-semibold mt-4 text-gray-900">
                {assessment.title}
              </h3>
              <p className="mt-2 text-gray-600">{assessment.description}</p>
              <button className="mt-4 text-brand-blue flex items-center text-sm hover:text-brand-purple transition-colors">
                Start Assessment <ChevronRight className="w-4 h-4 ml-1" />
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
