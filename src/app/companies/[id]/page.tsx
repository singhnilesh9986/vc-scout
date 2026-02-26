"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import companiesData from "@/data/companies.json";

export default function CompanyProfile() {
  const { id } = useParams();
  const [isEnriching, setIsEnriching] = useState(false);
  const [enrichedData, setEnrichedData] = useState<any>(null);
  const [note, setNote] = useState("");

 
  const company = companiesData.find((c) => c.id === id) || companiesData[0];

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("companyNotes") || "{}");
    if (savedNotes[id as string]) setNote(savedNotes[id as string]);

    const cachedEnrichment = localStorage.getItem(`enrichment_${id}`);
    if (cachedEnrichment) setEnrichedData(JSON.parse(cachedEnrichment));
  }, [id]);

  const handleSaveNote = () => {
    
    const savedNotes = JSON.parse(localStorage.getItem("companyNotes") || "{}");
    savedNotes[id as string] = note;
    localStorage.setItem("companyNotes", JSON.stringify(savedNotes));
    alert("Intelligence Note Persisted.");
  };

  const handleEnrich = async () => {
    setIsEnriching(true);
    try {
      const response = await fetch("/api/enrich", {
        method: "POST",
        body: JSON.stringify({ url: company.website }),
      });
      const data = await response.json();
      
      setEnrichedData(data);
      localStorage.setItem(`enrichment_${id}`, JSON.stringify(data));
    } catch (error) {
      console.error("Enrichment failed", error);
    } finally {
      setIsEnriching(false);
    }
  };

  const handleAddToList = () => {
    const existingList = JSON.parse(localStorage.getItem("myList") || "[]");
    const alreadyExists = existingList.some((item: any) => item.id === company.id);
    
    if (alreadyExists) {
      alert(`${company.name} is already in your list!`);
    } else {
      const updatedList = [...existingList, company];
      localStorage.setItem("myList", JSON.stringify(updatedList));
      alert(`Success: ${company.name} added to My Lists.`);
    }
  };


  const signals = [
    { date: "Feb 2024", event: "Series A Extension - $12M", type: "Funding" },
    { date: "Jan 2024", event: "Careers page updated (5 new roles)", type: "Hiring" },
    { date: "Nov 2023", event: "Technical blog post: Scaling AI Infra", type: "Content" },
  ];

  return (
    <div className="max-w-7xl mx-auto space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      <div className="bg-slate-900/40 border border-slate-800 p-8 rounded-3xl backdrop-blur-xl flex justify-between items-center shadow-2xl">
        <div>
          <div className="flex items-center gap-4 mb-2">
            <h1 className="text-5xl font-black text-white italic tracking-tighter">{company.name}</h1>
            <span className={`px-4 py-1 rounded-full text-[10px] font-black uppercase tracking-[0.2em] border shadow-lg
              ${company.stage === 'Seed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-blue-500/10 text-blue-400 border-blue-500/20'}`}>
              {company.stage}
            </span>
          </div>
          <p className="text-slate-500 font-mono text-sm">{company.website} • {company.sector}</p>
        </div>
        
        <div className="flex gap-4">
          <button 
            onClick={handleEnrich}
            disabled={isEnriching}
            className={`px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all 
              ${isEnriching ? 'bg-slate-800 text-slate-600 cursor-not-allowed' : 'bg-blue-600 text-white hover:bg-blue-500 shadow-[0_0_20px_rgba(37,99,235,0.3)] hover:scale-105'}`}
          >
            {isEnriching ? "Enriching Pipeline..." : "✦ Enrich Intelligence"}
          </button>
          <button 
            onClick={handleAddToList}
            className="bg-slate-800 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-700 transition-all active:scale-95"
          >
            📂 Save to List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
     
        <div className="lg:col-span-2 space-y-8">
          
          <div className="bg-[#020617] border border-slate-800 rounded-[2rem] p-8 shadow-inner relative overflow-hidden">
            <h3 className="text-slate-500 uppercase text-[10px] font-black tracking-[0.3em] mb-8 flex items-center gap-3">
              <span className={`h-2 w-2 rounded-full ${isEnriching ? 'bg-blue-500 animate-ping' : 'bg-slate-700'}`} />
              Live AI Extraction
            </h3>

            {isEnriching ? (
              <div className="space-y-6 animate-pulse">
                <div className="h-8 bg-slate-900 rounded-lg w-3/4" />
                <div className="grid grid-cols-2 gap-4">
                  <div className="h-24 bg-slate-900 rounded-2xl" />
                  <div className="h-24 bg-slate-900 rounded-2xl" />
                </div>
              </div>
            ) : enrichedData ? (
              <div className="space-y-8">
                <p className="text-2xl text-white font-medium leading-relaxed italic">"{enrichedData.summary}"</p>
                <div className="grid grid-cols-2 gap-4">
                  {enrichedData.bullets.map((b: string, i: number) => (
                    <div key={i} className="bg-slate-900/50 p-5 rounded-2xl border border-slate-800/50 text-slate-300 text-sm">
                      <span className="text-blue-500 mr-2">✦</span> {b}
                    </div>
                  ))}
                </div>
                <div className="pt-6 border-t border-slate-800/50 text-[10px] text-slate-600 font-mono">
                  SOURCE: {company.website} | FETCHED: {new Date().toISOString()}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-slate-800/50 rounded-3xl text-slate-600 font-bold uppercase text-xs tracking-widest">
                No data fetched yet.
              </div>
            )}
          </div>

         
          <div className="bg-slate-900/20 border border-slate-800 rounded-[2rem] p-8">
            <h3 className="text-slate-500 uppercase text-[10px] font-black tracking-[0.3em] mb-10">Signals Trail</h3>
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[19px] before:w-[2px] before:bg-gradient-to-b before:from-blue-500 before:to-transparent">
              {signals.map((s, i) => (
                <div key={i} className="relative pl-14 group">
                  <div className="absolute left-0 mt-1 h-10 w-10 rounded-full bg-[#020617] border-2 border-slate-800 flex items-center justify-center z-10 group-hover:border-blue-500 transition-colors">
                    <div className="h-2 w-2 rounded-full bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.5)]" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-600 uppercase tracking-widest">{s.date} • {s.type}</span>
                    <p className="text-white text-lg font-bold group-hover:text-blue-400 transition-colors">{s.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

    
        <div className="space-y-8">
       
          <div className="bg-slate-900/40 border border-slate-800 rounded-[2rem] p-8 flex flex-col h-full">
            <h3 className="text-slate-500 uppercase text-[10px] font-black tracking-[0.3em] mb-6">Investment Thesis</h3>
            <textarea 
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Start typing internal context..."
              className="flex-1 min-h-[300px] bg-transparent text-slate-300 outline-none resize-none placeholder:text-slate-800 font-medium leading-relaxed"
            />
            <button 
              onClick={handleSaveNote}
              className="w-full bg-white text-black py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-6 hover:bg-blue-500 hover:text-white transition-all shadow-xl shadow-white/5"
            >
              Save Notes  
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}