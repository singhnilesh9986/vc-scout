"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import companiesData from "@/data/companies.json";

function SearchFilters() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");

  useEffect(() => {
    const query = searchParams.get("q");
    if (query) setSearch(query);
  }, [searchParams]);

  const filtered = companiesData.filter((c) => {
    const matchesSearch = c.name.toLowerCase().includes(search.toLowerCase());
    const matchesSector = sectorFilter === "All" || c.sector === sectorFilter;
    return matchesSearch && matchesSector;
  });

  const handleSaveSearch = () => {
    if (!search.trim()) return;
    const existing = localStorage.getItem("savedSearches");
    const searches = existing ? JSON.parse(existing) : [];
    if (!searches.includes(search)) {
      localStorage.setItem("savedSearches", JSON.stringify([...searches, search]));
      alert(`Search for "${search}" saved!`);
    }
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8">
      <div className="flex justify-between items-end">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Market Intelligence</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Real-time sourcing and enrichment engine.</p>
        </div>
        
        <div className="flex gap-4 items-center">
          <div className="relative group">
            <input 
              type="text" 
              placeholder="Quick search..." 
              value={search}
              className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-2xl w-80 text-white outline-none focus:ring-2 focus:ring-blue-500/50 transition-all placeholder:text-slate-600"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button 
              onClick={handleSaveSearch} 
              className="absolute right-4 top-4 text-slate-500 hover:text-yellow-400 transition-colors"
              title="Save Search"
            >
              ⭐
            </button>
          </div>

          <select 
            className="bg-slate-900/50 border border-slate-800 p-3.5 rounded-2xl text-slate-300 outline-none focus:ring-2 focus:ring-blue-500/50 transition-all cursor-pointer"
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="All">All Sectors</option>
            <option value="ClimateTech">ClimateTech</option>
            <option value="Fintech">Fintech</option>
          </select>
        </div>
      </div>

      <div className="bg-slate-900/30 rounded-3xl border border-slate-800/60 backdrop-blur-md overflow-hidden shadow-2xl">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-800/30 text-slate-500 text-[11px] uppercase tracking-[0.2em] font-bold border-b border-slate-800/60">
              <th className="p-6">Company</th>
              <th className="p-6">Sector</th>
              <th className="p-6">Stage</th>
              <th className="p-6 text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/40">
            {filtered.map((company) => (
              <tr key={company.id} className="hover:bg-blue-500/5 transition-all duration-200 group">
                <td className="p-6">
                  <div className="font-bold text-white text-lg group-hover:text-blue-400 transition-colors">{company.name}</div>
                  <div className="text-xs text-slate-500 font-mono mt-0.5 uppercase tracking-tighter">ID: {company.id}</div>
                </td>
                <td className="p-6">
                  <span className="text-xs font-bold px-3 py-1.5 rounded-lg bg-slate-800/80 text-slate-300 border border-slate-700/50 uppercase tracking-wider">
                    {company.sector}
                  </span>
                </td>
                <td className="p-6">
                  <span className={`text-[10px] font-black px-3 py-1 rounded-full border uppercase tracking-widest
                    ${company.stage === 'Seed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      company.stage === 'Series A' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    ● {company.stage}
                  </span>
                </td>
                <td className="p-6 text-right">
                  <Link 
                    href={`/companies/${company.id}`} 
                    className="inline-flex items-center gap-2 bg-white text-slate-950 px-5 py-2.5 rounded-xl text-xs font-black hover:bg-blue-500 hover:text-white transition-all transform active:scale-95 shadow-lg shadow-white/5"
                  >
                    ANALYZE <span>→</span>
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="text-white">Loading Intelligence...</div>}>
      <SearchFilters />
    </Suspense>
  );
}