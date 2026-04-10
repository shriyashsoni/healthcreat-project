'use client';

import { useState, useRef, useEffect } from 'react';
import { Send, User, Stethoscope, AlertCircle, Copy, Star } from 'lucide-react';
import { useRouter } from 'next/navigation';

type MessageInfo = {
  role: 'user' | 'assistant';
  content: string;
};

export default function ChatPage({
  params = {},
}: {
  params?: { id?: string };
} = {}) {
  const [messages, setMessages] = useState<MessageInfo[]>([
    {
      role: 'assistant',
      content: 'Hello! I am here to help you find the right specialist. Please describe your symptoms in English or Hindi (e.g., "I have had a severe stomach ache since yesterday").',
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const [conversationId, setConversationId] = useState(params.id || '');
  const [isFavorited, setIsFavorited] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Load existing conversation if ID provided
  useEffect(() => {
    const loadConversation = async () => {
      if (!conversationId) return;

      try {
        const res = await fetch(`/api/conversations/${conversationId}/messages`);
        if (res.ok) {
          const msgs = await res.json();
          if (msgs.length > 0) {
            setMessages(msgs);
          }
        }
      } catch (error) {
        console.error('[v0] Failed to load conversation:', error);
      }
    };

    loadConversation();
  }, [conversationId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');

    const newMessages: MessageInfo[] = [
      ...messages,
      { role: 'user', content: userMessage },
    ];

    setMessages(newMessages);
    setIsLoading(true);

    try {
      // Create conversation if it doesn't exist
      let currentConvId = conversationId;
      if (!currentConvId) {
        const convRes = await fetch('/api/conversations', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ title: userMessage.substring(0, 50) }),
        });

        if (convRes.ok) {
          const conv = await convRes.json();
          currentConvId = conv.id;
          setConversationId(conv.id);
          router.push(`/chat/${conv.id}`);
        }
      }

      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: newMessages,
          conversationId: currentConvId,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch');
      }

      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: data.content },
      ]);

      if (data.isFinal) {
        setIsFinal(true);
      }
    } catch (err: any) {
      console.error('[v0] Chat error:', err);
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: `Error: ${err.message}. Please try again.`,
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNewChat = () => {
    setMessages([
      {
        role: 'assistant',
        content: 'Hello! I am here to help you find the right specialist. Please describe your symptoms in English or Hindi (e.g., "I have had a severe stomach ache since yesterday").',
      },
    ]);
    setConversationId('');
    setIsFinal(false);
    setInput('');
    router.push('/chat');
  };

  const handleToggleFavorite = async () => {
    if (!conversationId) return;

    try {
      const res = await fetch(`/api/conversations/${conversationId}/favorite`, {
        method: 'POST',
      });

      if (res.ok) {
        const data = await res.json();
        setIsFavorited(data.favorited);
      }
    } catch (error) {
      console.error('[v0] Failed to toggle favorite:', error);
    }
  };

  const handleCopy = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary font-sans text-text-primary">
      {/* Header */}
      <header className="bg-bg-primary border-b border-border-light sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-sm bg-text-primary"></div>
          <h1 className="text-lg font-bold tracking-tight text-text-primary">
            HealthRouter Chat
          </h1>
        </div>
        <div className="flex items-center gap-2">
          {conversationId && (
            <>
              <button
                onClick={handleToggleFavorite}
                className={`p-2 rounded-lg transition ${
                  isFavorited
                    ? 'bg-accent-blue text-white'
                    : 'text-text-secondary hover:bg-bg-secondary hover:text-white'
                }`}
                title={isFavorited ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Star className="w-5 h-5" />
              </button>
            </>
          )}
          <button
            onClick={handleNewChat}
            className="text-xs uppercase tracking-widest font-medium text-text-secondary hover:text-text-primary transition"
          >
            New Chat
          </button>
        </div>
      </header>

      {/* Warning Banner */}
      <div className="bg-[#E2DDD5] border-b border-border-light px-6 py-3 flex gap-3 items-center text-text-secondary text-xs uppercase tracking-wider font-medium">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <p>Not for emergencies. Provides routing, not medical diagnosis.</p>
      </div>

      {/* Chat Container */}
      <main className="flex-1 flex flex-col w-full mx-auto p-4 sm:p-6 pb-32">
        <div className="flex flex-col gap-6 max-w-4xl mx-auto w-full">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-4 mb-4 ${
                m.role === 'user' ? 'flex-row-reverse' : 'flex-row'
              }`}
            >
              <div
                className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  m.role === 'user'
                    ? 'bg-accent-blue text-white'
                    : 'bg-bg-secondary text-white'
                }`}
              >
                {m.role === 'user' ? (
                  <User className="w-5 h-5" />
                ) : (
                  <Stethoscope className="w-5 h-5" />
                )}
              </div>

              <div
                className={`flex flex-col max-w-[85%] ${
                  m.role === 'user' ? 'items-end' : 'items-start'
                }`}
              >
                <div
                  className={`px-6 py-4 rounded-[16px] text-base leading-relaxed ${
                    m.role === 'user'
                      ? 'bg-accent-blue text-white rounded-se-sm'
                      : 'bg-white border border-border-light text-text-primary rounded-ss-sm'
                  }`}
                >
                  {m.role === 'assistant' ? (
                    <div
                      className="font-sans prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{
                        __html: m.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                          .replace(/## (.*?)\n/g, '<h2 class="text-lg font-bold mt-4 mb-2 text-text-primary">$1</h2>\n')
                          .replace(/\n/g, '<br />'),
                      }}
                    />
                  ) : (
                    m.content
                  )}
                </div>
                {m.role === 'assistant' && (
                  <button
                    onClick={() => handleCopy(m.content)}
                    className="mt-2 text-xs text-text-secondary hover:text-text-primary transition flex items-center gap-1"
                  >
                    <Copy className="w-3 h-3" />
                    Copy
                  </button>
                )}
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-bg-secondary text-white">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="bg-white border border-border-light rounded-[16px] rounded-ss-sm px-6 py-5 flex items-center gap-2">
                <div
                  className="w-2 h-2 rounded-full bg-border-dark animate-bounce"
                  style={{ animationDelay: '0ms' }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-border-dark animate-bounce"
                  style={{ animationDelay: '150ms' }}
                ></div>
                <div
                  className="w-2 h-2 rounded-full bg-border-dark animate-bounce"
                  style={{ animationDelay: '300ms' }}
                ></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Form */}
      <footer className="fixed bottom-0 left-0 right-0 bg-bg-primary border-t border-border-light p-4">
        <div className="max-w-4xl mx-auto flex gap-3">
          {isFinal ? (
            <div className="w-full text-center p-4 bg-bg-secondary rounded-md text-white font-medium text-sm">
              Consultation complete. You can click New Chat to start a new session.
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex-1 flex gap-3 items-center">
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Describe your symptoms..."
                disabled={isLoading}
                className="flex-1 bg-white border border-border-light text-text-primary rounded-md px-5 py-4 focus:outline-none focus:ring-1 focus:ring-text-primary focus:border-text-primary transition disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="bg-bg-secondary text-white rounded-md px-6 py-4 flex items-center justify-center flex-shrink-0 hover:bg-black transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-2 font-medium">
                  Send <Send className="w-4 h-4" />
                </div>
              </button>
            </form>
          )}
        </div>
      </footer>
    </div>
  );
}
