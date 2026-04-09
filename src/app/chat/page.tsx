"use client";

import { useState, useRef, useEffect } from "react";
import { Send, User, Stethoscope, PlusCircle, AlertCircle } from "lucide-react";

type MessageInfo = {
  role: "user" | "assistant";
  content: string;
};

export default function Home() {
  const [messages, setMessages] = useState<MessageInfo[]>([
    {
      role: "assistant",
      content: "Hello! I am here to help you find the right specialist. Please describe your symptoms in English or Hindi (e.g., 'I have had a severe stomach ache since yesterday').",
    },
  ]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isFinal, setIsFinal] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput("");
    
    const newMessages: MessageInfo[] = [
      ...messages,
      { role: "user", content: userMessage },
    ];
    
    setMessages(newMessages);
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        // send all messages except the first greeting (which is just UI context)
        body: JSON.stringify({ messages: newMessages.slice(1) }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to fetch");
      }

      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: data.content },
      ]);
      
      if (data.isFinal) {
        setIsFinal(true);
      }
    } catch (err: any) {
      console.error(err);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: `Error: ${err.message}` },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleRestart = () => {
    setMessages([
      {
        role: "assistant",
        content: "Hello! Let's start over. Please describe your symptoms.",
      },
    ]);
    setIsFinal(false);
    setInput("");
  };

  return (
    <div className="flex flex-col min-h-screen bg-bg-primary font-sans text-text-primary">
      {/* Header */}
      <header className="bg-bg-primary border-b border-border-light sticky top-0 z-10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-sm bg-text-primary"></div>
          <h1 className="text-lg font-bold tracking-tight text-text-primary">HealthRouter Chat</h1>
        </div>
        <button 
          onClick={handleRestart}
          className="text-xs uppercase tracking-widest font-medium text-text-secondary hover:text-text-primary transition flex items-center gap-1"
        >
          <PlusCircle className="w-4 h-4" /> Restart
        </button>
      </header>

      {/* Warning Banner */}
      <div className="bg-[#E2DDD5] border-b border-border-light px-6 py-3 flex gap-3 items-center text-text-secondary text-xs uppercase tracking-wider font-medium">
        <AlertCircle className="w-4 h-4 flex-shrink-0" />
        <p>Not for emergencies. Provides routing, not medical diagnosis.</p>
      </div>

      {/* Chat Container */}
      <main className="flex-1 flex flex-col max-w-3xl w-full mx-auto p-4 sm:p-6 pb-32">
        <div className="flex flex-col gap-6">
          {messages.map((m, idx) => (
            <div
              key={idx}
              className={`flex gap-4 mb-4 ${
                m.role === "user" ? "flex-row-reverse" : "flex-row"
              }`}
            >
              <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                m.role === "user" ? "bg-accent-blue text-white" : "bg-bg-secondary text-white"
              }`}>
                {m.role === "user" ? <User className="w-5 h-5" /> : <Stethoscope className="w-5 h-5" />}
              </div>
              
              <div className={`flex flex-col max-w-[80%] ${m.role === "user" ? "items-end" : "items-start"}`}>
                <div className={`px-6 py-4 rounded-[16px] text-base leading-relaxed whitespace-pre-wrap ${
                  m.role === "user" 
                    ? "bg-accent-blue text-white rounded-se-sm" 
                    : "bg-white border border-border-light text-text-primary rounded-ss-sm"
                }`}>
                  {m.role === "assistant" ? (
                    <div 
                      className="font-sans" 
                      dangerouslySetInnerHTML={{ 
                        __html: m.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong class="font-bold">$1</strong>')
                          .replace(/## (.*?)\n/g, '<h2 class="text-xl font-bold mt-5 mb-2 text-text-primary uppercase tracking-tight">$1</h2>\n')
                          .replace(/\n/g, '<br />') 
                      }} 
                    />
                  ) : (
                    m.content
                  )}
                </div>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex gap-4">
              <div className="w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 bg-bg-secondary text-white">
                <Stethoscope className="w-5 h-5" />
              </div>
              <div className="bg-white border border-border-light rounded-[16px] rounded-ss-sm px-6 py-5 flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-border-dark animate-bounce" style={{ animationDelay: "0ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-border-dark animate-bounce" style={{ animationDelay: "150ms" }}></div>
                <div className="w-2 h-2 rounded-full bg-border-dark animate-bounce" style={{ animationDelay: "300ms" }}></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </main>

      {/* Input Form */}
      <footer className="fixed bottom-0 left-0 right-0 bg-bg-primary border-t border-border-light p-4">
        <div className="max-w-3xl mx-auto flex gap-3">
          {isFinal ? (
            <div className="w-full text-center p-4 bg-bg-secondary rounded-md text-white font-medium text-sm">
              Consultation complete. You can click Restart to begin again.
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
                <div className="flex items-center gap-2 font-medium">Send <Send className="w-4 h-4" /></div>
              </button>
            </form>
          )}
        </div>
      </footer>
    </div>
  );
}
