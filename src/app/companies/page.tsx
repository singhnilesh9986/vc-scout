"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

function TickerFeed() {
  const initialSignals = [
    "EcoAI sentiment score increased by 14% this morning.",
    "FinTech seed-stage velocity spiking in EU market.",
    "AI agents developer interest up 42% week-over-week.",
    "Scope 3 emissions accounting carbon compliance demand rising.",
    "Series A round sizes expanding in SaaS sector.",
    "Autonomous robotics pre-seed activity clustering in Boston.",
    "Payroll automations reporting 98% retention rates."
  ];

  const [signals, setSignals] = useState(initialSignals);

  useEffect(() => {
    const interval = setInterval(() => {
      setSignals((prev) => {
        const next = [...prev];
        const first = next.shift();
        if (first) next.push(first);
        return next;
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex-1 overflow-hidden relative min-h-[180px]">
      <div className="space-y-4 font-mono text-xs text-slate-400">
        {signals.slice(0, 4).map((signal, idx) => (
          <div 
            key={signal} 
            className={`p-3.5 bg-[#0D0E12] border border-purple-900/30 rounded-xl flex gap-2.5 items-start transition-all duration-700 animate-in fade-in slide-in-from-right-3
              ${idx === 0 ? "border-purple-500/40 text-purple-350 bg-purple-950/10 shadow-[0_0_15px_rgba(139,92,246,0.05)]" : ""}`}
          >
            <span className={`text-[10px] ${idx === 0 ? "text-purple-400 font-bold" : "text-slate-650"}`}>
              {idx === 0 ? "◈" : "▷"}
            </span>
            <p className="leading-relaxed flex-1">{signal}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

function SearchFilters() {
  const searchParams = useSearchParams();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [sectorFilter, setSectorFilter] = useState("All");
  const [companies, setCompanies] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  // Sync with URL query parameter if present
  useEffect(() => {
    const query = searchParams.get("q");
    if (query !== null) {
      setSearch(query);
      setDebouncedSearch(query);
    }
  }, [searchParams]);

  // Debounce search input changes to avoid hammering the API
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(search);
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Fetch search results dynamically
  useEffect(() => {
    let active = true;
    const fetchCompanies = async () => {
      setIsLoading(true);
      try {
        const queryParam = encodeURIComponent(debouncedSearch);
        const sectorParam = encodeURIComponent(sectorFilter);
        const res = await fetch(`/api/search?q=${queryParam}&sector=${sectorParam}`);
        if (!res.ok) throw new Error("Search failed");
        const data = await res.json();
        if (active) {
          setCompanies(data);
        }
      } catch (err) {
        console.error("Failed to fetch search results:", err);
      } finally {
        if (active) {
          setIsLoading(false);
        }
      }
    };

    fetchCompanies();

    return () => {
      active = false;
    };
  }, [debouncedSearch, sectorFilter]);

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
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6">
        <div>
          <h1 className="text-4xl font-black text-white tracking-tight">Market Intelligence</h1>
          <p className="text-slate-500 mt-2 text-lg font-medium">Real-time sourcing and enrichment engine.</p>
        </div>
        
        <div className="flex flex-wrap gap-4 items-center w-full md:w-auto">
          {/* Refined Terminal Search Box */}
          <div className="relative flex-1 md:flex-initial flex items-center bg-[#0D0E12] border border-purple-900/40 rounded-2xl w-full md:w-80 px-4 focus-within:border-purple-500/50 focus-within:ring-2 focus-within:ring-purple-500/25 transition-all">
            <svg className="h-4 w-4 text-slate-500 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <input 
              type="text" 
              placeholder="Search companies..." 
              value={search}
              className="bg-transparent border-none py-3.5 w-full text-white outline-none placeholder:text-slate-600 font-medium text-sm"
              onChange={(e) => setSearch(e.target.value)}
            />
            <button 
              onClick={handleSaveSearch} 
              className="text-slate-500 hover:text-yellow-400 transition-colors p-1"
              title="Save Search"
            >
              ⭐
            </button>
          </div>

          <select 
            className="bg-[#0D0E12] border border-purple-900/40 p-3.5 rounded-2xl text-slate-300 outline-none focus:ring-2 focus:ring-purple-500/25 focus:border-purple-500/50 transition-all cursor-pointer font-semibold text-sm"
            value={sectorFilter}
            onChange={(e) => setSectorFilter(e.target.value)}
          >
            <option value="All">All Sectors</option>
            <option value="ClimateTech">ClimateTech</option>
            <option value="Fintech">Fintech</option>
            <option value="AI">AI</option>
          </select>
        </div>
      </div>

      {isLoading ? (
        // Skeleton grid loader
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, idx) => (
            <div key={idx} className="bg-gradient-to-br from-[#0D0E12] to-[#090D10] border border-purple-900/20 rounded-3xl p-6 space-y-5 animate-pulse">
              <div className="flex gap-4">
                <div className="h-12 w-12 bg-slate-800 rounded-xl" />
                <div className="flex-1 space-y-2 py-1">
                  <div className="h-4 bg-slate-800 rounded w-3/4" />
                  <div className="h-3 bg-slate-800 rounded w-1/2" />
                </div>
              </div>
              <div className="h-16 bg-slate-800/40 rounded-xl w-full" />
              <div className="flex gap-3 pt-2">
                <div className="h-6 bg-slate-800/60 rounded-md w-20" />
                <div className="h-6 bg-slate-800/60 rounded-md w-16" />
              </div>
              <div className="h-10 bg-slate-800 rounded-xl w-full pt-1" />
            </div>
          ))}
        </div>
      ) : companies.length === 0 ? (
        <div className="bg-[#0D0E12]/40 border border-purple-900/30 rounded-3xl p-24 text-center">
          <p className="text-slate-500 font-bold uppercase tracking-[0.2em] text-xs">No companies found</p>
        </div>
      ) : (
        // Staggered Cards Grid
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {companies.map((company, index) => (
            <div 
              key={company.id} 
              style={{ animationDelay: `${index * 60}ms` }}
              className="animate-slide-fade-in bg-gradient-to-br from-[#0D0E12] to-[#090D10] border border-purple-900/40 rounded-3xl p-6 flex flex-col justify-between hover:border-purple-500/50 hover:shadow-[0_0_30px_rgba(139,92,246,0.12)] hover:-translate-y-1 transition-all duration-300 group"
            >
              <div className="space-y-4">
                <div className="flex items-center gap-4">
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 border border-purple-500/20 group-hover:border-purple-500/40 flex items-center justify-center text-purple-400 group-hover:text-purple-300 font-black text-xl shadow-lg transition-all">
                    {company.name.charAt(0)}
                  </div>
                  <div className="overflow-hidden">
                    <h3 className="font-bold text-white text-lg tracking-tight group-hover:text-purple-400 transition-colors truncate">{company.name}</h3>
                    <span className="text-[10px] text-slate-505 font-mono block truncate">ID: {company.id}</span>
                  </div>
                </div>

                <p className="text-slate-400 text-sm font-medium leading-relaxed line-clamp-3">
                  {company.description}
                </p>
              </div>

              <div className="space-y-5 pt-5 mt-4 border-t border-purple-900/20">
                <div className="flex gap-2.5 flex-wrap">
                  <span className="text-[9px] font-black px-2.5 py-1 rounded-md bg-[#0D0E12] text-slate-400 border border-purple-900/30 uppercase tracking-widest">
                    {company.sector}
                  </span>
                  <span className={`text-[9px] font-black px-2.5 py-1 rounded-md border uppercase tracking-widest
                    ${company.stage === 'Seed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 
                      company.stage === 'Series A' ? 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20' : 
                      'bg-amber-500/10 text-amber-400 border-amber-500/20'}`}>
                    ● {company.stage}
                  </span>
                </div>

                <Link 
                  href={`/companies/${company.id}`} 
                  className="w-full text-center block bg-[#0D0E12] hover:bg-purple-600 border border-purple-900/30 group-hover:border-purple-500/60 text-slate-300 group-hover:text-white py-3 rounded-xl text-xs font-black tracking-widest transition-all uppercase font-mono shadow-md"
                >
                  [ VIEW INTEL ]
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Market Trends Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-16 pt-8 border-t border-purple-900/40 animate-in fade-in duration-700">
        {/* Funding Activity Chart */}
        <div className="lg:col-span-2 bg-gradient-to-br from-[#0D0E12] to-[#090D10] border border-purple-900/40 rounded-3xl p-6 flex flex-col justify-between">
          <div>
            <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs mb-2">Funding Activity Trend</h3>
            <p className="text-slate-500 text-sm font-medium mb-6">Total Venture Funding across core sectors (Q2 2026).</p>
          </div>
          
          <div className="flex justify-around items-end h-48 px-4 border-b border-purple-900/20 pb-2">
            {[
              { sector: "AI", amount: 4.2, percentage: "85%", color: "from-purple-500/80 to-indigo-600/90" },
              { sector: "ClimateTech", amount: 2.8, percentage: "57%", color: "from-emerald-500/80 to-teal-600/90" },
              { sector: "Fintech", amount: 3.5, percentage: "72%", color: "from-blue-500/80 to-cyan-600/90" },
              { sector: "SaaS", amount: 1.9, percentage: "39%", color: "from-amber-500/80 to-orange-600/90" },
            ].map((bar, i) => (
              <div key={i} className="flex flex-col items-center group w-1/4">
                <div className="opacity-0 group-hover:opacity-100 transition-opacity bg-slate-900 border border-slate-800/85 text-white text-[10px] font-mono py-1.5 px-2.5 rounded-lg mb-2 shadow-xl translate-y-1 group-hover:-translate-y-0 transition-transform duration-200">
                  ${bar.amount}B
                </div>
                <div className="w-12 bg-[#0D0E12] rounded-t-xl relative overflow-hidden flex items-end h-36 border border-purple-900/20">
                  <div 
                    className={`w-full bg-gradient-to-t ${bar.color} rounded-t-xl transition-all duration-1000 origin-bottom`}
                    style={{ height: bar.percentage }}
                  />
                </div>
                <span className="text-xs font-mono font-bold text-slate-400 mt-3">{bar.sector}</span>
                <span className="text-[10px] font-mono text-slate-500 mt-0.5">${bar.amount}B</span>
              </div>
            ))}
          </div>
        </div>

        {/* Live Ticker Feed */}
        <div className="bg-gradient-to-br from-[#0D0E12] to-[#090D10] border border-purple-900/40 rounded-3xl p-6 flex flex-col">
          <div className="mb-4">
            <div className="flex items-center gap-2 mb-2">
              <span className="h-2 w-2 rounded-full bg-red-500 animate-pulse" />
              <h3 className="text-slate-400 font-bold uppercase tracking-[0.2em] text-xs">Recent Scout Signals</h3>
            </div>
            <p className="text-slate-500 text-sm font-medium">Real-time velocity and sentiment shifts.</p>
          </div>

          <TickerFeed />
        </div>
      </div>
    </div>
  );
}

export default function CompaniesPage() {
  return (
    <Suspense fallback={<div className="text-white font-mono">Loading Intelligence...</div>}>
      <SearchFilters />
    </Suspense>
  );
}