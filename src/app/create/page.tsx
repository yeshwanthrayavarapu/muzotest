'use client';

import React, { useState, useRef, useEffect } from 'react';
import { Music, HelpCircle, Info, Wand2, Zap, Play, Pause, Download, Share2, RotateCcw, Save, Heart } from 'lucide-react';
import { AudioInput } from '@/components/AudioInput';
import { AuthGuard } from '@/components/AuthGuard';
import { Sidebar } from '@/components/Sidebar';
import { AudioVisualizer } from '@/components/AudioVisualizer';

interface TrackData {
  id: string;
  title: string;
  audioUrl: string;
  coverImageUrl?: string;
  duration: number;
}

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [creationStep, setCreationStep] = useState(1);
  
  // New states for track display
  const [createdTrack, setCreatedTrack] = useState<TrackData | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);

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
      
      // In a real implementation, you would use the actual data returned from the API
      // This is mock data for demonstration
      setCreatedTrack({
        id: data.id || 'track-123',
        title: prompt.trim().substring(0, 40) + '...',
        audioUrl: data.audioUrl || '/demo-track.mp3',
        coverImageUrl: data.coverImageUrl || '/demo-cover.jpg',
        duration: data.duration || 180, // 3 minutes in seconds
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create track');
    } finally {
      setIsLoading(false);
      setCreationStep(1);
    }
  };

  // Audio controls
  const togglePlayPause = () => {
    if (!audioRef.current) return;
    
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
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

  return (
    <AuthGuard>
        <Sidebar />
        <div className="ml-64 min-h-screen">
          <main className="px-6 py-8">
            {!createdTrack ? (
              // Creation Form
              <>
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
              </>
            ) : (
              // Track Display UI - This is shown after track creation
              <>
                <header className="mb-8 flex justify-between items-center">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold text-cyan-400 flex items-center gap-2">
                      <Music className="h-6 w-6" />
                      Your Generated Track
                    </h1>
                    <p className="text-gray-400 mt-1 text-sm">
                      Listen, save, or share your unique AI-generated music
                    </p>
                  </div>
                  <button 
                    onClick={resetCreation}
                    className="flex items-center gap-1 text-sm text-cyan-400 hover:text-cyan-300 transition-colors"
                  >
                    <RotateCcw size={16} />
                    Create Another
                  </button>
                </header>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                  <div className="lg:col-span-2">
                    <div className="bg-gradient-to-br from-[#1e1b3b] to-[#262145] rounded-xl shadow-xl overflow-hidden">
                      <div className="p-6">
                        {/* Track title & info */}
                        <div className="mb-6">
                          <h2 className="text-xl font-semibold text-white">{createdTrack.title}</h2>
                          <p className="text-gray-400 text-sm">Generated from your prompt</p>
                        </div>
                        
                        {/* Audio visualization */}
                        <div className="relative h-48 mb-6 bg-[#2c284e]/50 rounded-lg overflow-hidden flex items-center justify-center">
                          <AudioVisualizer 
                            audioElement={audioRef.current}
                            isPlaying={isPlaying}
                            gradientFrom="#22d3ee" 
                            gradientTo="#1d4ed8"
                            height={300}
                          />
                          
                          {!isPlaying && (
                            <div className="absolute inset-0 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                              <button 
                                onClick={togglePlayPause}
                                className="bg-cyan-400 hover:bg-cyan-500 transition-colors text-black p-4 rounded-full shadow-xl"
                              >
                                <Play size={24} fill="currentColor" />
                              </button>
                            </div>
                          )}
                        </div>
                        
                        {/* Audio player controls */}
                        <div className="space-y-4">
                          <audio 
                            ref={audioRef} 
                            src={createdTrack.audioUrl} 
                            onTimeUpdate={handleTimeUpdate}
                            onEnded={() => setIsPlaying(false)}
                            onPlay={() => setIsPlaying(true)}
                            onPause={() => setIsPlaying(false)}
                            hidden
                          />
                          
                          <div className="flex items-center gap-4">
                            <button 
                              onClick={togglePlayPause}
                              className="bg-cyan-400 hover:bg-cyan-500 transition-colors text-black p-3 rounded-full"
                            >
                              {isPlaying ? <Pause size={18} /> : <Play size={18} fill="currentColor" />}
                            </button>
                            
                            {/* Progress bar */}
                            <div className="flex-1 flex items-center gap-2">
                              <span className="text-xs text-gray-300">{formatTime(currentTime)}</span>
                              <div className="flex-1 h-1 bg-[#45417a] rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-gradient-to-r from-cyan-400 to-blue-600" 
                                  style={{
                                    width: `${(currentTime / createdTrack.duration) * 100}%`
                                  }}
                                ></div>
                              </div>
                              <span className="text-xs text-gray-300">{formatTime(createdTrack.duration)}</span>
                            </div>
                          </div>
                          
                          {/* Action buttons */}
                          <div className="flex flex-wrap gap-3 mt-6">
                            <button className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg">
                              <Save size={18} />
                              <span>Save to Library</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors">
                              <Download size={18} />
                              <span>Download</span>
                            </button>
                            <button className="flex items-center justify-center gap-2 py-3 px-4 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors">
                              <Share2 size={18} />
                              <span>Share</span>
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-1">
                    <div className="bg-gradient-to-br from-[#1e1b3b] to-[#262145] rounded-xl shadow-xl h-full">
                      <div className="p-6">
                        <h3 className="text-lg font-medium text-cyan-300 mb-4">Track Details</h3>
                        
                        <div className="space-y-4 text-sm">
                          <div>
                            <p className="text-gray-400">Generated from</p>
                            <p className="text-white mt-1 p-3 bg-[#2c284e]/70 border border-[#45417a] rounded-lg">{prompt}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-400">Duration</p>
                            <p className="text-white mt-1">{formatTime(createdTrack.duration)}</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-400 mb-2">Rate this generation</p>
                            <div className="flex items-center gap-2">
                              <button className="p-2 rounded-full hover:bg-cyan-500/20 transition-colors">
                                <Heart size={20} className="text-gray-400 hover:text-cyan-400" />
                              </button>
                              <div className="flex gap-1">
                                {[1, 2, 3, 4, 5].map((star) => (
                                  <button 
                                    key={star}
                                    className="text-gray-400 hover:text-yellow-400 transition-colors"
                                  >
                                    ★
                                  </button>
                                ))}
                              </div>
                            </div>
                          </div>
                          
                          <div className="pt-4 mt-4 border-t border-[#45417a]">
                            <h4 className="font-medium text-cyan-300 mb-3">What's Next?</h4>
                            <ul className="space-y-2 text-gray-300">
                              <li className="flex items-start gap-2">
                                <div className="rounded-full bg-cyan-500/20 p-1 mt-0.5">
                                  <Save size={12} className="text-cyan-400" />
                                </div>
                                <span>Save to your personal library</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="rounded-full bg-cyan-500/20 p-1 mt-0.5">
                                  <Download size={12} className="text-cyan-400" />
                                </div>
                                <span>Download for offline use</span>
                              </li>
                              <li className="flex items-start gap-2">
                                <div className="rounded-full bg-cyan-500/20 p-1 mt-0.5">
                                  <Share2 size={12} className="text-cyan-400" />
                                </div>
                                <span>Share with friends or on social media</span>
                              </li>
                            </ul>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            )}
          </main>
        </div>
    </AuthGuard>
  );
}