/**
 * Represents a generated track.
 * @member duration - The duration of the track in seconds.
 * @member playUrl - A WAV data URI of the track.
 */
export interface Track {
    id: string;
    audioUrl: string;
    duration: number;
    playUrl?: string;
    prompt: string;
    createdAt: string;
    metadata?: TrackMetadata;
};

export interface TrackMetadata {
    title: string;
    artist?: string;
    coverUrl: string;
    description: string;
    genre: string;
}