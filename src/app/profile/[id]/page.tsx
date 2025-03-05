'use client';

import { useState } from 'react';
import { Settings, Mail, Phone, MapPin, Globe } from 'lucide-react';
import Link from 'next/link';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
  profileImage: string;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile] = useState<UserProfile>({
    id: params.id,
    name: 'Alex Johnson',
    email: 'alex@example.com',
    phone: '+1 (555) 123-4567',
    location: 'New York, USA',
    website: 'www.alexmusic.com',
    bio: 'Music producer and sound designer. Creating electronic and ambient soundscapes.',
    profileImage: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&h=200&fit=crop'
  });

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] to-[#0a0d12]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-[#1e1b3b] rounded-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-cyan-400/20 to-blue-500/20">
            <div className="absolute -bottom-16 left-8">
              <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-[#1e1b3b]">
                <img
                  src={profile.profileImage}
                  alt={profile.name}
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-white">{profile.name}</h1>
                <p className="text-gray-400 mt-4 max-w-2xl">{profile.bio}</p>
              </div>
              <Link
                href="/settings"
                className="flex items-center gap-2 px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
              >
                <Settings size={20} />
                Edit Profile
              </Link>
            </div>

            {/* Contact Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 text-gray-400">
                <Mail size={20} className="text-cyan-400" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Phone size={20} className="text-cyan-400" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <MapPin size={20} className="text-cyan-400" />
                <span>{profile.location}</span>
              </div>
              <div className="flex items-center gap-3 text-gray-400">
                <Globe size={20} className="text-cyan-400" />
                <a href={`https://${profile.website}`} target="_blank" rel="noopener noreferrer" className="hover:text-cyan-400 transition-colors">
                  {profile.website}
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}