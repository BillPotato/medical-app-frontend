// pages/AuthPage.jsx
import { Routes, Route, Navigate } from 'react-router-dom'
import { useTheme } from '../contexts/ThemeContext'
import { useState } from 'react'

export default function AuthPage() {
  const isAuthenticated = !!localStorage.getItem('token')
  const { isDark } = useTheme()

  if (isAuthenticated) {
    return <Navigate to="/dashboard" replace />
  }

  return (
    <div className="min-h-screen">
      {/* Auth Section */}
      <div className={`min-h-screen theme-transition ${isDark ? 'bg-gray-900' : 'bg-gradient-to-br from-blue-50 to-purple-50'} flex items-center justify-center p-4`}>
        <Routes>
          <Route path="/signin" element={<AuthLayout><SignInForm /></AuthLayout>} />
          <Route path="/signup" element={<AuthLayout><SignUpForm /></AuthLayout>} />
          <Route path="*" element={<Navigate to="/auth/signin" replace />} />
        </Routes>
      </div>

      {/* Introduction Section - Appears when scrolling down */}
      <IntroductionSection />
    </div>
  )
}

// Centered Auth Layout with Logo Left + Form Right
const AuthLayout = ({ children }) => {
  const { isDark } = useTheme()

  return (
    <div className={`w-full max-w-6xl rounded-3xl shadow-2xl overflow-hidden border ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-200'}`}>
      <div className="flex flex-col lg:flex-row min-h-[600px]">

        {/* Left Side - Full Size Logo Image */}
        <div className="lg:w-1/2 bg-gradient-to-br from-blue-600 to-purple-700 relative">
          <img
            src="../../public/dailydose1.png"
            alt="Daily Dose Logo"
            className="w-full h-full object-cover"
          />
          {/* Overlay with app name */}
          {/* <div className="absolute inset-0 bg-black/20 flex items-center justify-center"> */}
          {/*   <div className="text-center text-white"> */}
          {/*     <h1 className="text-5xl font-bold mb-2">DAILY DOSE</h1> */}
          {/*     <p className="text-xl font-light">FUEL YOUR BEST DAY</p> */}
          {/*   </div> */}
          {/* </div> */}
        </div>

        {/* Right Side - Auth Form */}
        <div className="lg:w-1/2 p-8 lg:p-12 flex items-center justify-center">
          <div className="w-full max-w-md">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}

// Sign In Form Component
const SignInForm = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    setTimeout(() => {
      if (formData.email === 'test@test.com' && formData.password === 'password') {
        localStorage.setItem('token', 'mock-token');
        localStorage.setItem('user', JSON.stringify({
          name: 'Test User',
          email: formData.email
        }));
        window.location.href = '/dashboard';
      } else {
        setError('Invalid credentials. Use: test@test.com / password');
        setLoading(false);
      }
    }, 1000);
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign In</h1>
        <p className="text-gray-600 dark:text-gray-400">Access your Daily Dose account</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-MAIL</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">PASSWORD</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter your password"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Signing In...
            </>
          ) : (
            'Sign In'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <p className="text-gray-600 dark:text-gray-400">
          Don't have an account?{' '}
          <a href="/auth/signup" className="text-blue-600 hover:text-blue-700 font-semibold dark:text-blue-400 dark:hover:text-blue-300">
            Sign Up
          </a>
        </p>
      </div>

      <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/30 border border-blue-200 dark:border-blue-800 rounded-xl text-center">
        <p className="text-sm text-blue-800 dark:text-blue-300">
          <strong>Demo Credentials:</strong><br />
          test@test.com / password
        </p>
      </div>
    </>
  )
}

// Sign Up Form Component
const SignUpForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setLoading(false);
      return;
    }

    setTimeout(() => {
      localStorage.setItem('token', 'mock-token');
      localStorage.setItem('user', JSON.stringify({
        name: formData.name,
        email: formData.email
      }));
      localStorage.setItem('tasks', JSON.stringify([]));
      localStorage.setItem('surveys', JSON.stringify([]));
      window.location.href = '/dashboard';
    }, 1000);
  };

  return (
    <>
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Sign Up</h1>
        <p className="text-gray-600 dark:text-gray-400">Create your Daily Dose account</p>
      </div>

      {error && (
        <div className="bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-xl mb-6 text-center">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">USERNAME</label>
          <input
            type="text"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter your username"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">E-MAIL</label>
          <input
            type="email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Enter your email"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">PASSWORD</label>
          <input
            type="password"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Create a password"
            required
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">CONFIRM PASSWORD</label>
          <input
            type="password"
            value={formData.confirmPassword}
            onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
            className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all duration-300 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            placeholder="Confirm your password"
            required
          />
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="terms" className="rounded border-gray-300 text-blue-600 focus:ring-blue-500" required />
          <label htmlFor="terms" className="text-sm text-gray-600 dark:text-gray-400">
            I agree to the <a href="#" className="text-blue-600 hover:text-blue-700">Privacy policy & Terms of service</a>
          </label>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 flex items-center justify-center"
        >
          {loading ? (
            <>
              <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
              Creating Account...
            </>
          ) : (
            'Register'
          )}
        </button>
      </form>

      <div className="mt-8 text-center">
        <div className="flex items-center justify-center space-x-4 mb-4">
          <div className="flex-1 h-px bg-gray-300"></div>
          <span className="text-gray-500 text-sm">Or</span>
          <div className="flex-1 h-px bg-gray-300"></div>
        </div>
        <p className="text-gray-600 dark:text-gray-400">
          Already have an account?{' '}
          <a href="/auth/signin" className="text-blue-600 hover:text-blue-700 font-semibold dark:text-blue-400 dark:hover:text-blue-300">
            Sign In
          </a>
        </p>
      </div>
    </>
  )
}

// Introduction Section Component
const IntroductionSection = () => {
  return (
    <div className="bg-gradient-to-br from-gray-50 to-blue-50 dark:from-gray-800 dark:to-gray-900 py-20 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">

        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Welcome to Daily Dose
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto">
            Your ultimate companion for health management and wellness tracking
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          <FeatureCard
            icon="💊"
            title="Medication Management"
            description="Never miss a dose with smart reminders and comprehensive tracking system"
          />
          <FeatureCard
            icon="📊"
            title="Health Analytics"
            description="Track your progress with detailed insights and personalized health reports"
          />
          <FeatureCard
            icon="😊"
            title="Mood Tracking"
            description="Monitor your emotional wellbeing and identify patterns over time"
          />
          <FeatureCard
            icon="🔔"
            title="Smart Notifications"
            description="Personalized alerts for medications, appointments, and health goals"
          />
          <FeatureCard
            icon="👨‍⚕️"
            title="Health Insights"
            description="Get valuable insights about your health patterns and progress"
          />
          <FeatureCard
            icon="📱"
            title="Mobile Friendly"
            description="Access your health data anywhere, anytime with our responsive design"
          />
        </div>
        {/* {/* Testimonials */}
        {/* <div className="bg-white dark:bg-gray-800 rounded-3xl shadow-xl p-12 mb-16"> */}
        {/*   <div className="text-center mb-12"> */}
        {/*     <h3 className="text-3xl font-bold text-gray-900 dark:text-white mb-4"> */}
        {/*       Loved by Users Worldwide */}
        {/*     </h3> */}
        {/*     <p className="text-gray-600 dark:text-gray-400 text-lg"> */}
        {/*       See what our community is saying about their experience */}
        {/*     </p> */}
        {/*   </div> */}
        {/**/}
        {/*   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"> */}
        {/*     <TestimonialCard */}
        {/*       quote="Daily Dose completely transformed how I manage my health. The reminders are a lifesaver!" */}
        {/*       author="Sarah Johnson" */}
        {/*       role="Daily User" */}
        {/*     /> */}
        {/*     <TestimonialCard */}
        {/*       quote="As someone with multiple medications, this app keeps me organized and stress-free." */}
        {/*       author="Michael Chen" */}
        {/*       role="Health Enthusiast" */}
        {/*     /> */}
        {/*     <TestimonialCard */}
        {/*       quote="The mood tracking feature helped me understand patterns I never noticed before." */}
        {/*       author="Emily Wilson" */}
        {/*       role="Wellness Advocate" */}
        {/*     /> */}
        {/*   </div> */}
        {/* </div> */}
        {/**/}
        {/* {/* Stats */}
        {/* <div className="text-center mb-16"> */}
        {/*   <div className="grid grid-cols-2 md:grid-cols-4 gap-8"> */}
        {/*     <StatCard number="50K+" label="Active Users" /> */}
        {/*     <StatCard number="99%" label="Satisfaction Rate" /> */}
        {/*     <StatCard number="24/7" label="Support" /> */}
        {/*     <StatCard number="1M+" label="Doses Tracked" /> */}
        {/*   </div> */}
        {/* </div> */}
        {/**/}
        {/* {/* Final CTA */}
        {/* <div className="text-center"> */}
        {/*   <div className="bg-gradient-to-r from-blue-600 to-purple-600 rounded-3xl p-12 text-white"> */}
        {/*     <h3 className="text-3xl font-bold mb-4"> */}
        {/*       Ready to Fuel Your Best Day? */}
        {/*     </h3> */}
        {/*     <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto"> */}
        {/*       Join thousands of users and start your journey to better health management today */}
        {/*     </p> */}
        {/*     <div className="flex flex-col sm:flex-row gap-4 justify-center"> */}
        {/*       <a href="/auth/signup" className="bg-white text-blue-600 hover:bg-blue-50 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300 transform hover:scale-105"> */}
        {/*         Get Started Free */}
        {/*       </a> */}
        {/*       <a href="/auth/signin" className="border-2 border-white text-white hover:bg-white hover:text-blue-600 px-8 py-4 rounded-xl font-bold text-lg transition-all duration-300"> */}
        {/*         Sign In */}
        {/*       </a> */}
        {/*     </div> */}
        {/*   </div> */}
        {/* </div> */}
      </div>
    </div>
  )
}

// Supporting Components
const FeatureCard = ({ icon, title, description }) => (
  <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 p-6 group border border-gray-200 dark:border-gray-700">
    <div className="text-4xl mb-4 transform group-hover:scale-110 transition-transform duration-300">
      {icon}
    </div>
    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">{title}</h3>
    <p className="text-gray-600 dark:text-gray-400 leading-relaxed">{description}</p>
  </div>
)

const TestimonialCard = ({ quote, author, role }) => (
  <div className="bg-gray-50 dark:bg-gray-700 rounded-2xl p-6 hover:shadow-lg transition-all duration-300">
    <div className="text-4xl text-blue-500 mb-4">"</div>
    <p className="text-gray-700 dark:text-gray-300 text-lg italic mb-6 leading-relaxed">
      {quote}
    </p>
    <div>
      <p className="font-semibold text-gray-900 dark:text-white">{author}</p>
      <p className="text-gray-600 dark:text-gray-400 text-sm">{role}</p>
    </div>
  </div>
)

const StatCard = ({ number, label }) => (
  <div className="text-center">
    <div className="text-4xl font-bold text-blue-600 dark:text-blue-400 mb-2">{number}</div>
    <div className="text-gray-600 dark:text-gray-400 font-medium uppercase tracking-wider text-sm">{label}</div>
  </div>
)
