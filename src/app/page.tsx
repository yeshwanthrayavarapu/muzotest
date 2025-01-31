import Link from 'next/link';
import { Music, Mic, Download } from 'lucide-react';

export default function HomePage() {
  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <div className="flex justify-between items-center min-h-[calc(100vh-80px)] px-12">
        <div className="max-w-xl">
          <h1 className="text-5xl font-bold leading-tight">
            Experience the Future of{' '}
            <span className="text-cyan-400">Music</span> with AI
          </h1>
          <p className="mt-6 text-lg text-gray-400">
            Create your own music with AI. Type in your description or upload your audio.
          </p>
          <div className="mt-8">
            <Link
              href="/create"
              className="inline-flex items-center px-8 py-3 bg-cyan-400 text-black font-semibold rounded-md hover:bg-cyan-500 transition-colors"
            >
              Get Started →
            </Link>
          </div>
        </div>
        
        <div className="w-1/2">
          <img
            src="https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&q=80"
            alt="Music Visualization"
            className="w-full max-w-lg mx-auto rounded-lg shadow-xl"
          />
        </div>
      </div>

      {/* Features Section */}
      <div className="py-20 px-12">
        <h2 className="text-4xl font-bold text-center text-cyan-400 mb-16">How It Works</h2>
        <div className="flex justify-center gap-24 flex-wrap">
          {[
            {
              icon: <Music className="w-12 h-12 text-cyan-400" />,
              title: "Describe your idea",
              description: "Start by typing your description of music you like to hear."
            },
            {
              icon: <Mic className="w-12 h-12 text-cyan-400" />,
              title: "Upload Recording",
              description: "Upload your recording or song idea."
            },
            {
              icon: <Download className="w-12 h-12 text-cyan-400" />,
              title: "Music Ready",
              description: "Download your fully-generated AI music in seconds."
            }
          ].map((feature, index) => (
            <div key={index} className="flex flex-col items-center text-center max-w-xs">
              <div className="mb-6 p-4 bg-[#1a0b2e] rounded-full">
                {feature.icon}
              </div>
              <h3 className="text-xl font-semibold text-white mb-3">{feature.title}</h3>
              <p className="text-gray-400">{feature.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}