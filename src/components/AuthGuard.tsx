'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { LoadingSpinner } from './LoadingSpinner';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === "loading") {
    return <LoadingSpinner fullScreen={true} size='large' />;
  }

  if (!session) {
    return null;
  }

  return <>{children}</>;
}
