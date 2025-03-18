export interface CreateTrackInput {
  prompt: string;
  audioFile?: File;
}

/**
 * Represents a generated track.
 * @member duration - The duration of the track in seconds.
 * @member playUrl - A WAV data URI of the track.
 */
export interface Track {
  id: string;
  title: string;
  artist?: string;
  coverUrl: string;
  audioUrl: string;
  duration: number;
  description: string;
  genre: string;
  playUrl?: string;
  prompt: string;
  createdAt: string;
}

export interface CreateTrackInput {
  prompt: string;
  audioFile?: File;
}
