import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext();

const MOCK_USER = {
  supervisor: {
    email: 'supervisor@demo.com',
    password: 'password123',
    name: 'Ahmad Setiawan',
    role: 'supervisor',
    avatar: 'https://ui-avatars.com/api/?name=Ahmad+Setiawan&background=0077ff&color=fff',
    teamId: 'team_001',
  },
};

export const AuthProvider = ({ children }) => { 
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem('taco_user');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user) {
      localStorage.setItem('taco_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('taco_user');
    }
  }, [user]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    await new Promise(resolve => setTimeout(resolve, 800));
    
    try {
      let authenticatedUser = null;
      if (email === MOCK_USER.supervisor.email && password === MOCK_USER.supervisor.password) {
        authenticatedUser = { ...MOCK_USER.supervisor };
      } else {
        const savedUserRaw = localStorage.getItem('taco_user');
        if (savedUserRaw) {
          try {
            const savedUser = JSON.parse(savedUserRaw);
            if (
              savedUser &&
              savedUser.email &&
              savedUser.password &&
              savedUser.email === email &&
              savedUser.password === password
            ) {
              authenticatedUser = { ...savedUser };
            }
          } catch {
            // abaikan data pengguna yang rusak
          }
        }
      }
      if (!authenticatedUser) {
        throw new Error('Kredensial salah. Silakan coba lagi.');
      }
      setUser(authenticatedUser);
      return { success: true, user: authenticatedUser };
    } catch (err) {
      setError(err.message);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('taco_user');
  };

  const updateUser = (updates) => {
    setUser((prev) => ({ ...prev, ...updates }));
  };

  const value = {
    user,
    loading,
    error,
    login,
    logout,
    updateUser,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};