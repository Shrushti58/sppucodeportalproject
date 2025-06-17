import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from '../axios'; // custom axios instance
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

const LoginPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const endpoint = isLogin ? '/admin/login' : '/admin/register';
      const payload = isLogin
        ? { email: formData.email, password: formData.password }
        : formData;

      const res = await axios.post(`${API_BASE_URL}${endpoint}`, payload, { withCredentials: true });

      toast.success(isLogin ? 'Login successful!' : 'Registration successful!', {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });

      console.log('Response:', res.data);

      if (isLogin) {
        navigate('/admin-dashboard');
      }

    } catch (err) {
      const errorMessage = err.response?.data?.message || err.message || 'Something went wrong';
      console.error('Error:', errorMessage);

      toast.error(errorMessage, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#0f172a] to-[#1e293b] text-gray-100 p-4 flex flex-col items-center justify-center">
      <ToastContainer theme="dark" />
      
      <div className="w-full max-w-md mb-8">
        <div className="bg-slate-800/20 backdrop-blur-xl rounded-2xl shadow-2xl overflow-hidden border border-slate-700/30 relative before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/5 before:to-transparent before:rounded-2xl before:z-0">
          <div className="relative z-10">
            <div className="flex border-b border-slate-700/30">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                  isLogin 
                    ? 'text-white bg-gradient-to-r from-slate-700/30 to-slate-800/30 shadow-inner' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/20'
                }`}
              >
                Login
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-4 px-6 text-center font-medium transition-all ${
                  !isLogin 
                    ? 'text-white bg-gradient-to-r from-slate-700/30 to-slate-800/30 shadow-inner' 
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/20'
                }`}
              >
                Register
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {!isLogin && (
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium text-slate-300">
                    Full Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-transparent"
                    placeholder="John Doe"
                    required
                  />
                </div>
              )}

              <div className="space-y-2">
                <label htmlFor="email" className="block text-sm font-medium text-slate-300">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-transparent"
                  placeholder="your@email.com"
                  required
                />
              </div>

              <div className="space-y-2">
                <label htmlFor="password" className="block text-sm font-medium text-slate-300">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-slate-800/30 backdrop-blur-sm border border-slate-700/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-500/50 focus:border-transparent"
                  placeholder="••••••••"
                  required
                  minLength="3"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={`w-full py-3 px-4 bg-gradient-to-r from-slate-700/40 to-slate-800/40 hover:from-slate-700/50 hover:to-slate-800/50 border border-slate-700/50 rounded-lg text-white font-medium transition-all shadow-lg hover:shadow-slate-800/20 focus:outline-none focus:ring-2 focus:ring-slate-500/50 ${
                  isSubmitting ? 'opacity-70 cursor-not-allowed' : ''
                }`}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : isLogin ? 'Sign In' : 'Create Account'}
              </button>
            </form>

            <div className="px-6 py-4 text-center text-sm text-slate-400 border-t border-slate-700/30">
              {isLogin ? (
                <p>
                  Don't have an account?{' '}
                  <button 
                    onClick={() => setIsLogin(false)}
                    className="text-slate-300 font-medium hover:text-white transition-colors"
                  >
                    Sign up
                  </button>
                </p>
              ) : (
                <p>
                  Already have an account?{' '}
                  <button 
                    onClick={() => setIsLogin(true)}
                    className="text-slate-300 font-medium hover:text-white transition-colors"
                  >
                    Sign in
                  </button>
                </p>
              )}
            </div>
          </div>
        </div>
      </div>

      <Link 
        to="/admin-login" 
        className="mt-6 inline-block group relative overflow-hidden rounded-xl"
      >
        <div className="absolute inset-0 bg-gradient-to-r from-slate-700/30 to-slate-800/30 backdrop-blur-md border border-slate-700/50 rounded-xl group-hover:from-slate-700/40 group-hover:to-slate-800/40 transition-all shadow-lg group-hover:shadow-slate-800/30"></div>
        <button className="relative z-10 flex items-center gap-2 px-6 py-3 text-slate-300 group-hover:text-white transition-colors">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-6-3a2 2 0 11-4 0 2 2 0 014 0zm-2 4a5 5 0 00-4.546 2.916A5.986 5.986 0 0010 16a5.986 5.986 0 004.546-2.084A5 5 0 0010 11z" clipRule="evenodd" />
          </svg>
          Admin Login
        </button>
      </Link>
    </div>
  );
};

export default LoginPage;
