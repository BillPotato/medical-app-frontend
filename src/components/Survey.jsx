import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const defaultQuestions = [
  {
    id: 'mood',
    text: 'How is your mood today?',
    description: 'Rate from 1 (Very Poor) to 5 (Excellent)',
    type: 'scale',
    min: 1,
    max: 5
  },
  {
    id: 'pain',
    text: 'Any pain or discomfort today?',
    description: 'Scale from 0 (No Pain) to 10 (Severe Pain)',
    type: 'scale',
    min: 0,
    max: 10
  },
  {
    id: 'exercise',
    text: 'Minutes of exercise today',
    description: 'Total minutes of physical activity',
    type: 'number',
    placeholder: 'Enter minutes'
  },
  {
    id: 'sleep',
    text: 'Sleep quality last night',
    description: 'Rate your sleep quality from 1-5',
    type: 'scale',
    min: 1,
    max: 5
  },
]

export default function Survey({ onSubmit }) {
  const [answers, setAnswers] = useState(() => {
    const init = {}
    defaultQuestions.forEach((q) => (init[q.id] = ''))
    return init
  })
  const [currentStep, setCurrentStep] = useState(0)
  const navigate = useNavigate()

  const handleChange = (id, value) => {
    setAnswers((s) => ({ ...s, [id]: value }))
  }

  const nextStep = () => {
    if (currentStep < defaultQuestions.length - 1) {
      setCurrentStep(currentStep + 1)
    }
  }

  const prevStep = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1)
    }
  }

  const submit = () => {
    const payload = {
      id: Date.now(),
      date: new Date().toISOString(),
      answers
    }
    const existing = JSON.parse(localStorage.getItem('surveys') || '[]')
    localStorage.setItem('surveys', JSON.stringify([payload, ...existing]))
    onSubmit && onSubmit(payload)

    setAnswers(() => {
      const init = {}
      defaultQuestions.forEach((q) => (init[q.id] = ''))
      return init
    })
    setCurrentStep(0)

    alert('Survey submitted successfully! 🎉')
    navigate('/dashboard')
  }

  const currentQuestion = defaultQuestions[currentStep]
  const progress = ((currentStep + 1) / defaultQuestions.length) * 100

  const renderInput = (question) => {
    switch (question.type) {
      case 'scale':
        return (
          <div className="space-y-4">
            <div className="flex justify-between text-sm text-gray-500 mb-2">
              <span>{question.min} (Low)</span>
              <span>{question.max} (High)</span>
            </div>
            <div className="grid grid-cols-5 gap-2">
              {Array.from({ length: question.max - question.min + 1 }, (_, i) => {
                const value = i + question.min
                return (
                  <button
                    key={value}
                    type="button"
                    onClick={() => handleChange(question.id, value.toString())}
                    className={`py-4 rounded-lg font-semibold transition-all ${answers[question.id] === value.toString()
                        ? 'bg-blue-600 text-white shadow-md transform scale-105'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                  >
                    {value}
                  </button>
                )
              })}
            </div>
          </div>
        )

      case 'number':
        return (
          <input
            type="number"
            value={answers[question.id]}
            onChange={(e) => handleChange(question.id, e.target.value)}
            placeholder={question.placeholder}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition text-lg text-center"
          />
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      <div className="max-w-2xl mx-auto px-4">
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 text-white">
            <button
              onClick={() => navigate('/dashboard')}
              className="flex items-center space-x-2 text-blue-100 hover:text-white mb-6 transition-colors"
            >
              <span>←</span>
              <span>Back to Dashboard</span>
            </button>
            <h1 className="text-3xl font-bold mb-2">Daily Health Survey</h1>
            <p className="text-blue-100">Your responses help track your health progress</p>
          </div>

          {/* Progress Bar */}
          <div className="px-8 pt-6">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Question {currentStep + 1} of {defaultQuestions.length}</span>
              <span>{Math.round(progress)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="p-8">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                {currentQuestion.text}
              </h2>
              <p className="text-gray-600">{currentQuestion.description}</p>
            </div>

            <div className="mb-8">
              {renderInput(currentQuestion)}
            </div>

            {/* Navigation */}
            <div className="flex justify-between pt-6 border-t border-gray-200">
              <button
                onClick={prevStep}
                disabled={currentStep === 0}
                className={`px-6 py-3 rounded-lg font-medium transition-all ${currentStep === 0
                    ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                    : 'bg-gray-500 text-white hover:bg-gray-600'
                  }`}
              >
                Previous
              </button>

              {currentStep === defaultQuestions.length - 1 ? (
                <button
                  onClick={submit}
                  disabled={!answers[currentQuestion.id]}
                  className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Submit Survey
                </button>
              ) : (
                <button
                  onClick={nextStep}
                  disabled={!answers[currentQuestion.id]}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-semibold transition-all disabled:bg-gray-300 disabled:cursor-not-allowed"
                >
                  Next Question
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
