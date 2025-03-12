'use client';

import { Loader2 } from 'lucide-react';

interface LoadingSpinnerProps {
  size?: 'small' | 'medium' | 'large';
  fullScreen?: boolean;
}

export function LoadingSpinner({ size = 'medium', fullScreen = false }: LoadingSpinnerProps) {
  const sizeClasses = {
    small: 'w-4 h-4',
    medium: 'w-8 h-8',
    large: 'w-12 h-12',
  };

  let divClasses = 'flex justify-center items-center';

  if (fullScreen) {
    divClasses += ' w-full h-screen';
  }
  
  return (
    <div className={divClasses}>
      <Loader2 className={`text-accent animate-spin ${sizeClasses[size]}`} />
    </div>
  );
}

