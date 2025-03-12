'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function SignUpPage() {
  const router = useRouter();
  const [error, setError] = useState('');

  const handleSubmit = async (data: { name: string; email: string; password: string }) => {
    setError('');

    const response = await fetch('/api/auth/signup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    const result = await response.json();

    if (!response.ok) {
      setError(result.error || 'Something went wrong');
      return;
    }

    router.push('/signin'); // Redirect after successful signup
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-container p-8 rounded-xl shadow-xl w-full max-w-md">
        <h1 className="text-3xl font-bold text-center mb-8 text-accent">Sign Up for MUZO</h1>

        {error && <p className="text-red-500 text-center">{error}</p>}

        <form onSubmit={(e) => {
          e.preventDefault();
          const form = e.target as HTMLFormElement;
          const name = (form.elements.namedItem('name') as HTMLInputElement).value;
          const email = (form.elements.namedItem('email') as HTMLInputElement).value;
          const password = (form.elements.namedItem('password') as HTMLInputElement).value;
          handleSubmit({ name, email, password });
        }} className="space-y-6">

          <input name="name" type="text" placeholder="Name" className="w-full px-4 py-3 bg-subContainer placeholder-altAccent rounded-lg text-textPrimary" required />
          <input name="email" type="email" placeholder="Email" className="w-full px-4 py-3 bg-subContainer placeholder-altAccent rounded-lg text-textPrimary" required />
          <input name="password" type="password" placeholder="Password" className="w-full px-4 py-3 bg-subContainer placeholder-altAccent rounded-lg text-textPrimary" required />

          <button type="submit" className="blue-button w-full">Sign Up</button>
        </form>
      </div>
    </div>
  );
}
