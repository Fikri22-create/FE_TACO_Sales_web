import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaChartLine, FaArrowRight } from 'react-icons/fa';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isOnline, setIsOnline] = useState(() => navigator.onLine);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  useEffect(() => {
    window.addEventListener('online', () => setIsOnline(true));
    window.addEventListener('offline', () => setIsOnline(false));
    
    if (isAuthenticated) {
      navigate('/supervisor');
    }
    
    return () => {
      window.removeEventListener('online', () => setIsOnline(true));
      window.removeEventListener('offline', () => setIsOnline(false));
    };
  }, [isAuthenticated, navigate]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!formData.email || !formData.password) {
      return;
    }
    
    setIsSubmitting(true);
    const result = await login(formData.email, formData.password);
    setIsSubmitting(false);
    
    if (result.success) {
      switch (result.user.role) {
        case 'supervisor':
          navigate('/supervisor');
          break;
        case 'admin':
          navigate('/admin');
          break;
        default:
          navigate('/supervisor');
      }
    }
  };
  
  const isFormValid = formData.email && formData.password;
  
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-warm-50 to-gray-100 flex">
      <div className="w-full grid md:grid-cols-2 animate-fade-in">
        <div className="hidden md:flex flex-col p-8 lg:p-12 xl:p-16 bg-gradient-to-br from-gray-900 to-gray-800 text-white overflow-y-auto">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-10 lg:mb-12">
              <div className="p-3 bg-primary-500/20 rounded-xl backdrop-blur-sm">
                <FaChartLine className="w-10 h-10 text-primary-300" />
              </div>
              <div>
                <h1 className="text-3xl font-display font-bold tracking-tight">TACO</h1>
                <p className="text-gray-300 text-sm mt-1">Sales Intelligence Platform</p>
              </div>
            </div>
            
            <div className="mb-10 lg:mb-12">
              <h2 className="text-4xl font-display font-bold mb-6 leading-tight">
                Data-Driven<br />
                <span className="text-primary-300">Sales Decisions</span>
              </h2>
              <p className="text-gray-300 text-lg leading-relaxed">
                Monitor team performance, analyze competitor intelligence, and make informed decisions with real-time insights.
              </p>
            </div>
            
            <div className="space-y-4">
              {[
                { title: 'Real-Time Analytics', desc: 'Live performance tracking with instant updates' },
                { title: 'Competitor Intelligence', desc: 'Market trends and pricing analysis' },
                { title: 'Team Performance', desc: 'Detailed rep performance metrics' },
                { title: 'Actionable Insights', desc: 'Data-driven recommendations and alerts' },
              ].map((item, index) => (
                <div 
                  key={index}
                  className="flex items-start gap-4 p-4 bg-white/5 rounded-xl backdrop-blur-sm border border-white/10 hover:bg-white/10 transition-colors duration-300 animate-fade-up"
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  <div className="flex-shrink-0 mt-1">
                    <div className="w-2 h-2 rounded-full bg-primary-400"></div>
                  </div>
                  <div>
                    <h3 className="font-semibold text-white mb-1">{item.title}</h3>
                    <p className="text-gray-400 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="pt-8 border-t border-gray-700/50">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${isOnline ? 'bg-success-500' : 'bg-error-500'} animate-pulse-smooth`}></div>
                <span className="text-sm text-gray-400">
                  {isOnline ? 'System Online' : 'System Offline'}
                </span>
              </div>
              <div className="text-sm text-gray-400">
                v1.0.0 • Production
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex items-center justify-center overflow-y-auto min-h-screen p-6 sm:p-10 lg:p-16">
          <div className="max-w-md mx-auto w-full">
            <div className="md:hidden flex items-center gap-3 mb-8">
              <div className="p-3 bg-primary-500/10 rounded-xl">
                <FaChartLine className="w-8 h-8 text-primary-600" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-gray-900">TACO</h1>
                <p className="text-gray-600 text-sm">Sales Intelligence</p>
              </div>
            </div>
            
            <div className="mb-10">
              <h2 className="text-2xl md:text-3xl font-display font-semibold text-gray-900 mb-3">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to access your sales dashboard and analytics.
              </p>
            </div>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaUser className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="pl-10 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200 placeholder:text-gray-400"
                      placeholder="nama@perusahaan.com"
                      disabled={isSubmitting}
                    />
                  </div>
                </div>
                
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <label className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <button
                      type="button"
                      className="text-sm text-primary-600 hover:text-primary-700 font-medium"
                      onClick={(e) => {
                        e.preventDefault();
                        alert('Contact system administrator for password reset.');
                      }}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FaLock className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      name="password"
                      value={formData.password}
                      onChange={handleChange}
                      className="pl-10 pr-10 w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:bg-white focus:border-primary-500 focus:ring-2 focus:ring-primary-500/20 transition-all duration-200"
                      placeholder="••••••••"
                      disabled={isSubmitting}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                      disabled={isSubmitting}
                    >
                      {showPassword ? (
                        <FaEyeSlash className="h-5 w-5" />
                      ) : (
                        <FaEye className="h-5 w-5" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
              
              {error && (
                <div className="p-4 bg-error-50 border border-error-200 rounded-lg animate-fade-up">
                  <div className="flex items-start">
                    <div className="flex-shrink-0">
                      <div className="w-5 h-5 rounded-full bg-error-500 flex items-center justify-center">
                        <span className="text-white text-xs">!</span>
                      </div>
                    </div>
                    <div className="ml-3">
                      <p className="text-sm font-medium text-error-800">
                        Invalid credentials
                      </p>
                      <p className="text-sm text-error-700 mt-1">
                        Please check your email and password and try again.
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <button
                type="submit"
                disabled={!isFormValid || isSubmitting || loading}
                className={`w-full inline-flex items-center justify-center px-6 py-4 text-base font-medium rounded-lg transition-all duration-300 ${
                  !isFormValid || isSubmitting || loading
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-primary-500 text-white hover:bg-primary-600 active:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 shadow-sm hover:shadow-md'
                }`}
              >
                {isSubmitting || loading ? (
                  <>
                    <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin-smooth mr-3"></div>
                    Signing In...
                  </>
                ) : (
                  <>
                    Sign In
                    <FaArrowRight className="ml-3 h-4 w-4" />
                  </>
                )}
              </button>
              
              <p className="pt-4 text-center text-xs text-gray-500">
                © {new Date().getFullYear()} TACO Sales Intelligence • Internal Use Only
              </p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;