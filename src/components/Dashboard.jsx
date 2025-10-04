// components/Dashboard.jsx
import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Dashboard({ tasks = [] }) {
  const [surveys, setSurveys] = useState([]);
  const [chartType, setChartType] = useState('mood');
  const navigate = useNavigate();

  useEffect(() => {
    const s = JSON.parse(localStorage.getItem('surveys') || '[]');
    setSurveys(s);
  }, []);

  const stats = useMemo(() => {
    const totalSurveys = surveys.length;
    const avgMood = surveys.length > 0
      ? (surveys.reduce((sum, s) => sum + Number(s.answers.mood || 0), 0) / surveys.length).toFixed(1)
      : 0;
    const avgPain = surveys.length > 0
      ? (surveys.reduce((sum, s) => sum + Number(s.answers.pain || 0), 0) / surveys.length).toFixed(1)
      : 0;
    const avgExercise = surveys.length > 0
      ? (surveys.reduce((sum, s) => sum + Number(s.answers.exercise || 0), 0) / surveys.length).toFixed(0)
      : 0;
    const avgSleep = surveys.length > 0
      ? (surveys.reduce((sum, s) => sum + Number(s.answers.sleep || 0), 0) / surveys.length).toFixed(1)
      : 0;

    return { totalSurveys, avgMood, avgPain, avgExercise, avgSleep };
  }, [surveys]);

  const chartData = useMemo(() => {
    const sortedSurveys = [...surveys].sort((a, b) => new Date(a.date) - new Date(b.date));

    const labels = sortedSurveys.map(survey =>
      new Date(survey.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    );

    const data = sortedSurveys.map(survey => {
      switch (chartType) {
        case 'mood': return Number(survey.answers.mood || 0);
        case 'pain': return Number(survey.answers.pain || 0);
        case 'exercise': return Number(survey.answers.exercise || 0);
        case 'sleep': return Number(survey.answers.sleep || 0);
        default: return 0;
      }
    });

    const chartConfig = {
      mood: {
        label: 'Mood Level',
        color: 'rgba(59, 130, 246, 0.8)',
        bgColor: 'rgba(59, 130, 246, 0.1)',
        max: 5
      },
      pain: {
        label: 'Pain Level',
        color: 'rgba(239, 68, 68, 0.8)',
        bgColor: 'rgba(239, 68, 68, 0.1)',
        max: 10
      },
      exercise: {
        label: 'Exercise (minutes)',
        color: 'rgba(16, 185, 129, 0.8)',
        bgColor: 'rgba(16, 185, 129, 0.1)',
        max: Math.max(...data, 60)
      },
      sleep: {
        label: 'Sleep Quality',
        color: 'rgba(139, 92, 246, 0.8)',
        bgColor: 'rgba(139, 92, 246, 0.1)',
        max: 5
      }
    };

    const config = chartConfig[chartType];

    return {
      labels,
      datasets: [
        {
          label: config.label,
          data,
          borderColor: config.color,
          backgroundColor: config.bgColor,
          borderWidth: 3,
          fill: true,
          tension: 0.4,
          pointBackgroundColor: config.color,
          pointBorderColor: '#fff',
          pointBorderWidth: 2,
          pointRadius: 6,
          pointHoverRadius: 8,
        }
      ]
    };
  }, [surveys, chartType]);

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      title: {
        display: true,
        text: `Your ${chartType.charAt(0).toUpperCase() + chartType.slice(1)} Trend`,
        font: {
          size: 16,
          weight: 'bold'
        }
      },
      tooltip: {
        backgroundColor: 'rgba(255, 255, 255, 0.95)',
        titleColor: '#1f2937',
        bodyColor: '#4b5563',
        borderColor: '#e5e7eb',
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        max: chartData.datasets[0]?.data.length > 0 ? Math.max(...chartData.datasets[0].data) * 1.1 : 10,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)'
        },
        ticks: {
          color: '#6b7280'
        }
      },
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#6b7280'
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/auth/signin');
  };

  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const StatCard = ({ title, value, subtitle, icon, gradient }) => (
    <div className={`bg-gradient-to-br ${gradient} rounded-2xl p-6 shadow-lg border border-white/20 backdrop-blur-sm transition-all duration-300 hover:scale-105 hover:shadow-xl`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-white/90">{title}</p>
          <p className="text-3xl font-bold text-white mt-2">{value}</p>
          {subtitle && <p className="text-xs text-white/70 mt-1">{subtitle}</p>}
        </div>
        <div className="text-3xl opacity-80">{icon}</div>
      </div>
    </div>
  );

  const ChartTypeButton = ({ type, label, icon, isActive }) => (
    <button
      onClick={() => setChartType(type)}
      className={`flex items-center space-x-3 px-6 py-4 rounded-xl transition-all duration-300 ${isActive
          ? 'bg-blue-600 text-white shadow-lg transform scale-105'
          : 'bg-white/80 text-gray-700 hover:bg-white hover:shadow-md'
        }`}
    >
      <span className="text-xl">{icon}</span>
      <span className="font-medium">{label}</span>
    </button>
  );

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
            Welcome back, {user.name || 'User'}! 👋
          </h1>
          <p className="text-gray-600 mt-2 text-lg">Here's your health overview for today</p>
        </div>
        <button
          onClick={handleLogout}
          className="mt-4 lg:mt-0 bg-white/80 backdrop-blur-sm text-gray-700 hover:bg-white border border-gray-300 px-6 py-3 rounded-xl font-medium transition-all duration-300 hover:shadow-lg hover:scale-105"
        >
          Logout
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Surveys"
          value={stats.totalSurveys}
          subtitle="This month"
          icon="📊"
          gradient="from-blue-500 to-cyan-500"
        />
        <StatCard
          title="Average Mood"
          value={stats.avgMood}
          subtitle="Out of 5"
          icon="😊"
          gradient="from-green-500 to-emerald-500"
        />
        <StatCard
          title="Average Pain"
          value={stats.avgPain}
          subtitle="Out of 10"
          icon="🎯"
          gradient="from-orange-500 to-red-500"
        />
        <StatCard
          title="Avg Exercise"
          value={`${stats.avgExercise}m`}
          subtitle="Daily average"
          icon="💪"
          gradient="from-purple-500 to-pink-500"
        />
      </div>

      {/* Chart Section */}
      <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 lg:mb-0">Health Trends</h2>

          {/* Chart Type Selector */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
            <ChartTypeButton
              type="mood"
              label="Mood"
              icon="😊"
              isActive={chartType === 'mood'}
            />
            <ChartTypeButton
              type="pain"
              label="Pain"
              icon="🎯"
              isActive={chartType === 'pain'}
            />
            <ChartTypeButton
              type="exercise"
              label="Exercise"
              icon="💪"
              isActive={chartType === 'exercise'}
            />
            <ChartTypeButton
              type="sleep"
              label="Sleep"
              icon="😴"
              isActive={chartType === 'sleep'}
            />
          </div>
        </div>

        <div className="h-80">
          {surveys.length > 0 ? (
            <Line data={chartData} options={chartOptions} />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <div className="text-6xl mb-4">📈</div>
                <p className="text-lg mb-2">No survey data yet</p>
                <p className="text-sm">Complete your first survey to see trends</p>
                <button
                  onClick={() => navigate('/survey')}
                  className="mt-4 bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Take First Survey
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Quick Actions & Tasks */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
        {/* Tasks Section */}
        <div className="xl:col-span-2 space-y-6">
          {/* Tasks Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Medication Tasks</h3>
              <span className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full">
                {tasks.length} tasks
              </span>
            </div>

            {tasks.length > 0 ? (
              <div className="space-y-4">
                {tasks.slice(0, 5).map((task) => (
                  <div key={task.id} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl border border-gray-200/60 hover:border-blue-300 transition-all duration-300 hover:shadow-md">
                    <div className="flex items-center space-x-4">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="font-medium text-gray-800">{task.title}</span>
                    </div>
                    <span className={`px-3 py-1 text-xs rounded-full ${task.frequency === 'daily'
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
                <div className="text-6xl mb-4">💊</div>
                <p className="text-gray-500 mb-4">No medication tasks yet</p>
                <button
                  onClick={() => navigate('/medication-parser')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Add Medications
                </button>
              </div>
            )}
          </div>

          {/* Recent Surveys */}
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Recent Surveys</h3>
            {surveys.slice(0, 5).map((survey) => (
              <div key={survey.id} className="flex items-center justify-between py-4 border-b border-gray-200/60 last:border-0">
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
                <div className="text-6xl mb-4">📝</div>
                <p className="text-gray-500 mb-4">No surveys completed yet</p>
                <button
                  onClick={() => navigate('/survey')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
                >
                  Take First Survey
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions Sidebar */}
        <div className="space-y-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl shadow-xl border border-white/60 p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h3>
            <div className="space-y-4">
              <button
                onClick={() => navigate('/survey')}
                className="w-full flex items-center space-x-4 p-6 bg-gradient-to-r from-blue-50 to-cyan-50/50 hover:from-blue-100 hover:to-cyan-100 rounded-xl transition-all duration-300 border border-blue-200/60 hover:border-blue-300 hover:shadow-lg transform hover:scale-[1.02] text-left"
              >
                <div className="text-2xl">📝</div>
                <div>
                  <p className="font-medium text-gray-900">Daily Survey</p>
                  <p className="text-sm text-gray-600">Complete your check-in</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/feeling-analyzer')}
                className="w-full flex items-center space-x-4 p-6 bg-gradient-to-r from-green-50 to-emerald-50/50 hover:from-green-100 hover:to-emerald-100 rounded-xl transition-all duration-300 border border-green-200/60 hover:border-green-300 hover:shadow-lg transform hover:scale-[1.02] text-left"
              >
                <div className="text-2xl">😊</div>
                <div>
                  <p className="font-medium text-gray-900">Feeling Analyzer</p>
                  <p className="text-sm text-gray-600">Get insights</p>
                </div>
              </button>

              <button
                onClick={() => navigate('/medication-parser')}
                className="w-full flex items-center space-x-4 p-6 bg-gradient-to-r from-purple-50 to-pink-50/50 hover:from-purple-100 hover:to-pink-100 rounded-xl transition-all duration-300 border border-purple-200/60 hover:border-purple-300 hover:shadow-lg transform hover:scale-[1.02] text-left"
              >
                <div className="text-2xl">💊</div>
                <div>
                  <p className="font-medium text-gray-900">Add Medications</p>
                  <p className="text-sm text-gray-600">Manage your prescriptions</p>
                </div>
              </button>
            </div>
          </div>

          {/* Health Tips */}
          <div className="bg-gradient-to-br from-emerald-50 to-green-100/50 rounded-3xl p-8 border border-emerald-200/60 shadow-lg">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center text-lg">
              <span className="text-2xl mr-3">💡</span>
              Health Tips
            </h3>
            <ul className="space-y-3 text-sm text-gray-700">
              <li className="flex items-start space-x-3">
                <span className="text-emerald-500 mt-1 text-lg">•</span>
                <span className="leading-relaxed">Stay hydrated throughout the day</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-emerald-500 mt-1 text-lg">•</span>
                <span className="leading-relaxed">Take regular breaks if sitting for long</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-emerald-500 mt-1 text-lg">•</span>
                <span className="leading-relaxed">Practice deep breathing exercises</span>
              </li>
              <li className="flex items-start space-x-3">
                <span className="text-emerald-500 mt-1 text-lg">•</span>
                <span className="leading-relaxed">Maintain consistent sleep schedule</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
