---
created: 2026-04-13
tags: [karpathy, blog, raw]
status: active
source: https://karpathy.bearblog.dev/
---

# Karpathy: Bear Blog Posts (Raw Source)

Immutable captures of Karpathy's bearblog.dev posts. Started March 2025.

---

## 2025 LLM Year in Review
Source: https://karpathy.bearblog.dev/year-in-review-2025/

Six paradigm shifts Karpathy flagged as personally notable from 2025:

### 1. Reinforcement Learning from Verifiable Rewards (RLVR)
Previous training stack: Pretraining → SFT → RLHF. In 2025, RLVR emerged as a new major stage. By training against automatically verifiable rewards (math/code puzzles), LLMs spontaneously develop reasoning strategies — breaking problems into intermediate steps, backtracking, recovering. Unlike SFT/RLHF (thin stages), RLVR allows much longer optimization against objective reward functions. New knob: test-time compute (longer reasoning traces = more thinking time). OpenAI o1 (late 2024) was first demo; o3 (early 2025) was the inflection point you could intuitively feel.

### 2. Ghosts vs. Animals / Jagged Intelligence
2025 is where Karpathy internalized the "shape" of LLM intelligence. LLMs are not "evolving animals," they are "summoning ghosts" — entities optimized by a completely different process (imitation of text, math puzzle rewards, LM Arena upvotes). Intelligence is jagged: simultaneously genius polymath and confused grade schooler, seconds from a jailbreak. Benchmark trust collapsed — RLVR and synthetic data trivially exploit verifiable environments. "Training on the test set is a new art form."

### 3. Cursor / New Layer of LLM Apps
Cursor revealed a new class of LLM app — "Cursor for X." These apps: (1) do context engineering, (2) orchestrate LLM calls in complex DAGs, (3) provide domain-specific GUI for human-in-the-loop, (4) offer an "autonomy slider." Thesis: LLM labs will graduate generalist college students; LLM apps will deploy them as specialized professionals by supplying private data, sensors, actuators, and feedback loops.

### 4. Claude Code / AI That Lives on Your Computer
Claude Code = first convincing LLM Agent. Key insight: it runs on your computer, not in the cloud. OpenAI erred by focusing on cloud container deployments. What matters isn't where the AI ops run but the already-booted computer, its context, secrets, configuration, and low-latency interaction. CC is packaged as a minimal CLI — "a little spirit/ghost that lives on your computer." New paradigm: AI is not a website you visit, it inhabits your machine.

### 5. Vibe Coding
2025: AI crossed the threshold to build impressive programs purely via English. Karpathy coined "vibe coding" in a shower-of-thoughts tweet (Feb 2025). Programming no longer reserved for professionals. Anyone can build apps. Professionals write far more software that would otherwise not exist. Code becomes free, ephemeral, malleable, disposable after single use. Vibe coding will "terraform software and alter job descriptions."

### 6. Nano Banana / LLM GUI
Google Gemini Nano banana = paradigm-shifting 2025 model. Argument: chatting with LLMs is like issuing commands to a 1980s console. Text is the computer's favored format, not the human's. People consume information visually/spatially — hence the GUI was invented for traditional computing. LLMs should speak in images, infographics, animations, web apps. Nano banana hints at what the LLM GUI might look like: joint capability from text generation, image generation, and world knowledge, tangled together in weights.

**TLDR:** LLMs are simultaneously smarter and dumber than expected. Industry has realized <10% of their potential at current capability.

---

## Animals vs. Ghosts
Source: https://karpathy.bearblog.dev/animals-vs-ghosts/

Response to Dwarkesh pod with Rich Sutton. Sutton ("The Bitter Lesson") argues LLMs are not "bitter lesson pilled" because: (1) trained on finite human data, (2) SFT is absent from animal kingdom, (3) pretraining biases toward human patterns vs. pure RL from experience.

Karpathy's take:
- Sutton is right that frontier LLMs are not truly bitter-lesson-pilled — they are thoroughly human-engineered at every stage
- But the animal analogy is also oversimplified: a baby zebra runs within minutes of birth — that's not tabula rasa RL, it's a powerful initialization from millions of years of evolution (DNA = the "outer loop")
- **Pretraining is our crappy evolution.** It is a practical solution to the cold start problem — gathering enough soft constraints over billions of parameters — before finetuning on more correct tasks (RLVR)
- LLMs = "summoning ghosts": imperfect statistical distillations of humanity's documents + RL sprinkle on top. Not animals. Different point in intelligence space
- Ghosts may converge toward animals over time, or permanently diverge. Ghosts:Animals :: Planes:Birds
- Still worth drawing inspiration from animal intelligence: intrinsic motivation, curiosity, multi-agent self-play, culture, always-learning at test time

---

## Verifiability
Source: https://karpathy.bearblog.dev/verifiability/

- Software 1.0: easily automates what you can **specify** (rule-based, deterministic)
- Software 2.0: easily automates what you can **verify** (neural nets trained on objectives/rewards)
- New most predictive feature for a task's automability: **verifiability** — can you reset, run efficiently, and reward automatically?
- More verifiable → more RLVR-optimizable → jagged capability spike in that domain (math, code)
- Less verifiable → relies on generalization/imitation → lags behind
- Explains why LLM progress is jagged: domains with clear right/wrong answers progress fastest

---

## Power to the People
Source: https://karpathy.bearblog.dev/power-to-the-people/

Key thesis: LLMs reverse the historical top-down diffusion of technology (government → corporations → individuals). ChatGPT is the fastest-growing consumer app ever (400M weekly active users). Regular people benefit disproportionately vs. corporations/governments.

Why corps/govs benefit less:
1. LLMs offer broad quasi-expertise, but orgs already have specialists — marginal gain is smaller
2. Corporate problems are far more complex (integrations, legacy systems, compliance, coordination) — can't just vibe code
3. Institutional inertia, political turf wars, culture change friction

Looking forward: train-time + test-time scaling increases dynamic range (money buys better models). Model distillation decreases it (small models catch up). If money can buy dramatically better AI, elite orgs split away again. "Your child will be tutored by GPT-8-pro-max-high, yours by GPT-6 mini." But right now: "The future is already here, and it is shockingly distributed. Power to the people."
