---
created: 2026-04-29
source: https://zylos.ai/research/2026-02-08-computer-use-gui-agents
topic: jarvis-systems
tags:
  - raw
  - jarvis-systems
  - computer-use
  - gui-agents
status: ingested
---

# Computer Use & GUI Agents in 2026 (Zylos Research)

## State of the Art

- Web automation: production-ready. ChatGPT Agent 87% on complex JS sites. Project Mariner 83.5% on real-world web tasks.
- Desktop automation: research-stage. Agents succeed on only 12% of open-ended OS tasks; humans at 72%.

## Leading Frameworks

**Commercial:**
- ChatGPT Agent (OpenAI, Jan 2025)
- Google Project Mariner (Gemini 2.0)
- Microsoft UFO² (multiagent Windows desktop)
- Apple Intelligence Siri (on-device focus)
- Anthropic Computer Use API (public beta)

**Open Source:**
- Mobile-Agent-v3 + GUI-Owl foundation
- Mobile-use: 100% on AndroidWorld

## Technical Approaches

| Method | Strength | Weakness |
|--------|----------|----------|
| Vision + click | Universal | Token-expensive (15k+ per screenshot), slow |
| Accessibility trees | Efficient text | Fails on canvas/custom rendering |
| DOM manipulation | Fastest, most precise | Web only |
| Hybrid (all three) | Best overall | Complex |

## Benchmark Reality

| Benchmark | SOTA | Human |
|-----------|------|-------|
| WebArena | 71.2% | ~95% |
| OSWorld | 20.58% | 72.36% |
| AndroidWorld | 100% (Mobile-use) | — |

## Production vs Research

**Production-ready:** Supervised web browsing, form-filling, accessibility tools, test automation
**Still research:** Unsupervised desktop/mobile automation, multi-app workflows, irreversible actions

## Security
- 13.4% of all skills contain at least one critical-level security issue
- Sandboxing and permission-tiering are mandatory

## Industry Consensus
Hybrid RPA + AI (not pure agentic) for anything mission-critical. Human oversight still required.
