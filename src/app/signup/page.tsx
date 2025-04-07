'use client';

import { isApiError, signUp } from '@/api';
import ErrorMessage from '@/components/ErrorMessage';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const { session, login } = useAuth();

  useEffect(() => {
    if (session) {
      router.push('/');
    }
  }, [session]);

  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    setError('');

    const response = await signUp({
      username: data.name,
      email: data.email,
      password: data.password,
    });

    if (isApiError(response)) {
      setError(response.message);
      return;
    }

    login(response.session, response.user);

    router.push('/signin'); // Redirect after successful signup
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-container p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-accent">Sign Up for MUZO</h1>

        <ErrorMessage message={error} />

        <form onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const name = (form.elements.namedItem('name') as HTMLInputElement).value;
          const email = (form.elements.namedItem('email') as HTMLInputElement).value;
          const password = (form.elements.namedItem('password') as HTMLInputElement).value;
          handleSubmit({ name, email, password });
        }} className="space-y-6">

          <input name="name" type="text" placeholder="Name" required />
          <input name="email" type="email" placeholder="Email" required />
          <input name="password" type="password" placeholder="Password" required />

          <button type="submit" className="blue-button w-full">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
