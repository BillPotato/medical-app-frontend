// pages/MedicationParserPage.jsx
import MedicationParser from '../components/MedicationParser';
import { useTheme } from '../contexts/ThemeContext';

const MedicationParserPage = ({ onSave }) => {
  const { isDark } = useTheme();

  const handleSave = (parsedTasks) => {
    if (onSave) {
      onSave(parsedTasks);
    } else {
      // Default save behavior if no onSave prop provided
      console.log('Saving tasks:', parsedTasks);

      // Get existing tasks from localStorage
      const existingTasks = JSON.parse(localStorage.getItem('tasks') || '[]');

      // Add new parsed tasks
      const updatedTasks = [...existingTasks, ...parsedTasks];

      // Save back to localStorage
      localStorage.setItem('tasks', JSON.stringify(updatedTasks));

      // Show success message
      alert(`Successfully saved ${parsedTasks.length} medication tasks!`);
    }
  };

  return (
    <div className={`min-h-screen theme-transition ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-gray-50 to-blue-50/30'}`}>
      <MedicationParser onSave={handleSave} />
    </div>
  );
};

export default MedicationParserPage;
