import "./globals.css";
import Link from "next/link";
import { Inter } from "next/font/google";
import SidebarDrawer from "./SidebarDrawer";

const inter = Inter({ subsets: ["latin"] });

export const metadata = {
  title: "VC Scout | Intelligence Engine",
  description: "Premium Venture Sourcing Platform",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className="dark">
      <body className={`${inter.className} flex h-screen bg-[#050709] text-slate-300 antialiased overflow-hidden`}>
        
        <aside className="w-64 bg-[#050709] border-r border-purple-900/20 flex flex-col h-screen z-20 flex-shrink-0">
          <div className="p-8 border-b border-purple-900/20">
            <h1 className="text-2xl font-black text-white tracking-tighter flex items-center gap-2">
              <span className="text-purple-500 text-3xl">◈</span>
              VC SCOUT
            </h1>
          </div>
          
          <nav className="flex-1 p-4 mt-6 space-y-3">
            <Link 
              href="/" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#0D0E12] border border-transparent hover:border-purple-900/30 hover:text-white transition-all font-semibold text-sm"
            >
              <span>🔍</span> Discover
            </Link>
            
            {/* My Lists button triggers the sidebar drawer via client component */}
            <SidebarDrawer />

            <Link 
              href="/saved-searches" 
              className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#0D0E12] border border-transparent hover:border-purple-900/30 hover:text-white transition-all font-semibold text-sm"
            >
              <span>⭐</span> Saved Searches
            </Link>
          </nav>

          <div className="p-4 border-t border-purple-900/20">
            <div className="flex items-center gap-3 px-3 py-3 bg-[#0D0E12] rounded-2xl border border-purple-900/30">
              <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-purple-600 to-indigo-600 flex items-center justify-center text-white text-xs font-black">JD</div>
              <div className="flex-1 overflow-hidden">
                <p className="text-xs font-bold text-white truncate">Scout Mode</p>
                <p className="text-[10px] text-purple-400 font-mono tracking-tight uppercase">Connected</p>
              </div>
            </div>
          </div>
        </aside>
        
        <main className="flex-1 overflow-auto bg-[#050709]">
          <div className="p-8 min-h-screen">
            {children}
          </div>
        </main>
      </body>
    </html>
  );
}