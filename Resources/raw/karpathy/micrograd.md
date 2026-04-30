---
source: https://github.com/karpathy/micrograd
ingested: 2026-04-20
type: github-repo
status: immutable
---

# micrograd — raw source notes

Source: https://github.com/karpathy/micrograd
Author: Andrej Karpathy
License: MIT

## Project description

Tiny scalar-valued autograd engine + neural net library on top, PyTorch-like API.
- engine: ~100 lines
- nn: ~50 lines
- Total: ~150 lines

## What it is

> "A tiny Autograd engine (with a bite! :)). Implements backpropagation (reverse-mode autodiff) over a dynamically built DAG and a small neural networks library on top of it with a PyTorch-like API. Both are tiny, with about 100 and 50 lines of code respectively. The DAG only operates over scalar values, so e.g. we chop up each neuron into all of its individual tiny adds and multiplies."

## Why it exists

- Pedagogical. Scalar granularity avoids tensor complexity.
- Same math/intuition as PyTorch — just minimal and readable.
- Companion to the "Neural Networks: Zero to Hero" video series (first episode: "The spelled-out intro to neural networks and backpropagation: building micrograd").

## Core API

### Value class (engine.py)

Wraps a single scalar. Tracks:
- `data` — the scalar value
- `grad` — gradient (starts at 0)
- `_prev` — set of parent Values in the DAG
- `_op` — operation that produced it
- `_backward` — closure that implements local chain rule for that op

Supported ops in the canonical repo:
- `__add__` — grad flows equally to both operands
- `__mul__` — product rule: each operand gets other's data × out.grad
- `__pow__(other)` — power rule: `other * self**(other-1) * out.grad`
- `relu` — pass grad only if out > 0
- Operator overloads: `__radd__`, `__sub__`, `__rsub__`, `__rmul__`, `__truediv__`, `__rtruediv__`, `__neg__`

### backward()

1. Build topological order via DFS over `_prev`
2. Set output `grad = 1.0`
3. Walk reversed topo order, call each node's `_backward()`

### nn.py

- `Neuron(nin)` — weights + bias, optional nonlin (relu)
- `Layer(nin, nout)` — list of Neurons
- `MLP(nin, nouts)` — list of Layers, PyTorch-like API (`.parameters()`, `zero_grad` idiom)

## Example from README

```python
from micrograd.engine import Value

a = Value(-4.0)
b = Value(2.0)
c = a + b
d = a * b + b**3
c += c + 1
c += 1 + c + (-a)
d += d * 2 + (b + a).relu()
d += 3 * d + (b - a).relu()
e = c - d
f = e**2
g = f / 2.0
g += 10.0 / f
print(f'{g.data:.4f}') # prints 24.7041, outcome of forward pass
g.backward()
print(f'{a.grad:.4f}') # prints 138.8338, i.e. dg/da
print(f'{b.grad:.4f}') # prints 645.5773, i.e. dg/db
```

## Training demo (demo.ipynb)

- 2-layer MLP, 16 hidden units
- Moon dataset (sklearn)
- SVM max-margin loss
- SGD
- Binary classification

## Visualization

`trace_graph.ipynb` uses graphviz to render DAG with data + grad per node.

## Tests

Unit tests in `test/` compare gradients against PyTorch on sample expressions.

## Install

```
pip install micrograd
```

## Position in Karpathy's minimalism ladder

micrograd → makemore → minGPT → nanoGPT → llm.c → microgpt

Each strips a concept to bare math ops. micrograd is the atom: autodiff itself.

## Community ports

TypeScript (trekhleb/micrograd-ts), Scala (sicrograd), Crystal (micrograd.cr), Go (nathan.rs walkthrough), plus many forks.

## Key quotes / pedagogical framing

- "Think of each operation as a little lego block: it takes some inputs, produces an output (the forward pass), and it knows how its output would change with respect to each of its inputs (the local gradient). Everything else is just the chain rule, stringing the blocks together."
- "None of the fundamental math and intuition changes" between scalar micrograd and real tensor libraries.

## Related sources

- https://github.com/karpathy/micrograd — repo
- https://github.com/karpathy/micrograd/blob/master/micrograd/engine.py — engine
- https://nathan.rs/posts/go-micrograd/ — Go reimplementation walkthrough
- https://www.queryloop.ai/blog/explanation-of-karpathy-s-micrograd — explainer
- https://deepwiki.com/karpathy/micrograd/2-autograd-engine — DeepWiki
- "The spelled-out intro to neural networks and backpropagation: building micrograd" (YouTube, Karpathy) — the canonical lecture
