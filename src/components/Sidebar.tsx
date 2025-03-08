"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Home, PlusCircle, Library, User, Settings } from 'lucide-react';
import Image from 'next/image';

export function Sidebar() {
  const pathname = usePathname();
  const { data: session, status } = useSession();
  
  const isActive = (path: string) => pathname === path;
  
  console.log('Session:', session);
  console.log('User ID:', session?.user?.id);
  console.log('Auth Status:', status);
  
  return (
    <div className="w-64 bg-[#16132a] p-6 flex flex-col h-screen fixed left-0 top-0">
      <div>
        <h1 className="text-2xl font-bold mb-8 text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
          MUZO
        </h1>
        <nav className="space-y-4">
          <Link 
            href="/" 
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              isActive('/') ? 'text-cyan-400 bg-[#2a264d]' : 'text-white hover:text-cyan-400'
            }`}
          >
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link 
            href="/create" 
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              isActive('/create') ? 'text-cyan-400 bg-[#2a264d]' : 'text-white hover:text-cyan-400'
            }`}
          >
            <PlusCircle size={20} />
            <span>Create</span>
          </Link>
          <Link 
            href="/library" 
            className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${
              isActive('/library') ? 'text-cyan-400 bg-[#2a264d]' : 'text-white hover:text-cyan-400'
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
              pathname.startsWith('/profile') ? 'text-cyan-400 bg-[#2a264d]' : 'text-white hover:text-cyan-400'
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
                <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                  <User size={16} className="text-gray-400" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-medium">{session.user.name || 'User'}</p>
              <p className="text-sm text-gray-400">@{session.user.email?.split('@')[0] || 'user'}</p>
            </div>
          </Link>
          <Link
            href={status === 'authenticated' && session.user.id ? `/settings/${session.user.id}` : '/signin'}
            className={`flex items-center space-x-3 p-2 mt-2 rounded-lg transition-colors ${
              pathname.startsWith('/settings') ? 'text-cyan-400 bg-[#2a264d]' : 'text-white hover:text-cyan-400'
            }`}
          >
            <Settings size={20} />
            <span>Settings</span>
          </Link>
        </div>
      ) : null}
    </div>
  );
}