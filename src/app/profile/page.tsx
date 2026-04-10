'use client';

import { useState, useEffect } from 'react';
import { ArrowLeft, Save } from 'lucide-react';
import Link from 'next/link';
import { ChatSidebar } from '@/components/ChatSidebar';

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [fullName, setFullName] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const res = await fetch('/api/profile');
        if (res.ok) {
          const prof = await res.json();
          setProfile(prof);
          setFullName(prof.full_name || '');
          setAvatarUrl(prof.avatar_url || '');
        }
      } catch (error) {
        console.error('[v0] Failed to fetch profile:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const handleSave = async () => {
    setIsSaving(true);
    setMessage('');

    try {
      const res = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          full_name: fullName,
          avatar_url: avatarUrl,
        }),
      });

      if (res.ok) {
        const updated = await res.json();
        setProfile(updated);
        setMessage('Profile updated successfully!');
        setTimeout(() => setMessage(''), 3000);
      } else {
        setMessage('Failed to update profile');
      }
    } catch (error) {
      console.error('[v0] Failed to save profile:', error);
      setMessage('Error saving profile');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-bg-primary">
      <ChatSidebar />
      
      <main className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-bg-primary border-b border-border-light sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/chat" className="text-text-secondary hover:text-text-primary transition">
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <h1 className="text-2xl font-bold text-text-primary">Profile</h1>
          </div>
        </header>

        {/* Content */}
        {isLoading ? (
          <div className="flex-1 flex items-center justify-center">
            <p className="text-text-secondary">Loading profile...</p>
          </div>
        ) : (
          <div className="flex-1 max-w-2xl mx-auto w-full p-6">
            <div className="bg-white rounded-xl border border-border-light p-8 space-y-6">
              {/* Avatar Section */}
              <div className="text-center">
                {avatarUrl ? (
                  <img
                    src={avatarUrl}
                    alt={fullName}
                    className="w-24 h-24 rounded-full mx-auto mb-4 object-cover"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto mb-4 bg-accent-blue flex items-center justify-center">
                    <span className="text-3xl font-bold text-white">
                      {fullName?.charAt(0) || '?'}
                    </span>
                  </div>
                )}
                <p className="text-sm text-text-secondary">{profile?.email}</p>
              </div>

              {/* Form */}
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Full Name
                  </label>
                  <input
                    type="text"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Your full name"
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue text-text-primary placeholder-text-secondary"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">
                    Avatar URL
                  </label>
                  <input
                    type="url"
                    value={avatarUrl}
                    onChange={(e) => setAvatarUrl(e.target.value)}
                    placeholder="https://example.com/avatar.jpg"
                    className="w-full px-4 py-2 border border-border-light rounded-lg focus:outline-none focus:ring-2 focus:ring-accent-blue text-text-primary placeholder-text-secondary"
                  />
                </div>
              </div>

              {/* Message */}
              {message && (
                <div className={`p-4 rounded-lg text-sm ${
                  message.includes('successfully')
                    ? 'bg-green-50 text-green-700'
                    : 'bg-red-50 text-red-700'
                }`}>
                  {message}
                </div>
              )}

              {/* Save Button */}
              <button
                onClick={handleSave}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-accent-blue text-white rounded-lg px-6 py-3 font-medium hover:bg-opacity-90 transition disabled:opacity-50"
              >
                <Save className="w-4 h-4" />
                {isSaving ? 'Saving...' : 'Save Profile'}
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
