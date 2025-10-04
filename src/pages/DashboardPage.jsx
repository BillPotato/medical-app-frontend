// pages/DashboardPage.jsx
import Dashboard from '../components/Dashboard';
import { useTheme } from '../contexts/ThemeContext';

export default function DashboardPage({ tasks, onUpdateTask, onDeleteTask }) {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen p-4 theme-transition ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30'}`}>
      <div className="max-w-7xl mx-auto">
        <Dashboard
          tasks={tasks || []}
          onUpdateTask={onUpdateTask}
          onDeleteTask={onDeleteTask}
        />
      </div>
    </div>
  );
}
