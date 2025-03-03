'use client';

import React, { useState } from 'react';
import { Send } from 'lucide-react';
import { AudioInput } from '@/components/AudioInput';
import type { CreateTrackInput } from '@/types/music';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { AuthGuard } from '@/components/AuthGuard';

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();



  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    try {
      const formData = new FormData();
      formData.append('prompt', prompt.trim());
      if (audioFile) {
        formData.append('audioFile', audioFile);
      }

      const response = await fetch('/api/tracks/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create track');
      }

      const data = await response.json();
      console.log('Track created:', data);
      
      // Reset form
      setPrompt('');
      setAudioFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create track');
    } finally {
      setIsLoading(false);
    }
  };

  const handleAudioCapture = (file: File) => {
    setAudioFile(file);
  };

  return (
    <AuthGuard>
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="max-w-4xl mx-auto px-6 py-12">
          <h1 className="text-3xl font-bold mb-8 text-cyan-400">Create New Track</h1>
          
          <div className="bg-[#1e1b3b] p-6 rounded-xl">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 text-red-500 rounded-lg text-sm">
                {error}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Write about your song idea..."
                className="w-full h-32 bg-[#2c284e] text-white rounded-lg p-4 mb-4 resize-none focus:ring-2 focus:ring-cyan-400 focus:outline-none"
                disabled={isLoading}
              />
              
              <AudioInput onAudioCapture={handleAudioCapture} />
              
              {audioFile && (
                <p className="mt-4 text-sm text-cyan-400">
                  Selected: {audioFile.name}
                </p>
              )}
              
              <button
                type="submit"
                disabled={isLoading || !prompt.trim()}
                className="mt-4 w-full bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold py-2 px-6 rounded-lg hover:opacity-90 transition-opacity flex items-center justify-center gap-2 disabled:opacity-50"
              >
                <Send size={20} />
                {isLoading ? 'Creating...' : 'Create'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}