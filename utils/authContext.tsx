import { createContext, useContext, useState, ReactNode, useMemo } from 'react';
import { useRouter } from 'next/router';
import { User, AuthContextType } from '@/types/auth';
import { setCookie, deleteCookie, getCookie } from 'cookies-next';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  useMemo(() => {
    const users = getCookie('users');
    if (users) {
      setUser(JSON.parse(users));
    }
  }, []);

  const login = (userData: User) => {
    setCookie('users', JSON.stringify(userData));
    setUser(userData);
    localStorage.setItem('userType', userData?.user_type);
    // router.push('/');
  };

  const logout = () => {
    deleteCookie('users');
    localStorage.removeItem('userType');
    setUser(null);
    router.push('/auth/login');
  };

  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
