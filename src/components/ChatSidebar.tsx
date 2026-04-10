'use client';

import { useState, useEffect } from 'react';
import { Plus, Trash2, Star, ChevronDown, LogOut } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

interface Conversation {
  id: string;
  title: string;
  is_favorite: boolean;
  created_at: string;
}

interface Profile {
  id: string;
  full_name: string;
  avatar_url: string;
  email: string;
}

export function ChatSidebar() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showUserMenu, setShowUserMenu] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [convsRes, profileRes] = await Promise.all([
          fetch('/api/conversations'),
          fetch('/api/profile')
        ]);

        if (convsRes.ok) {
          const convs = await convsRes.json();
          setConversations(convs);
        }

        if (profileRes.ok) {
          const prof = await profileRes.json();
          setProfile(prof);
        }
      } catch (error) {
        console.error('[v0] Failed to fetch data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleNewChat = async () => {
    try {
      const res = await fetch('/api/conversations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title: 'New Conversation' }),
      });

      if (res.ok) {
        const conversation = await res.json();
        setConversations([conversation, ...conversations]);
        router.push(`/chat/${conversation.id}`);
      }
    } catch (error) {
      console.error('[v0] Failed to create conversation:', error);
    }
  };

  const handleSignOut = async () => {
    try {
      await fetch('/auth/signout', { method: 'POST' });
      router.push('/login');
    } catch (error) {
      console.error('[v0] Sign out error:', error);
    }
  };

  const favorites = conversations.filter(c => c.is_favorite);
  const recent = conversations.filter(c => !c.is_favorite);

  return (
    <div className="w-64 bg-bg-secondary text-white flex flex-col border-r border-border-light h-full">
      {/* Header */}
      <div className="p-4 border-b border-border-dark">
        <button
          onClick={handleNewChat}
          className="w-full flex items-center justify-center gap-2 bg-text-primary text-bg-secondary rounded-lg px-4 py-3 font-medium hover:bg-opacity-90 transition text-sm"
        >
          <Plus className="w-4 h-4" />
          New Chat
        </button>
      </div>

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-2 mb-2">
              Favorites
            </h3>
            <div className="space-y-2">
              {favorites.map(conv => (
                <Link
                  key={conv.id}
                  href={`/chat/${conv.id}`}
                  className="block p-3 rounded-lg hover:bg-bg-primary transition text-sm text-text-primary group"
                >
                  <div className="flex items-center justify-between">
                    <span className="truncate flex-1">{conv.title}</span>
                    <Star className="w-4 h-4 text-accent-blue flex-shrink-0 opacity-0 group-hover:opacity-100 transition" />
                  </div>
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Recent Section */}
        {recent.length > 0 && (
          <div>
            <h3 className="text-xs font-semibold text-text-secondary uppercase tracking-wider px-2 mb-2">
              Recent
            </h3>
            <div className="space-y-2">
              {recent.slice(0, 10).map(conv => (
                <Link
                  key={conv.id}
                  href={`/chat/${conv.id}`}
                  className="block p-3 rounded-lg hover:bg-bg-primary transition text-sm text-text-primary truncate"
                >
                  {conv.title}
                </Link>
              ))}
            </div>
          </div>
        )}

        {isLoading && (
          <div className="text-center py-8">
            <p className="text-xs text-text-secondary">Loading conversations...</p>
          </div>
        )}

        {!isLoading && conversations.length === 0 && (
          <div className="text-center py-8">
            <p className="text-xs text-text-secondary">No conversations yet</p>
          </div>
        )}
      </div>

      {/* User Profile Section */}
      <div className="border-t border-border-dark p-4">
        <button
          onClick={() => setShowUserMenu(!showUserMenu)}
          className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-bg-primary transition text-sm"
        >
          <div className="flex items-center gap-3 min-w-0">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt={profile.full_name}
                className="w-8 h-8 rounded-full flex-shrink-0"
              />
            ) : (
              <div className="w-8 h-8 rounded-full bg-accent-blue flex items-center justify-center flex-shrink-0 text-xs font-bold">
                {profile?.full_name?.charAt(0) || '?'}
              </div>
            )}
            <div className="min-w-0 text-left">
              <p className="font-medium text-text-primary truncate text-xs">
                {profile?.full_name || 'User'}
              </p>
              <p className="text-xs text-text-secondary truncate">
                {profile?.email}
              </p>
            </div>
          </div>
          <ChevronDown className="w-4 h-4 text-text-secondary flex-shrink-0" />
        </button>

        {showUserMenu && (
          <div className="mt-2 space-y-2">
            <Link
              href="/profile"
              className="block w-full text-left p-3 rounded-lg hover:bg-bg-primary transition text-sm text-text-primary"
            >
              View Profile
            </Link>
            <button
              onClick={handleSignOut}
              className="w-full flex items-center gap-2 p-3 rounded-lg hover:bg-bg-primary transition text-sm text-red-400"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
