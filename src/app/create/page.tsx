'use client';

import React, { useEffect, useState } from 'react';
import { Music, HelpCircle, Info, Wand2, Zap, RotateCcw } from 'lucide-react';
import { AudioInput } from '@/components/AudioInput';
import { Sidebar } from '@/components/Sidebar';
import NewTrackPlayer from './NewTrackPlayer';
import { selectRandom, truncate } from '@/utils';
import { authedPost } from '@/api';
import { AuthStatus, useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { PromptDto, PromptResponseDto } from '../../../shared/dto';
import { Track } from '../../../shared/track';
import ErrorMessage from '@/components/ErrorMessage';

// TODO: Revise these and make more
const ALL_EXAMPLE_PROMPTS = [
  "A melodic lo-fi beat with soft piano and rain sounds",
  "Upbeat electronic dance music with synth leads and a strong bass line",
  "Ambient soundscape with nature sounds and subtle strings",
  "A lively Baroque orchestral piece in the style of Johann Sebastian Bach, featuring a vibrant interplay between violin, cello, and harpsichord. The melody dances through intricate counterpoint, with a strong, flowing bass line and elegant ornamentation. The composition exudes a sense of grandeur and refinement, perfect for a courtly dance or a triumphant overture.",
  "A fast-paced, energetic bebop jazz piece with intricate saxophone solos, walking double bass, and swinging drum patterns. The piano adds syncopated chord stabs and rapid arpeggios, creating a lively, improvisational feel. The mood is vibrant and dynamic, perfect for a bustling city scene or an intense jam session.",
];

export default function CreatePage() {
  const [prompt, setPrompt] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showTips, setShowTips] = useState(false);
  const [creationStep, setCreationStep] = useState(1);
  const [examplePrompts, setExamplePrompts] = useState<string[]>([]);

  const { session, status } = useAuth();

  const router = useRouter();

  useEffect(() => {
    if (status === AuthStatus.LoggedOut) {
      router.push('/signin');
    }
  }, [session]);

  useEffect(() => {
    setExamplePrompts(selectRandom(ALL_EXAMPLE_PROMPTS, 3));
  }, []);

  // New states for track display
  const [createdTrack, setCreatedTrack] = useState<Track | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    if (!session) return;

    e.preventDefault();
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);
    setCreationStep(1);

    try {
      // // First step simulation
      // await new Promise(resolve => setTimeout(resolve, 1500));
      // setCreationStep(2);

      const formData = new FormData();
      formData.append('prompt', prompt.trim());
      if (audioFile) {
        formData.append('audioFile', audioFile);
      }

      // // Second step simulation
      // await new Promise(resolve => setTimeout(resolve, 1500));
      // setCreationStep(3);

      const body: PromptDto = {
        prompt: prompt.trim(),
        hasAudioAttchment: !!audioFile,
      };

      const response = await authedPost('/tracks/create', session, body);

      if (!response.ok) {
        throw new Error('Failed to create track');
      }

      const data = await response.json() as PromptResponseDto;

      console.log('Track created:', data);

      setCreatedTrack(data.track);
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

  const examplePromptButtons = (
    <>
      <h3 className="text-lg font-medium text-accent mb-4">
        Example Prompts
      </h3>
      <div className="space-y-3">
        {examplePrompts.map((examplePrompt, index) => (
          <button
            key={index}
            onClick={() => insertExamplePrompt(examplePrompt)}
            disabled={isLoading}
            className="w-full text-left p-3 bg-subContainer/50 border border-accent hover:border-accent/50 rounded-lg text-sm text-textSecondary transition-all hover:bg-subContainer cursor-pointer"
          >
            {truncate(examplePrompt, 220)}
          </button>
        ))}
      </div>
    </>
  );

  return (
    <>
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

              <ErrorMessage message={error ?? undefined} />

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
                            disabled={isLoading}
                            className="h-32"
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
                      {examplePromptButtons}

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
    </>
  );
}
