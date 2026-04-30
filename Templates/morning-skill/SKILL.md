---
name: morning
description: Daily morning check-in — reads vault goals, surfaces what needs attention today, classifies the day's tier, collects progress updates, adjusts timelines, and logs the check-in. Triggers on "morning", "good morning", "/morning", or "daily check-in".
model: sonnet
---

# Morning Check-In

Daily briefing + goals accountability system. Tier-aware (A/B/C) so the recommendation scales to the day's available bandwidth.

## First-Run Setup (ask once, save to memory)

If any of the following are missing from memory, ask the user and save the answers before continuing:

1. **Name + grade/role** — "What's your name and what do you do (student, role, etc.)?"
2. **Content niche** — "Are you posting short-form content (Reels/TikTok/Shorts)? If yes, what 2–3 themes/formats should I rotate through? (e.g., 'tech tips, motivation, sports highlights')"
3. **Sports / physical activities** — "What sports or activities requiring physical exertion are part of your routine? (used to schedule training + flag tournament days)"
4. **Competitions / events you compete in** — "What competitions or contests do you participate in? (used to flag competition days as Tier B)"
5. **Standardized tests / exams on your radar** — "What major exams are you preparing for? (e.g., SAT, AP, certifications)"
6. **Recurring rest days / recovery windows** — "Are there days you're already committed to resting (recovery, religious observance, family days)?" → save to `rest_days.md` memory.
7. **School / work schedule** — "What's your weekly schedule (school hours, work hours, commitments)?" → save to `school_schedule.md` memory.

Save responses as memory files in `~/.claude/projects/<project>/memory/` and add a one-line entry to `MEMORY.md`. Re-ask if user later says "I picked up X" or "I dropped Y."

---

## Workflow

### 1. Read vault state

Read these files in parallel:
- Today's daily note at `YYYY-MM-DD.md` (vault root) — if it exists
- `Areas/goals.md` — full goals tracking file
- `Inbox/` — any files tagged `#needs-review`

Also check Gmail (unread) and Calendar if MCP tools are available:
1. Call `mcp__claude_ai_Google_Calendar__list_calendars` (pageSize: 250) — get ALL calendar IDs including shared/added ones
2. For **each** calendar ID, call `mcp__claude_ai_Google_Calendar__list_events` with `calendarId` set — never skip this param or it defaults to primary only
3. Merge + deduplicate results by event id, sort by startTime

Run a web search for recent AI/tech news **in parallel** with the above (use the user's stated content niche to filter).

### 2. Surface today's agenda

Print:

```
MORNING CHECK-IN — [Day], [Date]
════════════════════════════════════════

🎚️ DAY TIER — [A / B / C]
  Reason: [one-line trigger that picked the tier]
  Default plan: [link/snippet from Areas/goals.md > "Daily Operating Plan"]

📅 CALENDAR TODAY
  [List events from Google Calendar for today]

📬 INBOX (unread)
  [Count of unread emails or "clear"]

📥 VAULT INBOX
  [Any #needs-review notes in Inbox/]

🤖 NEWS (last 48h)
  [3–5 bullets matched to the user's stated content niche]

🎬 CONTENT SCRIPTS (post one today)
  [3 ready-to-film scripts — see format below]
```

After printing the briefing block, generate 3 short-form content scripts tailored to the **user's stated niche/themes from setup**. Each script must:
- Open with a scroll-stopping hook (bold claim, curiosity gap, or relatable question) — land it in ≤3 seconds
- Run 15–30 seconds total when spoken aloud
- Deliver one concrete insight, tip, or story beat
- End with a follow CTA
- Rotate format across the user's stated themes (one per theme)
- Label each with the theme tag (e.g., `[THEME-1]`, `[THEME-2]`, `[THEME-3]`)
- Use natural conversational speech — no marketing filler

If the user said they're not posting content, skip this section entirely.

### 2.5 Classify today's tier

Pick exactly one tier — A, B, or C — using the rules in `Areas/goals.md` > "Day-Shape Rules" section. Inputs to scan:

- **Calendar events for today** (from step 1 — already merged across all calendars)
- **Memory rest-day flags** (e.g., `rest_days.md` — recovery, illness, family-day windows)
- **goals.md competition/exam dates** (whatever the user listed in setup)
- **School/work schedule from memory** (`school_schedule.md`)

Decision order (first match wins):

| Trigger | Tier |
|---------|------|
| Memory says today is a rest day (sick, recovery, religious observance, family day) | **C** |
| Travel day OR away tournament OR full-day flight in calendar | **C** |
| Major exam in calendar | **B** |
| Competition / contest in calendar | **B** |
| Sports tournament (home) | **B** |
| Family event in calendar (movie, day trip, dinner out, hangout) > 3h | **B** |
| Multiple calendar events totaling >4h after school/work | **B** |
| Sunday (or user's chosen weekly rest day) | **B** (light) |
| Default workday with normal evening | **A** |

Always print the **chosen tier + the trigger** in the briefing block (see template above). If two triggers conflict, pick the more restrictive (C > B > A).

If the user's input later in the check-in implies a different tier ("I have my cousin coming over tonight"), reclassify and announce the change.

### 3. Goals status report

Read `Areas/goals.md`. For each goal with status 🟡 or 🔴, compute:

- Days until next checkpoint/deadline
- Whether any action item is due today or overdue
- Whether the goal is on track given elapsed time

Print:

```
🎯 GOALS NEEDING ATTENTION
────────────────────────────────────────

[Goal name] — [status emoji]
  Deadline: [date] ([N days away])
  Next action: [exact next action from goals.md]
  On track: [yes / at risk / behind]

[repeat for each 🟡/🔴 goal]

✅ ON TRACK (no action needed today)
  - [Goal name] — [brief status]
```

### 4. Collect progress updates

For each 🟡 in-progress goal, ask:

> "Any progress on [goal] since last check-in? (yes / no / update)"

If yes → ask for details. Capture the update.

Keep it conversational — one goal at a time if there are many.

### 5. Update goals.md

After collecting updates:

1. Append a new row to the Weekly Check-In Log table:
   ```
   | YYYY-MM-DD | [Summary of progress updates, any timeline changes] |
   ```

2. If a goal's next checkpoint has passed with completion → change status from 🟡 to 🟢.

3. If a goal is behind schedule → note it in the log row and flag in the goal section.

4. If the user reports a timeline shift → update the Timeline field for that goal.

5. Update the "Last updated" line at the top of goals.md to today's date.

6. Move completed action items from the Immediate Action Items checklist to done (`[x]`).

### 6. Set today's focus

**Always print the full project list first** — never hide projects based on tier. The user wants visibility on everything before deciding what to skip.

```
📋 ALL ACTIVE PROJECTS
────────────────────────────────────────
  [Every 🟡 / 🔴 / 🟢 goal from goals.md, one line each, with status emoji + next action]
```

Then, based on deadlines, user input, **and the day tier from step 2.5**, recommend which subset to actually do today:

- **Tier A** → recommend 1–3 focus items (full plan)
- **Tier B** → recommend 1 focus item only (highest-urgency from goals.md)
- **Tier C** → recommend 0 focus items; "rest + capture ideas in Inbox/"

```
🔥 RECOMMENDED FOR TODAY (Tier [A/B/C])
  1. [Most urgent action item]
  2. [Second priority — A only]
  3. [Optional stretch — A only]

  Skipping today (still on the board): [list of projects deferred today + why]
```

Always show the "Skipping today" line so the user knows what's being deferred — never silently drop a project.

### 7. Suggest a daily schedule

Based on today's focus items, goals deadlines, calendar events already present, the school/work schedule from memory (check `school_schedule.md`), and the **day tier from step 2.5**, generate **1–2 concrete time-block schedule options** for the rest of today.

Tier-aware rules:
- **Tier A** — full plan from `Areas/goals.md` > "Daily Operating Plan" > Tier A (~3–4h of focused work)
- **Tier B** — single ~1h block on the chosen focus item + 5-min Close. Don't overschedule a B day.
- **Tier C** — no work blocks. Output: "Rest day — read 1 wiki page (5m), capture ideas in Inbox/ (5m), sleep early." Skip schedule options entirely.

General rules (apply to A and B):
- Each block is 30–90 min (no marathon sessions)
- Insert a 5–10 min buffer between every block
- Respect any calendar events already on the calendar (don't overlap)
- Prioritize by deadline urgency, then goal weight
- Label each block with the goal it serves
- Account for rest days in memory (don't schedule physical training on rest days)

Print like:

```
📆 SCHEDULE OPTIONS
────────────────────────────────────────

Option A
  [HH:MM – HH:MM] Block name (goal)
  [5 min buffer]
  [HH:MM – HH:MM] Block name (goal)
  ...

Option B (if meaningfully different)
  ...

Which schedule works? (A / B / neither — tell me what to change)
```

Once the user confirms a schedule (or requests changes and confirms), create each block as a Google Calendar event using `mcp__claude_ai_Google_Calendar__create_event`. Use:
- `summary`: block name
- `description`: goal it serves + next action
- `start` / `end`: ISO 8601 with local timezone
- `calendarId`: primary

Confirm once all events are created: "✅ Schedule added to Google Calendar."

### 8. Write daily note (if not exists)

Create `YYYY-MM-DD.md` in vault root with:

```yaml
---
created: YYYY-MM-DD
tags: [daily]
status: active
related: [Areas/goals]
---
```

Then a `## Focus` section with today's recommended focus items and a `## Log` section (empty, for the user to fill in).

## Key Rules

- Always read `Areas/goals.md` fresh — never rely on cached memory for goal status
- Never skip goals that are 🔴 (not started) if they have a deadline within 30 days
- Timeline updates must be written back to `Areas/goals.md` immediately — don't defer
- If a goal deadline passed without completion, flag it explicitly — don't silently update
- Keep the check-in conversational, not interrogation-style — one topic at a time
- The weekly log row is append-only — never edit past rows
- **Always show all projects** — tier only changes the recommendation, not visibility

## Goals Reference

All goal data is read live from `Areas/goals.md` at check-in time. Never use cached or hardcoded goal data — it will be stale.
