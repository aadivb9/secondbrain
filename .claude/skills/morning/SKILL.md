---
name: morning
description: Morning briefing skill. Checks Gmail inbox, Google Calendar for today and this week, scans Projects/ for deadlines and blockers, then produces an itemized situation report and a time-blocked schedule for the day. Trigger word: "morning".
user-invocable: true
---

# Morning Briefing

Run this skill whenever the user types `morning`. It pulls together email, calendar, and project state into one actionable daily plan.

## Workflow

### 1. Get today's date
Today's date is already in context via `currentDate`. Use it for all date comparisons.

### 2. Check Gmail
Use `mcp__claude_ai_Gmail__search_threads` to fetch recent unread and important mail:
- Query 1: `is:unread` — cap at 20 results
- Query 2: `is:important newer_than:2d` — cap at 10 results

For each thread that looks actionable (needs a reply, decision, or follow-up), note:
- Sender
- Subject
- One-line summary of what's needed

Ignore newsletters, notifications, and automated mail.

### 3. Check Google Calendar
**Step A** — Call `mcp__claude_ai_Google_Calendar__list_calendars` (pageSize: 250). Extract the `id` field from every calendar returned — this includes primary, shared-with-me, and custom calendars.

**Step B** — For **each** calendar `id` from Step A, call `mcp__claude_ai_Google_Calendar__list_events` with:
- `calendarId`: the calendar's `id`
- `startTime`: start of today (midnight local)
- `endTime`: 7 days from now
- `orderBy`: `startTime`

Merge all results, deduplicate by event id, sort by start time. Skip any events matching: "TSSO", "Physics Club".

**All-day event date rule:** For all-day events, Google Calendar uses an *exclusive* end date — `end.date: 2026-04-20` means the event ends before Apr 20, not on it. Never show an all-day event on its `end.date` day.

For each event note:
- Time and duration
- Title / description
- Which calendar it came from (use calendar summary/name)
- Whether prep is needed

### 4. Scan Projects/ for deadlines
Use the `obsidian` CLI or Read tool to check all notes under `Projects/`:

```bash
obsidian search query="#project" path="Projects"
```

Read each active project note and extract:
- Project name
- Stated deadline or due date
- Current status / blockers
- Next action item

Flag any deadline within 7 days as **urgent**.

### 5. AI News Digest
Use the `deep-search` skill to research what's happened in AI in the past 1–2 days:

```
/deep-search What are the most important AI news, model releases, research papers, and industry developments from the past 48 hours?
```

Summarize the top 3–5 findings. For each item note:
- What happened
- Why it matters (1 sentence)
- Source if available

**Prioritization rules — rank in this order:**
1. Open source model releases (e.g. Gemma, Llama, DeepSeek, Mistral) — always surface these
2. Tools, APIs, or libraries the user can immediately use or integrate
3. Research papers with practical takeaways
4. Product launches with accessible free tiers

**Deprioritize / skip:**
- Data center builds, infrastructure investments
- Corporate funding rounds, acquisitions, IPO news
- "Company X surpassed $Y billion in revenue" business metrics
- Regulatory/policy news unless it directly affects developers

### 6. Instagram Reel Scripts
Using the AI news findings from step 5, generate **3 fully captivating Instagram Reel scripts** (60–90 seconds each when spoken aloud at a natural pace).

Each script must follow this structure:

**Hook (0–3 sec)** — Open with a question, bold claim, or shocking stat. The viewer should stop scrolling immediately.

**Body (4–75 sec)** — Short punchy sentences. One idea per line. No jargon. Write for spoken delivery, not reading.

**CTA (last 5 sec)** — Strong call to action: follow, comment with a specific word, or share.

Include `[VISUAL CUE: ...]` markers throughout for b-roll suggestions, on-screen text, or transitions.

**Tone:** Tech-savvy but accessible. Feels like a viral creator who actually understands AI — not a tutorial, not a press release.

**Pick 3 different news items** from the digest, one per script. If fewer than 3 news items were found, pick the strongest angles from what exists.

Output format for each script:
```
---
**Script [N]: [Topic in 5 words or fewer]**
[VISUAL CUE: opening frame description]

[Hook line]

[Body — line by line, each line = one spoken beat]
[VISUAL CUE: transition / overlay suggestions mid-script]

[CTA line]
---
```

### 7. Daily Workout
Generate a workout recommendation tailored to the user's two sports:
- **Volleyball** — training for nationals; setter + right side hitter; needs explosive jumps, shoulder strength, core, lateral quickness, setting endurance
- **Archery** — training for states; needs back/scapular strength, core stability, shoulder endurance, grip, stillness/breathing

Vary the workout daily — don't repeat the same session two days in a row. Check the day of week:
- Mon/Wed/Fri → heavier strength focus
- Tue/Thu → speed, agility, endurance focus
- Sat → full combined session
- Sun → active recovery / mobility

Workout is 30 minutes max. Default slot: 4:30–5:00 AM (pre-breakfast). User sometimes works in morning too — keep workout tight, leave room for work in remaining pre-school gap.

Output format:
```
### Today's Workout
**Volleyball** — [focus]: [exercises]
**Archery** — [focus]: [exercises]
Slot: [time block from free gaps]
```

### 8. Proactive Situation Awareness

After merging all calendar events, think like a smart assistant who knows Aadi's life. Look at every event in the next 14 days and reason about what needs to happen *before* or *because of* it. Surface anything actionable as **⚠️ Action Items** — never skip silently, never assume it's been handled.

Run all of these checks:

**A. School absences**
School: Mon/Tue/Thu/Fri 7 AM–3:30 PM, Wed 7 AM–1:30 PM. Any non-school event overlapping a school day → flag it.
- Remind to email teachers proactively to get assignments/tests in advance
- Ask: "Have you already talked to your teachers about missing [dates]?"

**B. Packing / gear**
Any competition, tournament, overnight trip, or travel event within 3 days:
- Remind to pack. Think about what's needed based on the event type:
  - Volleyball tournament → jersey, knee pads, shoes, water, snacks
  - FBLA/academic competition → dress clothes, laptop, charger, printed materials, ID
  - Archery → bow, arrows, arm guard, finger tab, scoring sheets
  - Overnight → toiletries, clothes, phone charger
- Ask: "Have you packed for [event]? Here's what you'll likely need: [list]"

**C. Time conflicts**
Two events overlap on the same day → list both, ask which to handle/notify, don't pick.

**D. Recurring commitment conflicts**
Multi-day event overlaps with a recurring commitment (practice, club, class):
- Ask: "You have [recurring event] on [day] — do you need to let them know you won't be there?"

**E. Prep & logistics**
For any important event (competition, meeting with counselor, exam, presentation) within 3 days:
- Think about what prep is realistically needed and ask about it
- Examples:
  - FBLA competition → "Have you reviewed your event material? Do you know the location/time?"
  - PathIvy meeting → "Do you have your resume/notes ready for Liz?"
  - Exam → "Have you studied for [subject]?"
  - Away tournament → "Do you have a ride? Do you know the address?"

**F. Registration / deadlines**
If a competition or program has a known registration deadline coming up → flag it.

**G. Charge everything**
Every night → remind: "Charge your phone, laptop, and any other devices before bed."
Surface this at the end of the briefing as a nightly checklist item.

**H. Tell your dad**
Any time there's a competition, tournament, away trip, or event where you're leaving the house → remind: "Text your dad before you leave — let him know where you're going and when."

**Key rule:** Ask, don't assume. One smart question beats a missed detail. Keep it tight — only surface what's genuinely actionable, not noise.

Output all of these under **⚠️ Action Items** at the top of the briefing, before email.

### 9. Compose the Morning Briefing

Output a structured briefing in this exact format:

---

## Morning Briefing — {DATE}

### ⚠️ Action Items
| # | What | Why |
|---|------|-----|
| 1 | Email teachers for [event] absence on [days] | Missing school [dates] |

*(If no conflicts: skip this section.)*

### Email — Action Required
| # | From | Subject | Action needed |
|---|------|---------|---------------|
| 1 | ... | ... | ... |

*(If no actionable email: "Inbox clear — nothing urgent.")*

### Today's Calendar
| Time | Event | Prep needed? |
|------|-------|--------------|
| 9:00 AM | ... | Yes / No |

*(If nothing today: "No events scheduled.")*

### Project Deadlines
| Project | Deadline | Status | Next action |
|---------|----------|--------|-------------|
| ... | ... | ... | ... |

*(Flag anything due within 7 days with 🔴)*

### AI News — Last 48 Hours
| # | What | Why it matters |
|---|------|----------------|
| 1 | ... | ... |

### Today's Workout
**Volleyball** — [focus]: [exercises]
**Archery** — [focus]: [exercises]
Slot: [time]

### Instagram Reel Scripts
---
**Script 1: [topic]**
[full script with visual cues]

---
**Script 2: [topic]**
[full script with visual cues]

---
**Script 3: [topic]**
[full script with visual cues]

---

### Suggested Schedule for Today
Build a time-blocked plan using:
- Fixed calendar events (unmovable)
- Email actions slotted into gaps
- Project work prioritized by urgency

Example output:
```
9:00–10:00   [Calendar] Team standup
10:00–11:30  [Project] Work on <highest urgency task>
11:30–12:00  [Email] Reply to <sender> re: <subject>
12:00–1:00   Lunch
1:00–3:00    [Project] <next priority>
3:00–3:30    [Email] <second reply>
3:30–5:00    [Project] <remaining work>
```

Adapt the schedule to the real events and tasks found. Do not invent time slots — leave gaps unscheduled if there's nothing to fill them.

---

### 6. Save the briefing (optional)
After displaying, offer to save the briefing to the vault:
```
Save this to Inbox/morning-{DATE}.md? (yes/no)
```
If yes, write it with frontmatter:
```yaml
---
created: {DATE}
tags: [morning-briefing]
status: active
related: []
---
```

## Key Rules
- Never fabricate email content — only summarize what the tools actually return
- If a tool call fails or returns empty, say so explicitly rather than skipping silently
- Prioritize ruthlessly: surface only what requires action today, not everything in existence
- Keep the schedule realistic — do not pack every minute
