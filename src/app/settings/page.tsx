'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Globe, Camera, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  location: string;
  website: string;
  bio: string;
  profileImage: string;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  
  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    phone: '',
    location: '',
    website: '',
    bio: '',
    profileImage: ''
  });
  
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');

  // Fetch user data on component mount
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }
    
    if (status === 'authenticated' && session?.user?.id) {
      fetchUserData();
    }
  }, [status, session, router]);

  // Add this near the top of your component
useEffect(() => {
    // Set a timeout to prevent infinite loading
    const loadingTimeout = setTimeout(() => {
      if (isLoading) {
        setIsLoading(false);
        setError('Loading timed out. Please try refreshing the page.');
        console.error('Loading profile data timed out');
      }
    }, 10000); // 10 second timeout
    
    return () => clearTimeout(loadingTimeout);
  }, [isLoading]);
  
  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/user/${session?.user?.id}`);
      
      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }
      
      const userData = await response.json();
      setSettings({
        name: userData.name || '',
        email: userData.email || '',
        phone: userData.phone || '',
        location: userData.location || '',
        website: userData.website || '',
        bio: userData.bio || '',
        profileImage: userData.profileImage || ''
      });
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
      const response = await fetch(`/api/user/${session?.user?.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      
      if (!response.ok) {
        throw new Error('Failed to update profile');
      }
      
      // Update successful
      setIsEditing(false);
      // Refresh the user data to ensure we have the latest
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
      // Create a FormData instance
      const formData = new FormData();
      formData.append('image', file);
      
      // Upload the image to your server/storage service
      const response = await fetch(`/api/upload`, {
        method: 'POST',
        body: formData,
      });
      
      if (!response.ok) {
        throw new Error('Failed to upload image');
      }
      
      const data = await response.json();
      // Update the image URL in the settings state
      handleChange('profileImage', data.imageUrl);
    } catch (err) {
      setError('Error uploading image');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Loader2 className="h-10 w-10 text-cyan-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-12">
      <div className="bg-[#1e1b3b] rounded-xl p-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Profile Settings
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

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Profile Image */}
          <div className="flex items-center space-x-8">
            <div className="relative">
              <div className="w-32 h-32 rounded-full overflow-hidden">
                {settings.profileImage ? (
                  <Image
                    src={settings.profileImage}
                    alt={settings.name}
                    width={128}
                    height={128}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-gray-700 flex items-center justify-center">
                    <User size={48} className="text-gray-400" />
                  </div>
                )}
              </div>
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
            <div>
              <h2 className="text-xl font-semibold text-white">{settings.name}</h2>
              <p className="text-gray-400">Update your profile picture</p>
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
                onChange={(e) => handleChange('email', e.target.value)}
                disabled={!isEditing || true} // Email typically can't be changed
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
                className="w-full px-4 py-2 bg-[#2a264d] rounded-lg border border-gray-700 text-white disabled:opacity-50"
              />
            </div>

            <div className="space-y-2">
              <label className="flex items-center text-gray-400">
                <Globe size={16} className="mr-2" />
                Website
              </label>
              <input
                type="url"
                value={settings.website}
                onChange={(e) => handleChange('website', e.target.value)}
                disabled={!isEditing}
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
  );
}