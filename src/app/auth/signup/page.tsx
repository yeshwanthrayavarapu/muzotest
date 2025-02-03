'use client';

import { useRouter } from 'next/navigation';
import { AuthForm } from '@/components/AuthForm';

export default function SignUpPage() {
  const router = useRouter();

  const handleSubmit = async (data: { email: string; password: string; name?: string }) => {
    try {
      // Implement your sign up logic here
      console.log('Signing up:', data);
      // After successful sign up, redirect to home page
      router.push('/');
    } catch (error) {
      console.error('Sign up error:', error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#1a0b2e] to-[#0a0d12]">
      <div className="bg-[#1e1b3b] p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-cyan-400">Create Account</h1>
        <AuthForm type="signup" onSubmit={handleSubmit} />
        <p className="mt-6 text-center text-gray-400">
          Already have an account?{' '}
          <button
            onClick={() => router.push('/auth/signin')}
            className="text-cyan-400 hover:underline"
          >
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}