import React, { useState, useRef } from 'react';
import { Play, Pause } from 'lucide-react';

interface AudioPlayerProps {
  audioUrl: string;
  title: string;
  compact?: boolean;
}

export function AudioPlayer({ audioUrl, title, compact = false }: AudioPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  return (
    <div className={`flex items-center ${compact ? 'justify-center' : 'space-x-4'}`}>
      <button
        onClick={togglePlay}
        className={`flex items-center justify-center bg-cyan-400 rounded-full hover:bg-cyan-500 transition-colors ${
          compact ? 'w-10 h-10' : 'w-12 h-12'
        }`}
        aria-label={isPlaying ? 'Pause' : 'Play'}
      >
        {isPlaying ? (
          <Pause className={compact ? 'w-5 h-5' : 'w-6 h-6'} />
        ) : (
          <Play className={compact ? 'w-5 h-5' : 'w-6 h-6'} />
        )}
      </button>
      <audio
        ref={audioRef}
        src={audioUrl}
        onEnded={() => setIsPlaying(false)}
        className="hidden"
      />
    </div>
  );
}