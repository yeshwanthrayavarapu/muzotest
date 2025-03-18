'use client';

import React, { useState } from 'react';
import { Music, HelpCircle, Info, Wand2, Zap, RotateCcw } from 'lucide-react';
import { AudioInput } from '@/components/AudioInput';
import { AuthGuard } from '@/components/AuthGuard';
import { Sidebar } from '@/components/Sidebar';
import NewTrackPlayer from './NewTrackPlayer';
import { Track } from '@/types/music';
import { getRandomImageUrl } from '../lib/imageUtils';
import { truncate } from '@/utils';

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [creationStep, setCreationStep] = useState(1);

  // New states for track display
  const [createdTrack, setCreatedTrack] = useState<Track | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setCreationStep(1);
    
    try {
      // First step simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCreationStep(2);
      
      const formData = new FormData();
      formData.append('prompt', prompt.trim());
      if (audioFile) {
        formData.append('audioFile', audioFile);
      }

      // Second step simulation
      await new Promise(resolve => setTimeout(resolve, 1500));
      setCreationStep(3);

      const response = await fetch('/api/tracks/create', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Failed to create track');
      }

      const data = await response.json();

      const coverUrl = await getRandomImageUrl(prompt);

      setCreatedTrack({
        id: data.id || 'track-123',
        title: truncate(prompt, 30),
        audioUrl: data.audioUrl || '/demo-track.mp3',
        playUrl: data.playUrl || '/demo-track.mp3',
        coverUrl,
        duration: data.duration || 180, // 3 minutes in seconds
        prompt,
        description: prompt, // Use prompt as description
        genre: 'AI Generated', // Default genre
        artist: 'AI Music', // Default artist
        createdAt: new Date().toISOString()
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create track');
    } finally {
      setIsLoading(false);
      setCreationStep(1);
    }
  };

  const resetCreation = () => {
    setCreatedTrack(null);
    setPrompt('');
    setAudioFile(null);
  };

  const handleAudioCapture = (file: File) => {
    setAudioFile(file);
  };

  const examplePrompts = [
    "A melodic lo-fi beat with soft piano and rain sounds",
    "Upbeat electronic dance music with synth leads and a strong bass line",
    "Ambient soundscape with nature sounds and subtle strings"
  ];

  const insertExamplePrompt = (prompt: string) => {
    setPrompt(prompt);
  };

  const submit = (
    <div>
      <button
        type="submit"
        disabled={isLoading || !prompt.trim()}
        className="blue-button w-full"
      >
        {isLoading ? (
          <>
            <div className="animate-spin w-5 h-5 border-2 border-accent rounded-full" />
            <span className="ml-2">Creating Your Track...</span>
          </>
        ) : (
          <>
            <Zap size={18} />
            <span>Generate Track</span>
          </>
        )}
      </button>
    </div>
  );

  return (
    <AuthGuard>
        <Sidebar />
        <div className="ml-64 min-h-screen">
          <main className="px-6 py-8">
            {!createdTrack ? (
              // Creation Form
              <>
                <header className="mb-8">
                  <h1 className="text-2xl md:text-3xl font-bold text-accent flex items-center gap-2">
                    <Wand2 className="h-6 w-6" />
                    Create New Track
                  </h1>
                  <p className="text-textSecondary mt-1 text-sm">
                    Generate unique music using AI with text prompts or audio references
                  </p>
                </header>
                
                {error && (
                  <div className="mb-8 p-3 bg-red-500/10 border border-red-500/30 text-red-400 rounded-lg text-sm flex items-center">
                    <Info className="mr-2 h-4 w-4 flex-shrink-0" />
                    <span>{error}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-container rounded-xl shadow-xl overflow-hidden">
                      <div className="p-6">
                        <form onSubmit={handleSubmit} className="space-y-6">
                          <div className="space-y-2">
                            <div className="flex items-center justify-between">
                              <label className="text-base font-medium text-accent">
                                Describe Your Track
                              </label>
                              <button
                                type="button"
                                onClick={() => setShowTips(!showTips)}
                                className="text-textSecondary hover:text-accent transition-colors flex items-center text-xs"
                              >
                                <HelpCircle size={14} className="mr-1" />
                                Writing Tips
                              </button>
                            </div>
                            
                            <textarea
                              value={prompt}
                              onChange={(e) => setPrompt(e.target.value)}
                              placeholder="Describe the music you want to create... Be specific about genre, mood, instruments, tempo, etc."
                              className="w-full h-32 placeholder-textSecondary bg-subContainer text-textPrimary rounded-lg p-4 resize-none focus:ring-2 focus:ring-altAccent focus:outline-none transition-all text-sm"
                              disabled={isLoading}
                            />
                            
                            {showTips && (
                              <div className="p-3 bg-subContainer/50 border border-accent/20 rounded-lg text-xs text-textSecondary">
                                <p className="font-medium text-accent mb-1">Tips for better results:</p>
                                <ul className="list-disc list-inside space-y-1">
                                  <li>Specify genre, mood, and tempo</li>
                                  <li>Mention specific instruments</li>
                                  <li>Describe the overall feeling you want</li>
                                </ul>
                              </div>
                            )}
                          </div>
                          
                          <div className="space-y-3">
                            <label className="text-base font-medium text-accent">
                              Audio Reference (Optional)
                            </label>
                            <AudioInput 
                              onAudioCapture={handleAudioCapture} 
                              disabled={isLoading}
                            />
                            
                            {audioFile && (
                              <div className="p-3 bg-subContainer border border-accent/20 rounded-lg flex items-center">
                                <Music size={16} className="text-accent mr-2 flex-shrink-0" />
                                <span className="text-accent text-xs truncate">
                                  {audioFile.name}
                                </span>
                              </div>
                            )}
                          </div>
                          
                          {isLoading && (
                            <div className="bg=subContainer border border-accent/10 rounded-lg p-4">
                              <div className="flex items-center justify-between mb-3">
                                <h4 className="text-accent text-sm font-medium">Creating your track</h4>
                                <span className="text-xs text-accent">Step {creationStep}/3</span>
                              </div>
                              <div className="w-full bg-subContainer rounded-full h-2.5">
                                <div 
                                  className="bg-gradient-to-r from-accent to-accent h-2.5 rounded-full transition-all duration-500"
                                  style={{ width: `${(creationStep / 3) * 100}%` }}
                                ></div>
                              </div>
                              <div className="text-xs text-textSecondary mt-3">
                                {creationStep === 1 && "Analyzing your prompt..."}
                                {creationStep === 2 && "Generating music patterns..."}
                                {creationStep === 3 && "Finalizing your track..."}
                              </div>
                            </div>
                          )}
                          
                          {submit}
                        </form>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-container rounded-xl shadow-xl h-full">
                      <div className="p-6">
                        <h3 className="text-lg font-medium text-accent mb-4">Example Prompts</h3>
                        <div className="space-y-3">
                          {examplePrompts.map((examplePrompt, index) => (
                            <button
                              key={index}
                              onClick={() => insertExamplePrompt(examplePrompt)}
                              disabled={isLoading}
                              className="w-full text-left p-3 bg-subContainer/50 border border-accent hover:border-accent/50 rounded-lg text-sm text-textSecondary transition-all hover:bg-subContainer cursor-pointer"
                            >
                              {examplePrompt}
                            </button>
                          ))}
                        </div>
                        
                        <div className="mt-8">
                          <h3 className="text-lg font-medium text-accent mb-4">How It Works</h3>
                          <div className="space-y-4 text-sm text-textSecondary">
                            <div className="flex items-start">
                              <div className="bg-altAccent/20 rounded-full p-1.5 mr-3 flex-shrink-0">
                                <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-accent">1</span>
                              </div>
                              <p>Describe the music you want to create with specific details</p>
                            </div>
                            <div className="flex items-start">
                              <div className="bg-altAccent/20 rounded-full p-1.5 mr-3 flex-shrink-0">
                                <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-accent">2</span>
                              </div>
                              <p>Optionally upload an audio reference to guide the style</p>
                            </div>
                            <div className="flex items-start">
                              <div className="bg-altAccent/20 rounded-full p-1.5 mr-3 flex-shrink-0">
                                <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-accent">3</span>
                              </div>
                              <p>Our AI will generate a unique track based on your input</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <header className="mb-8 flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-accent flex items-center gap-2">
                      <Music className="h-6 w-6" />
                      Your Generated Track
                    </h1>
                    <p className="text-textSecondary mt-1 text-sm">
                      Listen, save, or share your unique AI-generated music
                    </p>
                  </div>
                  <button
                    onClick={resetCreation}
                    className="flex items-center gap-1 text-sm text-accent hover:text-accent transition-colors"
                  >
                    <RotateCcw size={16} />
                    Create Another
                  </button>
                </header>
                <NewTrackPlayer createdTrack={createdTrack} /> 
              </>
            )}
          </main>
        </div>
    </AuthGuard>
  );
}
