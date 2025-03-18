"use client";

import { useAudio } from "@/contexts/AudioContext";
import { formatTime } from "@/utils";
import { useRef } from "react";

export default function PlayerProgress() {
  const {
    currentTime,
    duration,
    seekTo,
  } = useAudio();

  const progressRef = useRef<HTMLDivElement>(null);

  if (!duration) {
    // Loading state
    return (
      <div className="w-full mt-2 flex items-center space-x-2 text-xs text-textSecondary bg-background h-1 rounded-full animate-pulse"></div>
    );
  }

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!progressRef.current) return;

    const rect = progressRef.current.getBoundingClientRect();
    const percent = (e.clientX - rect.left) / rect.width;
    seekTo(percent * duration);
  };

  return (
    <div className="w-full mt-2 flex items-center space-x-2 text-xs text-textSecondary">
      <span className="w-[1.6rem]">{formatTime(currentTime)}</span>
      <div
        ref={progressRef}
        className="flex-1 h-1 bg-background rounded-full cursor-pointer"
        onClick={handleProgressClick}
      >
        <div
          className="h-full bg-accent rounded-full relative"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        >
        </div>
        <div
          className="h-full relative mx-[0.365rem] transform translate-y-[-100%]"
          style={{ width: `${(currentTime / duration) * 100}%` }}
        >
          <div className="absolute right-0 top-1/2 transform translate-y-[-50%] translate-x-[0.73rem]] w-3 h-3 bg-white rounded-full shadow-lg"></div>
        </div>
      </div>
      <span>{formatTime(duration)}</span>
    </div>
  )
}
