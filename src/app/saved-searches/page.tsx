"use client";
import { useEffect, useState } from "react";
import Link from "next/link";

export default function SavedSearchesPage() {
  const [searches, setSearches] = useState<string[]>([]);

  // Load the searches you starred on the Discover page
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
    <div className="max-w-4xl mx-auto space-y-6">
      <h1 className="text-3xl font-bold text-slate-900">Saved Searches</h1>
      <p className="text-slate-500">Quickly re-run your frequent search queries.</p>

      <div className="grid grid-cols-1 gap-4">
        {searches.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-dashed border-slate-300 text-center">
            <p className="text-slate-500 text-lg italic">No searches saved yet. Go to Discover and click the ⭐ next to the search bar!</p>
          </div>
        ) : (
          searches.map((term) => (
            <div key={term} className="flex justify-between items-center bg-white p-5 rounded-xl border border-slate-200 shadow-sm hover:border-blue-300 transition-colors">
              <div>
                <span className="text-xs font-bold text-slate-400 uppercase tracking-widest">Search Term</span>
                <p className="text-xl font-semibold text-slate-800">"{term}"</p>
              </div>
              <div className="flex gap-4 items-center">
                <Link 
                  href={`/companies?q=${encodeURIComponent(term)}`} 
                  className="bg-blue-50 text-blue-600 px-4 py-2 rounded-lg font-medium hover:bg-blue-100 transition"
                >
                  Run Search →
                </Link>
                <button 
                  onClick={() => removeSearch(term)}
                  className="text-slate-400 hover:text-red-500 transition-colors"
                  title="Delete"
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