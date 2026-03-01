import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const PAYSTACK_SECRET_KEY = Deno.env.get("PAYSTACK_SECRET_KEY");
    if (!PAYSTACK_SECRET_KEY) {
      throw new Error("PAYSTACK_SECRET_KEY is not configured");
    }

    const { email, amount, plan, callback_url } = await req.json();

    if (!email || !amount) {
      return new Response(
        JSON.stringify({ error: "Email and amount are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Amount in pesewas (kobo equivalent for GHS)
    const amountInPesewas = Math.round(amount * 100);

    const response = await fetch("https://api.paystack.co/transaction/initialize", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${PAYSTACK_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        amount: amountInPesewas,
        currency: "GHS",
        callback_url,
        metadata: {
          plan: plan || "donation",
          custom_fields: [
            {
              display_name: "Plan",
              variable_name: "plan",
              value: plan || "donation",
            },
          ],
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Paystack API error:", response.status, JSON.stringify(data));
      throw new Error("Payment provider error");
    }

    return new Response(JSON.stringify(data), {
      status: 200,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error: unknown) {
    console.error("Payment initialization error:", error);
    return new Response(
      JSON.stringify({ status: false, message: "Payment initialization failed. Please try again." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
