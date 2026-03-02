import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    // Verify authentication
    const authHeader = req.headers.get("Authorization");
    if (!authHeader?.startsWith("Bearer ")) {
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabaseClient = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_ANON_KEY") ?? "",
      { global: { headers: { Authorization: authHeader } } }
    );

    const token = authHeader.replace("Bearer ", "");
    const { data: claimsData, error: authError } = await supabaseClient.auth.getClaims(token);
    if (authError || !claimsData?.claims) {
      console.warn("AI insights auth failure:", authError?.message ?? "invalid claims");
      return new Response(JSON.stringify({ error: "Unauthorized" }), {
        status: 401, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const userId = claimsData.claims.sub;
    console.info(`AI insights requested by user=${userId}`);

    const { transactions, settings } = await req.json();

    // Validate inputs
    if (!Array.isArray(transactions)) {
      return new Response(
        JSON.stringify({ error: "Invalid transactions format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    if (!settings || typeof settings !== "object" || !settings.currency || typeof settings.monthlyBudget !== "number") {
      return new Response(
        JSON.stringify({ error: "Invalid settings format" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Validate and sanitize each transaction
    const validTypes = ["income", "expense"];
    const validatedTx = transactions.slice(0, 50).filter((t: any) =>
      t && validTypes.includes(t.type) &&
      typeof t.amount === "number" && t.amount >= 0 &&
      typeof t.category === "string" && t.category.length <= 100 &&
      typeof t.date === "string" && t.date.length <= 20
    );

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY is not configured");

    const now = new Date();
    const currentMonth = now.toLocaleString('en', { month: 'long', year: 'numeric' });

    const currency = String(settings.currency).slice(0, 10);
    const budget = Number(settings.monthlyBudget);

    const systemPrompt = `You are a smart financial advisor for a Ghanaian budget app called SmartSpend. 
Analyze the user's spending data and provide 3-5 personalized, actionable insights.
Be specific with numbers and categories. Use the user's currency (${currency}).
Keep each insight to 1-2 sentences. Be encouraging but honest.
Format as a JSON array of objects with "icon" (emoji), "title" (short), and "message" (the insight).
Current month: ${currentMonth}. Monthly budget: ${budget}.`;

    const txSummary = validatedTx.map((t: any) => 
      `${t.type}: ${t.category} - ${t.amount} on ${t.date}`
    ).join('\n');

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-3-flash-preview",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: `Here are my recent transactions:\n${txSummary || 'No transactions yet.'}` },
        ],
        tools: [{
          type: "function",
          function: {
            name: "provide_insights",
            description: "Return financial insights for the user",
            parameters: {
              type: "object",
              properties: {
                insights: {
                  type: "array",
                  items: {
                    type: "object",
                    properties: {
                      icon: { type: "string" },
                      title: { type: "string" },
                      message: { type: "string" },
                    },
                    required: ["icon", "title", "message"],
                    additionalProperties: false,
                  },
                },
              },
              required: ["insights"],
              additionalProperties: false,
            },
          },
        }],
        tool_choice: { type: "function", function: { name: "provide_insights" } },
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limited. Please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (response.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const text = await response.text();
      console.error("AI error:", response.status, text);
      throw new Error("AI gateway error");
    }

    const data = await response.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    let insights = [];
    
    if (toolCall) {
      try {
        const parsed = JSON.parse(toolCall.function.arguments);
        insights = parsed.insights;
      } catch {
        insights = [{ icon: "💡", title: "Tip", message: "Keep tracking your expenses to get personalized insights!" }];
      }
    }

    return new Response(JSON.stringify({ insights }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("Error:", e);
    return new Response(JSON.stringify({ error: "Failed to generate insights. Please try again." }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
