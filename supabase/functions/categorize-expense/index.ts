import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const MAX_DESC_CHARS = 500;
const MAX_CATEGORIES = 50;

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Authenticate caller
    const authHeader = req.headers.get("Authorization");
    if (!authHeader) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } },
    );
    const { data: userData, error: userErr } = await supabase.auth.getUser();
    if (userErr || !userData.user) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    let { description, categories } = await req.json();
    if (typeof description !== "string" || !description.trim() || !Array.isArray(categories) || categories.length === 0) {
      return new Response(JSON.stringify({ error: "description and categories are required" }), {
        status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    description = description.slice(0, MAX_DESC_CHARS);
    categories = categories.slice(0, MAX_CATEGORIES)
      .filter((c: any) => typeof c === "string" && c.length > 0)
      .map((c: string) => c.slice(0, 100));

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
