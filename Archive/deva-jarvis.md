---
created: 2026-04-16
tags: [archive, project/deva, ai, local-llm]
status: archived
related: []
---

# DEVA / Jarvis — Local AI Assistant

Personal AI assistant built on local LLMs. Archived April 2026.

## What It Was

A local Jarvis-style AI assistant running entirely on-device — no cloud API keys needed. Flask web server with a dark Iron Man–style UI.

## Stack

- **LLM**: Ollama (`llama3.2:3b` for speed, `gemma4` available)
- **Backend**: Python / Flask (`jarvis/app.py`)
- **Frontend**: Single-page HTML/CSS/JS (`jarvis/templates/index.html`)
- **TTS**: macOS `say` command (Samantha voice, 200 wpm)
- **STT**: Web Speech API (Chrome only)
- **Wake word**: "deva" — continuous background listener

## Features Built

- Morning briefing sidebar (reads vault projects, inbox, daily note)
- Streaming chat responses (token-by-token via SSE)
- Voice: push-to-talk (hold Space), click mic, wake word "deva ..."
- TTS interruption (speaking deva / pressing space stops current speech)
- Orb UI with 4 states: idle (blue), listening (red), thinking (orange), speaking (green)

## Computer Control Actions

| Command | Action |
|---|---|
| `open <app>` | Opens any Mac app |
| `close <app>` | Quits app via AppleScript |
| `email <person> about <topic>` | Drafts email in Mail.app |
| `remind me to <task> at <time>` | Adds to Reminders |
| `add <event> to calendar` | Creates Calendar event |
| `create a note called <title>` | Creates Apple Note |
| `save a note to my vault about <topic>` | Creates `.md` in Inbox/ |
| `mark <task> done` | Checks off task in vault |
| `search <query>` | Google search in browser |
| `screenshot` | Saves PNG to Desktop |
| `volume up/down/mute` | System volume |
| `set brightness to <N>` | Screen brightness |

## Intent Detection Architecture

Two-stage pipeline:
1. Fast regex for simple commands (open/close app, volume)
2. LLM classification for complex natural language → structured JSON action
3. Execute action → stream verbal confirmation from LLM

## Key Files (deleted)

- `jarvis/app.py` — Flask backend, action library, Ollama streaming
- `jarvis/templates/index.html` — full UI with orb, voice, chat
- `deva.py` — standalone wake-word script (original prototype)

## To Rebuild

```bash
# Install deps
brew install portaudio ollama
pip3 install flask requests SpeechRecognition pyaudio

# Pull a fast model
ollama pull llama3.2:3b

# Run
ollama serve &
python3 jarvis/app.py
# open http://localhost:5050
```

## Why Archived

Decided the local assistant wasn't necessary at this time.
