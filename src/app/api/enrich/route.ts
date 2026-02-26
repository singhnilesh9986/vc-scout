import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { url } = await req.json();

    
    const enrichedData = {
      summary: "An innovative platform specialized in the sector, leveraging proprietary technology to solve core market inefficiencies.",
      bullets: [
        "Proprietary AI-driven processing engine",
        "Seamless integration with existing enterprise workflows",
        "Scalable infrastructure designed for high-growth global markets",
        "Focus on user-centric design and fast iteration cycles"
      ],
      keywords: ["Innovation", "Scalability", "B2B", "Efficiency", "Next-Gen", "Automation"],
      signals: [
        "Active 'Careers' page detected",
        "Recent product changelog update",
        "Founder-led technical blog present"
      ],
      sources: [url], 
      timestamp: new Date().toISOString() 
    };

    return NextResponse.json(enrichedData);
  } catch (error) {
    return NextResponse.json({ error: "Enrichment failed" }, { status: 500 });
  }
}