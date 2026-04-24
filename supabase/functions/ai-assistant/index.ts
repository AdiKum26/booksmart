import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type, x-supabase-client-platform, x-supabase-client-platform-version, x-supabase-client-runtime, x-supabase-client-runtime-version",
};

const SYSTEM_PROMPT = `You are BookSmart AI, a friendly and knowledgeable assistant for a college textbook marketplace called SMART. Your role is to help students:

1. **Navigate the website**: Guide students to the right pages:
   - /shop — Browse and buy textbooks (can filter by category/major like Computer Science, Economics, etc.)
   - /store-list — See all vendor stores
   - /my-account — Login, register, or manage their vendor store
   - /about-us — Learn about the team
   - /contact-us — Get in touch
   - /join-us — Join the team

2. **Find textbooks**: Help students find textbooks by subject, course number, or topic. Suggest they use the Shop page filters.

3. **Summarize textbook content**: If asked about a textbook topic (e.g., "What is microeconomics about?"), provide a helpful academic summary.

4. **Answer questions about the platform**: Explain how to buy, sell, become a vendor, list textbooks, etc.

5. **Academic help**: Provide brief, helpful explanations of academic topics related to common college courses.

Keep responses concise, friendly, and student-oriented. Use markdown formatting for clarity. If you don't know something specific about a product listing, suggest the student check the Shop page.`;

// How long to wait for Google AI to start responding before giving up (ms)
const FETCH_TIMEOUT_MS = 25_000;

function isQuotaError(status: number): boolean {
  // 429 = rate limit / quota; 402 = billing/payment required (spending limit hit)
  return status === 429 || status === 402;
}

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { messages } = await req.json();
    const GOOGLE_AI_KEY = Deno.env.get("GOOGLE_AI_KEY");
    if (!GOOGLE_AI_KEY) throw new Error("GOOGLE_AI_KEY is not configured");

    // Abort the upstream fetch if Google AI doesn't respond within the timeout
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT_MS);

    let response: Response;
    try {
      response = await fetch(
        "https://generativelanguage.googleapis.com/v1beta/openai/chat/completions",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${GOOGLE_AI_KEY}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            model: "gemini-2.0-flash",
            messages: [
              { role: "system", content: SYSTEM_PROMPT },
              ...messages,
            ],
            stream: true,
          }),
          signal: controller.signal,
        }
      );
    } catch (fetchErr) {
      clearTimeout(timer);
      const isTimeout =
        fetchErr instanceof Error && fetchErr.name === "AbortError";
      return new Response(
        JSON.stringify({
          error: isTimeout
            ? "The AI took too long to respond. Please try again in a moment."
            : "Could not reach the AI service. Please check your connection.",
        }),
        { status: 504, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }
    clearTimeout(timer);

    if (!response.ok) {
      if (isQuotaError(response.status)) {
        return new Response(
          JSON.stringify({
            error:
              "quota_exhausted",
          }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const t = await response.text();
      console.error("Google AI error:", response.status, t);
      return new Response(
        JSON.stringify({ error: "AI service error. Please try again later." }),
        { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(response.body, {
      headers: { ...corsHeaders, "Content-Type": "text/event-stream" },
    });
  } catch (e) {
    console.error("ai-assistant error:", e);
    return new Response(
      JSON.stringify({ error: e instanceof Error ? e.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
