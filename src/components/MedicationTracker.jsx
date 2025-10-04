// components/MedicationTracker.jsx
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function MedicationTracker({ tasks = [], onUpdateTask, onDeleteTask }) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const [showCompleted, setShowCompleted] = useState(false);
  const navigate = useNavigate();

  // Safe function wrappers
  const safeUpdateTask = (updatedTask) => {
    if (typeof onUpdateTask === 'function') {
      onUpdateTask(updatedTask);
    } else {
      console.warn('onUpdateTask is not available');
      // Fallback: update local storage directly
      const updatedTasks = tasks.map(task =>
        task.id === updatedTask.id ? updatedTask : task
      );
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event('storage')); // Trigger storage event
    }
  };

  const safeDeleteTask = (taskId) => {
    if (typeof onDeleteTask === 'function') {
      onDeleteTask(taskId);
    } else {
      console.warn('onDeleteTask is not available');
      // Fallback: delete from local storage directly
      const updatedTasks = tasks.filter(task => task.id !== taskId);
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      window.dispatchEvent(new Event('storage')); // Trigger storage event
    }
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      checkReminders();
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, [tasks]);

  const checkReminders = () => {
    const now = new Date();
    const currentTimeString = now.toTimeString().slice(0, 5);

    tasks.forEach(task => {
      if (task.isActive && !isCompletedToday(task)) {
        task.times?.forEach(time => {
          if (time === currentTimeString) {
            showNotification(task);
          }
        });
      }
    });
  };

  const showNotification = (task) => {
    if ('Notification' in window && Notification.permission === 'granted') {
      new Notification(`💊 Medication Reminder: ${task.title}`, {
        body: `Time to take your ${task.title}`,
        icon: '/favicon.ico',
        tag: task.id
      });
    }
  };

  const requestNotificationPermission = () => {
    if ('Notification' in window && Notification.permission === 'default') {
      Notification.requestPermission();
    }
  };

  useEffect(() => {
    requestNotificationPermission();
  }, []);

  const isCompletedToday = (task) => {
    const today = new Date().toDateString();
    return task.completed?.some(completion =>
      new Date(completion.timestamp).toDateString() === today
    ) || false;
  };

  const isTimeForMedication = (task) => {
    const now = new Date();
    const currentTimeString = now.toTimeString().slice(0, 5);
    return task.times?.some(time => time === currentTimeString) || false;
  };

  const markAsCompleted = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const updatedTask = {
        ...task,
        completed: [
          ...(task.completed || []),
          {
            timestamp: new Date().toISOString(),
            date: new Date().toDateString()
          }
        ]
      };
      safeUpdateTask(updatedTask);
    }
  };

  const markAsIncomplete = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      const today = new Date().toDateString();
      const updatedCompleted = (task.completed || []).filter(completion =>
        new Date(completion.timestamp).toDateString() !== today
      );
      safeUpdateTask({ ...task, completed: updatedCompleted });
    }
  };

  const remindLater = (taskId) => {
    console.log(`Will remind about task ${taskId} later`);
    // You can implement more sophisticated remind later logic here
  };

  const deleteTask = (taskId) => {
    if (window.confirm('Are you sure you want to delete this medication task?')) {
      safeDeleteTask(taskId);
    }
  };

  const getNextReminderTime = (task) => {
    const now = new Date();
    const currentTime = now.toTimeString().slice(0, 5);

    if (!task.times || task.times.length === 0) return 'No times set';

    for (const time of task.times) {
      if (time > currentTime) {
        return time;
      }
    }
    // If no more times today, return first time tomorrow
    return task.times[0];
  };

  const activeTasks = tasks.filter(task => task.isActive);
  const completedTasksToday = activeTasks.filter(task => isCompletedToday(task));
  const pendingTasks = activeTasks.filter(task => !isCompletedToday(task));

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Medication Tracker</h2>
          <p className="text-gray-600">Manage your daily medications and reminders</p>
        </div>
        <div className="flex space-x-3">
          <button
            onClick={requestNotificationPermission}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Enable Notifications
          </button>
          <button
            onClick={() => navigate('/medication-parser')}
            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            Add Medications
          </button>
        </div>
      </div>

      {/* Current Time */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white p-6 rounded-2xl text-center">
        <div className="text-sm opacity-80">Current Time</div>
        <div className="text-3xl font-bold mt-2">
          {currentTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
        </div>
        <div className="text-sm opacity-80 mt-1">
          {currentTime.toLocaleDateString([], { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
        </div>
      </div>

      {/* Pending Medications */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Pending Medications
          </h3>
          <span className="bg-orange-100 text-orange-800 text-sm px-3 py-1 rounded-full">
            {pendingTasks.length} pending
          </span>
        </div>

        {pendingTasks.length > 0 ? (
          <div className="space-y-4">
            {pendingTasks.map(task => (
              <div key={task.id} className={`p-4 rounded-xl border-2 transition-all ${isTimeForMedication(task)
                  ? 'border-orange-400 bg-orange-50 animate-pulse'
                  : 'border-gray-200 bg-gray-50'
                }`}>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <div className="text-2xl">
                      {task.type === 'supplement' ? '🌿' : '💊'}
                    </div>
                    <div>
                      <h4 className="font-semibold text-gray-900">{task.title}</h4>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm text-gray-600">
                          Next: {getNextReminderTime(task)}
                        </span>
                        <span className={`px-2 py-1 text-xs rounded-full ${task.frequency === 'once-daily' ? 'bg-green-100 text-green-800' :
                            task.frequency === 'twice-daily' ? 'bg-blue-100 text-blue-800' :
                              task.frequency === 'three-times-daily' ? 'bg-purple-100 text-purple-800' :
                                'bg-gray-100 text-gray-800'
                          }`}>
                          {task.frequency?.replace(/-/g, ' ') || 'as directed'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {isTimeForMedication(task) && (
                      <span className="px-3 py-1 bg-orange-100 text-orange-800 text-sm rounded-full animate-pulse">
                        Time to take!
                      </span>
                    )}
                    <button
                      onClick={() => remindLater(task.id)}
                      className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                    >
                      Remind Later
                    </button>
                    <button
                      onClick={() => markAsCompleted(task.id)}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                    >
                      Mark Complete
                    </button>
                  </div>
                </div>

                {/* Times */}
                {task.times && task.times.length > 0 && (
                  <div className="flex items-center space-x-2 mt-3">
                    <span className="text-sm text-gray-600">Times:</span>
                    {task.times.map((time, index) => (
                      <span
                        key={index}
                        className={`px-2 py-1 text-xs rounded ${time === getNextReminderTime(task)
                            ? 'bg-blue-100 text-blue-800 font-medium'
                            : 'bg-gray-100 text-gray-600'
                          }`}
                      >
                        {time}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">🎉</div>
            <p className="text-gray-600 text-lg">All medications completed for today!</p>
          </div>
        )}
      </div>

      {/* Completed Medications */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Completed Today
          </h3>
          <span className="bg-green-100 text-green-800 text-sm px-3 py-1 rounded-full">
            {completedTasksToday.length} completed
          </span>
        </div>

        {completedTasksToday.length > 0 ? (
          <div className="space-y-3">
            {completedTasksToday.map(task => (
              <div key={task.id} className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-200">
                <div className="flex items-center space-x-4">
                  <div className="text-2xl text-green-600">✅</div>
                  <div>
                    <h4 className="font-semibold text-gray-900">{task.title}</h4>
                    <p className="text-sm text-gray-600">
                      Completed at {task.completed && task.completed.length > 0
                        ? new Date(task.completed[task.completed.length - 1].timestamp).toLocaleTimeString()
                        : 'Unknown time'
                      }
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => markAsIncomplete(task.id)}
                  className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                >
                  Mark Incomplete
                </button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center py-4">No medications completed yet today</p>
        )}
      </div>

      {/* Medication Management */}
      <div className="bg-white rounded-2xl shadow-lg border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-semibold text-gray-900">
            Manage Medications
          </h3>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
          >
            {showCompleted ? 'Hide Completed' : 'Show All'}
          </button>
        </div>

        <div className="space-y-3">
          {(showCompleted ? tasks : activeTasks).map(task => (
            <div key={task.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
              <div className="flex items-center space-x-4">
                <div className="text-2xl">
                  {task.type === 'supplement' ? '🌿' : '💊'}
                </div>
                <div>
                  <h4 className="font-semibold text-gray-900">{task.title}</h4>
                  <div className="flex items-center space-x-2 mt-1">
                    <span className="text-sm text-gray-600">
                      {task.times?.join(', ') || 'No times set'}
                    </span>
                    {!task.isActive && (
                      <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                        Inactive
                      </span>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => safeUpdateTask({ ...task, isActive: !task.isActive })}
                  className={`px-4 py-2 rounded-lg transition-colors ${task.isActive
                      ? 'bg-orange-500 text-white hover:bg-orange-600'
                      : 'bg-green-500 text-white hover:bg-green-600'
                    }`}
                >
                  {task.isActive ? 'Deactivate' : 'Activate'}
                </button>
                <button
                  onClick={() => deleteTask(task.id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {tasks.length === 0 && (
          <div className="text-center py-8">
            <div className="text-6xl mb-4">💊</div>
            <p className="text-gray-600 mb-4">No medications added yet</p>
            <button
              onClick={() => navigate('/medication-parser')}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-xl transition-colors"
            >
              Add Medications
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
