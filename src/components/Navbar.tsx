'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Music } from 'lucide-react';

export function Navbar() {
  const router = useRouter();
  // This would be replaced with your actual auth state management
  const user = null; // For demo purposes
  
  const handleSignOut = async () => {
    // Implement your sign out logic here
    console.log('Signing out...');
  };

  return (
    <nav className="w-full px-12 py-5 flex justify-between items-center bg-transparent backdrop-blur-sm">
      <Link href="/" className="text-2xl font-bold flex items-center gap-2">
        <Music className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500" />
        <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          MUZO
        </span>
      </Link>
      
      <div className="flex items-center space-x-8">
        <ul className="flex space-x-8">
          <li>
            <Link 
              href="/create" 
              className="text-white hover:text-cyan-400 transition-colors"
            >
              Create
            </Link>
          </li>
          <li>
            <Link 
              href="/library" 
              className="text-white hover:text-cyan-400 transition-colors"
            >
              Library
            </Link>
          </li>
        </ul>

        <div className="flex space-x-4">
          {user ? (
            <button
              onClick={handleSignOut}
              className="px-5 py-2 border-2 border-white text-white rounded-md hover:text-cyan-400 hover:border-cyan-400 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link 
                href="/auth/signin" 
                className="px-5 py-2 border-2 border-white text-white rounded-md hover:text-cyan-400 hover:border-cyan-400 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/auth/signup" 
                className="px-5 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black rounded-md hover:opacity-90 transition-opacity"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}