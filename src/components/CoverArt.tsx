'use client';

import { Track } from "../../shared/track";

interface Props {
  track: Track,
  height: `${number}${"px" | "rem" | "%"}`,
}

export default function CoverArt({ track, height }: Props) {
  return (
    <img
      src={track.metadata?.coverUrl}
      alt={track.metadata?.title}
      className="rounded-lg object-cover shadow-2xl"
      style={{ height, width: height }}
    />
  );
}
