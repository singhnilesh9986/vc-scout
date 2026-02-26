"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<string[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem("savedSearches");
    if (saved) {
      setSearches(JSON.parse(saved));
    }
  }, []);

  const removeSearch = (term: string) => {
    const updated = searches.filter(s => s !== term);
    setSearches(updated);
    localStorage.setItem("savedSearches", JSON.stringify(updated));
  };

  return (
    <div className="max-w-4xl space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-white mb-2">Saved Searches</h1>
        <p className="text-slate-400">Quickly re-run your frequent search queries.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {searches.length === 0 ? (
          <div className="bg-slate-900/40 p-12 rounded-2xl border border-dashed border-slate-800 text-center">
            <p className="text-slate-500 text-lg italic">No searches saved yet.</p>
          </div>
        ) : (
          searches.map((term) => (
            <div key={term} className="flex justify-between items-center bg-slate-900/40 p-6 rounded-2xl border border-slate-800/60 hover:border-slate-700 transition-colors">
              <div>
                <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-1">Search Term</span>
                <p className="text-2xl font-medium text-white">"{term}"</p>
              </div>
              <div className="flex gap-6 items-center">
                <Link 
                  href={`/companies?q=${encodeURIComponent(term)}`} 
                  className="bg-white text-black px-6 py-2.5 rounded-xl font-bold hover:bg-slate-200 transition-colors"
                >
                  Run Search →
                </Link>
                <button 
                  onClick={() => removeSearch(term)}
                  className="text-slate-500 hover:text-red-500 transition-colors p-2"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}