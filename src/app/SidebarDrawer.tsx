"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";

type SavedCompany = {
  id: string | number;
  name: string;
  sector: string;
};

const STORAGE_KEY = "myList";

export default function SidebarDrawer() {
  const [isOpen, setIsOpen] = useState(false);
  const [isClosing, setIsClosing] = useState(false);
  const [companies, setCompanies] = useState<SavedCompany[]>([]);

  const loadList = useCallback(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(STORAGE_KEY);
      if (!raw) {
        setCompanies([]);
        return;
      }
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        const normalized: SavedCompany[] = parsed.map((c: any) => ({
          id: c.id ?? c.name,
          name: c.name || "Unknown Company",
          sector: c.sector || "General",
        }));
        setCompanies(normalized);
      }
    } catch (error) {
      console.error("Failed to load saved companies", error);
    }
  }, []);

  useEffect(() => {
    loadList();
    window.addEventListener("storage", loadList);
    return () => window.removeEventListener("storage", loadList);
  }, [loadList]);

  const openDrawer = () => {
    loadList(); // Refresh on open
    setIsClosing(false);
    setIsOpen(true);
  };

  const closeDrawer = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsOpen(false);
      setIsClosing(false);
    }, 250);
  };

  const handleRemove = (id: string | number) => {
    const updated = companies.filter((c) => c.id !== id);
    setCompanies(updated);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  return (
    <>
      {/* Trigger Button in Sidebar */}
      <button
        onClick={openDrawer}
        className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-[#0D0E12] border border-transparent hover:border-purple-900/30 hover:text-white transition-all font-semibold text-sm w-full text-left text-slate-300 cursor-pointer"
      >
        <span>📂</span> My Lists
      </button>

      {/* Drawer Overlay */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex">
          {/* Backdrop */}
          <div
            className={`absolute inset-0 bg-black/60 backdrop-blur-sm ${isClosing ? "backdrop-exit" : "backdrop-enter"}`}
            onClick={closeDrawer}
          />

          {/* Drawer Panel */}
          <div
            className={`relative w-[420px] max-w-[90vw] h-full bg-[#0A0B0F] border-r border-purple-900/40 shadow-2xl shadow-purple-500/5 flex flex-col ${isClosing ? "drawer-exit" : "drawer-enter"}`}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-purple-900/20">
              <div>
                <h2 className="text-xl font-black text-white tracking-tight flex items-center gap-2">
                  <span className="text-purple-400">◈</span>
                  My Curated Lists
                </h2>
                <p className="text-[11px] text-slate-500 font-mono mt-1 uppercase tracking-widest">
                  {companies.length} saved {companies.length === 1 ? "entity" : "entities"}
                </p>
              </div>
              <button
                onClick={closeDrawer}
                className="h-9 w-9 rounded-xl bg-[#0D0E12] border border-purple-900/30 hover:border-purple-500/50 hover:bg-purple-500/10 flex items-center justify-center text-slate-400 hover:text-white transition-all cursor-pointer"
              >
                ✕
              </button>
            </div>

            {/* Company List */}
            <div className="flex-1 overflow-y-auto p-4 space-y-2.5">
              {companies.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-center px-8">
                  <div className="h-16 w-16 rounded-2xl bg-[#0D0E12] border border-purple-900/30 flex items-center justify-center text-3xl mb-5">
                    📂
                  </div>
                  <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-[10px] mb-2">
                    No saved companies
                  </p>
                  <p className="text-slate-600 text-xs leading-relaxed">
                    Search and add companies from the Discover pipeline to build your watchlist.
                  </p>
                </div>
              ) : (
                companies.map((company, index) => (
                  <div
                    key={company.id}
                    style={{ animationDelay: `${index * 50}ms` }}
                    className="animate-slide-fade-in group flex items-center gap-3 p-4 rounded-2xl bg-[#0D0E12] border border-purple-900/20 hover:border-purple-500/40 hover:shadow-[0_0_20px_rgba(139,92,246,0.08)] transition-all"
                  >
                    <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 border border-purple-500/20 flex items-center justify-center text-purple-400 font-black text-sm flex-shrink-0">
                      {company.name.charAt(0)}
                    </div>
                    <div className="flex-1 overflow-hidden">
                      <Link
                        href={`/companies/${company.id}`}
                        onClick={closeDrawer}
                        className="font-bold text-white text-sm group-hover:text-purple-400 transition-colors truncate block"
                      >
                        {company.name}
                      </Link>
                      <span className="text-[9px] text-slate-500 font-mono uppercase tracking-widest">
                        {company.sector}
                      </span>
                    </div>
                    <button
                      onClick={() => handleRemove(company.id)}
                      className="text-[9px] font-black text-slate-600 hover:text-red-400 uppercase tracking-widest transition-colors p-1.5 cursor-pointer"
                    >
                      ✕
                    </button>
                  </div>
                ))
              )}
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-purple-900/20">
              <Link
                href="/lists"
                onClick={closeDrawer}
                className="w-full text-center block bg-[#0D0E12] hover:bg-purple-600 border border-purple-900/30 hover:border-purple-500/60 text-slate-300 hover:text-white py-3 rounded-xl text-[10px] font-black tracking-widest transition-all uppercase font-mono"
              >
                [ OPEN FULL LIST VIEW ]
              </Link>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
