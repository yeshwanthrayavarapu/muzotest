'use client';

import { useState, useEffect } from 'react';
import { User, Mail, Phone, MapPin, Camera, Loader2 } from 'lucide-react';
import { useParams, useRouter } from 'next/navigation';
import { Theme, useTheme } from '@/contexts/ThemeContext';
import { AuthStatus, useAuth } from '@/contexts/AuthContext';
import { authedPost } from '@/api';
import { UserDetails } from '../../../shared/user';
import Avatar from '@/components/Avatar';
import { LoadingSpinner } from '@/components/LoadingSpinner';
import ErrorMessage from '@/components/ErrorMessage';

export default function SettingsPage() {
  const { id } = useParams<{ id: string }>();

  const { session, status, user, refetchUser } = useAuth();

  const router = useRouter();

  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState('');
  const { setTheme, theme } = useTheme();

  const [settings, setSettings] = useState<UserDetails>(user?.details || {
    name: '',
    email: '',
    phone: '',
    location:  '',
    bio: '',
    profileImage: '',
  });

  useEffect(() => {
    if (status === AuthStatus.LoggedOut) {
      router.push('/signin');
      return;
    }
  }, [status, session, router, id, settings.name]);

  const handleChange = (field: keyof UserDetails, value: string) => {
    setSettings(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (isSaving || !session) return;

    try {
      setIsSaving(true);

      console.log('settings', settings);
      const response = await authedPost('/users/update', session, settings);
      if (!response.ok) throw new Error('Failed to update profile');

      router.back(); // Navigate back to the previous page after saving
    } catch (err) {
      setError('Error saving profile data');
      console.error(err);
    } finally {
      setIsSaving(false);
      refetchUser();
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

  if (!session || !user) {
    return <LoadingSpinner fullScreen={true} />;
  }

  return (
    <div className="min-h-screen">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-container rounded-xl p-8">
          {/* Header */}
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl gradient-text font-bold">
              Profile Settings
            </h1>
          </div>

          <ErrorMessage message={error} />

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Profile Image */}
            <div className="flex items-center space-x-8">
              <div className="relative">
                <div className="w-32 h-32">
                  <Avatar user={user} size={128} />
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
                <label className="flex items-center text-subtext">
                  <User size={16} className="mr-2" />
                  Name
                </label>
                <input
                  type="text"
                  value={settings.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  disabled={false}
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-subtext">
                  <Mail size={16} className="mr-2" />
                  Email
                </label>
                <input
                  type="email"
                  value={settings.email}
                  disabled
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-subtext">
                  <Phone size={16} className="mr-2" />
                  Phone
                </label>
                <input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => handleChange('phone', e.target.value)}
                  disabled={false}
                  placeholder="+61-12345678"
                />
              </div>

              <div className="space-y-2">
                <label className="flex items-center text-subtext">
                  <MapPin size={16} className="mr-2" />
                  Location
                </label>
                <input
                  type="text"
                  value={settings.location}
                  onChange={(e) => handleChange('location', e.target.value)}
                  disabled={false}
                  placeholder="Sydney, Australia"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-subtext">Bio</label>
              <textarea
                value={settings.bio}
                onChange={(e) => handleChange('bio', e.target.value)}
                disabled={false}
                rows={4}
                placeholder="Tell us about yourself..."
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
