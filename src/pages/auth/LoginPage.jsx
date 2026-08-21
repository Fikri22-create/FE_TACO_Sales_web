import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { FaEye, FaEyeSlash, FaUser, FaLock, FaChartLine, FaArrowRight, FaCheck, FaArrowLeft, FaEnvelope } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, loading, error, isAuthenticated, user } = useAuth();
  
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const [isExiting, setIsExiting] = useState(false);
  const [targetRoute, setTargetRoute] = useState(null);
  
  const [viewMode, setViewMode] = useState('login');
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
  const [resetSuccess, setResetSuccess] = useState(false);
  
  useEffect(() => {
    if (isAuthenticated && !isExiting) {
      if (user?.role === 'data-steward') {
        navigate('/data-steward');
      } else {
        navigate('/supervisor');
      }
    }
  }, [isAuthenticated, navigate, user, isExiting]);
  
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
    }));
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.email || !formData.password) return;
    
    setIsSubmitting(true);
    const result = await login(formData.email, formData.password);
    setIsSubmitting(false);
    
    if (result.success) {
      let route = '/supervisor';
      switch (result.user.role) {
        case 'supervisor': route = '/supervisor'; break;
        case 'data-steward': route = '/data-steward'; break;
        case 'admin': route = '/admin'; break;
      }
      setTargetRoute(route);
      setIsExiting(true);
    }
  };
  
  const handleResetSubmit = async (e) => {
    e.preventDefault();
    if (!resetEmail) return;
    
    setIsResetting(true);
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsResetting(false);
    setResetSuccess(true);
  };
  
  const handleAnimationComplete = () => {
    if (isExiting && targetRoute) {
      navigate(targetRoute);
    }
  };
  
  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email);
  const isPasswordValid = formData.password.length > 0;
  const isFormValid = isEmailValid && isPasswordValid;
  
  const isResetEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(resetEmail);
  
  return (
    <div className="fixed inset-0 w-full h-full overflow-hidden bg-gray-50 flex z-50 font-sans [perspective:1200px]">
      <div className={`w-full h-full grid md:grid-cols-2 min-h-0 ${!isExiting ? 'animate-fade-in' : ''}`}>
        
        <motion.div 
          className="hidden md:flex flex-col relative min-h-0 w-full bg-gradient-to-br from-[#953D1F] to-[#FF4C00] overflow-hidden"
          initial={{ x: 0, rotateY: 0, scale: 1 }}
          animate={{ 
            x: isExiting ? '-110%' : 0, 
            rotateY: isExiting ? 20 : 0,
            scale: isExiting ? 0.9 : 1
          }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.84, 0] }}
          style={{ originX: 0, originY: 0.5 }}
        >
          <div className="absolute top-0 bottom-0 right-0 w-24 lg:w-36 h-full text-white pointer-events-none translate-x-[1px]">
            <svg viewBox="0 0 100 100" preserveAspectRatio="none" className="w-full h-full fill-current">
              <path d="M100 0 V100 H0 C30 75, 10 60, 40 50 C70 40, 20 25, 0 0 Z" opacity="0.2"/>
              <path d="M100 0 V100 H15 C45 75, 0 60, 30 50 C60 40, 10 25, 15 0 Z" opacity="0.4"/>
              <path d="M100 0 V100 H30 C60 75, 20 60, 50 50 C80 40, 30 25, 30 0 Z"/>
            </svg>
          </div>

          <div className="flex-1 flex flex-col p-10 lg:p-14 z-10 max-w-[480px] mx-auto w-full min-h-0 relative">
            <div className="flex-1 flex flex-col justify-center">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mb-8 shadow-xl">
                <img src="/favicon.svg" alt="Logo" className="w-10 h-10" />
              </div>
              
              <div>
                <h2 className="text-xl lg:text-2xl text-white/80 font-medium mb-1">Selamat Datang di</h2>
                <h1 className="text-4xl lg:text-6xl font-display font-bold text-white mb-4 tracking-tight">TACO Sales Insight</h1>
                <p className="text-white/60 text-sm lg:text-base leading-relaxed max-w-sm">
                  Platform intelligence untuk memantau performa tim dan menganalisis tren kompetitor secara real-time.
                </p>
              </div>
            </div>
            
            <div className="mt-auto shrink-0">
              <p className="text-white/40 text-xs">
                © {new Date().getFullYear()} TACO Group. All rights reserved.
              </p>
            </div>
          </div>
        </motion.div>
        
        <motion.div 
          className="flex flex-col items-center justify-center p-6 lg:p-12 relative bg-white min-h-0 z-10 w-full h-full"
          initial={{ x: 0, rotateY: 0, scale: 1 }}
          animate={{ 
            x: isExiting ? '110%' : 0, 
            rotateY: isExiting ? -20 : 0,
            scale: isExiting ? 0.9 : 1
          }}
          transition={{ duration: 0.9, ease: [0.7, 0, 0.84, 0] }}
          style={{ originX: 1, originY: 0.5 }}
          onAnimationComplete={handleAnimationComplete}
        >
          <div className="max-w-[340px] lg:max-w-[380px] w-full overflow-y-auto no-scrollbar px-2 py-4 min-h-0">
            <div className="md:hidden flex items-center gap-3 mb-8">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center shadow-lg border border-gray-100">
                <img src="/favicon.svg" alt="Logo" className="w-8 h-8" />
              </div>
              <div>
                <h1 className="text-2xl font-display font-bold text-[#953D1F]">TACO Sales Insight</h1>
              </div>
            </div>
            
            <AnimatePresence mode="wait">
              {viewMode === 'login' ? (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                >
                  <div className="mb-10">
                    <h2 className="text-3xl font-display font-bold text-[#953D1F]">
                      Masuk ke Akun
                    </h2>
                  </div>
                  
                  <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="space-y-6">
                      
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email</label>
                        <div className="relative border-b border-gray-300 focus-within:border-[#FF4C00] transition-colors duration-300 pb-1.5 group">
                          <div className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none">
                            <FaUser className="h-4 w-4 text-gray-400 group-focus-within:text-[#FF4C00] transition-colors" />
                          </div>
                          <input
                            type="text"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            className="w-full bg-transparent pl-8 pr-8 py-1.5 text-gray-900 placeholder-gray-400 text-sm outline-none"
                            placeholder="nama@taco.co.id"
                            disabled={isSubmitting || isExiting}
                          />
                          {isEmailValid && (
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[#FF4C00] animate-fade-in">
                              <FaCheck className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div>
                        <div className="flex items-center justify-between mb-1.5">
                          <label className="block text-sm font-medium text-gray-700">Password</label>
                          <button 
                            type="button" 
                            onClick={() => {
                              setViewMode('forgot');
                              setResetSuccess(false);
                              setResetEmail(formData.email);
                            }}
                            className="text-xs font-medium text-[#FF4C00] hover:text-[#953D1F] transition-colors focus:outline-none"
                          >
                            Lupa Password?
                          </button>
                        </div>
                        <div className="relative border-b border-gray-300 focus-within:border-[#FF4C00] transition-colors duration-300 pb-1.5 group">
                          <div className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none">
                            <FaLock className="h-4 w-4 text-gray-400 group-focus-within:text-[#FF4C00] transition-colors" />
                          </div>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            className="w-full bg-transparent pl-8 pr-16 py-1.5 text-gray-900 placeholder-gray-400 text-sm outline-none"
                            placeholder="Masukkan password Anda"
                            disabled={isSubmitting || isExiting}
                          />
                          
                          <div className="absolute right-1 top-1/2 -translate-y-1/2 flex items-center gap-2">
                            {isPasswordValid && (
                              <div className="text-[#FF4C00] animate-fade-in pointer-events-none">
                                <FaCheck className="h-3.5 w-3.5" />
                              </div>
                            )}
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="text-gray-400 hover:text-[#953D1F] transition-colors focus:outline-none p-1"
                              disabled={isSubmitting || isExiting}
                            >
                              {showPassword ? (
                                <FaEyeSlash className="h-4 w-4" />
                              ) : (
                                <FaEye className="h-4 w-4" />
                              )}
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {error && !isExiting && (
                      <div className="p-3 bg-[#953D1F]/10 border border-[#953D1F]/20 rounded-lg animate-fade-up">
                        <div className="flex items-start">
                          <div className="flex-shrink-0 mt-0.5">
                            <div className="w-4 h-4 rounded-full bg-[#FF4C00] flex items-center justify-center">
                              <span className="text-white text-[10px] font-bold">!</span>
                            </div>
                          </div>
                          <div className="ml-3">
                            <p className="text-sm font-medium text-[#953D1F]">
                              Kredensial tidak valid
                            </p>
                          </div>
                        </div>
                      </div>
                    )}
                    
                    <div className="pt-2">
                      <button
                        type="submit"
                        disabled={!isFormValid || isSubmitting || loading || isExiting}
                        className={`w-full inline-flex items-center justify-center px-4 py-3 text-sm font-bold rounded-full transition-all duration-300 ${
                          !isFormValid || isSubmitting || loading || isExiting
                            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                            : 'bg-[#FF4C00] text-white hover:bg-[#953D1F] focus:outline-none focus:ring-2 focus:ring-[#FF4C00] focus:ring-offset-2 shadow-lg hover:shadow-xl'
                        }`}
                      >
                        {isSubmitting || loading || isExiting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin-smooth mr-2"></div>
                            Memproses...
                          </>
                        ) : (
                          <>
                            Masuk
                            <FaArrowRight className="ml-2 h-3.5 w-3.5" />
                          </>
                        )}
                      </button>
                    </div>
                  </form>
                </motion.div>
              ) : (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  <button 
                    type="button" 
                    onClick={() => setViewMode('login')}
                    className="flex items-center text-sm font-medium text-gray-500 hover:text-[#FF4C00] transition-colors mb-8 focus:outline-none"
                  >
                    <FaArrowLeft className="mr-2 h-3 w-3" />
                    Kembali ke Login
                  </button>
                  
                  <div className="mb-8">
                    <h2 className="text-3xl font-display font-bold text-[#953D1F] mb-2">
                      Lupa Password
                    </h2>
                    <p className="text-sm text-gray-600">
                      Masukkan email Anda dan kami akan mengirimkan instruksi untuk mengatur ulang password.
                    </p>
                  </div>
                  
                  {resetSuccess ? (
                    <div className="text-center animate-fade-in py-4">
                      <div className="w-16 h-16 bg-[#FF4C00]/10 rounded-full flex items-center justify-center mx-auto mb-6">
                        <FaCheck className="w-6 h-6 text-[#FF4C00]" />
                      </div>
                      <h3 className="text-2xl font-display font-bold text-[#953D1F] mb-3">Email Terkirim!</h3>
                      <p className="text-sm text-gray-600 mb-8 leading-relaxed">
                        Link reset password telah dikirim ke <span className="font-semibold text-gray-900">{resetEmail}</span>. Silakan periksa inbox Anda untuk instruksi selanjutnya.
                      </p>
                      <button
                        type="button"
                        onClick={() => setViewMode('login')}
                        className="w-full inline-flex items-center justify-center px-4 py-3 text-sm font-bold rounded-full bg-[#FF4C00] text-white hover:bg-[#953D1F] transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-[#FF4C00] focus:ring-offset-2 shadow-lg hover:shadow-xl"
                      >
                        Kembali ke Login
                      </button>
                    </div>
                  ) : (
                    <form onSubmit={handleResetSubmit} className="space-y-8">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Terdaftar</label>
                        <div className="relative border-b border-gray-300 focus-within:border-[#FF4C00] transition-colors duration-300 pb-1.5 group">
                          <div className="absolute left-1 top-1/2 -translate-y-1/2 pointer-events-none">
                            <FaEnvelope className="h-4 w-4 text-gray-400 group-focus-within:text-[#FF4C00] transition-colors" />
                          </div>
                          <input
                            type="email"
                            value={resetEmail}
                            onChange={(e) => setResetEmail(e.target.value)}
                            className="w-full bg-transparent pl-8 pr-8 py-1.5 text-gray-900 placeholder-gray-400 text-sm outline-none"
                            placeholder="nama@taco.co.id"
                            disabled={isResetting}
                          />
                          {isResetEmailValid && (
                            <div className="absolute right-1 top-1/2 -translate-y-1/2 pointer-events-none text-[#FF4C00] animate-fade-in">
                              <FaCheck className="h-3.5 w-3.5" />
                            </div>
                          )}
                        </div>
                      </div>
                      
                      <div className="pt-2">
                        <button
                          type="submit"
                          disabled={!isResetEmailValid || isResetting}
                          className={`w-full inline-flex items-center justify-center px-4 py-3 text-sm font-bold rounded-full transition-all duration-300 ${
                            !isResetEmailValid || isResetting
                              ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
                              : 'bg-[#FF4C00] text-white hover:bg-[#953D1F] focus:outline-none focus:ring-2 focus:ring-[#FF4C00] focus:ring-offset-2 shadow-lg hover:shadow-xl'
                          }`}
                        >
                          {isResetting ? (
                            <>
                              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin-smooth mr-2"></div>
                              Mengirim...
                            </>
                          ) : (
                            'Kirim Link Reset'
                          )}
                        </button>
                      </div>
                    </form>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
            
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoginPage;