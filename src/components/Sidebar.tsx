import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Home, PlusCircle, Library } from 'lucide-react';

export function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  
  const isActive = (path: string) => location.pathname === path;
  
  return (
    <div className="w-64 bg-[#16132a] p-6 flex flex-col justify-between h-screen fixed left-0 top-0">
      <div>
        <h1 className="text-2xl font-bold mb-8 text-cyan-400">MUZO</h1>
        <nav className="space-y-4">
          <Link to="/" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isActive('/') ? 'text-cyan-400 bg-[#2a264d]' : 'text-white hover:text-cyan-400'}`}>
            <Home size={20} />
            <span>Home</span>
          </Link>
          <Link to="/create" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isActive('/create') ? 'text-cyan-400 bg-[#2a264d]' : 'text-white hover:text-cyan-400'}`}>
            <PlusCircle size={20} />
            <span>Create</span>
          </Link>
          <Link to="/library" className={`flex items-center space-x-3 p-2 rounded-lg transition-colors ${isActive('/library') ? 'text-cyan-400 bg-[#2a264d]' : 'text-white hover:text-cyan-400'}`}>
            <Library size={20} />
            <span>Library</span>
          </Link>
        </nav>
      </div>
      <button 
        onClick={() => navigate('/pricing')}
        className="w-full py-3 px-4 bg-gradient-to-r from-cyan-400 to-blue-500 rounded-full text-black font-semibold hover:opacity-90 transition-opacity"
      >
        Upgrade
      </button>
    </div>
  );
}