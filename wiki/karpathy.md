---
created: 2026-04-13
tags: [wiki, karpathy, AI, LLMs, deep-learning]
status: active
related: []
---

# Andrej Karpathy

Synthesized knowledge page. Sources: [[Resources/raw/karpathy/tweets-faves]], [[Resources/raw/karpathy/bear-blog]], [[Resources/raw/karpathy/github-blog-posts]], [[Resources/raw/karpathy/github-repos]].

> Do not edit manually — regenerate via `/wiki-ingest`.

---

## Who He Is

AI researcher. Former Director of AI at Tesla (Autopilot), founding member of OpenAI, Stanford PhD under Fei-Fei Li. Now building **Eureka Labs** (AI-native education). Known for making complex ML deeply accessible through minimal, from-scratch implementations and free video courses.

---

## Core Mental Models

### Software 1.0 / 2.0 / 3.0

One of Karpathy's most influential conceptual frameworks:

| Version | Paradigm | How you "program" |
|---------|----------|-------------------|
| Software 1.0 | Classical code | Write explicit Python/C++ rules |
| Software 2.0 | Neural nets | Define objectives; gradient descent finds the program |
| Software 3.0 | LLMs | Write prompts in English; model executes |

Key implication: *"The hottest new programming language is English."* Prompt engineering is applied psychology of neural nets — biological or synthetic. LLMs are general-purpose computers reconfigurable at runtime via natural language.

**Specifiability vs Verifiability:**
- Software 1.0 automates what you can *specify*
- Software 2.0 automates what you can *verify*
- The more a task is verifiable (resettable, efficient, rewardable), the more amenable it is to full automation via RLVR. This is what drives LLM capability's jagged frontier.

*Sources: Software 2.0 blog post (Medium), Verifiability (bearblog), YC AI Startup School talk*

---

### LLMs as Ghosts, Not Animals

Karpathy's sharpest frame for understanding LLM intelligence:

- **Animals** (biological intelligence): initialized by evolution (DNA = the outer loop), learn from embodied experience, always adapting, intrinsically motivated
- **Ghosts**: statistically distilled from humanity's text. Optimized by a different set of pressures (imitation of documents, verifiable puzzle rewards, LM Arena votes). Not truly "bitter lesson pilled" because they're thoroughly human-engineered

**Consequence: Jagged intelligence.** LLMs are simultaneously genius polymaths and confused grade schoolers. They crush benchmarks in domains with verifiable feedback (math, code) while hallucinating in domains that aren't. Benchmarks are immediately corrupted by RLVR — "training on the test set is a new art form."

**Ghosts:Animals :: Planes:Birds** — a different engineering solution in the intelligence space. May converge toward animals over time or diverge permanently. Either way: world-altering.

**Rich Sutton's "Bitter Lesson" critique:** LLMs aren't truly bitter-lesson-pilled (they rely on finite human data, supervised learning absent from animals). Karpathy's response: pretraining is our *crappy evolution* — a practical cold-start solution, not philosophically pure but practically viable. The baby zebra running at birth isn't tabula rasa RL; it's a powerful initialization from millions of years of evolution.

*Sources: Animals vs. Ghosts (bearblog), 2025 Year in Review (bearblog)*

---

### RLVR and the 2025 Training Stack

Previous production stack: Pretraining → SFT → RLHF (stable 2020–2024).

2025 addition: **RLVR (Reinforcement Learning from Verifiable Rewards)**:
- Train against auto-verifiable rewards (math, code puzzles)
- LLMs spontaneously develop "reasoning" strategies: breaking into steps, backtracking, recovering
- Unlike SFT/RLHF (minor finetunes), RLVR allows much longer optimization
- New capability knob: **test-time compute** (longer reasoning traces = thinking time)
- OpenAI o1 (late 2024) = first RLVR model. o3 (early 2025) = the inflection point.
- RLVR gobbled up compute originally destined for pretraining → similar model sizes but far longer RL runs

*Source: 2025 Year in Review (bearblog)*

---

### Vibe Coding

Coined by Karpathy in a shower-of-thoughts tweet (Feb 2025):

> Programming where you forget that code even exists — you just express intent in English and the AI builds it.

Implications:
- Programming is no longer gated by technical expertise
- Professionals write far more software that would never have been built (custom BPE tokenizer in Rust, throwaway single-use apps)
- Code becomes free, ephemeral, malleable, disposable
- "Vibe coding will terraform software and alter job descriptions"

Examples: llm-council, reader3, HN time capsule, menugen — all vibe-coded projects.

*Source: 2025 Year in Review (bearblog), various tweets*

---

### Claude Code as the New Paradigm

Karpathy considers Claude Code the first convincing demonstration of an LLM Agent:

> "Not a website you go to — a little spirit/ghost that lives on your computer."

Key insight OpenAI missed: the advantage isn't running AI in the cloud. It's the **already-booted local machine** — its existing context, secrets, file system, configuration, low latency interaction. Claude Code's minimal CLI form factor got this right. This is a categorically new mode of human-AI interaction.

*Source: 2025 Year in Review (bearblog)*

---

### Data Engine > Data

> "Competitive advantage in AI goes not so much to those with data but those with a **data engine**: iterated data acquisition, re-training, evaluation, deployment, telemetry. And whoever can spin it fastest."
> — Dec 2022 tweet

Originated from Tesla Autopilot work. A flywheel of data + model improvement matters more than a static dataset advantage.

---

### The Transformer as Differentiable Computer

> "The Transformer is a magnificent neural network architecture because it is a general-purpose differentiable computer. Simultaneously: 1) expressive (forward pass) 2) optimizable (backprop+gradient descent) 3) efficient (high parallelism compute graph)"

An MLP can be rewritten as Attention over data-independent weights. Attention is brilliant as a data-dependent weighted average — a form of global pooling, communication, aggregation of relevant information. The Transformer's 2017 form has held up with only minor modifications (mainly RoPE and friends for positional encoding).

*Source: tweets, thread on attention history*

---

### LLM Psychology

LLMs have an unusual psychology distinct from humans:

- They are completely unaware of their own strengths and limitations (finite context window, bad at mental math, samples can go off the rails)
- They are simulators: "A pretrained LLM is not an AI but a simulator" — it maintains a distribution over what kind of document it's completing
- "People spirits" — stochastic simulations of humanity, simultaneously superhuman and cognitively challenged

*Source: tweets (2023)*

---

### On Wealth and FLOP Inequality

> "How long until we measure wealth inequality in FLOPS"
> — Dec 2022

Prescient given test-time scaling: money can buy longer reasoning (more thinking time). Dynamic range of AI capability as a function of capital expenditure is a critical variable for technology diffusion — who benefits most from AI depends on whether frontier models are a commodity or a premium product.

*Source: Power to the People (bearblog)*

---

## Key Philosophical Positions

| Claim | Karpathy's Stance |
|-------|-------------------|
| AGI definition | "AGI is a feeling. Like love. Stop trying to define it." |
| Benchmarks | Don't trust them — RLVR corrupts them. "Training on test set is new art form." |
| Bitter Lesson | Correct as a platonic ideal, not necessarily practically reachable. Pretraining is crappy evolution. |
| LLM diffusion | Reverse of historical tech diffusion — individuals benefit *more* than orgs/govs today |
| Reading books | "Just reading a book is not learning but entertainment." |
| Strong statements | "It would be best if people made strong statements understood to be only 90% true, and ignore the counterexample police." |
| Automation risk | Verifiable tasks at most risk; creative/strategic/contextual tasks lag |

---

## Teaching Philosophy and Style

Karpathy is defined by a compulsion toward **minimal, from-scratch implementations**:

- micrograd → makemore → minGPT → nanoGPT → llm.c → microgpt
- Each project strips a concept to its bare mathematical operations
- microgpt: 200 lines of pure Python, zero dependencies, full GPT training
- llm.c: full LLM training in pure C/CUDA

**Learning heuristic (from tweets):**
1. Take on concrete projects depth-first; learn "on demand" (not breadth-first)
2. Teach/summarize everything in your own words
3. Only compare yourself to younger you, never to others

**Most valuable college subject:** Physics — for general problem-solving intuitions: modeling with increasingly complex terms, extrapolating to limits, pursuing simplest powerful solutions.

---

## Practical Deep Learning Wisdom

From "A Recipe for Training Neural Networks" (2019):

- Neural nets **fail silently** — the error surface is logical, not syntactic
- Always overfit a single batch first
- Visualize data *immediately* before it enters the network
- Sort dataset by loss descending — always reveals something unexpected
- 3e-4 is the best learning rate for Adam
- Random > grid search for hyperparameters
- Model ensembles = guaranteed +2% accuracy
- Leave models training longer than you think
- Get more real data before any other regularization

**Most common mistakes:**
1. No single-batch overfit first
2. Forgot train/eval mode toggle
3. Forgot `.zero_grad()` before `.backward()`
4. Passed softmax outputs to loss expecting raw logits

---

## GitHub Repos: Key Projects

| Project | Purpose |
|---------|---------|
| [[nanoGPT]] | Simplest, fastest GPT training/finetuning |
| [[nn-zero-to-hero]] | Full video course: Neural Networks Zero to Hero |
| [[micrograd]] | Tiny autograd engine — the atom of deep learning |
| [[minbpe]] | Minimal BPE tokenization |
| [[llm.c]] | LLM training in pure C/CUDA |
| [[makemore]] | Autoregressive character-level models |
| [[autoresearch]] | AI agents doing automated research (71k stars) |
| [[nanochat]] | Best ChatGPT $100 can buy (51k stars) |
| [[LLM101n]] | Let's build a Storyteller — LLM course |

---

## Timeline of Ideas

| Year | Key contribution |
|------|----------------|
| 2014 | ConvNetJS, neuraltalk — pioneered JS ML; image captioning |
| 2015 | char-rnn, "Unreasonable Effectiveness of RNNs" |
| 2015–16 | Deep RL: Pong from Pixels, PhD survival guide |
| 2017 | Software 2.0 concept (neural nets as programs) |
| 2017–22 | Tesla Autopilot: data engine, autonomous driving at scale |
| 2019 | Recipe for Training Neural Networks |
| 2022 | Rejoined OpenAI; coined "English as programming language" |
| 2022 | nanoGPT, build-nanogpt video course |
| 2023 | "The hottest new programming language is English"; AutoGPT concept; minbpe |
| 2024 | LLM101n; left OpenAI to found Eureka Labs |
| 2025 | Vibe coding coined; llm.c; nanochat; 2025 Year in Review |
| 2026 | microgpt (200-line GPT); autoresearch |

---

## LLM Coding Guidelines (Karpathy-Derived)

Four principles for reducing common LLM coding mistakes. Source: forrestchang/andrej-karpathy-skills.

| Principle | Core Rule |
|-----------|-----------|
| Think Before Coding | Surface assumptions + interpretations before implementing. Ask if unclear. |
| Simplicity First | Minimum code to solve the problem. Nothing speculative or unasked-for. |
| Surgical Changes | Touch only what the request requires. Mention unrelated issues, don't fix them. |
| Goal-Driven Execution | Transform tasks into verifiable goals. State plan as `[Step] → verify: [check]` before starting. |

**Key heuristics:**
- "Would a senior engineer say this is overcomplicated?" → If yes, simplify.
- Every changed line should trace directly to the user's request.
- Strong success criteria = independent looping. Weak criteria = constant clarification.

*Source: [[Resources/raw/karpathy/andrej-karpathy-skills]]*

---

## On Attention (History)

Based on personal correspondence with Dzmitry Bahdanau: The "attention" term was coined late in the process by Yoshua Bengio (replacing "RNNSearch"). Inspired by the human cognitive process of attending to source words while emitting translations. Similar ideas were in the air simultaneously (Alex Graves' Neural Turing Machines, Jason Weston's Memory Networks). "Attention is All You Need" (Transformer paper) gets ~100x more attention than the original attention paper by Bahdanau et al. 2014 — which actually *introduced* attention.

*Source: Karpathy tweet thread, Feb 2025*
