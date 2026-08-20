import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/auth/ProtectedRoute';
import LoginPage from './pages/auth/LoginPage';
import SupervisorLayout from './layouts/SupervisorLayout';
import TeamPerformancePage from './pages/supervisor/TeamPerformancePage';
import CompetitorIntelligencePage from './pages/supervisor/CompetitorIntelligencePage';
import ProfilePage from './pages/supervisor/ProfilePage';
import ComingSoonPage from './pages/misc/ComingSoonPage';

function App() {
  return (
    <div className="min-h-screen bg-gray-50 font-sans antialiased text-gray-900">
      <AuthProvider>
        <Router>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<LoginPage />} />
          
            <Route element={<ProtectedRoute allowedRoles={['supervisor']} />}>
              <Route element={<SupervisorLayout />}>
                <Route path="/supervisor" element={<Navigate to="/supervisor/kinerja-tim" replace />} />
                <Route path="/supervisor/kinerja-tim" element={<TeamPerformancePage />} />
                <Route path="/supervisor/kompetitor" element={<CompetitorIntelligencePage />} />
                <Route path="/supervisor/profil" element={<ProfilePage />} />
              </Route>
            </Route>
            
            <Route element={<ProtectedRoute allowedRoles={['admin']} />}>
              <Route path="/admin/*" element={<ComingSoonPage />} />
            </Route>
            
            <Route path="*" element={
              <div className="min-h-screen flex items-center justify-center p-6">
                <div className="text-center max-w-md animate-fade-in">
                  <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-primary-50 mb-6">
                    <span className="text-4xl font-bold text-primary-600">404</span>
                  </div>
                  <h1 className="text-3xl font-display font-semibold text-gray-900 mb-3">Halaman Tidak Ditemukan</h1>
                  <p className="text-gray-600 mb-8 leading-relaxed">
                    Halaman yang Anda cari tidak tersedia atau telah dipindahkan.
                  </p>
                  <a 
                    href="/" 
                    className="inline-flex items-center justify-center px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 active:bg-primary-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
                  >
                    Kembali ke Login
                  </a>
                </div>
              </div>
            } />
          </Routes>
        </Router>
      </AuthProvider>
    </div>
  );
}

export default App;