// components/FeelingAnalyzer.jsx
import { useState } from 'react';
import { feelingAnalyzerAPI } from '../services/api';

export default function FeelingAnalyzer({ onAnalysisComplete }) {
  const [feelingText, setFeelingText] = useState('');
  const [analysis, setAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState('');

  const suggestions = [
    "I've been having headaches and feeling tired lately",
    "My stomach hurts and I can't sleep well",
    "Feeling anxious about work and having trouble focusing",
    "Joint pain in the morning and low energy throughout the day",
    "Stress from school and feeling overwhelmed"
  ];

  const analyzeFeeling = async () => {
    if (!feelingText.trim()) return;

    setIsAnalyzing(true);
    setError('');
    setAnalysis(null);

    try {
      // NOTE: This makes the actual API call to your backend
      const result = await feelingAnalyzerAPI.analyzeSymptoms(feelingText);

      setAnalysis(result);
      if (onAnalysisComplete) {
        onAnalysisComplete(result);
      }
    } catch (err) {
      console.error('API Error:', err);
      setError('Failed to analyze symptoms. Please try again.');

      // Fallback to local analysis if API fails
      const localResult = localAnalyze(feelingText);
      setAnalysis(localResult);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const localAnalyze = (text) => {
    // ... (same local analysis logic as before)
    const t = text.toLowerCase();
    const recs = [];
    let issue = 'General wellness check';
    let severity = 'low';
    let emoji = '🤔';
    let color = 'blue';

    if (/\b(pain|ache|hurt|sore|tender)\b/.test(t)) {
      if (/\b(head|headache|migraine)\b/.test(t)) {
        issue = 'Head pain or discomfort';
        recs.push('Track headache frequency and triggers in your daily survey');
        recs.push('Ensure proper hydration and consider over-the-counter pain relief if appropriate');
        recs.push('Consult healthcare provider if headaches persist or worsen');
      }
      // ... rest of analysis logic
    }

    return {
      issue,
      recommendations: recs,
      severity,
      emoji,
      color,
      source: 'local-fallback',
      timestamp: new Date().toISOString()
    };
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800';
      case 'medium': return 'bg-orange-100 border-orange-300 text-orange-800';
      default: return 'bg-blue-100 border-blue-300 text-blue-800';
    }
  };

  const getColorClasses = (color) => {
    switch (color) {
      case 'red': return 'from-red-500 to-orange-500';
      case 'orange': return 'from-orange-500 to-amber-500';
      case 'purple': return 'from-purple-500 to-indigo-500';
      default: return 'from-blue-500 to-cyan-500';
    }
  };

  return (
    <div className="space-y-6">
      {/* Input Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
        <div className="mb-6">
          <label className="block text-xl font-semibold text-gray-900 mb-4">
            How are you feeling today?
          </label>
          <textarea
            value={feelingText}
            onChange={(e) => setFeelingText(e.target.value)}
            placeholder="Describe your symptoms, emotions, or concerns in detail..."
            className="w-full h-48 px-6 py-4 border border-gray-300 rounded-2xl focus:ring-4 focus:ring-blue-500/20 focus:border-blue-500 outline-none transition-all duration-300 resize-none shadow-inner"
            rows={6}
          />
          <div className="flex justify-between items-center mt-3">
            <span className="text-sm text-gray-500">
              {feelingText.length}/500 characters
            </span>
            <button
              onClick={() => setFeelingText('')}
              className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200 hover:scale-110"
            >
              Clear
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-xl text-red-700">
            {error}
          </div>
        )}

        <div className="flex space-x-4">
          <button
            onClick={analyzeFeeling}
            disabled={isAnalyzing || !feelingText.trim()}
            className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-4 px-8 rounded-2xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
          >
            {isAnalyzing ? (
              <div className="flex items-center justify-center space-x-3">
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                <span>Analyzing with AI...</span>
              </div>
            ) : (
              'Analyze My Feelings'
            )}
          </button>
        </div>
      </div>

      {/* Quick Suggestions */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
        <h3 className="font-semibold text-gray-900 mb-6 text-lg">Need inspiration? Try these examples:</h3>
        <div className="space-y-3">
          {suggestions.map((suggestion, index) => (
            <button
              key={index}
              onClick={() => setFeelingText(suggestion)}
              className="w-full text-left p-4 bg-gradient-to-r from-gray-50 to-blue-50/50 hover:from-blue-50 hover:to-purple-50 rounded-xl transition-all duration-300 border border-gray-200/60 hover:border-blue-300 hover:shadow-md transform hover:scale-[1.02]"
            >
              <span className="text-gray-700">{suggestion}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Analysis Results */}
      {analysis && (
        <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 overflow-hidden transform transition-all duration-500 animate-in fade-in-0 zoom-in-95">
          <div className={`bg-gradient-to-r ${getColorClasses(analysis.color)} p-8 text-white`}>
            <div className="flex items-center space-x-4">
              <span className="text-3xl">{analysis.emoji}</span>
              <div>
                <h3 className="font-bold text-xl">Analysis Complete</h3>
                <p className="text-blue-100/90 text-sm">
                  {analysis.source === 'local-fallback' ? 'Local Analysis (API Unavailable)' : 'AI-powered health insights'}
                </p>
              </div>
            </div>
          </div>

          <div className="p-6 space-y-6">
            <div>
              <h4 className="font-semibold text-gray-900 mb-3">Potential Issue</h4>
              <div className="flex items-center space-x-3">
                <span className={`px-4 py-2 rounded-full text-sm font-medium ${getSeverityColor(analysis.severity)}`}>
                  {analysis.severity === 'high' ? 'High Priority' :
                    analysis.severity === 'medium' ? 'Moderate Priority' : 'General Concern'}
                </span>
                <span className="text-gray-900 font-medium">{analysis.issue}</span>
              </div>
            </div>

            <div>
              <h4 className="font-semibold text-gray-900 mb-4">Recommendations</h4>
              <div className="space-y-3">
                {analysis.recommendations.map((rec, i) => (
                  <div key={i} className="flex items-start space-x-4 p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/60">
                    <div className="w-3 h-3 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                    <span className="text-gray-700 text-sm leading-relaxed">{rec}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="bg-gradient-to-r from-yellow-50 to-orange-50/30 border border-yellow-200 rounded-xl p-4">
              <p className="text-yellow-800 text-sm leading-relaxed">
                <strong>Note:</strong> This analysis is for informational purposes only.
                Always consult healthcare professionals for medical advice.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
