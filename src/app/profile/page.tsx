'use client';

import { useState, useEffect } from 'react';
import { Settings, Mail, Phone, MapPin } from 'lucide-react';
import Link from 'next/link';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import { User, UserDetails } from '../../../shared/user';
import * as api from '@/api';
import Avatar from '@/components/Avatar';

export default function ProfilePage() {
  const [profile, setProfile] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const userUuid = new URLSearchParams(document.location.search).get("u") as string

    const fetchProfile = async () => {
      try {
        const data = await api.fetchProfile(userUuid);
        setProfile(data!);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load profile');
      } finally {
        setLoading(false);
      }
    };

    fetchProfile();
  }, []);

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
              <Avatar user={profile} size={128} />
            </div>
          </div>

          {/* Profile Info */}
          <div className="pt-20 px-8 pb-8">
            <div className="flex justify-between items-start">
              <div>
                <h1 className="text-3xl font-bold text-textPrimary">{profile.details?.name}</h1>
                <p className="text-textSecondary mt-4 max-w-2xl">{profile.details?.bio}</p>
              </div>
              <Link
                href="/settings"
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
                <span>{profile.details?.phone}</span>
              </div>
              <div className="flex items-center gap-3 text-textSecondary">
                <MapPin size={20} className="text-accent" />
                <span>{profile.details?.location}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
