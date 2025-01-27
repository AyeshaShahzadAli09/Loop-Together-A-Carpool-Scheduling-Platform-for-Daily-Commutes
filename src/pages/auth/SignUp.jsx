import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signup } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';
import Button from '../../ui/Button';
import CarAnimation from "../../ui/CarAnimation";
import { FaUser, FaEnvelope, FaLock, FaVenusMars } from 'react-icons/fa';
import MovingCarsBackground from '../../components/animations/MovingCarsBackground';

const SignUp = () => {
  const navigate = useNavigate();
  const { dispatch } = useAuth();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    gender: ''
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

    if (formData.password !== formData.confirmPassword) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    try {
      const response = await signup({
        name: formData.name,
        email: formData.email,
        password: formData.password,
        gender: formData.gender
      });
      
      dispatch({ type: 'LOGIN', payload: response.user });
      navigate('/app/carpoolDashboard');
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.');
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
          <h2 className="text-3xl font-bold mt-8 text-center">Welcome to Loop Together</h2>
          <p className="mt-4 text-center text-teal-100">
            Join our community and make your daily commute more sustainable and enjoyable
          </p>
        </div>

        {/* Right side - Sign Up Form */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 backdrop-blur-sm">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-teal-900 dark:text-white">
              Create Account
            </h2>
            <p className="mt-2 text-gray-600 dark:text-gray-300">
              Start your journey with us today
            </p>
          </div>

          <form className="space-y-6" onSubmit={handleSubmit}>
            <div className="space-y-4">
              {/* Name Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaUser className="h-5 w-5 text-teal-500" />
                </div>
                <input
                  name="name"
                  type="text"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

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

              {/* Confirm Password Input */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaLock className="h-5 w-5 text-teal-500" />
                </div>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleChange}
                />
              </div>

              {/* Gender Select */}
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <FaVenusMars className="h-5 w-5 text-teal-500" />
                </div>
                <select
                  name="gender"
                  required
                  className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent dark:bg-gray-700 dark:border-gray-600 dark:text-white"
                  value={formData.gender}
                  onChange={handleChange}
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                  <option value="Other">Other</option>
                </select>
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
                {loading ? 'Creating Account...' : 'Sign up'}
              </button>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-600 dark:text-gray-300">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-teal-600 hover:text-teal-500">
                  Sign in
                </Link>
              </p>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignUp; 