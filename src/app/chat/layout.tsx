'use client';

import { ChatSidebar } from '@/components/ChatSidebar';

export default function ChatLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen bg-bg-primary">
      <ChatSidebar />
      <div className="flex-1 flex flex-col">{children}</div>
    </div>
  );
}
