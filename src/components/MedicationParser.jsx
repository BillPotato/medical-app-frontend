import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function MedicationParser({ onSave }) {
  const [text, setText] = useState('')
  const [parsedTasks, setParsedTasks] = useState([])
  const [isParsing, setIsParsing] = useState(false)
  const navigate = useNavigate()

  const examples = [
    `Lisinopril 10mg - once daily
Metformin 500mg - twice daily with meals
Atorvastatin 20mg - at bedtime
Aspirin 81mg - once daily`,

    `Vitamin D 1000 IU daily
Omega-3 1000mg twice daily
Calcium 600mg with breakfast
Multivitamin once daily`
  ]

  function parseToTasks(input) {
    return input
      .split(/\r?\n/)
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, i) => {
        const lowerLine = line.toLowerCase()
        let frequency = 'as-directed'
        let type = 'medication'

        if (/\b(once|1x|one time)\b/.test(lowerLine)) {
          frequency = 'once-daily'
        } else if (/\b(twice|2x|two times|bid)\b/.test(lowerLine)) {
          frequency = 'twice-daily'
        } else if (/\b(three times|3x|tid)\b/.test(lowerLine)) {
          frequency = 'three-times-daily'
        } else if (/\b(daily|every day|qd)\b/.test(lowerLine)) {
          frequency = 'daily'
        } else if (/\b(weekly|once weekly)\b/.test(lowerLine)) {
          frequency = 'weekly'
        } else if (/\b(as needed|prn|when needed)\b/.test(lowerLine)) {
          frequency = 'as-needed'
        }

        if (/\b(vitamin|supplement|omega|calcium|multivitamin)\b/.test(lowerLine)) {
          type = 'supplement'
        }

        return {
          id: `${Date.now()}-${i}`,
          title: line,
          frequency,
          type,
          parsed: true
        }
      })
  }

  function handleParse() {
    if (!text.trim()) return

    setIsParsing(true)
    setTimeout(() => {
      const tasks = parseToTasks(text)
      setParsedTasks(tasks)
      setIsParsing(false)
    }, 1000)
  }

  function handleSave() {
    if (parsedTasks.length === 0) return

    onSave(parsedTasks)
    setText('')
    setParsedTasks([])
    navigate('/dashboard')
  }

  function loadExample(exampleText) {
    setText(exampleText)
    setParsedTasks([])
  }

  const getFrequencyColor = (frequency) => {
    const colors = {
      'once-daily': 'bg-green-100 text-green-800',
      'twice-daily': 'bg-blue-100 text-blue-800',
      'three-times-daily': 'bg-purple-100 text-purple-800',
      'daily': 'bg-green-100 text-green-800',
      'weekly': 'bg-orange-100 text-orange-800',
      'as-needed': 'bg-gray-100 text-gray-800',
      'as-directed': 'bg-yellow-100 text-yellow-800'
    }
    return colors[frequency] || 'bg-gray-100 text-gray-800'
  }

  const getTypeIcon = (type) => {
    const icons = {
      'medication': '💊',
      'supplement': '🌿'
    }
    return icons[type] || '💊'
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 py-8">
      <div className="max-w-6xl mx-auto px-4">
        {/* Header */}
        <div className="text-center mb-8">
          <button
            onClick={() => navigate('/dashboard')}
            className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6 transition-colors"
          >
            <span>←</span>
            <span>Back to Dashboard</span>
          </button>
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Medication Parser
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Paste your medication list and we'll automatically create manageable tasks
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <div className="mb-4">
                <label className="block text-lg font-semibold text-gray-900 mb-3">
                  Paste Medication List
                </label>
                <textarea
                  value={text}
                  onChange={(e) => setText(e.target.value)}
                  rows={10}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition resize-none font-mono text-sm"
                  placeholder={`Example:
Lisinopril 10mg - once daily
Metformin 500mg - twice daily with meals
Vitamin D 1000 IU - daily
Ibuprofen 400mg - as needed for pain`}
                />
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={handleParse}
                  disabled={isParsing || !text.trim()}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white font-semibold py-3 px-6 rounded-lg transition-all disabled:cursor-not-allowed flex items-center justify-center"
                >
                  {isParsing ? (
                    <>
                      <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                      Parsing...
                    </>
                  ) : (
                    'Parse Medications'
                  )}
                </button>

                {parsedTasks.length > 0 && (
                  <button
                    onClick={handleSave}
                    className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all"
                  >
                    Save {parsedTasks.length} Tasks
                  </button>
                )}
              </div>
            </div>

            {/* Examples */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
              <h3 className="font-semibold text-gray-900 mb-4">Try these examples:</h3>
              <div className="space-y-3">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => loadExample(example)}
                    className="w-full text-left p-4 bg-gray-50 hover:bg-blue-50 rounded-lg transition-all border border-transparent hover:border-blue-200"
                  >
                    <div className="font-mono text-sm text-gray-700 whitespace-pre-line">
                      {example.split('\n').slice(0, 2).join('\n')}
                      {example.split('\n').length > 2 && '...'}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Results Section */}
          <div className="space-y-6">
            {parsedTasks.length > 0 ? (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Parsed Medications ({parsedTasks.length})
                  </h3>
                  <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
                    Ready to save
                  </span>
                </div>

                <div className="space-y-4">
                  {parsedTasks.map((task) => (
                    <div key={task.id} className="p-4 bg-gray-50 rounded-lg border border-gray-200 hover:border-blue-300 transition-colors">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center space-x-3">
                          <span className="text-xl">{getTypeIcon(task.type)}</span>
                          <span className="font-medium text-gray-900">{task.title}</span>
                        </div>
                      </div>

                      <div className="flex flex-wrap gap-2 mt-3">
                        <span className={`px-2 py-1 text-xs rounded-full ${getFrequencyColor(task.frequency)}`}>
                          {task.frequency.replace(/-/g, ' ')}
                        </span>
                        <span className="px-2 py-1 text-xs bg-gray-100 text-gray-800 rounded-full capitalize">
                          {task.type.replace(/-/g, ' ')}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <p className="text-sm text-blue-800">
                    <strong>Tip:</strong> These tasks will be added to your dashboard for tracking.
                  </p>
                </div>
              </div>
            ) : (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-8 text-center">
                <div className="text-6xl mb-4">💊</div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  No medications parsed yet
                </h3>
                <p className="text-gray-600 mb-4">
                  Paste your medication list and click "Parse Medications"
                </p>
                <div className="text-sm text-gray-500 space-y-1">
                  <p>• Supports multiple formats</p>
                  <p>• Automatically detects frequency</p>
                  <p>• Creates trackable tasks</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
