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

  // Typewriter Animation States
  const [typedSummary, setTypedSummary] = useState("");
  const [visibleBullets, setVisibleBullets] = useState<string[]>([]);
  const [activeBulletIndex, setActiveBulletIndex] = useState(-1);
  const [typedActiveBullet, setTypedActiveBullet] = useState("");
  const [keywordsVisible, setKeywordsVisible] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  // Reconstruct company metadata from dynamic ID or hardcoded ID
  const company = (() => {
    const stringId = id as string;
    if (stringId && stringId.startsWith("dyn-")) {
      const parts = stringId.split("-");
      const name = decodeURIComponent(parts[1] || "");
      const sector = decodeURIComponent(parts[2] || "");
      const stage = decodeURIComponent(parts[3] || "");
      
      const domainName = name.toLowerCase().replace(/[^a-z0-9]/g, "") || "company";
      const website = `https://${domainName}.com`;
      
      let description = "";
      if (sector === "ClimateTech") {
        description = `Leveraging advanced engineering and data analytics to optimize carbon offsets and drive sustainability for ${name}.`;
      } else if (sector === "Fintech") {
        description = `Next-generation financial infrastructure by ${name} designed to streamline payments and automate payroll workflows.`;
      } else if (sector === "AI") {
        description = `Building cognitive agents and scalable neural processing models at ${name} to solve complex enterprise intelligence challenges.`;
      } else {
        description = `Innovative platform by ${name} specialized in the sector, leveraging proprietary technology to solve core market inefficiencies.`;
      }

      return {
        id: stringId,
        name,
        website,
        sector,
        stage,
        description
      };
    }
    return companiesData.find((c) => c.id === id) || companiesData[0];
  })();

  useEffect(() => {
    const savedNotes = JSON.parse(localStorage.getItem("companyNotes") || "{}");
    if (savedNotes[id as string]) setNote(savedNotes[id as string]);

    const cachedEnrichment = localStorage.getItem(`enrichment_${id}`);
    if (cachedEnrichment) setEnrichedData(JSON.parse(cachedEnrichment));
  }, [id]);

  // Typewriter sequence trigger
  useEffect(() => {
    if (!enrichedData) {
      setTypedSummary("");
      setVisibleBullets([]);
      setActiveBulletIndex(-1);
      setTypedActiveBullet("");
      setKeywordsVisible(false);
      setIsAnimating(false);
      return;
    }

    setIsAnimating(true);
    setTypedSummary("");
    setVisibleBullets([]);
    setActiveBulletIndex(-1);
    setTypedActiveBullet("");
    setKeywordsVisible(false);

    const summaryText = enrichedData.summary || "";
    let summaryIndex = 0;
    let summaryInterval: any;

    const startSummaryTyping = () => {
      summaryInterval = setInterval(() => {
        if (summaryIndex < summaryText.length) {
          setTypedSummary((prev) => prev + summaryText.charAt(summaryIndex));
          summaryIndex++;
        } else {
          clearInterval(summaryInterval);
          // Start typing bullets after a short delay
          setTimeout(startBulletsTyping, 200);
        }
      }, 10); // Typing speed: 10ms per char
    };

    const startBulletsTyping = () => {
      const bullets = enrichedData.bullets || [];
      if (bullets.length === 0) {
        setKeywordsVisible(true);
        setIsAnimating(false);
        return;
      }

      let bulletIdx = 0;
      let charIdx = 0;
      let activeText = "";
      
      setActiveBulletIndex(0);

      const typeNextBulletChar = () => {
        const currentBulletText = bullets[bulletIdx];
        if (charIdx < currentBulletText.length) {
          activeText += currentBulletText.charAt(charIdx);
          setTypedActiveBullet(activeText);
          charIdx++;
          setTimeout(typeNextBulletChar, 8); // Fast typing for bullets
        } else {
          // Bullet complete, add to finished list
          setVisibleBullets((prev) => [...prev, currentBulletText]);
          setTypedActiveBullet("");
          bulletIdx++;
          
          if (bulletIdx < bullets.length) {
            charIdx = 0;
            activeText = "";
            setActiveBulletIndex(bulletIdx);
            setTimeout(typeNextBulletChar, 150); // Pause between bullets
          } else {
            // All bullets typed
            setActiveBulletIndex(-1);
            setKeywordsVisible(true);
            setIsAnimating(false);
          }
        }
      };

      typeNextBulletChar();
    };

    startSummaryTyping();

    return () => {
      clearInterval(summaryInterval);
    };
  }, [enrichedData]);

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
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ 
          url: company.website,
          name: company.name,
          sector: company.sector
        }),
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
      
      {/* Top Profile Card */}
      <div className="bg-[#0D0E12] border border-purple-900/40 p-8 rounded-3xl flex flex-col md:flex-row justify-between items-start md:items-center gap-6 shadow-2xl">
        <div className="flex items-center gap-5">
          <div className="h-16 w-16 rounded-2xl bg-gradient-to-tr from-purple-500/10 to-indigo-500/10 border border-purple-500/35 flex items-center justify-center text-purple-400 font-black text-3xl shadow-lg">
            {company.name.charAt(0)}
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-3 mb-1.5">
              <h1 className="text-4xl font-black text-white italic tracking-tighter">{company.name}</h1>
              <span className={`px-3 py-0.5 rounded-full text-[9px] font-black uppercase tracking-widest border shadow-md
                ${company.stage === 'Seed' ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' : 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20'}`}>
                {company.stage}
              </span>
            </div>
            <p className="text-slate-500 font-mono text-sm">{company.website} • {company.sector}</p>
          </div>
        </div>
        
        <div className="flex gap-4 w-full md:w-auto">
          <button 
            onClick={handleEnrich}
            disabled={isEnriching}
            className={`flex-1 md:flex-initial px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest transition-all 
              ${isEnriching 
                ? 'bg-[#0D0E12] text-slate-500 border border-purple-900/20 cursor-not-allowed' 
                : 'bg-purple-600 text-white hover:bg-purple-500 border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.25)] hover:scale-105 cursor-pointer'}`}
          >
            {isEnriching ? "Enriching Pipeline..." : "✦ Enrich Intelligence"}
          </button>
          <button 
            onClick={handleAddToList}
            className="bg-[#0D0E12] border border-purple-900/30 text-white px-8 py-4 rounded-2xl font-black text-xs uppercase tracking-widest hover:bg-slate-900 hover:border-purple-900/40 transition-all active:scale-95 cursor-pointer"
          >
            📂 Save to List
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Main Content Area */}
        <div className="lg:col-span-2 space-y-8">
          
          {/* Live AI Extraction Feed */}
          <div className="bg-[#0D0E12] border border-purple-900/40 rounded-[2rem] p-8 shadow-inner relative overflow-hidden">
            <h3 className="text-slate-500 uppercase text-[10px] font-black tracking-[0.3em] mb-8 flex items-center gap-3 select-none">
              <span className={`h-2.5 w-2.5 rounded-full ${isEnriching || isAnimating ? 'bg-purple-500 animate-ping' : 'bg-slate-700'}`} />
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
                {/* Summary character typewriter */}
                <p className="text-2xl text-white font-medium leading-relaxed italic border-l-2 border-purple-500/80 pl-4 py-1">
                  "{typedSummary}
                  {isAnimating && activeBulletIndex === -1 && (
                    <span className="terminal-caret" />
                  )}"
                </p>

                {/* Bullets typewriter */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {visibleBullets.map((b: string, i: number) => (
                    <div key={i} className="bg-[#090D10]/50 p-5 rounded-2xl border border-purple-900/30 text-slate-300 text-sm hover:border-purple-500/20 hover:bg-[#0D0E12]/80 transition-all">
                      <span className="text-purple-500 mr-2">✦</span> {b}
                    </div>
                  ))}

                  {/* Active bullet typing */}
                  {activeBulletIndex !== -1 && (
                    <div className="bg-[#090D10]/50 p-5 rounded-2xl border border-purple-500/30 text-slate-200 text-sm">
                      <span className="text-purple-500 mr-2">✦</span>
                      {typedActiveBullet}
                      <span className="terminal-caret" />
                    </div>
                  )}
                </div>

                {/* Keywords and sources fade in */}
                <div className={`space-y-4 pt-4 border-t border-purple-900/20 transition-opacity duration-1000 ${keywordsVisible ? "opacity-100" : "opacity-0"}`}>
                  <div className="flex flex-wrap gap-2">
                    {enrichedData.keywords?.map((kw: string) => (
                      <span key={kw} className="text-[9px] font-black px-2.5 py-1 rounded bg-[#090D10]/60 text-purple-400 border border-purple-900/40 uppercase tracking-widest">
                        {kw}
                      </span>
                    ))}
                  </div>
                  <div className="text-[10px] text-slate-650 font-mono">
                    SOURCE: {company.website} | FETCHED: {enrichedData.timestamp || new Date().toISOString()}
                  </div>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center h-48 border-2 border-dashed border-purple-900/20 rounded-3xl text-slate-600 font-bold uppercase text-xs tracking-widest select-none">
                No data fetched yet. Click "Enrich Intelligence" above.
              </div>
            )}
          </div>

          {/* Signals Trail */}
          <div className="bg-[#0D0E12] border border-purple-900/40 rounded-[2rem] p-8">
            <h3 className="text-slate-500 uppercase text-[10px] font-black tracking-[0.3em] mb-10 select-none">Signals Trail</h3>
            <div className="space-y-12 relative before:absolute before:inset-0 before:ml-[19px] before:w-[2px] before:bg-gradient-to-b before:from-purple-600/70 before:to-transparent">
              {signals.map((s, i) => (
                <div key={i} className="relative pl-14 group">
                  <div className="absolute left-0 mt-1 h-10 w-10 rounded-full bg-[#090D10] border-2 border-purple-900/40 flex items-center justify-center z-10 group-hover:border-purple-500/60 transition-colors">
                    <div className="h-2.5 w-2.5 rounded-full bg-purple-500/80 group-hover:bg-purple-500 shadow-[0_0_10px_rgba(168,85,247,0.5)] transition-all" />
                  </div>
                  <div>
                    <span className="text-[10px] font-black text-slate-650 uppercase tracking-widest">{s.date} • {s.type}</span>
                    <p className="text-white text-lg font-bold group-hover:text-purple-400 transition-colors">{s.event}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Sidebar notes */}
        <div className="space-y-8">
          <div className="bg-[#0D0E12] border border-purple-900/40 rounded-[2rem] p-8 flex flex-col h-full justify-between">
            <div>
              <h3 className="text-slate-500 uppercase text-[10px] font-black tracking-[0.3em] mb-6 select-none">Investment Thesis</h3>
              <textarea 
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Start typing internal context/thesis..."
                className="w-full min-h-[300px] bg-transparent text-slate-300 outline-none resize-none placeholder:text-slate-800 font-medium leading-relaxed font-mono text-sm border border-transparent focus:border-purple-900/30 p-2 rounded-xl transition-all"
              />
            </div>
            <button 
              onClick={handleSaveNote}
              className="w-full bg-white text-black hover:bg-purple-600 hover:text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest mt-6 transition-all shadow-xl hover:shadow-[0_0_20px_rgba(168,85,247,0.15)] cursor-pointer"
            >
              Save Thesis Notes  
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}