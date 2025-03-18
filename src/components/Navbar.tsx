'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Music, User, LogOut, Sun, Moon } from 'lucide-react';
import { useSession, signOut } from 'next-auth/react';
import Logo from './Logo';
import { useTheme } from '@/contexts/ThemeContext';

export function Navbar() {
  const router = useRouter();
  const { data: session, status } = useSession();

  const handleSignOut = async () => {
    await signOut({ redirect: false });
    router.push('/');
  };

  const { theme, toggleTheme } = useTheme();

  const themeToggle = (
    <button
      onClick={toggleTheme}
      className="p-2 rounded-full hover:bg-accent transition-colors"
    >
      {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
    </button>
  );

  return (
    <nav className="w-full px-12 py-5 flex justify-between items-center bg-navbar backdrop-blur-sm">
      <Logo />

      <div className="flex items-center space-x-8">
        <div className="flex space-x-8 align-center">
          <div>
            <Link href="/create" className="text-textPrimary hover:text-accent transition-colors">
              Create
            </Link>
          </div>
          <div>
            <Link href="/library" className="text-textPrimary hover:text-accent transition-colors">
              Library
            </Link>
          </div>
          {session?.user && (
            <div>
              <Link
                href={`/profile/${session.user.id}`}
                className="text-textPrimary hover:text-accent transition-colors flex items-center gap-2"
              >
                <User size={20} />
                Profile
              </Link>
            </div>
          )}
        </div>

        <div>
          {themeToggle}
        </div>

        <div className="flex space-x-4">
          {status === "authenticated" ? (
            <button
              onClick={handleSignOut}
              className="secondary-button"
            >
              <LogOut size={16} />
              Sign Out
            </button>
          ) : (
            <>
              <Link
                href="/signin"
                className="px-5 py-2 border-2 border-accent text-textPrimary rounded-md hover:text-accent hover:border-accentContrast transition-colors"
              >
                Sign In
              </Link>
              <Link
                href="/signup"
                className="px-5 py-2 gradient-background text-accentContrast rounded-md hover:opacity-90 transition-opacity"
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
