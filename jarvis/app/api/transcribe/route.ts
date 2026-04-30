import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";

const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const audio = formData.get("audio") as File | null;
    if (!audio) return NextResponse.json({ error: "No audio" }, { status: 400 });

    const transcription = await groq.audio.transcriptions.create({
      file: audio,
      model: "whisper-large-v3-turbo",
      language: "en",
      response_format: "json",
    });

    return NextResponse.json({ transcript: transcription.text?.trim() ?? "" });
  } catch (e: unknown) {
    const msg = e instanceof Error ? e.message : "Transcription failed";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
