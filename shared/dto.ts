import { Track } from "./track";
import { User } from "./user";

/**
 * @member {string} username - The email of the user.
 */
export interface AuthDto {
  username: string;
  password: string;
}

export interface PromptDto {
  prompt: string;
  hasAudioAttchment: boolean;
}

export interface PromptResponseDto {
  track: Track;
}

export interface SignUpRequestDto {
  email: string;
  username: string;
  password: string;
}

export interface LoginResponseDto {
  jwtToken: string;
  user: User;
}

export interface TrackListDto {
  tracks: Track[];
}
