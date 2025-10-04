// pages/SurveyPage.jsx
import Survey from '../components/Survey';
import { useTheme } from '../contexts/ThemeContext';

const SurveyPage = ({ onSubmit }) => {
  const { isDark } = useTheme();

  return (
    <div className={`min-h-screen theme-transition ${isDark ? 'bg-slate-900' : 'bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50'}`}>
      <Survey onSubmit={onSubmit} />
    </div>
  );
};

export default SurveyPage;
