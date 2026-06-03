import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { description, categories } = await req.json();
    if (!description || !Array.isArray(categories) || categories.length === 0) {
      return new Response(JSON.stringify({ error: "description and categories are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const list = categories.map((c: string) => `- ${c}`).join("\n");
    const prompt = `Categorize this expense into exactly one of the allowed categories. Reply with only the category name, no extra text.

Allowed categories:
${list}

Expense description: "${description}"

Category:`;

    const r = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: { Authorization: `Bearer ${LOVABLE_API_KEY}`, "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-lite",
        messages: [
          { role: "system", content: "You classify short expense descriptions. Reply with ONLY the exact category name from the allowed list." },
          { role: "user", content: prompt },
        ],
      }),
    });

    if (!r.ok) {
      if (r.status === 429) return new Response(JSON.stringify({ error: "Rate limited, please try again later." }), { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      if (r.status === 402) return new Response(JSON.stringify({ error: "AI credits exhausted." }), { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } });
      const t = await r.text();
      console.error("AI gateway error:", r.status, t);
      return new Response(JSON.stringify({ error: "AI gateway error" }), { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } });
    }

    const data = await r.json();
    const raw: string = data?.choices?.[0]?.message?.content?.trim() || "";
    const cleaned = raw.replace(/[*_`."']/g, "").trim();
    // Find exact or case-insensitive match in allowed list
    const match = categories.find((c: string) => c.toLowerCase() === cleaned.toLowerCase())
      || categories.find((c: string) => cleaned.toLowerCase().includes(c.toLowerCase()))
      || "Other";

    return new Response(JSON.stringify({ category: match }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("categorize error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
