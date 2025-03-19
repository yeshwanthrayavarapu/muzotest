"use client";

import { useEffect, useState } from "react";
import { Play, Download, Clock, Heart, RefreshCcw } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { Sidebar } from '@/components/Sidebar';
import { useAudio } from '@/contexts/AudioContext';
import { AuthGuard } from '@/components/AuthGuard';
import type { Track } from '@/types/music';
import CoverArt from "@/components/CoverArt";
import { openDB } from 'idb';
import { LoadingSpinner } from "@/components/LoadingSpinner";
import { formatTime } from "@/utils";

// Modify getAudioFromCache to use IndexedDB for larger storage
const getAudioFromCache = async (url: string): Promise<string | null> => {
  const dbName = 'audioCache';
  const storeName = 'audioFiles';
  
  try {
    const db = await openDB(dbName, 1, {
      upgrade(db) {
        db.createObjectStore(storeName);
      },
    });

    const cached = await db.get(storeName, url);
    if (cached) {
      return URL.createObjectURL(cached);
    }
    return null;
  } catch (error) {
    console.error('Cache error:', error);
    return null;
  }
};

export default function LibraryPage() {
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const { playTrack, playlist } = useAudio();

  const { data: tracks = [], isLoading, error, refetch } = useQuery({
    queryKey: ['tracks'],
    queryFn: async () => {
      // Always fetch fresh data from API
      const response = await fetch("/api/tracks");
      if (!response.ok) throw new Error("Failed to fetch tracks");
      const data = await response.json();

      return data.map((track: Track) => ({
        ...track,
        audioUrl: track.audioUrl.includes('blob.core.windows.net') 
          ? `/api/proxy-audio?blob=${encodeURIComponent(track.audioUrl)}`
          : track.audioUrl
      }));
    },
    staleTime: 0,  // Always consider data stale
    refetchOnMount: true,
    refetchOnWindowFocus: true  // Refresh when window regains focus
  });

  // Update playlist when tracks change
  useEffect(() => {
    if (tracks.length > 0) {
      playlist.splice(0, playlist.length, ...tracks);
    }
  }, [tracks]);

  const handlePlayTrack = async (track: Track) => {
    try {
      const cachedUrl = await getAudioFromCache(track.audioUrl);
      if (cachedUrl) {
        playTrack({ ...track, audioUrl: cachedUrl });
        return;
      }

      const response = await fetch(track.audioUrl);
      const blob = await response.blob();
      
      // Store in IndexedDB
      const db = await openDB('audioCache', 1);
      await db.put('audioFiles', blob, track.audioUrl);
      
      const objectUrl = URL.createObjectURL(blob);
      playTrack({ ...track, audioUrl: objectUrl });
    } catch (error) {
      console.error('Error playing track:', error);
    }
  };

  if (isLoading) {
    return <LoadingSpinner fullScreen={true} size='large' />;
  }

  if (error) {
    return <div className="flex items-center justify-center min-h-screen">Error loading tracks</div>;
  }

  const genres = ['all', ...Array.from(new Set(tracks.map((track: Track) => track.genre)))];
  
  const filteredTracks = selectedGenre === 'all' 
    ? tracks 
    : tracks.filter((track: Track) => track.genre === selectedGenre);

  return (
    <AuthGuard>
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold">
                <span className="gradient-text">
                  Your Library
                </span>
              </h1>
              <button
                onClick={() => refetch()}
                className="p-2 rounded-full bg-container hover:bg-accent hover:text-black transition-colors"
                aria-label="Refresh tracks"
              >
                <RefreshCcw size={18} />
              </button>
            </div>
            
            <div className="flex gap-4">
              {genres.map((genre) => (
                <button
                  key={genre as string}
                  onClick={() => setSelectedGenre(genre as string)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedGenre === genre
                      ? 'gradient-background text-accentContrast'
                      : 'bg-container text-textPrimary hover:bg-subContainer'
                  }`}
                >
                  {(genre as string).charAt(0).toUpperCase() + (genre as string).slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {filteredTracks.map((track: Track) => (
              <div
                key={track.id}
                className="bg-container shadow-lg rounded-xl overflow-hidden hover:bg-subContainer transition-colors group"
              >
                <div className="flex items-center p-4">
                  <div 
                    className="relative w-16 min-w-16 h-16 mr-4 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => handlePlayTrack(track)}
                  >
                    <CoverArt track={track} height="100%" />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} className="text-textPrimary" />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-1">{track.title}</h3>
                    <p className="text-textSecondary text-sm">{track.description}</p>
                    <p className="text-accent text-sm mt-1">{track.artist}</p>
                  </div>

                  <div className="flex items-center gap-8 text-textSecondary">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{formatTime(track.duration)}</span>
                    </div>
                    <a
                      href={track.audioUrl}
                      download
                      className="p-2 rounded-full bg-subContainer hover:bg-accent hover:text-black transition-colors"
                      aria-label="Download"
                    >
                      <Download size={18} />
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
    </AuthGuard>
  );
}
