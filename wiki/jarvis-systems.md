---
created: 2026-04-29
updated: 2026-04-29
tags:
  - wiki
  - jarvis-systems
  - voice-ai
  - computer-use
  - agents
status: active
sources: []
---

# Jarvis Systems & Computer Control

How to build an AI that hears you, thinks, and controls your computer. Three separate problems that combine into one stack.

---

## The Three Layers

| Layer | What it does | Key tech |
|-------|-------------|----------|
| **Voice pipeline** | Speech → text → response → speech | Whisper, Ollama, Piper/Kokoro |
| **Agent brain** | Reasoning, memory, tool use | LLM + MCP servers |
| **Computer control** | See screen, click, type, run code | Computer Use API, Open Interpreter |

You can build any combination. Most "Jarvis" projects are just voice pipeline + basic shell tools. True computer control is harder and still research-stage for desktop.

---

## Layer 1: Voice Pipeline

### Architecture: STT → LLM → TTS

```
Mic → STT → LLM → TTS → Speaker
```

Three modes, ranked by latency:

| Mode | Latency | Tradeoff |
|------|---------|----------|
| Sequential | 2–4s | Simplest to build, feels robotic |
| Streaming (overlapped) | <1s | Production standard — stream tokens across all stages |
| Realtime speech-to-speech | <500ms | Single multimodal model (OpenAI Realtime, Gemini Live) — less control, best feel |

### Best Local Stack (2026)

| Component | Best local option | Notes |
|-----------|------------------|-------|
| STT | faster-whisper (turbo) | ~100–200ms, runs offline |
| LLM | Ollama + Gemma4 / Llama3 | Local inference, no API cost |
| TTS | Kokoro or Piper | Kokoro has emotion-aware synthesis |
| Wake word | Small classifier (gemma4:e2b or porcupine) | Dedicated model — don't use full LLM for this |

**Target:** ~700ms–1s total latency on mid-range GPU. Sub-1s requires streaming across all three stages.

### Key Implementation Details

- Stream STT partial transcripts to LLM while user is still speaking
- Stream LLM tokens into TTS as they arrive — don't wait for full response
- Echo filtering: detect and ignore your own TTS output (isair/jarvis does this)
- Wake word → intent classifier → query extractor → LLM (don't dump raw audio at the big model)

---

## Layer 2: Agent Brain

### Memory

Dual-layer memory (from isair/jarvis architecture):
- **Short-term:** Rolling conversational context window
- **Long-term:** Diary/log entries + knowledge graph

Without memory, every conversation starts cold. With it, Jarvis knows your schedule, preferences, past decisions.

### Tool Use / MCP

MCP (Model Context Protocol) = standard interface for plugging tools into any LLM. One MCP server = one tool (calendar, browser, smart home, shell, etc.).

**Critical pattern:** Don't dump all tools into every LLM call. Use embedding-based relevance filtering — pick only tools relevant to the current query. Prevents context bloat and degradation as your tool library grows.

### Task Planning

For complex requests, decompose first:
1. Parse intent
2. Generate sub-task list
3. Execute sub-tasks sequentially or in parallel
4. Synthesize result

Simple commands don't need this. Multi-step workflows ("book me a flight and add it to my calendar") do.

---

## Layer 3: Computer Control

### Where the field is in 2026

| Domain | Status | SOTA / Human |
|--------|--------|-------------|
| Web browsing | Production-ready | 87% / ~95% |
| Form filling | Production-ready | High |
| Desktop OS tasks | Research-stage | 20% / 72% |
| Android automation | Breakthrough | 100% / — |

Desktop control is still very hard. Don't build unsupervised pipelines for anything irreversible.

### Control Methods (ranked by tradeoff)

| Method | Speed | Coverage | Use when |
|--------|-------|----------|----------|
| DOM manipulation | Fastest | Web only | Web tasks |
| Accessibility trees | Fast | Most apps | Standard apps |
| Vision + click (screenshot) | Slowest (15k+ tokens/frame) | Universal | Fallback |
| **Hybrid** | Best overall | Best overall | Production |

### Key Frameworks

**Commercial APIs:**
- **Anthropic Computer Use API** — public beta; sees screen, mouse, keyboard, shell
- **OpenAI Codex Desktop** — macOS-first, parallel agent sessions (Apr 2026)
- **Google Project Mariner** — Gemini 2.0 powered, 83.5% on real tasks

**Open Source:**
- **Open Interpreter** — 58k+ stars; natural language → Python/JS/shell execution locally; also drives browser; best for mixed code + GUI tasks
- **Mobile-use** — 100% on AndroidWorld; best Android automation
- **Microsoft UFO²** — multiagent Windows desktop system

### Security (non-negotiable)

- 13.4% of published computer-use skills have critical-level security vulnerabilities
- Always sandbox: run agents in VM or Docker, not bare metal
- Permission tiering: read-only by default, require confirmation for writes/deletes
- Never give unsupervised access to financial apps, email sends, or destructive shell commands

---

## Reference Architecture: Full Jarvis Stack

```
┌─────────────┐
│   Mic / UI  │
└──────┬──────┘
       │ audio
┌──────▼──────────────┐
│  Wake word detector  │  (small model, always-on)
└──────┬──────────────┘
       │ triggered
┌──────▼──────────────┐
│  Intent classifier   │  (directive / echo / stop)
└──────┬──────────────┘
       │ query
┌──────▼──────────────┐     ┌──────────────┐
│   STT (Whisper)      │────▶│  LLM (Ollama) │
└─────────────────────┘     │               │◀── Memory (diary + KG)
                             │               │◀── Tools (MCP servers)
                             └──────┬────────┘
                                    │ response tokens (streaming)
                             ┌──────▼────────┐
                             │  TTS (Kokoro)  │
                             └──────┬────────┘
                                    │ audio
                             ┌──────▼────────┐
                             │   Speaker      │
                             └───────────────┘
                                    │
                             ┌──────▼──────────────────┐
                             │  Computer Control Layer   │
                             │  (Open Interpreter / CUA) │
                             └──────────────────────────┘
```

---

## Build Path (for Aadi)

| Phase | What to build | Est. time |
|-------|--------------|-----------|
| 1 | Voice pipeline: Whisper + Ollama + Piper, streaming | 1–2 days |
| 2 | Add MCP tools: shell, web search, calendar | 1 day |
| 3 | Add memory: rolling context + diary log | 1 day |
| 4 | Add screen control: Open Interpreter or Computer Use API | 1–2 days |
| 5 | Wake word + intent classifier | 1 day |

Start with phase 1 + 2. That's already a real Jarvis. Don't skip to computer control without a working voice layer.

---

## Open Source Projects Worth Studying

| Project | Stars | What makes it good |
|---------|-------|-------------------|
| [isair/jarvis](https://github.com/isair/jarvis) | — | Full local stack, MCP, memory, echo filter, well-architected |
| [open-interpreter](https://github.com/openinterpreter/open-interpreter) | 58k+ | Best code execution agent; runs Python/JS/shell locally |
| [open-jarvis/OpenJarvis](https://github.com/open-jarvis/OpenJarvis) | — | Stanford research project; on-device AI focus |
| Mobile-use | — | 100% AndroidWorld; best mobile control |

---

## Sources
- [[Resources/raw/jarvis-systems/isair-jarvis-architecture]] — isair/jarvis full local Jarvis stack architecture
- [[Resources/raw/jarvis-systems/livekit-voice-pipeline-architecture]] — LiveKit voice agent STT→LLM→TTS pipeline deep dive
- [[Resources/raw/jarvis-systems/zylos-computer-use-gui-agents-2026]] — State of computer use and GUI agents in 2026
