import { Settings, Lock, Download, ShieldCheck } from "lucide-react";
import Link from 'next/link';

export default function SettingsPage() {
  return (
    <div className="min-h-screen bg-bg-primary font-sans text-text-primary px-6 py-12 md:py-24">
      <div className="max-w-2xl mx-auto bg-white rounded-[24px] border border-border-light shadow-sm overflow-hidden">
        
        <header className="px-8 py-6 border-b border-border-light flex justify-between items-center bg-bg-primary">
          <div className="flex items-center gap-3">
             <Settings className="w-5 h-5" />
             <h1 className="text-2xl font-black tracking-tight">Settings & Privacy</h1>
          </div>
          <Link href="/chat" className="text-sm font-bold uppercase tracking-wide text-text-secondary hover:text-text-primary">
            Back to Chat
          </Link>
        </header>
        
        <div className="p-8">
          <section className="mb-10">
             <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-text-secondary mb-4 flex items-center gap-2">
                <ShieldCheck className="w-4 h-4" /> Data Tracking & Analytics
             </h2>
             <div className="bg-bg-card p-6 rounded-[16px] flex justify-between items-center">
                <div>
                   <h3 className="font-bold text-lg">Allow Usage Analytics</h3>
                   <p className="text-text-secondary text-sm mt-1">Help us improve by sharing anonymous usage info.</p>
                </div>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input type="checkbox" className="sr-only peer" defaultChecked />
                  <div className="w-11 h-6 bg-border-dark rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-blue"></div>
                </label>
             </div>
          </section>

          <section>
             <h2 className="text-xs font-bold uppercase tracking-[0.1em] text-text-secondary mb-4 flex items-center gap-2">
                <Lock className="w-4 h-4" /> Export & Privacy
             </h2>
             <div className="flex flex-col gap-4">
               <button className="bg-white border border-border-light hover:bg-gray-50 flex items-center justify-between p-4 rounded-md font-medium text-left transition">
                  <div className="flex flex-col gap-1">
                     <span className="font-bold">Export Chat History</span>
                     <span className="text-sm text-text-secondary">Download all your previous guidance logs as JSON/CSV.</span>
                  </div>
                  <Download className="w-5 h-5 text-text-secondary" />
               </button>
             </div>
          </section>

          <div className="mt-12 text-center text-xs uppercase tracking-widest text-text-secondary font-bold">
            Powered by Supabase + Vercel Analytics
          </div>
        </div>
      </div>
    </div>
  );
}