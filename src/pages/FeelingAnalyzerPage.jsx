// pages/FeelingAnalyzerPage.jsx
import { useNavigate } from 'react-router-dom';
import FeelingAnalyzer from '../components/FeelingAnalyzer';

export default function FeelingAnalyzerPage() {
  const navigate = useNavigate();

  const handleAnalysisComplete = (result) => {
    // You can handle the analysis result here if needed
    console.log('Analysis completed:', result);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50/50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-12">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-all duration-300 hover:scale-105 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-xl shadow-sm border border-gray-200"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-5xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Feeling Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Describe how you're feeling and get personalized health insights and recommendations
          </p>
        </div>

        <FeelingAnalyzer onAnalysisComplete={handleAnalysisComplete} />

        {/* Tips Card */}
        <div className="mt-8 bg-gradient-to-br from-emerald-50 to-green-100/50 rounded-3xl p-6 border border-emerald-200/60 shadow-lg">
          <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
            <span className="text-2xl mr-3">💡</span>
            Tips for Better Analysis
          </h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start space-x-3">
              <span className="text-emerald-500 mt-1 text-lg">•</span>
              <span className="leading-relaxed">Be specific about symptoms and timing</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-500 mt-1 text-lg">•</span>
              <span className="leading-relaxed">Mention duration and severity</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-500 mt-1 text-lg">•</span>
              <span className="leading-relaxed">Include any triggers or patterns</span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="text-emerald-500 mt-1 text-lg">•</span>
              <span className="leading-relaxed">Describe impact on daily activities</span>
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
