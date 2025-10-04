// components/Header.jsx
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../contexts/ThemeContext';
import Logo from './Logo';
import ThemeToggle from './ThemeToggle';

const Header = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { isDark } = useTheme();
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    window.location.href = '/auth/signin';
  };

  // Don't show header on auth pages
  if (location.pathname.startsWith('/auth')) {
    return null;
  }

  return (
    <header className={`
      sticky top-0 z-50 
      ${isDark
        ? 'bg-gray-900/95 backdrop-blur-md border-b border-gray-700'
        : 'bg-white/95 backdrop-blur-md border-b border-gray-200'
      }
      transition-all duration-300
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left: Logo */}
          <button
            onClick={() => navigate('/dashboard')}
            className="flex items-center space-x-4 group"
          >
            <Logo size="medium" />
          </button>

          {/* Right: User info and controls */}
          <div className="flex items-center space-x-4">
            <span className={`text-sm ${isDark ? 'text-gray-300' : 'text-gray-600'}`}>
              Welcome, {user.name || 'User'}
            </span>
            <ThemeToggle />
            <button
              onClick={handleLogout}
              className={`
                px-4 py-2 rounded-xl font-medium transition-all duration-300
                ${isDark
                  ? 'bg-gray-800 hover:bg-gray-700 text-gray-200 border border-gray-600'
                  : 'bg-gray-100 hover:bg-gray-200 text-gray-700 border border-gray-300'
                }
                hover:shadow-lg transform hover:scale-105
              `}
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
