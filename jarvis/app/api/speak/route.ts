import { NextRequest } from "next/server";

const VOICE_ID = process.env.ELEVENLABS_VOICE_ID ?? "pNInz6obpgDQGcFmaJgB"; // Adam
const API_KEY = process.env.ELEVENLABS_API_KEY ?? "";

export async function POST(req: NextRequest) {
  const { text } = await req.json();
  if (!text?.trim()) return new Response("", { status: 400 });
  if (!API_KEY) return new Response("ELEVENLABS_API_KEY not set", { status: 500 });

  const res = await fetch(
    `https://api.elevenlabs.io/v1/text-to-speech/${VOICE_ID}`,
    {
      method: "POST",
      headers: {
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        text,
        model_id: "eleven_turbo_v2_5",
        voice_settings: { stability: 0.5, similarity_boost: 0.75 },
      }),
    }
  );

  if (!res.ok) return new Response("TTS failed", { status: 500 });

  return new Response(res.body, {
    headers: { "Content-Type": "audio/mpeg" },
  });
}
