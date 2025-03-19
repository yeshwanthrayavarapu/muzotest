'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Loader2 } from 'lucide-react';
import { useSession } from 'next-auth/react';
import { useParams, useRouter } from 'next/navigation';
import { Theme, useTheme } from '@/contexts/ThemeContext';
import { LoadingSpinner } from '@/components/LoadingSpinner';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  location: string;
  bio: string;
  profileImage: string;
}

export default function SettingsPage() {
  const { id } = useParams<{ id: string }>();
  const { data: session, status } = useSession();
  const router = useRouter();

  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { setTheme, theme } = useTheme();

  const [settings, setSettings] = useState<UserSettings>({
    name: '',
    email: '',
    phone: '+61-12345678', // Default Australian number
    location: 'Sydney, Australia', // Default location
    bio: '',
    profileImage: '',
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/signin');
      return;
    }

    if (status === 'authenticated' && session?.user?.id !== id) {
      router.push(`/settings/${session?.user?.id}`);
      return;
    }

    // Only fetch if we're authenticated and haven't loaded the user's name yet
    if (status === 'authenticated' && session?.user?.id && !settings.name) {
      fetchUserData();
    }
  }, [status, session, router, id, settings.name]);

  const fetchUserData = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`/api/user/${id}`);

      if (!response.ok) {
        throw new Error('Failed to fetch user data');
      }

      const userData = await response.json();
      setSettings(prev => ({
        ...prev,
        ...userData,
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
      const response = await fetch(`/api/user/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(settings),
      });

      if (!response.ok) throw new Error('Failed to update profile');

      // Use the updated user from the response, no extra fetch
      const { user } = await response.json();
      setSettings(user);
      router.back(); // Navigate back to the previous page after saving
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
      <LoadingSpinner fullScreen={true} size="large" />
    );
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-container rounded-xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl gradient-text font-bold">
              Your Profile Settings
            </h1>
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
                <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-cyan-400/20">
                  {settings.profileImage ? (
                    <img
                      src={settings.profileImage}
                      alt={settings.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <div className="w-full h-full bg-accent flex items-center justify-center">
                      <User size={48} className="text-cyan-400" />
                    </div>
                  )}
                  <label className="absolute bottom-0 right-0 p-2 bg-accent rounded-full cursor-pointer hover:bg-altAccent transition-colors">
                    <Camera size={20} className="text-textPrimary" />
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageUpload}
                    />
                  </label>
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
                  disabled={false}
                  className="w-full px-4 py-2 bg-subContainer rounded-lg border border-background text-textPrimary disabled:opacity-50"
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
                  disabled
                  className="w-full px-4 py-2 bg-subContainer rounded-lg border border-background text-textPrimary disabled:opacity-50"
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
                  disabled={false}
                  placeholder="+61-12345678"
                  className="w-full px-4 py-2 bg-subContainer rounded-lg border border-background text-textPrimary disabled:opacity-50"
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
                  disabled={false}
                  placeholder="Sydney, Australia"
                  className="w-full px-4 py-2 bg-subContainer rounded-lg border border-background text-textPrimary disabled:opacity-50"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-gray-400">Bio</label>
              <textarea
                value={settings.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={false}
                rows={4}
                placeholder="Tell us about yourself..."
                className="w-full px-4 py-2 bg-subContainer rounded-lg border border-background text-textPrimary disabled:opacity-50"
              />
            </div>

            <div className="flex justify-end">
              <button
                type="submit"
                disabled={isSaving}
                className="blue-button"
              >
                {isSaving && <Loader2 size={16} className="animate-spin" />}
                {isSaving ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-container rounded-xl p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl gradient-text font-bold">
              Theme Settings
            </h1>
          </div>
          <select
            onChange={(e) => setTheme(e.target.value as Theme)}
            className="w-full px-4 py-2 bg-subContainer rounded-lg border border-background text-textPrimary disabled:opacity-50"
            value={theme}
          >
            {Object.values(Theme).map((theme) => (
              <option key={theme} value={theme} className="font-sans">{theme}</option>
            ))}
          </select>
        </div>
      </div>
    </div>
  );
}
