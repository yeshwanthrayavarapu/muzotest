'use client';

import Link from 'next/link';
import { signOut, useSession } from 'next-auth/react';
import { Music } from 'lucide-react';

export function Navbar() {
  const { data: session } = useSession(); // Get session info

  return (
    <nav className="w-full px-12 py-5 flex justify-between items-center bg-transparent backdrop-blur-sm">
      <Link href="/" className="text-2xl font-bold flex items-center gap-2">
        <Music className="gradient-text" />
        <span className="gradient-text">
          MUZO
        </span>
      </Link>

      <div className="flex items-center space-x-8">
        <ul className="flex space-x-8">
          <li>
            <Link href="/create" className="text-white hover:text-cyan-400 transition-colors">
              Create
            </Link>
          </li>
          <li>
            <Link href="/library" className="text-white hover:text-cyan-400 transition-colors">
              Library
            </Link>
          </li>
        </ul>

        <div className="flex space-x-4">
          {session ? (
            <button
              onClick={() => signOut({ callbackUrl: '/' })}
              className="px-5 py-2 border-2 border-white text-white rounded-md hover:text-cyan-400 hover:border-cyan-400 transition-colors"
            >
              Sign Out
            </button>
          ) : (
            <>
              <Link 
                href="/signin" 
                className="px-5 py-2 border-2 border-white text-white rounded-md hover:text-cyan-400 hover:border-cyan-400 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/signup" 
                className="px-5 py-2 gradient-background text-black rounded-md hover:opacity-90 transition-opacity"
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
