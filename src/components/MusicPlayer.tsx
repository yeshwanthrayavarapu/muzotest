'use client';

import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  Repeat,
  Shuffle,
  Maximize2,
  Minimize2,
  Heart,
} from 'lucide-react';
import { useAudio } from '@/contexts/AudioContext';
import CoverArt from './CoverArt';
import PlayButton from './PlayButton';
import PlayerProgress from './PlayerProgress';

export function MusicPlayer() {
  const {
    currentTrack,
    volume,
    togglePlay,
    setVolume,
    toggleShuffle,
    isShuffling,
    toggleRepeat,
    isRepeating,
    playNext,
    playPrevious,
    playerHeight,
  } = useAudio();

  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);

  // Spacebar to toggle play/pause
  useEffect(() => {
    const keyDownHandler = (e: KeyboardEvent) => {
      if (e.key !== ' ' || e.target !== document.body) return;
      e.preventDefault();
      togglePlay();
    }

    window.addEventListener("keydown", keyDownHandler);
    return () => {
      window.removeEventListener("keydown", keyDownHandler);
    };
  }, [togglePlay]);

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  if (!currentTrack) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-container shadow-lg transition-all duration-300 ${playerHeight}`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full">
        {/* Main Player Controls */}
        <div className="flex items-center justify-between h-20">
          {/* Track Info */}
          <div className="flex items-center space-x-4">
            <div className="relative">
              <CoverArt track={currentTrack} height="3rem" />
            </div>
            <div>
              <h3 className="text-textPrimary font-medium">{currentTrack.title}</h3>
              <p className="text-textSecondary text-sm">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center flex-1 max-w-2xl px-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={toggleShuffle}
                className={`${isShuffling ? "text-accent" : "text-textSecondary"} hover:text-accent transition-colors`}
              >
                <Shuffle size={20} />
              </button>
              <button
                onClick={playPrevious}
                className="text-textSecondary hover:text-accent transition-colors"
              >
                <SkipBack size={24} />
              </button>
              <PlayButton />
              <button
                onClick={playNext}
                className="text-textSecondary hover:text-accent transition-colors"
              >
                <SkipForward size={24} />
              </button>
              <button
                onClick={toggleRepeat}
                className={`${isRepeating ? "text-accent" : "text-textSecondary"} hover:text-accent transition-colors`}
              >
                <Repeat size={20} />
              </button>
            </div>

            <PlayerProgress />
          </div>

          {/* Volume and Expand Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-textSecondary hover:text-accent transition-colors"
              >
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={volume}
                onChange={(e) => setVolume(parseFloat(e.target.value))}
                className="w-24 accent-accent"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
