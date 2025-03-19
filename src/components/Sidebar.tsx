"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, PlusCircle, Library, User, Settings, Megaphone } from 'lucide-react';
import Image from 'next/image';
import Logo from './Logo';
import { useAudio } from '@/contexts/AudioContext';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  const isActive = (path: string) => pathname === path;
  
  const { playerHeight } = useAudio();
  
  return (
    <div 
      className="w-64 bg-sidebar p-6 flex flex-col fixed left-0 top-0"
      style={{ height: `calc(100vh - ${playerHeight})`, overflowY: 'auto' }}
    >
      <div>
        <div className="mb-4">
          <Logo />
        </div>

        <nav className="space-y-4">
          <Link 
            href="/" 
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              isActive('/') ? 'text-accent bg-subContainer' : 'text-textPrimary hover:text-accent'
            }`}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link 
            href="/create" 
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              isActive('/create') ? 'text-accent bg-subContainer' : 'text-textPrimary hover:text-accent'
            }`}
          >
            <PlusCircle size={20} />
            <span>Create</span>
          </Link>
          <Link 
            href="/library" 
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              isActive('/library') ? 'text-accent bg-subContainer' : 'text-textPrimary hover:text-accent'
            }`}
          >
            <Library size={20} />
            <span>Library</span>
          </Link>
        </nav>
      </div>

      {/* Profile Section at Bottom */}
      {session?.user?.id ? (
        <div className="mt-auto pt-6 border-t border-gray-800">
          <Link
            href={`/profile/${session.user.id}`}
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              pathname.startsWith('/profile') ? 'text-accent bg-subContainer' : 'text-textPrimary hover:text-accent'
            }`}
          >
            <div className="relative w-8 h-8 rounded-full overflow-hidden">
              {session.user.image ? (
                <Image
                  src={session.user.image}
                  alt="Profile"
                  width={32}
                  height={32}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full bg-background flex items-center justify-center">
                  <User size={16} className="text-textSecondary" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{session.user.name || 'User'}</p>
              <p className="text-sm text-textSecondary">@{session.user.email?.split('@')[0] || 'user'}</p>
            </div>
          </Link>
          <Link
            href={status === 'authenticated' && session.user.id ? `/settings/${session.user.id}` : '/signin'}
            className={`flex items-center space-x-3 p-2 mt-2 transition-colors ${
              pathname.startsWith('/settings') ? 'text-accent bg-subContainer' : 'text-textPrimary hover:text-accent'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
          <Link
            href={"/feedback"}
            className={`flex items-center space-x-3 p-2 transition-colors ${
              pathname.startsWith('/settings') ? 'text-accent bg-subContainer' : 'text-textPrimary hover:text-accent'
            }`}
          >
            <Megaphone size={20} />
            <span>Provide Feedback</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}
