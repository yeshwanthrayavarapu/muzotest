'use client';

import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';
import { AuthStatus, useAuth } from '@/contexts/AuthContext';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  const { status } = useAuth();

  useEffect(() => {
    if (status === AuthStatus.LoggedOut) {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === AuthStatus.Loading) {
    return <LoadingSpinner fullScreen={true} size='large' />;
  }

  return <>{children}</>;
}
