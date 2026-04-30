# Morning Skill — Tier-Aware Daily Check-In

A Claude Code skill that runs a daily morning briefing, classifies the day into a tier (A/B/C) based on your calendar + commitments, and recommends what to focus on given the day's available bandwidth.

## What it does

1. Reads your calendar, email, vault inbox, and goals file
2. Classifies today as **Tier A** (full day), **Tier B** (short day, competition/family/travel), or **Tier C** (rest day)
3. Lists every active project so you have full visibility
4. Recommends the subset matching the day's tier — never silently drops a project
5. Generates 1–2 schedule options + writes them to Google Calendar on confirmation
6. Logs progress and updates goals.md

## Setup

### 1. Install the skill

Copy `SKILL.md` to your skills directory:

```
~/.claude/skills/morning/SKILL.md
```

### 2. Create your goals file

Copy `goals.md.template` to your vault:

```
<vault>/Areas/goals.md
```

Fill in your goals, projects, competitions, and customize the Daily Operating Plan + Day-Shape Rules section.

### 3. Create memory files

Copy templates to your project's memory directory:

```
~/.claude/projects/<project>/memory/rest_days.md
~/.claude/projects/<project>/memory/school_schedule.md
```

Add pointer entries to `MEMORY.md`:

```markdown
- [Rest Days](rest_days.md) — recovery / family / religious observance windows
- [School / Work Schedule](school_schedule.md) — weekly fixed schedule
```

### 4. First run

Type `morning` or `/morning`. The skill will ask first-run setup questions (name, content niche, sports, competitions, exams, rest days, schedule) and save the answers to memory.

## Required tools / MCPs

- Read, Write, Edit (built-in)
- Google Calendar MCP (`mcp__claude_ai_Google_Calendar__*`) — optional but recommended
- Gmail MCP (`mcp__claude_ai_Gmail__*`) — optional
- WebSearch — optional, for the news block

If MCPs aren't connected, the skill skips those blocks gracefully.

## Tier system

| Tier | When | Recommendation |
|------|------|----------------|
| **A** | Default workday | 1–3 focus items, full schedule (~3–4h) |
| **B** | Competition / family / sports / Sunday | 1 focus item, single ~1h block |
| **C** | Sick / travel / rest day | 0 work items, recovery only |

Decision order: C beats B beats A on conflict. Pre-decide the tier the night before — don't decide at low-willpower morning.

## Customization

Everything specific to your life lives in **`Areas/goals.md`**:
- Your goals, deadlines, status emojis
- Your Daily Operating Plan tier definitions
- Your Day-Shape Rules (which triggers map to which tier)
- Your weekly rhythm

The skill itself stays generic — it just reads your goals file fresh every morning.

## License

Use, modify, share freely.
