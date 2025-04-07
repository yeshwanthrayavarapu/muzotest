"use client";
import { useLocalStorage } from '@uidotdev/usehooks';
import { User } from '../../shared/user';
import * as api from '@/api';

import { createContext, useContext, useEffect, useState } from 'react';

export interface Session {
  jwtToken: string;
}

export enum AuthStatus {
  Loading,
  LoggedIn,
  LoggedOut,
}

interface AuthContextType {
  user?: User;
  session?: Session;
  status: AuthStatus;
  login: (session: Session, user: User) => void;
  logout: () => void;
  refetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [session, setSession] = useLocalStorage<Session | undefined>('session', undefined);
  const [user, setUser] = useLocalStorage<User | undefined>('user', undefined);
  const [status, setStatus] = useState<AuthStatus>(AuthStatus.Loading);

  useEffect(() => {
    if (session && user) {
      setStatus(AuthStatus.LoggedIn);
    } else {
      setStatus(AuthStatus.LoggedOut);
    }
  }, [session, user]);

  const login = (session: Session, user: User) => {
    setSession(session);
    setUser(user);
    localStorage.setItem('session', JSON.stringify(session));
    localStorage.setItem('user', JSON.stringify(user));
  };

  const logout = () => {
    setSession(undefined);
    setUser(undefined);
    localStorage.removeItem('session');
    localStorage.removeItem('user');
  };

  const refetchUser = async () => {
    if (!session || !user) {
      logout();
      return;
    }

    const response = await api.fetchProfile(user.uuid);
    setUser(response);
  };

  return (
    <AuthContext.Provider value={{ user, session, login, logout, status, refetchUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
