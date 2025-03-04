'use client';

import { Track } from "@/types/music";

interface Props {
  track: Track,
  height: `${number}${"px" | "rem" | "%"}`,
}

export default function CoverArt({ track, height }: Props) {
  return (
    <img
      src={track.coverUrl}
      alt={track.title}
      className="rounded-lg object-cover shadow-2xl"
      style={{ height, width: height }}
    />
  );
}
