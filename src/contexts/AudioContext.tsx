'use client';

import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  currentTrack: Track | null;
  isPlaying: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  playTrack: (track: Track) => void;
  pauseTrack: () => void;
  togglePlay: () => void;
  setVolume: (volume: number) => void;
  seekTo: (time: number) => void;
  toggleShuffle: () => void;
  toggleRepeat: () => void;
  playNext: () => void;
  playPrevious: () => void;
}

interface Track {
  id: string;
  title: string;
  artist?: string;
  coverUrl: string;
  audioUrl: string;
  duration: string;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);

  const audioRef = useRef<HTMLAudioElement | null>(null);

  const destroyAudio = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.src = '';
      audioRef.current = null;
    }
  };

  const isRepeatingRef = useRef(isRepeating);
  useEffect(() => {
    isRepeatingRef.current = isRepeating;
  }, [isRepeating]);

  const playTrack = (track: Track) => {
    if (!audioRef?.current || audioRef.current.src !== track.audioUrl) {
      destroyAudio();

      audioRef.current = new Audio();
      audioRef.current.src = track.audioUrl;
      audioRef.current.volume = volume;
      audioRef.current.preload = "auto";

      const audio = audioRef.current;

      const handleTimeUpdate = () => setCurrentTime(audio.currentTime);
      const handleDurationChange = () => setDuration(audio.duration);

      const handleEnded = () => {
        setIsPlaying(false);
        if (isRepeatingRef.current) {
          playTrack(track);
        }
      };

      audio.addEventListener('timeupdate', handleTimeUpdate);
      audio.addEventListener('durationchange', handleDurationChange);
      audio.addEventListener('ended', handleEnded);
    }

    audioRef.current.play();
    setCurrentTrack(track);
    setIsPlaying(true);
  };

  const pauseTrack = () => {
    audioRef.current?.pause();
    setIsPlaying(false);
  };

  const togglePlay = () => {
    if (isPlaying) {
      pauseTrack();
    } else if (currentTrack) {
      audioRef.current?.play();
      setIsPlaying(true);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    if (audioRef.current) {
      audioRef.current.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const seekTo = (time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const toggleShuffle = () => setIsShuffling(!isShuffling);
  const toggleRepeat = () => setIsRepeating(!isRepeating);
  const playNext = () => console.log('Next track');
  const playPrevious = () => console.log('Previous track');

  const value = {
    currentTrack,
    isPlaying,
    volume,
    currentTime,
    duration,
    playTrack,
    pauseTrack,
    togglePlay,
    setVolume: handleVolumeChange,
    seekTo,
    toggleShuffle,
    toggleRepeat,
    playNext,
    playPrevious,
  };

  return (
    <AudioContext.Provider value={value}>
      {children}
    </AudioContext.Provider>
  );
}

export const useAudio = () => {
  const context = useContext(AudioContext);
  if (!context) throw new Error('useAudio must be used within AudioProvider');
  return context;
};
