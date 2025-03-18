'use client';

import { Track } from '@/types/music';
import React, { createContext, useContext, useState, useRef, useEffect } from 'react';

interface AudioContextType {
  currentTrack: Track | null;
  playlist: Track[],
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
  isShuffling: boolean;
  toggleRepeat: () => void;
  isRepeating: boolean;
  playNext: () => void;
  playPrevious: () => void;
  audioElement: HTMLAudioElement | null;
  playerHeight: string;
}

const AudioContext = createContext<AudioContextType | null>(null);

export function AudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrack, setCurrentTrack] = useState<Track | null>(null);
  const playlist = useRef<Track[]>([]);
  const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isShuffling, setIsShuffling] = useState(false);
  const [isRepeating, setIsRepeating] = useState(false);
  const [playerHeight, setPlayerHeight] = useState("0px");

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

  const urlToPlay = (track: Track) => track.playUrl ?? track.audioUrl;

  const playTrack = (track: Track) => {
    if (!audioRef?.current || audioRef.current.src !== urlToPlay(track)) {
      destroyAudio();

      audioRef.current = new Audio();
      const audio = audioRef.current;

      audio.src = urlToPlay(track);
      audio.volume = volume;
      audio.preload = "auto";

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

  const offsetCurrentTrack = (amount: number) => {
    if (!currentTrack) return;

    let position = playlist.current.indexOf(currentTrack);
    if (position === -1) return;

    position += amount;
    position = Math.max(0, Math.min(playlist.current.length - 1, position));
    
    playTrack(playlist.current[position]);
  };

  const playRandomTrack = () => {
    if (playlist.current.length < 2) return;
    const randomIndex = Math.floor(Math.random() * playlist.current.length);
    
    // Try again if the random track is the current track
    const currentIndex = !currentTrack ? -1 : playlist.current.indexOf(currentTrack);
    if (randomIndex === currentIndex) return playRandomTrack();

    playTrack(playlist.current[randomIndex]);
  };

  const toggleShuffle = () => setIsShuffling(!isShuffling);
  const toggleRepeat = () => setIsRepeating(!isRepeating);

  const playNext = () => {
    if (isShuffling) return playRandomTrack();
    offsetCurrentTrack(1)
  };

  const playPrevious = () => offsetCurrentTrack(-1);

  useEffect(() => {
    setPlayerHeight(currentTrack ? "4rem" : "0px");
  }, [currentTrack]);

  const value = {
    currentTrack,
    playlist: playlist.current,
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
    isShuffling,
    toggleRepeat,
    isRepeating,
    playNext,
    playPrevious,
    audioElement: audioRef.current,
    playerHeight,
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
