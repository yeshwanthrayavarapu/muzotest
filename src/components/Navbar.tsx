'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Music, User, LogOut } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();
  
  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

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
          {session?.user && (
            <li>
              <Link 
                href={`/profile/${session.user.id}`}
                className="text-white hover:text-cyan-400 transition-colors flex items-center gap-2"
              >
                <User size={20} />
                Profile
              </Link>
            </li>
          )}
        </ul>

        <div className="flex space-x-4">
          {status === "authenticated" ? (
            <button
              onClick={handleSignOut}
              className="px-5 py-2 border-2 border-white text-white rounded-md hover:text-cyan-400 hover:border-cyan-400 transition-colors flex items-center gap-2"
            >
              <LogOut size={16} />
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
