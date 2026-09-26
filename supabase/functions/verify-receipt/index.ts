// Receipt verification using Lovable AI Gateway (multimodal)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

Deno.serve(async (req) => {
  if (req.method === "OPTIONS") return new Response(null, { headers: corsHeaders });

  try {
    const { imageBase64, mimeType, expectedAmount, expectedReference } = await req.json();
    if (!imageBase64) {
      return new Response(JSON.stringify({ error: "imageBase64 is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) throw new Error("LOVABLE_API_KEY not configured");

    const dataUrl = `data:${mimeType || "image/jpeg"};base64,${imageBase64}`;

    const systemPrompt = `You are a forensic proof-of-payment (POP) verification expert for South African stokvels.
Analyze the uploaded image and decide if it is a GENUINE bank/mobile-money payment receipt or a FAKE / edited / screenshot-of-template / non-receipt image.

Look for tampering signs: inconsistent fonts, misaligned text, mismatched colors, low-quality cropping/blur over fields, wrong currency formatting, suspicious bank logos, missing reference numbers, repeated transactions, future dates, edited amounts, screenshot-of-screenshot artifacts, watermark removal, unusual aspect ratios.

Return your analysis ONLY by calling the verify_receipt tool.`;

    const userText = `Verify this proof of payment.${
      expectedAmount ? ` Expected amount: R${expectedAmount}.` : ""
    }${expectedReference ? ` Expected reference: "${expectedReference}".` : ""}`;

    const aiResp = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          {
            role: "user",
            content: [
              { type: "text", text: userText },
              { type: "image_url", image_url: { url: dataUrl } },
            ],
          },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "verify_receipt",
              description: "Return verification verdict for a proof of payment.",
              parameters: {
                type: "object",
                properties: {
                  verdict: {
                    type: "string",
                    enum: ["genuine", "suspicious", "fake", "not_a_receipt"],
                  },
                  confidence: { type: "number", description: "0-100" },
                  amount: { type: "string", description: "Detected amount, or empty" },
                  currency: { type: "string" },
                  date: { type: "string" },
                  reference: { type: "string" },
                  bank: { type: "string" },
                  recipient: { type: "string" },
                  sender: { type: "string" },
                  red_flags: { type: "array", items: { type: "string" } },
                  summary: { type: "string" },
                },
                required: ["verdict", "confidence", "summary", "red_flags"],
                additionalProperties: false,
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "verify_receipt" } },
      }),
    });

    if (!aiResp.ok) {
      if (aiResp.status === 429) {
        return new Response(JSON.stringify({ error: "Rate limit exceeded, please try again later." }), {
          status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      if (aiResp.status === 402) {
        return new Response(JSON.stringify({ error: "AI credits exhausted. Please add funds in workspace settings." }), {
          status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" },
        });
      }
      const t = await aiResp.text();
      console.error("AI gateway error:", aiResp.status, t);
      return new Response(JSON.stringify({ error: "AI verification failed" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const data = await aiResp.json();
    const toolCall = data.choices?.[0]?.message?.tool_calls?.[0];
    if (!toolCall) {
      return new Response(JSON.stringify({ error: "No verification result returned" }), {
        status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }
    const result = JSON.parse(toolCall.function.arguments);
    return new Response(JSON.stringify(result), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (e) {
    console.error("verify-receipt error:", e);
    return new Response(JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }), {
      status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
