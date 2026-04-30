---
created: 2026-04-29
source: https://github.com/isair/jarvis
topic: jarvis-systems
tags:
  - raw
  - jarvis-systems
  - voice-ai
  - local-llm
status: ingested
---

# Jarvis by isair — Architecture & Technical Overview

## Architecture

Local-first, voice-controlled AI running entirely on-device:

- **STT**: OpenAI Whisper (offline, multiple size options)
- **LLM**: Ollama-based models (Gemma4, GPT-OSS) with local inference
- **TTS**: Piper TTS or Chatterbox (emotion-aware voice synthesis)
- **Intent Classification**: Dedicated small model (gemma4:e2b) for wake-word + echo filtering
- **Memory**: Dual-layer — diary entries + knowledge graphs
- **Tools**: MCP (Model Context Protocol) servers for extensibility

## Pipeline

1. Wake word detection → listens for "Jarvis" continuously
2. Intent judgment → directive / echo / stop classification
3. Query extraction → isolates actual request
4. Memory retrieval → searches diary + knowledge graphs
5. Tool selection → embedding-based relevance filtering (prevents degradation at scale)
6. Response generation → small models use digest passes to compress context
7. Echo filtering → ignores its own TTS output

## Key Differentiators

- Multi-turn conversational context (rolling window)
- Embedding-based tool selection (not all tools every call)
- Task-list planner decomposes complex requests into sub-tasks
- Transparent inference logs — real-time display of each stage
- 100% local, no cloud required
- Automatic redaction of sensitive info before storage
