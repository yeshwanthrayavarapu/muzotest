"use client";

import { useEffect, useState } from "react";
import { Play, Download } from "lucide-react";
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';


// Define TypeScript interface for songs
interface Song {
  id: string;
  title: string;
  description: string;
  audioUrl: string;
  coverImage: string;
}

export default function LibraryPage() {
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push('/signin');
    }
  }, [status, router]);

  if (status === "loading") {
    return <div>Loading...</div>;
  }

  if (!session) {
    return null;
  }

  useEffect(() => {
    const fetchSongs = async () => {
      try {
        const response = await fetch("/api/songs");
        if (!response.ok) throw new Error("Failed to fetch songs");
        const data: Song[] = await response.json();
        setSongs(data);
      } catch (error) {
        console.error("Error fetching songs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchSongs();
  }, []);

  const handlePlay = (audioUrl: string) => {
    setCurrentPlaying(audioUrl);
  };

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Your Library</h1>

      {loading ? (
        <p className="text-gray-400">Loading songs...</p>
      ) : songs.length === 0 ? (
        <p className="text-gray-400">No songs found.</p>
      ) : (
        <div className="space-y-6">
          {songs.map((song) => (
            <div
              key={song.id}
              className="flex items-center bg-[#1e1b3b] p-4 rounded-lg hover:bg-[#2a264d] transition-colors"
            >
              {/* Song Cover Image */}
              <img
                src={song.coverImage}
                alt={song.title}
                className="w-16 h-16 object-cover rounded-lg mr-4"
              />

              {/* Song Details */}
              <div className="flex-1">
                <h3 className="text-xl font-semibold">{song.title}</h3>
                <p className="text-gray-400 text-sm">{song.description}</p>
                {/* Audio Player */}
                <audio
                  controls
                  src={song.audioUrl}
                  className="mt-2 w-full"
                  onPlay={() => handlePlay(song.audioUrl)}
                />
              </div>

              {/* Buttons */}
              <div className="flex gap-2">
                <button
                  className="p-2 rounded-full bg-cyan-400 hover:bg-cyan-500 transition-colors"
                  aria-label="Play"
                  onClick={() => handlePlay(song.audioUrl)}
                >
                  <Play size={18} />
                </button>
                <a
                  href={song.audioUrl}
                  download
                  className="p-2 rounded-full bg-cyan-400 hover:bg-cyan-500 transition-colors"
                  aria-label="Download"
                >
                  <Download size={18} />
                </a>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}