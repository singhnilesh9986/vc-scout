import "./globals.css";
import Link from "next/link";

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="flex h-screen bg-[#020617] text-slate-300 antialiased">
        
        
        <aside className="w-64 bg-[#020617] border-r border-slate-800/60 flex flex-col h-screen sticky top-0 shadow-2xl">
          <div className="p-8 border-b border-slate-800/40">
            <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <span className="text-blue-500 text-3xl">◈</span>
              VC SCOUT
            </h1>
            <p className="text-[10px] text-slate-500 font-bold uppercase tracking-[0.2em] mt-1">
              Intelligence Engine
            </p>
          </div>
          
          <nav className="flex-1 p-4 mt-4 space-y-1.5">
            <Link 
              href="/companies" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all duration-200 group font-medium"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">🔍</span> 
              <span>Discover</span>
            </Link>
            
            <Link 
              href="/lists" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all duration-200 group font-medium"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">📂</span> 
              <span>My Lists</span>
            </Link>
            
            <Link 
              href="/saved-searches" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all duration-200 group font-medium"
            >
              <span className="text-lg group-hover:scale-110 transition-transform duration-200">⭐</span> 
              <span>Saved Searches</span>
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-800/40">
            <div className="flex items-center gap-3 px-2 py-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-blue-600 to-indigo-600 flex items-center justify-center text-white text-xs font-bold">
                JD
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Scout Mode</p>
                <p className="text-[10px] text-slate-500 truncate">Connected to LLM</p>
              </div>
            </div>
          </div>
        </aside>
        
        <main className="flex-1 overflow-auto bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-slate-900/20 via-[#020617] to-[#020617]">
          <div className="p-8 min-h-screen">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}