"use client";

import { AudioVisualizer } from "@/components/AudioVisualizer";
import { Download, Heart, Megaphone, Pause, Play, Save, Share2 } from "lucide-react";
import { useRef, useState } from "react";
import { TrackData } from "./page";
import { useRouter } from 'next/navigation';
import TrackFeedback from "./TrackFeedback";
import { Stars } from "@/components/Stars";
import { SurveyResponse } from "../feedback/response";
import { QuestionData, QuestionType } from "@/types/feedback";
import { useSession } from "next-auth/react";

interface Props {
  createdTrack: TrackData;
}

export default function NewTrackPlayer({ createdTrack }: Props) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef<HTMLAudioElement>(null);

  const router = useRouter();
  const { data: session } = useSession();

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

  const handleDownload = () => {
    if (!createdTrack?.playUrl) return;

    // Extract base64 data from the data URL
    const base64Data = createdTrack.playUrl.split(',')[1];

    // Convert base64 to blob
    const byteCharacters = atob(base64Data);
    const byteArrays = [];

    for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
      const slice = byteCharacters.slice(offset, offset + 1024);
      const byteNumbers = new Array(slice.length);

      for (let i = 0; i < slice.length; i++) {
        byteNumbers[i] = slice.charCodeAt(i);
      }

      const byteArray = new Uint8Array(byteNumbers);
      byteArrays.push(byteArray);
    }

    const blob = new Blob(byteArrays, { type: 'audio/wav' });

    // Create download link
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${createdTrack.title}.wav`;

    // Trigger download
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(url);
  };

  const handleSaveToLibrary = async () => {
    if (!createdTrack) return;

    try {
      const response = await fetch('/api/tracks/save', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(createdTrack),
      });

      if (!response.ok) {
        throw new Error('Failed to save track');
      }

      // Redirect to library page after successful save
      router.push('/library');
    } catch (error) {
      console.error('Error saving track:', error);
      // You might want to show an error message to the user here
    }
  };

  const [showFeedback, setShowFeedback] = useState(false);

  const feedback = !showFeedback || (
    <TrackFeedback closeAction={() => setShowFeedback(false)} trackData={createdTrack} />
  );

  return (
    // Track Display UI - This is shown after track creation
    <>
      {feedback}

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
                  src={createdTrack.playUrl}
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
                  <button
                    onClick={handleSaveToLibrary}
                    className="flex-1 bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium py-3 px-4 rounded-lg hover:brightness-110 transition-all flex items-center justify-center gap-2 shadow-lg"
                  >
                    <Save size={18} />
                    <span>Save to Library</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors"
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </button>
                  <button className="flex items-center justify-center gap-2 py-3 px-4 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors">
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="flex items-center justify-center gap-2 py-3 px-4 border border-cyan-500/30 text-cyan-400 rounded-lg hover:bg-cyan-500/10 transition-colors"
                  >
                    <Megaphone size={18} />
                    <span>Provide Feedback</span>
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
                  <p className="text-white mt-1 p-3 bg-[#2c284e]/70 border border-[#45417a] rounded-lg">{createdTrack.prompt}</p>
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
                    <Stars setStarsAction={(n) => rateTrack(n, createdTrack, session?.user.id)} />
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
  );
}

const formatTime = (seconds: number) => {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
};

const rateTrack = (rating: number, trackData: TrackData, userId?: string) => {
  const ratingQuestion: QuestionData = {
    description: "Rating",
    type: QuestionType.Number,
    optional: false,
  };

  const response = new SurveyResponse([ratingQuestion], trackData, "track-rating", userId);

  response.addQuestionReponse(ratingQuestion, rating);

  response.submit();
};

