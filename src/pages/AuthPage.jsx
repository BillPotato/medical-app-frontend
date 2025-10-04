import { Routes, Route, Navigate } from 'react-router-dom';
import SignIn from '../components/auth/SignIn';
import SignUp from '../components/auth/SignUp';

const AuthPage = () => {
  const isAuthenticated = !!localStorage.getItem('token');

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />;
  }

  return (
    <Routes>
      <Route path="signin" element={<SignIn />} />
      <Route path="signup" element={<SignUp />} />
      <Route path="*" element={<Navigate to="signin" replace />} />
    </Routes>
  );
};

export default AuthPage;
