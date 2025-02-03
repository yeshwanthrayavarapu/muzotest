'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';

export default function SignInPage() {
  const router = useRouter();

  const handleSubmit = async (data: { email: string; password: string }) => {
    try {
      // Implement your sign in logic here
      console.log('Signing in:', data);
      // After successful sign in, redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Sign in error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0b2e] to-[#0a0d12]">
      <div className="bg-[#1e1b3b] p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-cyan-400">Sign In to MUZO</h1>
        <AuthForm type="signin" onSubmit={handleSubmit} />
        <p className="mt-6 text-center text-gray-400">
          Don&apos;t have an account?{' '}
          <button
            onClick={() => router.push('/auth/signup')}
            className="text-cyan-400 hover:underline"
          >
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}