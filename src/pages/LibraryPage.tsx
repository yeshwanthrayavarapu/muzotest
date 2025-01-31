import React from 'react';
import { Play, Download } from 'lucide-react';

const mockTracks = [
  {
    id: '1',
    title: 'Summer Vibes',
    description: 'A cheerful summer song with beach vibes',
  },
  {
    id: '2',
    title: 'Rainy Day',
    description: 'Melancholic piano melody with rain sounds',
  },
  {
    id: '3',
    title: 'Urban Night',
    description: 'Electronic beats with city atmosphere',
  },
];

export function LibraryPage() {
  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <h1 className="text-3xl font-bold mb-8 text-cyan-400">Your Library</h1>
      
      <div className="grid gap-4">
        {mockTracks.map((track) => (
          <div
            key={track.id}
            className="bg-[#1e1b3b] p-6 rounded-xl hover:bg-[#2a264d] transition-colors"
          >
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold mb-2">{track.title}</h3>
                <p className="text-gray-400">{track.description}</p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="p-2 rounded-full bg-cyan-400 hover:bg-cyan-500 transition-colors"
                  aria-label="Play"
                >
                  <Play size={18} />
                </button>
                <button
                  className="p-2 rounded-full bg-cyan-400 hover:bg-cyan-500 transition-colors"
                  aria-label="Download"
                >
                  <Download size={18} />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}