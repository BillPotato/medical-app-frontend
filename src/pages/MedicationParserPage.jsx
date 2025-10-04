// pages/MedicationParserPage.jsx
import MedicationParser from '../components/MedicationParser';
import { useTheme } from '../contexts/ThemeContext';

const MedicationParserPage = ({ onSave }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen theme-transition ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-gray-50 to-blue-50/30'}`}>
      <MedicationParser onSave={onSave} />
    </div>
  );
};

export default MedicationParserPage;
