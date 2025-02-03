'use client';

import React from 'react';

interface AuthFormProps {
  type: 'signin' | 'signup';
  onSubmit: (data: { email: string; password: string; name?: string }) => void;
}

export function AuthForm({ type, onSubmit }: AuthFormProps) {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    onSubmit({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      name: formData.get('name') as string,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {type === 'signup' && (
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-1">
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            required
            className="w-full px-4 py-2 bg-[#2a264d] border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-400 text-white"
          />
        </div>
      )}
      <div>
        <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-1">
          Email
        </label>
        <input
          type="email"
          id="email"
          name="email"
          required
          className="w-full px-4 py-2 bg-[#2a264d] border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-400 text-white"
        />
      </div>
      <div>
        <label htmlFor="password" className="block text-sm font-medium text-gray-300 mb-1">
          Password
        </label>
        <input
          type="password"
          id="password"
          name="password"
          required
          className="w-full px-4 py-2 bg-[#2a264d] border border-gray-600 rounded-lg focus:outline-none focus:border-cyan-400 text-white"
        />
      </div>
      <button
        type="submit"
        className="w-full py-2 px-4 bg-cyan-400 text-black rounded-lg font-medium hover:bg-cyan-500 transition-colors"
      >
        {type === 'signup' ? 'Sign Up' : 'Sign In'}
      </button>
    </form>
  );
}