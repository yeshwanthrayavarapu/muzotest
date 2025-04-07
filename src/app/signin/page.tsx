'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogIn } from 'lucide-react';
import { isApiError, login } from '@/api';
import { useAuth } from '@/contexts/AuthContext';
import ErrorMessage from '@/components/ErrorMessage';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const { login: setLogin, session } = useAuth();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await login(email, password);

    if (isApiError(result)) {
      setError(result.message);
    } else {
      setLogin(result.session, result.user);
    }

    setLoading(false);
    return;
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-container p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-accent">Sign In to MUZO</h1>

        <ErrorMessage message={error} />

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label htmlFor="email" className="block text-sm font-medium mb-2">
              Email Address
            </label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium mb-2">
              Password
            </label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="w-full blue-button"
            disabled={loading}
          >
            {loading ? 'Signing In...' : (
              <>
                <LogIn size={20} />
                Sign In
              </>
            )}
          </button>
        </form>

        <p className="mt-6 text-center text-textSecondary">
          Don&apos;t have an account?{' '}
          <button onClick={() => router.push('/signup')} className="text-accent hover:underline">
            Sign up
          </button>
        </p>
      </div>
    </div>
  );
}
