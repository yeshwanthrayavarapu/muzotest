"use client";

import { useAudio } from "@/contexts/AudioContext";
import { Pause, Play } from "lucide-react";

export default function PlayButton() {
  const { isPlaying, togglePlay } = useAudio();

  return (<button
    onClick={togglePlay}
    className="w-10 h-10 m-w-10 m-h-10 rounded-full bg-accent flex items-center justify-center hover:bg-altAccent transition-colors text-contrastAccent p-2 text-accentContrast"
  >
    {isPlaying ? <Pause size={24} /> : <Play size={24} />}
  </button>);
}
