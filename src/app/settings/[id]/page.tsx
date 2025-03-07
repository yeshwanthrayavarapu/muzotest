'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Loader2, Music, Calendar } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage: string;
  joinedDate?: string;
  tracksCreated?: number;
}

export default function SettingsPage({ params }: { params: { id: string } }) {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    phone: '+61-12345678', // Default Australian number
    location: 'Sydney, Australia', // Default location
    bio: '',
    profileImage: '',
    joinedDate: new Date().toISOString(),
    tracksCreated: 0
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id !== params.id) {
      router.push(`/settings/${session?.user?.id}`);
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData();
    }
  }, [status, session, router, params.id]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/user/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      setSettings(prev => ({
        ...prev,
        ...userData,
        joinedDate: userData.createdAt || prev.joinedDate,
      }));
    } catch (err) {
      setError('Error loading profile data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleChange = (field: keyof UserSettings, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      setIsSaving(true);
      const response = await fetch(`/api/user/${params.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) throw new Error('Failed to update profile');
      
      setIsEditing(false);
      await fetchUserData();
    } catch (err) {
      setError('Error saving profile data');
      console.error(err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const formData = new FormData();
      formData.append('image', file);
      
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) throw new Error('Failed to upload image');
      
      const data = await response.json();
      handleChange('profileImage', data.imageUrl);
    } catch (err) {
      setError('Error uploading image');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] to-[#0a0d12] flex justify-center items-center">
        <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-[#1a0b2e] to-[#0a0d12]">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-[#1e1b3b] rounded-xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
              Your Profile Settings
            </h1>
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="px-6 py-2 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity"
            >
              {isEditing ? 'Cancel' : 'Edit Profile'}
            </button>
          </div>

          {error && (
            <div className="mb-6 p-4 bg-red-500/20 border border-red-500 rounded-lg text-white">
              {error}
            </div>
          )}

          {/* User Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
            <div className="bg-[#2a264d] p-4 rounded-lg">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Calendar size={20} />
                <span className="text-sm">Joined</span>
              </div>
              <p className="text-white">
                {new Date(settings.joinedDate!).toLocaleDateString()}
              </p>
            </div>
            <div className="bg-[#2a264d] p-4 rounded-lg">
              <div className="flex items-center gap-2 text-cyan-400 mb-2">
                <Music size={20} />
                <span className="text-sm">Tracks Created</span>
              </div>
              <p className="text-white">{settings.tracksCreated}</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image */}
            <div className="flex items-center space-x-8">
              <div className="relative">
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-400/20">
                  {settings.profileImage ? (
                    <img
                      src={settings.profileImage}
                      alt={settings.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#2a264d] flex items-center justify-center">
                      <User size={48} className="text-cyan-400" />
                    </div>
                  )}
                  {isEditing && (
                    <label className="absolute bottom-0 right-0 p-2 bg-cyan-400 rounded-full cursor-pointer hover:bg-cyan-500 transition-colors">
                      <Camera size={20} className="text-black" />
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>

            {/* Form Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="flex items-center text-gray-400">
                  <User size={16} className="mr-2" />
                  Name
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={!isEditing}
                  className="w-full px-4 py-2 bg-[#2a264d] rounded-lg border border-gray-700 text-white disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-400">
                  <Mail size={16} className="mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  disabled={true}
                  className="w-full px-4 py-2 bg-[#2a264d] rounded-lg border border-gray-700 text-white disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-400">
                  <Phone size={16} className="mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="+61-12345678"
                  className="w-full px-4 py-2 bg-[#2a264d] rounded-lg border border-gray-700 text-white disabled:opacity-50"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-gray-400">
                  <MapPin size={16} className="mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Sydney, Australia"
                  className="w-full px-4 py-2 bg-[#2a264d] rounded-lg border border-gray-700 text-white disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-400">Bio</label>
              <textarea
                value={settings.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={!isEditing}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2 bg-[#2a264d] rounded-lg border border-gray-700 text-white disabled:opacity-50 resize-none"
              />
            </div>

            {isEditing && (
              <div className="flex justify-end">
                <button
                  type="submit"
                  disabled={isSaving}
                  className="px-8 py-3 bg-gradient-to-r from-cyan-400 to-blue-500 text-black font-semibold rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center gap-2"
                >
                  {isSaving && <Loader2 size={16} className="animate-spin" />}
                  {isSaving ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            )}
          </form>
        </div>
      </div>
    </div>
  );
}