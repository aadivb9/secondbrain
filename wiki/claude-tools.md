---
created: 2026-04-19
updated: 2026-04-19
tags:
  - wiki
  - claude-tools
  - developer-tools
status: active
sources:
  - Resources/raw/claude-tools/julius-brussee-github.md
---

# Claude Tools & AI Developer Utilities

Curated knowledge on Claude Code plugins, AI agent tooling, and developer productivity tools.

## Token Compression

**caveman** — terse output mode for AI agents. Drops articles, filler, hedging. Fragments OK. Code untouched. Four levels: Lite (~65% reduction), Full (~70%), Ultra (~75%), 文言文 (Classical Chinese). Works across Claude Code, Cursor, Codex, Gemini CLI, Windsurf, 40+ agents. Related: `/caveman-compress` compresses CLAUDE.md by ~46%.

## Persistent Cross-Session Memory

**cavemem** — MCP server for cross-agent memory. Hook-captured session events → compress via caveman grammar → SQLite local store → searchable via 3 MCP tools. ~75% token reduction on stored observations. Web viewer at `localhost:37777`. Strips `<private>` tags before storage. Works with Claude Code, Cursor, Gemini CLI.

Key tools exposed:
- `search` — full-text search across sessions
- `timeline` — chronological session view
- `get_observations` — fetch full observation bodies

## Spec-Driven Parallel Development

**cavekit** — Claude Code plugin for autonomous multi-agent builds. Workflow: `sketch` (decompose to R-numbered requirements) → `map` (tiered dependency graph) → `make` (parallel autonomous loop) → `check` (gap analysis + review verdict). Codex integration for adversarial review. Circuit breakers prevent infinite loops. Team mode: git-backed task claims with file footprints.

## Spaced Repetition Study

**revu-swift** — macOS local-first study app. FSRS scheduling algorithm (adaptive, beats fixed intervals). Decks, nested folders, flashcards, exams, study guides. Anki import (.apkg/.colpkg), CSV/Markdown/JSON import. SQLite at `~/Library/Application Support/revu/v1/`. No cloud. SwiftUI MVVM, keyboard-optimized.

## Logo / Visual Design

**logo-designer** — TypeScript pixel-grid editor. Draw on grid → export clean SVG/PNG.

## Sources
- [[Resources/raw/claude-tools/julius-brussee-github]] — JuliusBrussee GitHub profile research, Apr 2026
