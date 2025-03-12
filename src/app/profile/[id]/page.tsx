'use client';

import { useState, useEffect } from 'react';
import { Settings, Mail, Phone, MapPin, Globe } from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage: string;
}

export default function ProfilePage({ params }: { params: { id: string } }) {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await fetch(`/api/user/${params.id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch profile');
        }
        const data = await response.json();
        setProfile(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, [params.id]);

  if (loading) return <LoadingSpinner fullScreen={true} size='large' />;

  if (error) return <div className="min-h-screen flex items-center justify-center">
    <div className="text-red-500">{error}</div>
  </div>;

  if (!profile) return null;

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-container rounded-xl overflow-hidden">
          {/* Profile Header */}
          <div className="relative h-48 bg-gradient-to-r from-altAccent/20 to-blue-500/20">
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
                <h1 className="text-3xl font-bold text-textPrimary">{profile.name}</h1>
                <p className="text-textSecondary mt-4 max-w-2xl">{profile.bio}</p>
              </div>
              <Link
                href={`/settings/${params.id}`}
                className="blue-button"
              >
                <Settings size={20} />
                Edit Profile
              </Link>
            </div>

            {/* Contact Information */}
            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex items-center gap-3 text-textSecondary">
                <Mail size={20} className="text-accent" />
                <span>{profile.email}</span>
              </div>
              <div className="flex items-center gap-3 text-textSecondary">
                <Phone size={20} className="text-accent" />
                <span>{profile.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-textSecondary">
                <MapPin size={20} className="text-accent" />
                <span>{profile.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
