import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VC Scout | Intelligence Engine",
  description: "Premium Venture Sourcing Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex h-screen bg-[#020617] text-slate-300 antialiased overflow-hidden`}>
        
        <aside className="w-64 bg-[#020617] border-r border-slate-800/60 flex flex-col h-screen z-20">
          <div className="p-8 border-b border-slate-800/40">
            <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <span className="text-blue-500 text-3xl">◈</span>
              VC SCOUT
            </h1>
          </div>
          
          <nav className="flex-1 p-4 mt-6 space-y-4">
            <Link href="/companies" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all font-medium">
              <span>🔍</span> Discover
            </Link>
            
            <Link href="/lists" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all font-medium">
              <span>📂</span> My Lists
            </Link>

            <Link href="/saved-searches" className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-slate-800/50 hover:text-white transition-all font-medium">
              <span>⭐</span> Saved Searches
            </Link>
          </nav>

          <div className="p-4 border-t border-slate-800/40">
            <div className="flex items-center gap-3 px-2 py-3 bg-slate-900/40 rounded-xl border border-slate-800/50">
              <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center text-white text-xs font-bold">JD</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Scout Mode</p>
                <p className="text-[10px] text-slate-500">Connected</p>
              </div>
            </div>
          </div>
        </aside>
        
        <main className="flex-1 overflow-auto bg-[#020617]">
          <div className="p-8 min-h-screen">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}