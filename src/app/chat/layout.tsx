"use client";

import { MessageSquare, Plus, Settings, History } from "lucide-react"
import Link from 'next/link'

export default function ChatLayout({ children }: { children: React.ReactNode }) {
  // In a real app we would load history from Supabase, here we mock it
  const chatHistory = [
    { id: '1', title: 'Stomach Ache Guidance', date: 'Today' },
    { id: '2', title: 'Persistent Fever', date: 'Yesterday' },
  ];

  return (
    <div className="flex h-screen w-full bg-bg-primary font-sans text-text-primary">
      
      {/* ChatGPT Style Sidebar (Vanilla Tailwind instead of Shadcn) */}
      <aside className="border-r border-border-light bg-white w-64 flex-shrink-0 hidden md:flex flex-col h-full">
        <header className="p-4 flex flex-col gap-2 border-b border-border-light">
           <Link href="/chat" className="w-full">
             <button className="flex items-center gap-2 w-full justify-between bg-bg-primary hover:bg-bg-card transition px-4 py-3 rounded-[12px] text-sm font-bold shadow-sm text-text-primary">
               <div className="flex items-center gap-2">
                 <div className="w-4 h-4 bg-text-primary rounded-[2px]" />
                 <span>New Query</span>
               </div>
               <Plus className="w-4 h-4 text-text-secondary" />
             </button>
           </Link>
        </header>

        <nav className="flex-1 overflow-y-auto p-4">
           <div className="mb-6">
             <h3 className="text-[11px] font-bold text-text-secondary uppercase tracking-[0.1em] mb-4">Previous Chats</h3>
             <ul className="flex flex-col gap-2">
               {chatHistory.map((chat) => (
                 <li key={chat.id}>
                   <Link href={`/chat/${chat.id}`} className="flex items-center gap-3 px-3 py-2.5 rounded-[12px] hover:bg-bg-primary transition text-sm font-medium text-text-primary w-full shadow-sm">
                     <MessageSquare className="w-4 h-4 text-text-secondary flex-shrink-0" />
                     <span className="truncate flex-1">{chat.title}</span>
                   </Link>
                 </li>
               ))}
             </ul>
           </div>
        </nav>

        <footer className="p-4 border-t border-border-light bg-bg-primary">
           <Link href="/settings" className="flex items-center gap-3 px-3 py-3 rounded-[12px] hover:bg-bg-card transition text-sm font-bold text-text-primary text-center justify-center">
             <Settings className="w-5 h-5 flex-shrink-0" /> Settings & Profile
           </Link>
        </footer>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {children}
      </main>

    </div>
  )
}