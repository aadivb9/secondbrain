---
created: 2026-04-13
tags:
  - project/lockedIn
  - ios
  - swift
  - app-store
status: active
related: []
---

# lockedIn

An iOS app that gates distracting apps (Instagram, TikTok, etc.) behind a quiz on your own study material. Built on Apple's Family Controls / Screen Time framework.

> [!info] Project Location
> Xcode project: `/Users/aadigupta/Desktop/lockedIn/lockedIn.xcodeproj`

---

## Core Concept

- User selects apps to block
- Blocked app → custom shield overlay appears
- Tap "Take the Quiz" → quiz generated from user's study notes
- Pass (≥80%) → app unlocked for a timed window
- Timer expires → app re-locked automatically in background

---

## Architecture

### Targets

| Target | Role |
|--------|------|
| `lockedIn` | Main SwiftUI app |
| `DeviceActivityMonitorExtension` | Re-locks apps when unlock window expires |
| `ShieldConfigExtension` | Custom block overlay UI |
| `ShieldActionExtension` | Handles "Take Quiz" button tap on shield |

### Key Services

| File | Purpose |
|------|---------|
| `AppState.swift` | Central `@Observable` state container |
| `ScreenTimeManager.swift` | Family Controls / ManagedSettings integration |
| `SharedDefaults.swift` | App Group bridge between app and extensions |
| `AIQuizGenerator.swift` | Gemini 2.5 Flash API quiz generation |
| `QuizGenerator.swift` | Local fallback quiz generator |
| `GeminiVisionService.swift` | Image analysis (exists, not yet wired in) |
| `PDFExtractor.swift` | PDF parsing (exists, UI not yet exposed) |

### Cross-Extension Communication
- App Group: `group.lockedIn.shared`
- Key: `quizNeededOnResume` — set true when shields active, checked on foreground
- Key: `familyActivitySelectionData` — serialized `FamilyActivitySelection`
- Key: `dailyGrantedSeconds` — cumulative unlock time per day

---

## Features

### Implemented
- Family Controls authorization + app selection picker
- Shield application / removal via `ManagedSettings`
- AI quiz generation (Gemini 2.5 Flash, structured JSON schema)
- Local fallback quiz generation (sentence + term extraction)
- `DeviceActivity` re-shield scheduling (end-of-day window + threshold)
- Local notification fallback for re-shield timing
- Study material management (text input)
- Quiz editor — review/reorder questions before taking
- XP + leveling system (XP = (N-1)² × 100 per level)
- Streak tracking (current + longest)
- Per-topic accuracy tracking
- Difficulty auto-scaling (easy → expert based on accuracy)
- Unlock duration scales with level (10 min at level 0–2 → 30 min at level 10+)
- Deep link: `lockedin://quiz` auto-triggers quiz
- "Lava obsidian" design system (dark + molten orange-red `#FF4212`)

### Incomplete / Not Yet Wired
- `GeminiVisionService` — image analysis service built, not integrated into quiz flow
- PDF upload — `PDFExtractor` exists, but no UI in `StudyMaterialView`
- Crash reporting / analytics (only `print()` statements currently)
- Gemini API key hardcoded — needs to move before App Store submission

---

## Data Models

```
BlockedApp       — app being monitored; tracks unlockExpiry: Date?
StudyMaterial    — user notes (title, content, category)
Question         — quiz question (MC / true-false / fill-in-the-blank)
Quiz             — collection of questions, passing score (default 80%)
QuizResult       — historical attempt record
UserStats        — XP, level, streaks, topic accuracy
```

---

## Entitlements

| Capability | Main App | Extensions |
|-----------|----------|------------|
| `com.apple.developer.family-controls` | ✅ | ✅ all 3 |
| `family-controls.app-and-website-usage` | ✅ | — |
| `com.apple.security.application-groups` | ✅ | ✅ DeviceActivity |

---

## Before App Store Submission

> [!warning] Pre-Submission Checklist
> - [ ] Move Gemini API key out of source (use environment config or remote fetch)
> - [ ] Wire in `GeminiVisionService` or remove dead code
> - [ ] Add PDF upload UI in `StudyMaterialView`
> - [ ] Add crash reporting (Crashlytics or equivalent)
> - [ ] Test on physical device — Family Controls doesn't work in Simulator
> - [ ] Privacy manifest (`PrivacyInfo.xcprivacy`) — required for App Store
> - [ ] Review App Store guidelines for Screen Time / parental controls category
> - [ ] App icon + screenshots
> - [ ] TestFlight beta before submission

---

## Tech Stack

- Swift / SwiftUI
- Family Controls, ManagedSettings, DeviceActivity (Apple frameworks)
- Google Gemini 2.5 Flash (AI quiz generation)
- App Groups (cross-extension IPC)
- UserDefaults + Codable (persistence)

---

## Session Log

- **2026-04-13** — Project captured into second brain. Core flow complete. Key gaps: API key security, PDF UI, analytics.
