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
}

export interface CreateTrackInput {
  prompt: string;
  audioFile?: File;
}
