import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function FeelingAnalyzer() {
  const [feelingText, setFeelingText] = useState('')
  const [analysis, setAnalysis] = useState(null)
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [suggestions] = useState([
    "I've been having headaches and feeling tired lately",
    "My stomach hurts and I can't sleep well",
    "Feeling anxious about work and having trouble focusing",
    "Joint pain in the morning and low energy throughout the day",
    "Stress from school and feeling overwhelmed"
  ])
  const navigate = useNavigate()

  async function analyzeFeeling() {
    if (!feelingText.trim()) return
    setIsAnalyzing(true)
    setAnalysis(null)

    // Simulate API call delay
    setTimeout(() => {
      const result = localAnalyze(feelingText)
      setAnalysis(result)
      setIsAnalyzing(false)
    }, 2000)
  }

  function localAnalyze(text) {
    const t = text.toLowerCase()
    const recs = []
    let issue = 'General wellness check'
    let severity = 'low'
    let emoji = '🤔'
    let color = 'blue'

    // Physical symptoms
    if (/\b(pain|ache|hurt|sore|tender)\b/.test(t)) {
      if (/\b(head|headache|migraine)\b/.test(t)) {
        issue = 'Head pain or discomfort'
        recs.push('Track headache frequency and triggers in your daily survey')
        recs.push('Ensure proper hydration and consider over-the-counter pain relief if appropriate')
        recs.push('Consult healthcare provider if headaches persist or worsen')
      } else if (/\b(stomach|abdominal|belly|nauseous)\b/.test(t)) {
        issue = 'Digestive discomfort'
        recs.push('Monitor food intake and symptoms pattern')
        recs.push('Stay hydrated and consider dietary adjustments')
        recs.push('Consult doctor if symptoms persist for more than 2 days')
      } else if (/\b(chest|heart|lung)\b/.test(t)) {
        issue = 'Chest area discomfort'
        severity = 'high'
        emoji = '🚨'
        color = 'red'
        recs.push('Seek immediate medical attention for chest pain')
        recs.push('Monitor symptoms and note any additional symptoms')
        recs.push('Contact healthcare provider as soon as possible')
      } else {
        issue = 'General physical discomfort'
        recs.push('Note pain location and intensity in daily survey')
        recs.push('Apply RICE method (Rest, Ice, Compression, Elevation) if applicable')
        recs.push('Consult healthcare provider if pain persists')
      }
    }

    // Sleep issues
    if (/\b(tired|fatigue|exhausted|sleep|insomnia|wake)\b/.test(t)) {
      issue = 'Sleep or energy issues'
      emoji = '😴'
      color = 'purple'
      recs.push('Maintain consistent sleep schedule (even on weekends)')
      recs.push('Track sleep patterns and energy levels in daily survey')
      recs.push('Limit screen time 1 hour before bed and create relaxing bedtime routine')
      recs.push('Consider discussing sleep patterns with healthcare provider')
    }

    // Mental health
    if (/\b(anxious|anxiety|worried|worry|stress|stressed|overwhelmed)\b/.test(t)) {
      issue = 'Stress or anxiety concerns'
      emoji = '😥'
      color = 'orange'
      recs.push('Practice deep breathing exercises when feeling overwhelmed')
      recs.push('Continue tracking mood patterns in daily survey')
      recs.push('Consider speaking with mental health professional')
      recs.push('Try mindfulness or meditation exercises (5-10 minutes daily)')
    }

    if (/\b(depress|sad|down|hopeless|miserable)\b/.test(t)) {
      issue = 'Mood concerns'
      severity = 'medium'
      emoji = '😔'
      color = 'orange'
      recs.push('Reach out to trusted friends or family members')
      recs.push('Consider speaking with mental health professional')
      recs.push('Maintain daily routine and engage in enjoyable activities')
      recs.push('Contact crisis helpline if having thoughts of self-harm')
    }

    // Default recommendations if no specific patterns found
    if (!recs.length) {
      recs.push('Continue tracking symptoms in your daily survey')
      recs.push('Maintain hydration and balanced nutrition')
      recs.push('Consider discussing concerns with healthcare provider during next visit')
      recs.push('Practice stress-reduction techniques like light exercise or meditation')
    }

    return {
      issue,
      recommendations: recs,
      severity,
      emoji,
      color,
      source: 'ai-analysis',
      timestamp: new Date().toISOString()
    }
  }

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 border-red-300 text-red-800'
      case 'medium': return 'bg-orange-100 border-orange-300 text-orange-800'
      default: return 'bg-blue-100 border-blue-300 text-blue-800'
    }
  }

  const getColorClasses = (color) => {
    switch (color) {
      case 'red': return 'from-red-500 to-orange-500'
      case 'orange': return 'from-orange-500 to-amber-500'
      case 'purple': return 'from-purple-500 to-indigo-500'
      default: return 'from-blue-500 to-cyan-500'
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors duration-200"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Feeling Analyzer
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Describe how you're feeling and get personalized health insights and recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Input Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
              <div className="mb-6">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  How are you feeling today?
                </label>
                <textarea
                  value={feelingText}
                  onChange={(e) => setFeelingText(e.target.value)}
                  placeholder="Describe your symptoms, emotions, or concerns in detail... (e.g., 'I've been having headaches in the afternoon and feeling more tired than usual')"
                  className="w-full h-48 px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition resize-none"
                  rows={6}
                />
                <div className="flex justify-between items-center mt-2">
                  <span className="text-sm text-gray-500">
                    {feelingText.length}/500 characters
                  </span>
                  <button
                    onClick={() => setFeelingText('')}
                    className="text-sm text-gray-500 hover:text-gray-700 transition-colors duration-200"
                  >
                    Clear
                  </button>
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={analyzeFeeling}
                  disabled={isAnalyzing || !feelingText.trim()}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 disabled:from-gray-300 disabled:to-gray-400 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-200 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed shadow-md"
                >
                  {isAnalyzing ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Analyzing...</span>
                    </div>
                  ) : (
                    'Analyze My Feelings'
                  )}
                </button>
              </div>
            </div>

            {/* Quick Suggestions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mt-6">
              <h3 className="font-semibold text-gray-900 mb-4">Need inspiration? Try these examples:</h3>
              <div className="space-y-2">
                {suggestions.map((suggestion, index) => (
                  <button
                    key={index}
                    onClick={() => setFeelingText(suggestion)}
                    className="w-full text-left p-3 bg-gray-50 hover:bg-blue-50 rounded-lg transition-colors duration-200 border border-transparent hover:border-blue-200"
                  >
                    <span className="text-gray-700">{suggestion}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Analysis Results Sidebar */}
          <div className="space-y-6">
            {analysis && (
              <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                {/* Header */}
                <div className={`bg-gradient-to-r ${getColorClasses(analysis.color)} p-6 text-white`}>
                  <div className="flex items-center space-x-3">
                    <span className="text-2xl">{analysis.emoji}</span>
                    <div>
                      <h3 className="font-bold text-lg">Analysis Complete</h3>
                      <p className="text-blue-100 text-sm">Based on your description</p>
                    </div>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 space-y-6">
                  {/* Issue */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-2">Potential Issue</h4>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${getSeverityColor(analysis.severity)}`}>
                        {analysis.severity === 'high' ? 'High Priority' :
                          analysis.severity === 'medium' ? 'Moderate Priority' : 'General Concern'}
                      </span>
                      <span className="text-gray-900 font-medium">{analysis.issue}</span>
                    </div>
                  </div>

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-gray-900 mb-3">Recommendations</h4>
                    <div className="space-y-2">
                      {analysis.recommendations.map((rec, i) => (
                        <div key={i} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                          <span className="text-gray-700 text-sm">{rec}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Disclaimer */}
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                    <p className="text-yellow-800 text-sm">
                      <strong>Note:</strong> This analysis is for informational purposes only.
                      Always consult healthcare professionals for medical advice.
                    </p>
                  </div>

                  <div className="text-xs text-gray-500 text-center">
                    Analysis generated: {new Date(analysis.timestamp).toLocaleString()}
                  </div>
                </div>
              </div>
            )}

            {/* Tips Card */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-2xl p-6 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-lg mr-2">💡</span>
                Tips for Better Analysis
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Be specific about symptoms and timing</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Mention duration and severity</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Include any triggers or patterns</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Describe impact on daily activities</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
