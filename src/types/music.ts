export interface CreateTrackInput {
  prompt: string;
  audioFile?: File;
}

export interface Track {
  id: string;
  title: string;
  artist?: string;
  coverUrl: string;
  audioUrl: string;
  duration: string;
  description: string;
  genre: string;
  plays: number;
  likes: number;
}

export interface CreateTrackInput {
  prompt: string;
  audioFile?: File;
}
