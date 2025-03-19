"use client";

import { AudioVisualizer } from "@/components/AudioVisualizer";
import { Download, Heart, Megaphone, Pause, Play, Save, Share2 } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useRouter } from 'next/navigation';
import TrackFeedback from "./TrackFeedback";
import { Stars } from "@/components/Stars";
import { SurveyResponse } from "../feedback/response";
import { QuestionData, QuestionType } from "@/types/feedback";
import { useSession } from "next-auth/react";
import { useAudio } from "@/contexts/AudioContext";
import { Track } from "@/types/music";
import PlayButton from "@/components/PlayButton";
import PlayerProgress from "@/components/PlayerProgress";

interface Props {
  createdTrack: Track;
}

export default function NewTrackPlayer({ createdTrack }: Props) {
  const router = useRouter();
  const { data: session } = useSession();

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
      createdTrack.playUrl = undefined;

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

  const style = window.getComputedStyle(document.body)
  const accentColor = style.getPropertyValue("--col-accent");
  const altAccentColor = style.getPropertyValue("--col-altAccent");

  const {
    isPlaying,
    togglePlay,
    playTrack
  } = useAudio();

  useEffect(() => {
    playTrack(createdTrack);
  }, []);

  return (
    // Track Display UI - This is shown after track creation
    <>
      {feedback}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          <div className="bg-container rounded-xl shadow-xl overflow-hidden">
            <div className="p-6">
              {/* Track title & info */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-textPrimary">{createdTrack.title}</h2>
                <p className="text-textSecondary text-sm">Generated from your prompt</p>
              </div>

              {/* Audio visualization */}
              <div className="relative h-48 mb-6 bg-subContainer/50 rounded-lg overflow-hidden flex items-center justify-center">
                <AudioVisualizer
                  gradientFrom={accentColor}
                  gradientTo={altAccentColor}
                  height={300}
                />

                {!isPlaying && (
                  <div className="absolute inset-0 flex items-center justify-center bg-accentContrast/20 backdrop-blur-sm">
                    <button
                      onClick={togglePlay}
                      className="bg-accent hover:bg-altAccent transition-colors text-accentContrast p-4 rounded-full shadow-xl"
                    >
                      <Play size={24} fill="currentColor" />
                    </button>
                  </div>
                )}
              </div>

              {/* Audio player controls */}
              <div className="space-y-4">

                <div className="flex items-center gap-4">
                  <PlayButton />
                  <PlayerProgress />
                </div>

                {/* Action buttons */}
                <div className="flex flex-wrap gap-3 mt-6">
                  <button
                    onClick={handleSaveToLibrary}
                    className="blue-button"
                  >
                    <Save size={18} />
                    <span>Save to Library</span>
                  </button>
                  <button
                    onClick={handleDownload}
                    className="secondary-button !py-3"
                  >
                    <Download size={18} />
                    <span>Download</span>
                  </button>
                  <button className="secondary-button !py-3">
                    <Share2 size={18} />
                    <span>Share</span>
                  </button>
                  <button
                    onClick={() => setShowFeedback(true)}
                    className="secondary-button !py-3"
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
          <div className="bg-container rounded-xl shadow-xl h-full">
            <div className="p-6">
              <h3 className="text-lg font-medium text-accent mb-4">Track Details</h3>

              <div className="space-y-4 text-sm">
                <div>
                  <p className="text-textSecondary">Generated from</p>
                  <p className="text-textPrimary mt-1 p-3 bg-subContainer/70 border border-accent rounded-lg">{createdTrack.prompt}</p>
                </div>

                <div>
                  <p className="text-textSecondary">Duration</p>
                  <p className="text-textPrimary mt-1">{formatTime(createdTrack.duration)}</p>
                </div>

                <div>
                  <p className="text-textSecondary mb-2">Rate this generation</p>
                  <div className="flex items-center gap-2">
                    <Stars setStarsAction={(n) => rateTrack(n, createdTrack, session?.user.id)} />
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-accent">
                  <h4 className="font-medium text-accent mb-3">What's Next?</h4>
                  <ul className="space-y-2 text-textSecondary">
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-altAccent/20 p-1 mt-0.5">
                        <Save size={12} className="text-accent" />
                      </div>
                      <span>Save to your personal library</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-altAccent/20 p-1 mt-0.5">
                        <Download size={12} className="text-accent" />
                      </div>
                      <span>Download for offline use</span>
                    </li>
                    <li className="flex items-start gap-2">
                      <div className="rounded-full bg-altAccent/20 p-1 mt-0.5">
                        <Share2 size={12} className="text-accent" />
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

const rateTrack = (rating: number, trackData: Track, userId?: string) => {
  const ratingQuestion: QuestionData = {
    description: "Rating",
    type: QuestionType.Number,
    optional: false,
  };

  const response = new SurveyResponse([ratingQuestion], trackData, "track-rating", userId);

  response.addQuestionReponse(ratingQuestion, rating);

  response.submit();
};

