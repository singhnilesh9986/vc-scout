"use client";

import { useEffect, useState } from "react";
import Link from "next/link";

type SavedCompany = {
  id: string | number;
  name: string;
  sector: string;
};

// This MUST match the key used in your handleAddToList function on the profile page
const STORAGE_KEY = "myList";

export default function ListsPage() {
  const [companies, setCompanies] = useState<SavedCompany[]>([]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const loadList = () => {
      try {
        const raw = window.localStorage.getItem(STORAGE_KEY);
        if (!raw) {
          setCompanies([]);
          return;
        }

        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
          // Normalize data to ensure we have the properties needed for the table
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
    };

    loadList();
    
    // Listen for storage changes in case the user saves a company in another tab
    window.addEventListener('storage', loadList);
    return () => window.removeEventListener('storage', loadList);
  }, []);

  const handleRemove = (id: string | number) => {
    const updated = companies.filter((c) => c.id !== id);
    setCompanies(updated);
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
  };

  const handleExportCsv = () => {
    if (companies.length === 0) return;

    const headers = ["Company ID", "Company Name", "Sector"];
    const rows = companies.map((c) => [c.id, c.name, c.sector]);

    const csvContent =
      [headers, ...rows]
        .map((row) => row.map((val) => `"${String(val).replace(/"/g, '""')}"`).join(","))
        .join("\n") + "\n";

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", `vc_scout_export_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-700">
      {/* HEADER SECTION */}
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white italic tracking-tighter">My Curated Lists</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Your private pipeline of high-signal opportunities.</p>
        </div>

        <button
          onClick={handleExportCsv}
          disabled={companies.length === 0}
          className={`flex items-center gap-2 px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-all
            ${companies.length > 0 
              ? "bg-white text-black hover:bg-blue-500 hover:text-white shadow-lg" 
              : "bg-slate-800 text-slate-600 cursor-not-allowed"}`}
        >
          📥 Export CSV
        </button>
      </div>

      {/* LIST TABLE */}
      <div className="bg-slate-900/30 rounded-3xl border border-slate-800/60 backdrop-blur-md overflow-hidden shadow-2xl">
        {companies.length === 0 ? (
          <div className="p-24 text-center">
            <div className="text-4xl mb-4">📂</div>
            <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">No saved companies found</p>
            <Link href="/companies" className="text-blue-500 text-sm mt-4 inline-block hover:underline font-bold">
              Return to Discovery →
            </Link>
          </div>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="bg-slate-800/30 text-slate-500 text-[11px] uppercase tracking-[0.2em] font-bold border-b border-slate-800/60">
                <th className="p-6">Entity</th>
                <th className="p-6">Sector</th>
                <th className="p-6 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/40">
              {companies.map((company) => (
                <tr key={company.id} className="hover:bg-blue-500/5 transition-all group">
                  <td className="p-6">
                    <Link href={`/companies/${company.id}`} className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">
                      {company.name}
                    </Link>
                    <div className="text-[10px] text-slate-600 font-mono mt-1">ID: {company.id}</div>
                  </td>
                  <td className="p-6">
                    <span className="text-[10px] font-black px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-400 border border-slate-700/50 uppercase tracking-widest">
                      {company.sector}
                    </span>
                  </td>
                  <td className="p-6 text-right">
                    <button
                      onClick={() => handleRemove(company.id)}
                      className="text-[10px] font-black text-slate-500 hover:text-red-500 uppercase tracking-widest transition-colors p-2"
                    >
                      [ Remove ]
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}