---
created: 2026-04-29
source: https://livekit.com/blog/voice-agent-architecture-stt-llm-tts-pipelines-explained
topic: jarvis-systems
tags:
  - raw
  - jarvis-systems
  - voice-pipeline
  - stt
  - tts
status: ingested
---

# Voice Agent Pipeline Architecture (LiveKit)

## Core Pipeline: STT → LLM → TTS

Audio from user → transcribed by STT → passed to LLM → converted back to speech by TTS.

## STT Options
- Deepgram, AssemblyAI, Whisper (OpenAI), provider-specific models
- Streaming transcription significantly reduces TTFT
- Key metrics: accuracy across accents/noise, word error rate

## LLM Considerations
- Critical: time-to-first-token (TTFT), streaming output, context window management
- Tool calling support required for action-taking agents
- Stream tokens → TTS begins before full response generated

## TTS Options
- Streaming synthesis → audio generated from partial text
- Reduces perceived wait time dramatically

## Pipeline Architectures

| Type | Latency | Notes |
|------|---------|-------|
| Sequential | 2–4 seconds | Waits for each stage; feels unnatural |
| Streaming | <1 second | Overlaps all stages; production standard |
| Realtime speech-to-speech | <500ms | Single multimodal model (OpenAI Realtime, Gemini Live); less component control |

## Latency Breakdown (Streaming)

| Stage | Target |
|-------|--------|
| Audio transport | <50ms |
| STT first partial | 100–200ms |
| LLM TTFT | 200–400ms |
| TTS first audio | 100–300ms |
| **Total perceived** | **<1 second** |

## Tradeoffs
- Sequential: simpler, debuggable, slower
- Streaming: fast, complex, production standard
- Realtime: lowest latency, best prosody, least control
- Each session is stateful: WebRTC connection + STT stream + LLM context + TTS stream simultaneously
