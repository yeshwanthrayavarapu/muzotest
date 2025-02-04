export interface CreateTrackInput {
  prompt: string;
  audioFile?: File;
}

export interface Track {
  id: string;
  title: string;
  description: string;
  genre: string;
  duration: string;
  plays: number;
  likes: number;
  artist: string;
  coverUrl: string;
  audioUrl: string;
}

export interface CreateTrackInput {
  prompt: string;
  audioFile?: File;
}