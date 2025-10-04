import { useEffect, useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Dashboard({ tasks = [] }) {
  const [surveys, setSurveys] = useState([])
  const [activeTab, setActiveTab] = useState('overview')
  const navigate = useNavigate()

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('surveys') || '[]')
    setSurveys(s)
  }, [])

  const stats = useMemo(() => {
    const totalSurveys = surveys.length
    const avgMood = surveys.length > 0
      ? (surveys.reduce((sum, s) => sum + Number(s.answers.mood || 0), 0) / surveys.length).toFixed(1)
      : 0
    const avgPain = surveys.length > 0
      ? (surveys.reduce((sum, s) => sum + Number(s.answers.pain || 0), 0) / surveys.length).toFixed(1)
      : 0
    const avgExercise = surveys.length > 0
      ? (surveys.reduce((sum, s) => sum + Number(s.answers.exercise || 0), 0) / surveys.length).toFixed(0)
      : 0

    return { totalSurveys, avgMood, avgPain, avgExercise }
  }, [surveys])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/auth/signin')
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className={`bg-white rounded-xl p-6 shadow-sm border ${color} transition-all hover:shadow-md`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
        <div className="text-2xl">{icon}</div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50/30 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name || 'User'}! 👋</h1>
            <p className="text-gray-600 mt-2">Here's your health overview for today</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-lg font-medium transition-colors"
          >
            Logout
          </button>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <StatCard
            title="Total Surveys"
            value={stats.totalSurveys}
            subtitle="This month"
            icon="📊"
            color="border-gray-200 hover:border-blue-200"
          />
          <StatCard
            title="Average Mood"
            value={stats.avgMood}
            subtitle="Out of 5"
            icon="😊"
            color="border-gray-200 hover:border-green-200"
          />
          <StatCard
            title="Average Pain"
            value={stats.avgPain}
            subtitle="Out of 10"
            icon="🎯"
            color="border-gray-200 hover:border-orange-200"
          />
          <StatCard
            title="Avg Exercise"
            value={`${stats.avgExercise}m`}
            subtitle="Daily average"
            icon="💪"
            color="border-gray-200 hover:border-purple-200"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="xl:col-span-2 space-y-6">
            {/* Tasks Section */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Medication Tasks</h3>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {tasks.length} tasks
                </span>
              </div>

              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        <span className="font-medium text-gray-800">{task.title}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${task.frequency === 'daily'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-purple-100 text-purple-800'
                        }`}>
                        {task.frequency}
                      </span>
                    </div>
                  ))}
                  {tasks.length > 5 && (
                    <p className="text-center text-gray-500 text-sm mt-4">
                      +{tasks.length - 5} more tasks
                    </p>
                  )}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">💊</div>
                  <p className="text-gray-500 mb-4">No medication tasks yet</p>
                  <button
                    onClick={() => navigate('/medication-parser')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Add Medications
                  </button>
                </div>
              )}
            </div>

            {/* Recent Surveys */}
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Surveys</h3>
              {surveys.slice(0, 5).map((survey) => (
                <div key={survey.id} className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
                  <div>
                    <p className="font-medium text-gray-900">
                      {new Date(survey.date).toLocaleDateString()}
                    </p>
                    <p className="text-sm text-gray-600">
                      Mood: {survey.answers.mood}/5 • Pain: {survey.answers.pain}/10
                    </p>
                  </div>
                  <div className="text-2xl">
                    {Number(survey.answers.mood) >= 4 ? '😊' :
                      Number(survey.answers.mood) >= 3 ? '😐' : '😔'}
                  </div>
                </div>
              ))}
              {surveys.length === 0 && (
                <div className="text-center py-8">
                  <div className="text-4xl mb-3">📝</div>
                  <p className="text-gray-500 mb-4">No surveys completed yet</p>
                  <button
                    onClick={() => navigate('/survey')}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
                  >
                    Take First Survey
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/survey')}
                  className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-lg transition-colors text-left"
                >
                  <div className="text-xl">📝</div>
                  <div>
                    <p className="font-medium text-gray-900">Daily Survey</p>
                    <p className="text-sm text-gray-600">Complete your check-in</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/feeling-analyzer')}
                  className="w-full flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-lg transition-colors text-left"
                >
                  <div className="text-xl">😊</div>
                  <div>
                    <p className="font-medium text-gray-900">Feeling Analyzer</p>
                    <p className="text-sm text-gray-600">Get insights</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/medication-parser')}
                  className="w-full flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-lg transition-colors text-left"
                >
                  <div className="text-xl">💊</div>
                  <div>
                    <p className="font-medium text-gray-900">Add Medications</p>
                    <p className="text-sm text-gray-600">Manage your prescriptions</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Health Tips */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-6 border border-green-200">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
                <span className="text-lg mr-2">💡</span>
                Health Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Stay hydrated throughout the day</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Take regular breaks if sitting for long</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Practice deep breathing exercises</span>
                </li>
                <li className="flex items-start space-x-2">
                  <span className="text-green-500 mt-1">•</span>
                  <span>Maintain consistent sleep schedule</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
