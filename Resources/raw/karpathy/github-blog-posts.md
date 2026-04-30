---
created: 2026-04-13
tags: [karpathy, blog, raw]
status: active
source: https://karpathy.github.io
---

# Karpathy: GitHub Blog Posts (Raw Source)

Immutable captures of key posts from karpathy.github.io

---

## microgpt (2026)
Source: https://karpathy.github.io/2026/02/12/microgpt/

200 lines of pure, dependency-free Python to train and inference a GPT. Full algorithmic content with no dependencies. Contains: dataset loading, character-level tokenizer, scalar autograd engine (micrograd-style), GPT-2-like architecture, Adam optimizer, training loop, inference loop.

Key point: "Everything else is just efficiency. I cannot simplify this any further." Culmination of micrograd → makemore → nanoGPT → microgpt. Trained on 32k names dataset. Available as Google Colab, GitHub gist, and printable triptych art.

The autograd engine uses a `Value` class with `data`, `grad`, `_children`, `_local_grads`. Backprop via topological sort. Demonstrates that the core LLM algorithm fits in one screenful.

---

## A Recipe for Training Neural Networks (2019)
Source: https://karpathy.github.io/2019/04/25/recipe/

Karpathy's 6-step process for reliably training neural nets:

**Core insight:** Neural net training is a leaky abstraction that fails silently. You must be patient, thorough, defensive, paranoid, and obsessed with visualizations.

**The recipe:**
1. **Become one with the data** — spend hours scanning thousands of examples, look for patterns, imbalances, corrupted labels, duplicates. Your process of classification hints at future architectures.
2. **Set up training/evaluation skeleton + get dumb baselines** — use a simple model you couldn't have screwed up. Fix random seed. Disable data augmentation. Verify loss at init (e.g. `-log(1/n_classes)` for softmax). Overfit one batch. Visualize just before the net. Visualize prediction dynamics.
3. **Overfit** — first get a model large enough to overfit (focus on training loss). Then regularize.
4. **Regularize** — preferred order: get more real data → data augmentation → creative augmentation → pretrain → reduce input dims → reduce model size → decrease batch size → dropout → weight decay → early stopping.
5. **Tune** — use random over grid search for hyperparameters.
6. **Squeeze out the juice** — model ensembles (+2% accuracy, guaranteed). Leave it training longer than you think.

**Famous tweet tie-in:** 3e-4 is the best learning rate for Adam. Sort dataset descending by loss — always reveals something unexpected.

---

## Deep Neural Nets: 33 years ago and 33 years from now (2022)
Source: https://karpathy.github.io/2022/03/14/lecun1989/

Reproduced LeCun et al. 1989 — the earliest real-world backprop neural net (handwritten zip code). Used 33 years of progress to dramatically improve results. Then speculated: what will 2022's deep learning look like to someone in 2055?

---

## A from-scratch tour of Bitcoin in Python (2021)
Source: https://karpathy.github.io/2021/06/21/blockchain/

Create, digitally sign, and broadcast a Bitcoin transaction in pure Python with zero dependencies. Educational cryptography + blockchain implementation.

---

## Biohacking Lite (2020)
Source: https://karpathy.github.io/2020/06/11/biohacking-lite/

Personal experiments in biochemistry and energy metabolism. Karpathy's approach to quantified self applied to nutrition and running. Reflects interest in biology as "alien technology."

---

## A Survival Guide to a PhD (2016)
Source: https://karpathy.github.io/2016/09/07/phd/

Practical advice for PhD students. Key themes: advisor relationship, navigating publication culture, the importance of implementation skills, presentations, and maintaining research taste.

---

## Deep Reinforcement Learning: Pong from Pixels (2016)
Source: https://karpathy.github.io/2016/05/31/rl/

Policy gradient walkthrough: trains RL agent to play Atari Pong from raw pixels. 130-line Python + NumPy, no ML libraries. Explains pros/cons of policy gradients vs. value-based methods.

---

## The Unreasonable Effectiveness of Recurrent Neural Networks (2015)
Source: https://karpathy.github.io/2015/05/21/rnn-effectiveness/

Character-level RNN language models that learn to write poetry, LaTeX math, code, and Linux kernel source. Demonstrated surprising capability of vanilla LSTMs and hinted at the power of language modeling as a pretraining objective — years before GPT.

---

## What a Deep Neural Network thinks about your #selfie (2015)
Source: https://karpathy.github.io/2015/10/25/selfie/

Trained a ConvNet on 2 million scraped selfies to classify "good" vs. "bad." Illustrated practical pipeline of web scraping, labeling heuristics, training, and deployment.

---

## Blog posts index (all)

| Year | Title |
|------|-------|
| 2026 | microgpt |
| 2022 | Deep Neural Nets: 33 years ago and 33 years from now |
| 2021 | A from-scratch tour of Bitcoin in Python |
| 2021 | Short Story on AI: Forward Pass |
| 2020 | Biohacking Lite |
| 2019 | A Recipe for Training Neural Networks |
| 2016 | A Survival Guide to a PhD |
| 2016 | Deep Reinforcement Learning: Pong from Pixels |
| 2015 | Short Story on AI: A Cognitive Discontinuity |
| 2015 | What a Deep Neural Network thinks about your #selfie |
| 2015 | The Unreasonable Effectiveness of Recurrent Neural Networks |
| 2015 | Breaking Linear Classifiers on ImageNet |
| 2014 | What I learned from competing against a ConvNet on ImageNet |
| 2014 | Quantifying Productivity |
| 2014 | Feature Learning Escapades |
| 2014 | Visualizing Top Tweeps with t-SNE in Javascript |
| 2013 | Quantifying Hacker News with 50 days of data |
| 2012 | The state of Computer Vision and AI: we are really, really far away |
| 2011 | Lessons learned from manually classifying CIFAR-10 |
