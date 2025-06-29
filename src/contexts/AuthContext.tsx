import React, { createContext, useContext, useState, ReactNode } from 'react';
import { AuthContextType, User, RegisterFormData } from '@/core/types';
import { useUsers } from './UsersContext';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const { users, createUser } = useUsers();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  const login = async (email: string, password: string): Promise<void> => {
    setLoading(true);
    try {
      if (!email || !password) throw new Error('Preencha todos os campos');
      const foundUser = users.find(u => u.email === email);
      if (!foundUser) throw new Error('Usuário não encontrado');
      if (foundUser.password !== password) throw new Error('Senha incorreta');
      setUser(foundUser);
    } catch (error: any) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData: RegisterFormData): Promise<void> => {
    setLoading(true);
    try {
      if (!userData.username || !userData.email || !userData.password || !userData.confirmPassword) {
        throw new Error('Preencha todos os campos');
      }
      if (userData.password !== userData.confirmPassword) {
        throw new Error('As senhas não coincidem');
      }
      if (users.some(u => u.email === userData.email)) {
        throw new Error('Email já cadastrado');
      }
      const newUser = createUser({
        username: userData.username,
        email: userData.email,
        password: userData.password,
        avatar: 'https://via.placeholder.com/150',
        bio: '',
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      setUser(newUser);
    } catch (error) {
      setUser(null);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = (): void => {
    setUser(null);
  };

  const value: AuthContextType = {
    user,
    isAuthenticated: !!user,
    login,
    register,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth deve ser usado dentro de um AuthProvider');
  }
  return context;
};