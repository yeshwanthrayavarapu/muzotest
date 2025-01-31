import Link from 'next/link';
import { Music } from 'lucide-react';

export function Navbar() {
  return (
    <nav className="w-full px-12 py-5 flex justify-between items-center bg-transparent">
      <Link href="/" className="text-2xl font-bold flex items-center gap-2">
        <Music className="text-cyan-400" />
        <span className="text-cyan-400">MUZO</span>
      </Link>
      
      <ul className="flex space-x-8">
        <li><Link href="/create" className="text-white hover:text-cyan-400 transition-colors">Create</Link></li>
        <li><Link href="/library" className="text-white hover:text-cyan-400 transition-colors">Library</Link></li>
      </ul>
    </nav>
  );
}