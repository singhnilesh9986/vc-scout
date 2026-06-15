import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { url, name = "The company", sector = "General" } = body;

    // Check if there is a valid OpenAI API key configured
    const apiKey = process.env.OPENAI_API_KEY;
    const isValidKey = apiKey && apiKey !== "your_test_key_here" && apiKey.startsWith("sk-");

    if (isValidKey) {
      try {
        const response = await fetch("https://api.openai.com/v1/chat/completions", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${apiKey}`
          },
          body: JSON.stringify({
            model: "gpt-4o-mini",
            messages: [
              {
                role: "system",
                content: "You are an expert venture capital analyst. Generate realistic market intelligence data for the requested company."
              },
              {
                role: "user",
                content: `Generate a structured analysis for company "${name}" in the "${sector}" sector, website: "${url}".
Return ONLY a JSON object matching this structure (no markdown formatting, no backticks):
{
  "summary": "a single sentence summarizing what they do",
  "bullets": ["bullet point 1", "bullet point 2", "bullet point 3", "bullet point 4"],
  "keywords": ["keyword1", "keyword2", "keyword3", "keyword4", "keyword5", "keyword6"],
  "signals": ["signal1", "signal2", "signal3"]
}`
              }
            ],
            temperature: 0.7
          })
        });

        if (response.ok) {
          const aiResult = await response.json();
          const parsedData = JSON.parse(aiResult.choices[0].message.content.trim());
          return NextResponse.json({
            ...parsedData,
            sources: [url],
            timestamp: new Date().toISOString()
          });
        }
      } catch (err) {
        console.error("OpenAI call failed, falling back to simulated engine", err);
      }
    }

    // Fallback: Rich domain-specific simulation
    let summary = "";
    let bullets: string[] = [];
    let keywords: string[] = [];
    let signals: string[] = [];

    if (sector === "ClimateTech") {
      summary = `${name} is a pioneering ClimateTech solution focused on carbon tracking, emission reduction, and climate intelligence.`;
      bullets = [
        `${name}'s proprietary carbon footprint tracking algorithm`,
        "Real-time emissions profiling for complex supply chains",
        "Automated regulatory compliance reporting and verification",
        "Designed for seamless integration with legacy enterprise ERPs"
      ];
      keywords = ["ClimateTech", "Carbon Accounting", "Sustainability", "ESG", "Green Energy", "Compliance"];
      signals = [
        "New partnership announced with eco-certified logistics providers",
        "Launched beta portal for Scope 3 emissions tracing",
        "Hiring senior climate modelers and data engineers"
      ];
    } else if (sector === "Fintech") {
      summary = `${name} is a leading Fintech platform specializing in secure transactional routing, payroll automation, and borderless enterprise banking.`;
      bullets = [
        `${name}'s proprietary automated transactional ledger system`,
        "Multi-currency payroll routing with zero latency",
        "Enterprise-grade fraud detection and risk modeling",
        "Fully compliant API-first banking integrations"
      ];
      keywords = ["Fintech", "Payments", "Payroll", "B2B SaaS", "Ledger", "API Banking", "Security"];
      signals = [
        "Integrated real-time international wire routing",
        "Passed SOC2 Type II compliance audit with zero notes",
        "Hiring transactional infrastructure engineers"
      ];
    } else if (sector === "AI") {
      summary = `${name} is an advanced AI development platform pioneering autonomous agent coordination and scalable transformer architectures.`;
      bullets = [
        `${name}'s proprietary model-agnostic orchestration pipeline`,
        "High-throughput low-latency inference endpoints",
        "Dynamic prompt engineering and contextual memory databases",
        "Advanced safety guards and model alignment frameworks"
      ];
      keywords = ["AI", "Autonomous Agents", "Deep Learning", "Inference", "LLM Ops", "Cognitive Computing"];
      signals = [
        "Released open-source evaluation suite for model safety",
        "Completed training run on 2,000-GPU cluster",
        "Hiring research scientists and distributed systems engineers"
      ];
    } else {
      summary = `${name} is an innovative platform specialized in solving core market inefficiencies using proprietary technology and user-centric workflows.`;
      bullets = [
        `${name}'s proprietary workflow automation engine`,
        "Seamless integration with existing cloud storage and workspace tools",
        "Scalable architecture designed for high-growth global enterprise markets",
        "Designed for fast iteration cycles and data-driven insights"
      ];
      keywords = ["Innovation", "Enterprise SaaS", "Automation", "B2B", "Scale", "Efficiency"];
      signals = [
        "Active recruitment for customer success and engineering roles",
        "Recent update to public product roadmap",
        "Founder featured in industry leading technical podcasts"
      ];
    }

    const enrichedData = {
      summary,
      bullets,
      keywords,
      signals,
      sources: [url],
      timestamp: new Date().toISOString()
    };

    return NextResponse.json(enrichedData);
  } catch (error) {
    console.error("Enrichment failed:", error);
    return NextResponse.json({ error: "Enrichment failed" }, { status: 500 });
  }
}