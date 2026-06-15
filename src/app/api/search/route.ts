import { NextResponse } from "next/server";
import companiesData from "@/data/companies.json";

function getSectorFromQuery(name: string): string {
  const lower = name.toLowerCase();
  const climateKeywords = ["climate", "carbon", "green", "eco", "solar", "wind", "power", "earth", "recycle", "clean", "nature", "forest", "tree", "water"];
  const fintechKeywords = ["pay", "fin", "flow", "wallet", "bank", "ledger", "spend", "cash", "coin", "crypto", "chain", "defi", "card", "invoice", "tax", "wealth", "money", "invest"];
  const aiKeywords = ["ai", "intelligence", "model", "gpt", "deep", "neural", "learn", "agent", "cognitive", "brain", "chat", "bot", "mind", "ml", "data", "scout"];

  if (climateKeywords.some(kw => lower.includes(kw))) return "ClimateTech";
  if (fintechKeywords.some(kw => lower.includes(kw))) return "Fintech";
  if (aiKeywords.some(kw => lower.includes(kw))) return "AI";

  // Semi-random deterministic choice based on string length
  const sectors = ["ClimateTech", "Fintech", "AI"];
  return sectors[name.length % sectors.length];
}

function getStageFromQuery(name: string): string {
  const stages = ["Seed", "Series A", "Series B"];
  return stages[name.length % stages.length];
}

function generateCompany(name: string, sector: string, stage: string) {
  const cleanName = name.trim();
  const domainName = cleanName.toLowerCase().replace(/[^a-z0-9]/g, "") || "company";
  const website = `https://${domainName}.com`;
  
  let description = "";
  if (sector === "ClimateTech") {
    description = `Leveraging advanced engineering and data analytics to optimize carbon offsets and drive sustainability for ${cleanName}.`;
  } else if (sector === "Fintech") {
    description = `Next-generation financial infrastructure by ${cleanName} designed to streamline payments and automate payroll workflows.`;
  } else if (sector === "AI") {
    description = `Building cognitive agents and scalable neural processing models at ${cleanName} to solve complex enterprise intelligence challenges.`;
  } else {
    description = `Innovative platform by ${cleanName} specialized in the sector, leveraging proprietary technology to solve core market inefficiencies.`;
  }

  const encodedId = `dyn-${encodeURIComponent(cleanName)}-${encodeURIComponent(sector)}-${encodeURIComponent(stage)}`;

  return {
    id: encodedId,
    name: cleanName,
    website,
    sector,
    stage,
    description
  };
}

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const sector = searchParams.get("sector") || "All";

    // If search is empty and no sector filter, return empty — welcome state handles display
    if (q.trim() === "" && sector === "All") {
      return NextResponse.json([]);
    }

    // 1. Start with static database matching
    let results = companiesData.filter((c) => {
      const matchesSearch = q.trim() === "" || c.name.toLowerCase().includes(q.toLowerCase());
      const matchesSector = sector === "All" || c.sector === sector;
      return matchesSearch && matchesSector;
    });

    // 2. If q is specified and there's little or no matches, generate dynamic companies matching the query
    if (q.trim().length > 0) {
      const queryName = q.trim();
      
      // Check if the query matches any existing name exactly to avoid duplicates
      const hasExactMatch = results.some(r => r.name.toLowerCase() === queryName.toLowerCase());
      
      if (!hasExactMatch) {
        // Generate a primary company matching the query
        const primarySector = getSectorFromQuery(queryName);
        const primaryStage = getStageFromQuery(queryName);
        
        // Only include it if it matches the sector filter
        if (sector === "All" || primarySector === sector) {
          const mainCompany = generateCompany(queryName, primarySector, primaryStage);
          results.unshift(mainCompany);
        }

        // Add a secondary related dynamic company for search variance
        const variations = [
          { suffix: " Labs", stage: "Seed" },
          { suffix: " AI", stage: "Series A" },
          { suffix: " Technologies", stage: "Series B" }
        ];

        for (const variation of variations) {
          const varName = queryName + variation.suffix;
          const varSector = getSectorFromQuery(varName);
          if (sector === "All" || varSector === sector) {
            results.push(generateCompany(varName, varSector, variation.stage));
          }
        }
      }
    }

    return NextResponse.json(results);
  } catch (error) {
    console.error("Search API error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}
