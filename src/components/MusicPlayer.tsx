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

export function MusicPlayer() {
  const {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    togglePlay,
    setVolume,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious,
  } = useAudio();

  const [isExpanded, setIsExpanded] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [prevVolume, setPrevVolume] = useState(volume);
  const progressRef = useRef<HTMLDivElement>(null);

  const toggleMute = () => {
    if (isMuted) {
      setVolume(prevVolume);
    } else {
      setPrevVolume(volume);
      setVolume(0);
    }
    setIsMuted(!isMuted);
  };

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;
    
    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  if (!currentTrack) return null;

  return (
    <div
      className={`fixed bottom-0 left-0 right-0 bg-[#1e1b3b] border-t border-gray-800 transition-all duration-300 ${
        isExpanded ? 'h-96' : 'h-20'
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 h-full">
        {/* Main Player Controls */}
        <div className="flex items-center justify-between h-20">
          {/* Track Info */}
          <div className="flex items-center space-x-4">
            <div className="relative w-12 h-12">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="rounded-md object-cover"
              />
            </div>
            <div>
              <h3 className="text-white font-medium">{currentTrack.title}</h3>
              <p className="text-gray-400 text-sm">{currentTrack.artist}</p>
            </div>
          </div>

          {/* Playback Controls */}
          <div className="flex flex-col items-center flex-1 max-w-2xl px-4">
            <div className="flex items-center space-x-6">
              <button
                onClick={toggleShuffle}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Shuffle size={20} />
              </button>
              <button
                onClick={playPrevious}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <SkipBack size={24} />
              </button>
              <button
                onClick={togglePlay}
                className="w-10 h-10 rounded-full bg-cyan-400 flex items-center justify-center hover:bg-cyan-500 transition-colors"
              >
                {isPlaying ? <Pause size={24} /> : <Play size={24} />}
              </button>
              <button
                onClick={playNext}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <SkipForward size={24} />
              </button>
              <button
                onClick={toggleRepeat}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
              >
                <Repeat size={20} />
              </button>
            </div>

            {/* Progress Bar */}
            <div className="w-full mt-2 flex items-center space-x-2 text-xs text-gray-400">
              <span>{formatTime(currentTime)}</span>
              <div
                ref={progressRef}
                className="flex-1 h-1 bg-gray-700 rounded-full cursor-pointer"
                onClick={handleProgressClick}
              >
                <div
                  className="h-full bg-cyan-400 rounded-full relative"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                >
                  <div className="absolute right-0 top-1/2 transform translate-y-[-50%] translate-x-1/2] w-3 h-3 bg-white rounded-full shadow-lg"></div>
                </div>
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          {/* Volume and Expand Controls */}
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <button
                onClick={toggleMute}
                className="text-gray-400 hover:text-cyan-400 transition-colors"
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
                className="w-24 accent-cyan-400"
              />
            </div>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="text-gray-400 hover:text-cyan-400 transition-colors"
            >
              {isExpanded ? <Minimize2 size={20} /> : <Maximize2 size={20} />}
            </button>
          </div>
        </div>

        {/* Expanded View */}
        {isExpanded && (
          <div className="h-[calc(100%-5rem)] p-6 flex items-center justify-center">
            <div className="text-center">
              <div className="relative w-64 h-64 mx-auto mb-6">
                <img
                  src={currentTrack.coverUrl}
                  alt={currentTrack.title}
                  className="rounded-lg object-cover shadow-2xl"
                />
              </div>
              <h2 className="text-2xl font-bold text-white mb-2">{currentTrack.title}</h2>
              <p className="text-gray-400 mb-6">{currentTrack.artist}</p>
              <button className="text-gray-400 hover:text-cyan-400 transition-colors">
                <Heart size={24} />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}