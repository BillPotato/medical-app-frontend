// pages/DashboardPage.jsx
import Dashboard from '../components/Dashboard';

export default function DashboardPage({ tasks }) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-purple-50/30 p-4">
      <div className="max-w-7xl mx-auto">
        <Dashboard tasks={tasks} />
      </div>
    </div>
  );
}
