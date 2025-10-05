// components/MedicationParser.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import axios from "axios"
import { toast } from 'react-toastify';

export default function MedicationParser({ onSave }) {
  const [text, setText] = useState('');
  const [parsedTasks, setParsedTasks] = useState([]);
  const [isParsing, setIsParsing] = useState(false);
  const [isAddingToCalendar, setIsAddingToCalendar] = useState(false); // Add loading state
  const navigate = useNavigate();
  const { isDark } = useTheme();

  // ... existing code ...

  const addToCalendar = async () => {
    if (parsedTasks.length === 0) return;

    setIsAddingToCalendar(true); // Start loading

    try {
      const events = parsedTasks.map(task => {
        return {
          title: task.title,
          frequency: task.frequency,
          times: task.times
        }
      })

      const eventsTextObj = {
        content: JSON.stringify(events)
      }

      const parsedEvents = await axios.post("http://localhost:3001/api/parser", eventsTextObj)
      console.log(`parsedEvents: `, parsedEvents.data)
      await axios.post("http://localhost:3001/api/create", { events: parsedEvents.data })

      // Success notification - loading will stop right before this
      toast.success('Task added to Google Calendar successfully!');
    } catch (error) {
      console.error('Error adding to calendar:', error);
      toast.error('Failed to add task to Google Calendar.');
    } finally {
      setIsAddingToCalendar(false); // End loading regardless of success/error
    }
  }

  // ... existing code ...

  return (
    <div className={`min-h-screen py-8 ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-gray-50 to-blue-50/30'}`}>
      <div className="max-w-6xl mx-auto px-4">
        {/* ... existing header and input section ... */}

        {/* Results Section */}
        <div className="space-y-6">
          {parsedTasks.length > 0 ? (
            <div className={`rounded-xl shadow-sm border p-6 ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'
              }`}>
              <div className="flex items-center justify-between mb-6">
                <h3 className={`text-lg font-semibold ${isDark ? 'text-white' : 'text-gray-900'
                  }`}>
                  Parsed Medications ({parsedTasks.length})
                </h3>
                <div className="flex items-center space-x-3">
                  <span className="bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 text-sm px-3 py-1 rounded-full">
                    Ready to save
                  </span>
                  <button
                    onClick={addToCalendar}
                    disabled={isAddingToCalendar}
                    className={`bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-2 px-4 rounded-lg transition-all duration-300 transform shadow-lg hover:shadow-xl flex items-center justify-center space-x-2 text-sm ${isAddingToCalendar
                      ? 'opacity-70 cursor-not-allowed from-gray-400 to-gray-500 hover:from-gray-400 hover:to-gray-500'
                      : 'hover:scale-105'
                      }`}
                  >
                    {isAddingToCalendar ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                        <span>Adding to Calendar...</span>
                      </>
                    ) : (
                      <>
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                          <path d="M19 3h-1V1h-2v2H8V1H6v2H5c-1.11 0-1.99.9-1.99 2L3 19a2 2 0 002 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V8h14v11zM7 10h5v5H7z" />
                        </svg>
                        <span>Add to Calendar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* ... rest of the results section ... */}
            </div>
          ) : (
            // ... empty state JSX ...
          )}
        </div>
      </div>
    </div>
  );
}
