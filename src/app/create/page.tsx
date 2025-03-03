'use client';

import React, { useState } from 'react';
import { Music, HelpCircle, Info, Wand2, Zap } from 'lucide-react';
import { AudioInput } from '@/components/AudioInput';
import { AuthGuard } from '@/components/AuthGuard';
import { Sidebar } from '@/components/Sidebar';

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [creationStep, setCreationStep] = useState(1);

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
      console.log('Track created:', data);
      
      // Reset form
      setPrompt('');
      setAudioFile(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create track');
    } finally {
      setIsLoading(false);
      setCreationStep(1);
    }
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

  return (
    <AuthGuard>
        <Sidebar />
        <div className="ml-64 min-h-screen">
          <main className="px-6 py-8">
            <header className="mb-8">
              <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 flex items-center gap-2">
                <Wand2 className="h-6 w-6" />
                Create New Track
              </h1>
              <p className="text-gray-400 mt-1 text-sm">
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
                <div className="bg-gradient-to-br from-[#1e1b3b] to-[#262145] rounded-xl shadow-xl overflow-hidden">
                  <div className="p-6">
                    <form onSubmit={handleSubmit} className="space-y-6">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <label className="text-base font-medium text-cyan-300">
                            Describe Your Track
                          </label>
                          <button
                            type="button"
                            onClick={() => setShowTips(!showTips)}
                            className="text-gray-400 hover:text-cyan-400 transition-colors flex items-center text-xs"
                          >
                            <HelpCircle size={14} className="mr-1" />
                            Writing Tips
                          </button>
                        </div>
                        
                        <textarea
                          value={prompt}
                          onChange={(e) => setPrompt(e.target.value)}
                          placeholder="Describe the music you want to create... Be specific about genre, mood, instruments, tempo, etc."
                          className="w-full h-32 bg-[#2c284e]/70 border border-[#45417a] text-white rounded-lg p-4 resize-none focus:ring-2 focus:ring-cyan-400 focus:outline-none transition-all text-sm"
                          disabled={isLoading}
                        />
                        
                        {showTips && (
                          <div className="p-3 bg-[#2c284e]/50 border border-cyan-500/20 rounded-lg text-xs text-gray-300">
                            <p className="font-medium text-cyan-400 mb-1">Tips for better results:</p>
                            <ul className="list-disc list-inside space-y-1">
                              <li>Specify genre, mood, and tempo</li>
                              <li>Mention specific instruments</li>
                              <li>Describe the overall feeling you want</li>
                            </ul>
                          </div>
                        )}
                      </div>
                      
                      <div className="space-y-3">
                        <label className="text-base font-medium text-cyan-300">
                          Audio Reference (Optional)
                        </label>
                        <AudioInput 
                          onAudioCapture={handleAudioCapture} 
                          disabled={isLoading}
                        />
                        
                        {audioFile && (
                          <div className="p-3 bg-[#2c284e]/50 border border-cyan-500/20 rounded-lg flex items-center">
                            <Music size={16} className="text-cyan-400 mr-2 flex-shrink-0" />
                            <span className="text-cyan-300 text-xs truncate">
                              {audioFile.name}
                            </span>
                          </div>
                        )}
                      </div>
                      
                      {isLoading && (
                        <div className="bg-[#2c284e]/30 border border-cyan-500/10 rounded-lg p-4">
                          <div className="flex items-center justify-between mb-3">
                            <h4 className="text-cyan-300 text-sm font-medium">Creating your track</h4>
                            <span className="text-xs text-cyan-400">Step {creationStep}/3</span>
                          </div>
                          <div className="w-full bg-[#1e1b3b] rounded-full h-2.5">
                            <div 
                              className="bg-gradient-to-r from-cyan-500 to-blue-600 h-2.5 rounded-full transition-all duration-500"
                              style={{ width: `${(creationStep / 3) * 100}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-gray-400 mt-3">
                            {creationStep === 1 && "Analyzing your prompt..."}
                            {creationStep === 2 && "Generating music patterns..."}
                            {creationStep === 3 && "Finalizing your track..."}
                          </div>
                        </div>
                      )}
                      
                      <div>
                        <button
                          type="submit"
                          disabled={isLoading || !prompt.trim()}
                          className="w-full bg-gradient-to-r from-cyan-400 to-blue-700 text-white font-medium py-3.5 px-6 rounded-lg hover:from-cyan-500 hover:to-blue-600 hover:brightness-110 transition-all flex items-center justify-center gap-2 disabled:opacity-90 disabled:cursor-not-allowed shadow-lg"
                        >
                          {isLoading ? (
                            <>
                              <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
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
                    </form>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-1">
                <div className="bg-gradient-to-br from-[#1e1b3b] to-[#262145] rounded-xl shadow-xl h-full">
                  <div className="p-6">
                    <h3 className="text-lg font-medium text-cyan-300 mb-4">Example Prompts</h3>
                    <div className="space-y-3">
                      {examplePrompts.map((examplePrompt, index) => (
                        <button
                          key={index}
                          onClick={() => insertExamplePrompt(examplePrompt)}
                          disabled={isLoading}
                          className="w-full text-left p-3 bg-[#2c284e]/50 border border-[#45417a] hover:border-cyan-500/50 rounded-lg text-sm text-gray-300 transition-all hover:bg-[#2c284e] cursor-pointer"
                        >
                          {examplePrompt}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-8">
                      <h3 className="text-lg font-medium text-cyan-300 mb-4">How It Works</h3>
                      <div className="space-y-4 text-sm text-gray-300">
                        <div className="flex items-start">
                          <div className="bg-cyan-500/20 rounded-full p-1.5 mr-3 flex-shrink-0">
                            <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-cyan-400">1</span>
                          </div>
                          <p>Describe the music you want to create with specific details</p>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-cyan-500/20 rounded-full p-1.5 mr-3 flex-shrink-0">
                            <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-cyan-400">2</span>
                          </div>
                          <p>Optionally upload an audio reference to guide the style</p>
                        </div>
                        <div className="flex items-start">
                          <div className="bg-cyan-500/20 rounded-full p-1.5 mr-3 flex-shrink-0">
                            <span className="flex items-center justify-center w-4 h-4 text-xs font-bold text-cyan-400">3</span>
                          </div>
                          <p>Our AI will generate a unique track based on your input</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </main>
        </div>
    </AuthGuard>
  );
}