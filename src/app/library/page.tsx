"use client";

import { useEffect, useState } from "react";
import { Play, Download, Clock, Heart } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { useAudio } from '@/contexts/AudioContext';
import type { Track } from '@/types/music';

export default function LibraryPage() {
  const [tracks, setTracks] = useState<Track[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedGenre, setSelectedGenre] = useState<string>('all');
  const { data: session, status } = useSession();
  const router = useRouter();
  const { playTrack, playlist } = useAudio();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, router]);

  useEffect(() => {
    const fetchTracks = async () => {
      try {
        const response = await fetch("/api/songs");
        if (!response.ok) throw new Error("Failed to fetch tracks");
        const data = await response.json();
        setTracks(data);
      } catch (error) {
        console.error("Error fetching tracks:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchTracks();
  }, []);

  // Replace the playlist with the fetched tracks
  useEffect(() => {
    playlist.splice(0, playlist.length, ...tracks);
  }, [tracks]);

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  // Fix: Use Array.from instead of Set
  const genres = ['all', ...Array.from(new Set(tracks.map(track => track.genre)))];
  
  const filteredTracks = selectedGenre === 'all' 
    ? tracks 
    : tracks.filter(track => track.genre === selectedGenre);

  return (
    <div className="flex">
      <Sidebar />
      <div className="flex-1 ml-64">
        <div className="max-w-7xl mx-auto px-6 py-12">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
                Your Library
              </span>
            </h1>
            
            <div className="flex gap-4">
              {genres.map((genre) => (
                <button
                  key={genre}
                  onClick={() => setSelectedGenre(genre)}
                  className={`px-4 py-2 rounded-full text-sm transition-colors ${
                    selectedGenre === genre
                      ? 'bg-gradient-to-r from-cyan-400 to-blue-500 text-black'
                      : 'bg-[#1e1b3b] text-white hover:bg-[#2a264d]'
                  }`}
                >
                  {genre.charAt(0).toUpperCase() + genre.slice(1)}
                </button>
              ))}
            </div>
          </div>

          <div className="grid gap-4">
            {filteredTracks.map((track) => (
              <div
                key={track.id}
                className="bg-[#1e1b3b] rounded-xl overflow-hidden hover:bg-[#2a264d] transition-colors group"
              >
                <div className="flex items-center p-4">
                  <div 
                    className="relative w-16 min-w-16 h-16 mr-4 rounded-lg overflow-hidden group-hover:shadow-lg transition-shadow cursor-pointer"
                    onClick={() => playTrack(track)}
                  >
                    <img
                      src={track.coverUrl}
                      alt={track.title}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                      <Play size={24} className="text-white" />
                    </div>
                  </div>

                  <div className="flex-grow">
                    <h3 className="text-xl font-semibold mb-1">{track.title}</h3>
                    <p className="text-gray-400 text-sm">{track.description}</p>
                    <p className="text-cyan-400 text-sm mt-1">{track.artist}</p>
                  </div>

                  <div className="flex items-center gap-8 text-gray-400">
                    <div className="flex items-center gap-2">
                      <Clock size={16} />
                      <span>{track.duration}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Play size={16} />
                      <span>{track.plays}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Heart size={16} />
                      <span>{track.likes}</span>
                    </div>
                    <a
                      href={track.audioUrl}
                      download
                      className="p-2 rounded-full bg-[#2c284e] hover:bg-cyan-400 hover:text-black transition-colors"
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
  );
}
