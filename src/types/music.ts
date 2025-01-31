export interface Track {
  id: string;
  title: string;
  description: string;
  audioUrl?: string;
  createdAt: string;
}

export interface CreateTrackInput {
  prompt: string;
  audioFile?: File;
}