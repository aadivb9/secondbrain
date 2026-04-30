---
created: 2026-04-20
tags: [wiki, karpathy, deep-learning, autograd, education]
status: active
related: [[karpathy]]
---

# micrograd

Synthesized from [[Resources/raw/karpathy/micrograd]].

> Do not edit manually — regenerate via `/wiki-ingest`.

---

## What it is

A ~150-line Python library by [[karpathy]]:
- **engine.py** (~100 lines): scalar-valued autograd engine
- **nn.py** (~50 lines): PyTorch-like neural net library on top

Reverse-mode autodiff over a dynamically-built DAG of scalars. Every neuron is chopped into individual adds and multiplies. (→ [micrograd README](https://github.com/karpathy/micrograd))

Purpose: **pedagogy, not performance**. Same math as PyTorch, stripped to a readable minimum. Companion to the first lecture of Karpathy's *Neural Networks: Zero to Hero* course.

---

## Mental model: the Lego block

Each op is a block. It:
1. Takes inputs → produces output (**forward pass**)
2. Knows how output changes w.r.t. each input (**local gradient**)

Chain rule strings the blocks together. That's it. (→ [Queryloop explainer](https://www.queryloop.ai/blog/explanation-of-karpathy-s-micrograd))

---

## The Value class

A `Value` wraps one scalar and tracks:

| Field | Role |
|-------|------|
| `data` | the scalar |
| `grad` | accumulated gradient (starts 0) |
| `_prev` | set of parent Values |
| `_op` | op that made it |
| `_backward` | closure that applies local chain rule |

### Supported ops (canonical repo)

| Op | Forward | Backward (chain rule) |
|----|---------|-----------------------|
| `+` | `a + b` | grad flows equally to both |
| `*` | `a * b` | each gets other's `data × out.grad` |
| `**n` | `a**n` | `n * a**(n-1) * out.grad` |
| `relu` | `max(0, a)` | pass grad only if `out > 0` |

Operator overloads (`__sub__`, `__truediv__`, `__neg__`, reverse variants) are built from these.

> Note: `tanh` and `exp` are **not** in the canonical `engine.py` — Karpathy adds them live in the Zero-to-Hero lecture to show how to extend the engine.

---

## backward()

Standard reverse-mode autodiff:

```
1. DFS over _prev to build topological order
2. out.grad = 1.0
3. Walk reversed topo order, call each node._backward()
```

Gradients **accumulate** (`+=`), which is what lets a Value be used multiple times in the same expression.

---

## The nn module (PyTorch-like)

| Class | What |
|-------|------|
| `Neuron(nin)` | weights + bias, optional `relu` nonlin |
| `Layer(nin, nout)` | list of Neurons |
| `MLP(nin, nouts)` | list of Layers; exposes `.parameters()` |

Training loop: forward → loss → `zero_grad` → `backward` → SGD step. Same shape as PyTorch.

---

## Canonical demo

From `demo.ipynb`:
- 2-layer MLP, 16 hidden units
- sklearn moons dataset (binary classification)
- SVM max-margin loss
- SGD

Validates that scalar-granular autograd actually trains a real classifier. (→ [micrograd repo](https://github.com/karpathy/micrograd))

---

## README example

```python
from micrograd.engine import Value

a = Value(-4.0); b = Value(2.0)
c = a + b
d = a * b + b**3
c += c + 1
c += 1 + c + (-a)
d += d * 2 + (b + a).relu()
d += 3 * d + (b - a).relu()
e = c - d
f = e**2
g = f / 2.0 + 10.0 / f
g.backward()
# a.grad = 138.8338, b.grad = 645.5773
```

Tests in the repo compare these exact gradients against PyTorch.

---

## Why it matters

### Place in Karpathy's ladder

micrograd → [[makemore]] → [[minGPT]] → [[nanoGPT]] → [[llm.c]] → [[microgpt]]

micrograd is the **atom**: autodiff itself. Every other minimalist project assumes you understand this one. (→ [[karpathy#Building in Public]])

### What it actually teaches

- Backprop is not magic — it's one DFS plus local chain rules.
- PyTorch's magic is tensor efficiency, **not** different math.
- You can implement a working deep-learning framework in an afternoon.

### Pedagogical design principle

Scalar granularity sacrifices speed to kill incidental complexity. You never confuse "tensor broadcasting bug" with "I don't understand backprop." (→ [DeepWiki: Autograd Engine](https://deepwiki.com/karpathy/micrograd/2-autograd-engine))

---

## Community ports

TypeScript (`trekhleb/micrograd-ts`), Scala (`sicrograd`), Crystal (`micrograd.cr`), Go walkthrough at nathan.rs. Reimplementing micrograd in your language of choice is a rite of passage.

---

## For Aadi (builder angle)

- **Read it first, then write it from scratch.** The Zero-to-Hero micrograd video + typing it yourself is the fastest known path to understanding backprop.
- **Fits Karpathy's "build the atom, then scale" pattern** (→ [[karpathy#Core Mental Models]]). Good model for your own projects: pick the smallest honest version, ship it, then compound.
- **150 lines.** If a library is legendary at 150 lines, complexity is usually a choice.

---

## Sources

- [[Resources/raw/karpathy/micrograd]] — raw notes + quotes
- [karpathy/micrograd](https://github.com/karpathy/micrograd) — official repo
- [engine.py source](https://github.com/karpathy/micrograd/blob/master/micrograd/engine.py)
- [Queryloop explainer](https://www.queryloop.ai/blog/explanation-of-karpathy-s-micrograd)
- [DeepWiki: Autograd Engine](https://deepwiki.com/karpathy/micrograd/2-autograd-engine)
- [nathan.rs — Micrograd in Go](https://nathan.rs/posts/go-micrograd/)
