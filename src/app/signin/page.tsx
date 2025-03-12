'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';
import { LogIn } from 'lucide-react';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await signIn('credentials', {
      email,
      password,
      redirect: false, // Prevent automatic redirection
    });

    setLoading(false);

    if (result?.error) {
      setError('Invalid email or password. Please try again.');
    } else {
      router.push('/create'); // Consistent redirect
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-container p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-accent">Sign In to MUZO</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

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
              className="w-full px-4 py-3 bg-subContainer rounded-lg focus:ring-2 focus:ring-altAccent focus:outline-none text-textPrimary"
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
              className="w-full px-4 py-3 bg-subContainer rounded-lg focus:ring-2 focus:ring-altAccent focus:outline-none text-textPrimary"
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
