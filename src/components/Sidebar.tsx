"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, PlusCircle, Library } from 'lucide-react';

export function Sidebar() {
  const pathname = usePathname();
  
  const isActive = (path: string) => pathname === path;
  
  return (
    <div className="w-64 bg-[#16132a] p-6 flex flex-col h-screen fixed left-0 top-0">
      <div>
        <h1 className="text-2xl font-bold mb-8 text-cyan-400">MUZO</h1>
        <nav className="space-y-4">
          <Link href="/" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isActive('/') ? 'text-cyan-400 bg-[#2a264d]' : 'text-white hover:text-cyan-400'}`}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link href="/create" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isActive('/create') ? 'text-cyan-400 bg-[#2a264d]' : 'text-white hover:text-cyan-400'}`}>
            <PlusCircle size={20} />
            <span>Create</span>
          </Link>
          <Link href="/library" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isActive('/library') ? 'text-cyan-400 bg-[#2a264d]' : 'text-white hover:text-cyan-400'}`}>
            <Library size={20} />
            <span>Library</span>
          </Link>
        </nav>
      </div>
    </div>
  );
}