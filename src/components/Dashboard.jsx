import { useEffect, useMemo, useState } from 'react'
import { Bar, Line } from 'react-chartjs-2'
import { useNavigate } from 'react-router-dom'
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js'

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
  Filler
)

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

  const chartData = useMemo(() => {
    if (!surveys.length) return { labels: [], moods: [], pains: [] }

    const last7Surveys = surveys.slice(0, 7).reverse()
    const labels = last7Surveys.map((s) =>
      new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    )
    const moods = last7Surveys.map((s) => Number(s.answers.mood || 0))
    const pains = last7Surveys.map((s) => Number(s.answers.pain || 0))

    return { labels, moods, pains }
  }, [surveys])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/auth/signin')
  }

  const user = JSON.parse(localStorage.getItem('user') || '{}')

  const StatCard = ({ title, value, subtitle, icon, color }) => (
    <div className={`bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow duration-200 ${color}`}>
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
      {/* Header */}
      <div className="max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Welcome back, {user.name || 'User'}! 👋</h1>
            <p className="text-gray-600 mt-2">Here's your health overview for today</p>
          </div>
          <button
            onClick={handleLogout}
            className="mt-4 sm:mt-0 bg-white text-gray-700 hover:bg-gray-50 border border-gray-300 px-4 py-2 rounded-xl font-medium transition-colors duration-200 shadow-sm"
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
            color="hover:border-blue-200"
          />
          <StatCard
            title="Average Mood"
            value={stats.avgMood}
            subtitle="Out of 5"
            icon="😊"
            color="hover:border-green-200"
          />
          <StatCard
            title="Average Pain"
            value={stats.avgPain}
            subtitle="Out of 10"
            icon="🎯"
            color="hover:border-orange-200"
          />
          <StatCard
            title="Avg Exercise"
            value={`${stats.avgExercise}m`}
            subtitle="Daily average"
            icon="💪"
            color="hover:border-purple-200"
          />
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Tasks Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Chart */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">Health Trends</h3>
                <div className="flex space-x-2">
                  {['overview', 'mood', 'pain'].map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-3 py-1 rounded-lg text-sm font-medium capitalize transition-colors duration-200 ${activeTab === tab
                          ? 'bg-blue-500 text-white'
                          : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                        }`}
                    >
                      {tab}
                    </button>
                  ))}
                </div>
              </div>

              {chartData.labels.length > 0 ? (
                <div className="h-64">
                  <Line
                    data={{
                      labels: chartData.labels,
                      datasets: [
                        {
                          label: 'Mood',
                          data: chartData.moods,
                          borderColor: 'rgb(59, 130, 246)',
                          backgroundColor: 'rgba(59, 130, 246, 0.1)',
                          tension: 0.4,
                          fill: true,
                        },
                        {
                          label: 'Pain',
                          data: chartData.pains,
                          borderColor: 'rgb(249, 115, 22)',
                          backgroundColor: 'rgba(249, 115, 22, 0.1)',
                          tension: 0.4,
                          fill: true,
                        }
                      ]
                    }}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: 'top',
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          max: 10,
                        },
                      },
                    }}
                  />
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="text-4xl mb-4">📈</div>
                  <p className="text-gray-500">No survey data yet</p>
                  <button
                    onClick={() => navigate('/survey')}
                    className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Take First Survey
                  </button>
                </div>
              )}
            </div>

            {/* Tasks */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Medication Tasks</h3>
                <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                  {tasks.length} tasks
                </span>
              </div>

              {tasks.length > 0 ? (
                <div className="space-y-3">
                  {tasks.slice(0, 5).map((task) => (
                    <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200">
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
                <div className="text-center py-6">
                  <div className="text-3xl mb-3">💊</div>
                  <p className="text-gray-500 mb-4">No medication tasks yet</p>
                  <button
                    onClick={() => navigate('/medication-parser')}
                    className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg transition-colors duration-200"
                  >
                    Add Medications
                  </button>
                </div>
              )}
            </div>
          </div>

          {/* Quick Actions Sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <button
                  onClick={() => navigate('/survey')}
                  className="w-full flex items-center space-x-3 p-4 bg-blue-50 hover:bg-blue-100 rounded-xl transition-colors duration-200 text-left"
                >
                  <div className="text-xl">📝</div>
                  <div>
                    <p className="font-medium text-gray-900">Daily Survey</p>
                    <p className="text-sm text-gray-600">Complete your check-in</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/feeling-analyzer')}
                  className="w-full flex items-center space-x-3 p-4 bg-green-50 hover:bg-green-100 rounded-xl transition-colors duration-200 text-left"
                >
                  <div className="text-xl">😊</div>
                  <div>
                    <p className="font-medium text-gray-900">Feeling Analyzer</p>
                    <p className="text-sm text-gray-600">Get insights</p>
                  </div>
                </button>

                <button
                  onClick={() => navigate('/medication-parser')}
                  className="w-full flex items-center space-x-3 p-4 bg-purple-50 hover:bg-purple-100 rounded-xl transition-colors duration-200 text-left"
                >
                  <div className="text-xl">💊</div>
                  <div>
                    <p className="font-medium text-gray-900">Add Medications</p>
                    <p className="text-sm text-gray-600">Manage your prescriptions</p>
                  </div>
                </button>
              </div>
            </div>

            {/* Recent Surveys */}
            <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Surveys</h3>
              {surveys.slice(0, 3).map((survey, index) => (
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
                <p className="text-gray-500 text-center py-4">No surveys completed yet</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
