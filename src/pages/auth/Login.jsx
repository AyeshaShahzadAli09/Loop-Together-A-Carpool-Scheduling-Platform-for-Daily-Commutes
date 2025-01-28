import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { login } from '../../services/authService';
import CarAnimation from "../../ui/CarAnimation";
import { FaEnvelope, FaLock } from 'react-icons/fa';
import MovingCarsBackground from '../../components/animations/MovingCarsBackground';

const Login = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const response = await login(formData);
      localStorage.setItem('userToken', response.token);
      dispatch({ 
        type: 'LOGIN', 
        payload: {
          ...response.user,
          token: response.token
        }
      });
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err) {
      setError(err.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center bg-gradient-to-br from-teal-900 to-teal-800">
      <MovingCarsBackground />
      
      {/* Main content with higher z-index */}
      <div className="relative z-10 max-w-4xl w-full mx-4 flex bg-white/90 dark:bg-gray-800/90 rounded-xl shadow-2xl overflow-hidden backdrop-blur-lg">
        {/* Left side - Animation and Welcome Text */}
        <div className="hidden md:flex md:w-1/2 bg-teal-800/90 p-12 flex-col justify-center items-center text-white backdrop-blur-sm">
          <div className="w-full max-w-[300px]">
            <CarAnimation />
          </div>
          <h2 className="text-3xl font-bold mt-8 text-center">Welcome Back!</h2>
          <p className="mt-4 text-center text-teal-100">
            Continue your journey with Loop Together
          </p>
        </div>

        {/* Right side - Login Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-teal-900 dark:text-white">
              Sign in
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Access your account
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Email Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaEnvelope className="h-5 w-5 text-teal-500" />
                </div>
                <input
                  name="email"
                  type="email"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Email address"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              {/* Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-teal-500" />
                </div>
                <input
                  name="password"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </div>
            </div>

            {error && (
              <div className="text-red-500 text-sm text-center bg-red-100 dark:bg-red-900/30 p-3 rounded-lg">
                {error}
              </div>
            )}

            <div className="mt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-teal-600 hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-teal-500 transition-colors duration-200 disabled:opacity-50"
              >
                {loading ? 'Signing in...' : 'Sign in'}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Don't have an account?{' '}
                <Link to="/signup" className="font-medium text-teal-600 hover:text-teal-500">
                  Sign up
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login; 