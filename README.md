# Clone (I'm too lazy to live, so I wrote an AI to do it for me)

> **WIP**: This project is under active development.

> 我太懶了，所以寫個 AI 幫我活著

Welcome to the **Life Outsourcing Project**. Clone is a personal AI agent that creates a digital twin of you — it learns your tone, habits, and social patterns, then takes over your social media presence so you don't have to.

The goal: **fully replace yourself in all online social interactions.**

## How It Works

```
                ┌──────────────┐
                │   You (Once) │
                └──────┬───────┘
                       │ Login & authorize
                       ▼
              ┌────────────────────┐
              │  Account Connector │
              │  (OAuth / Cookies) │
              └────────┬───────────┘
                       │ Collect history
                       ▼
              ┌────────────────────┐
              │   Local SQLite DB  │
              │  Posts, comments,  │
              │  style, schedule   │
              └────────┬───────────┘
                       │ Analyze & learn
                       ▼
              ┌────────────────────┐
              │   AI Clone Agent   │
              │  (AI Skills)       │
              └────────┬───────────┘
                       │ Automate
          ┌────────────┼────────────┐
          ▼            ▼            ▼
     ┌─────────┐ ┌─────────┐ ┌─────────┐
     │LinkedIn │ │ Twitter │ │  More   │
     │  Posts  │ │  Posts  │ │ Socials │
     └─────────┘ └─────────┘ └─────────┘
```

### Phase 1 — Connect & Collect

The user logs in to each social media platform. Clone scrapes their historical data — posts, comments, reactions, writing style, posting frequency — and stores everything in a local SQLite database.

### Phase 2 — Learn & Simulate

AI skills analyze the collected data to build a behavioral profile: tone of voice, preferred topics, posting schedule, interaction patterns. Each platform gets a dedicated skill that mimics the user's habits.

### Phase 3 — Automate & Replace

Clone begins posting, replying, and interacting on behalf of the user. Over time it handles all social interactions autonomously — the user only needs to review occasionally (or not at all).

## Why Clone?

Life is full of high-latency, low-reward tasks. Clone fixes this by automating your existence:

- **Digital Twin:** Learns your writing style, tone, and personality from historical data.
- **Social Ghostwriting:** Posts, comments, and interacts across all your social platforms.
- **Behavioral Mimicry:** Matches your posting frequency, preferred time slots, and topic preferences.
- **Full Autonomy:** The end goal is zero human intervention — your clone lives your online life for you.

## Project Structure

```text
.agents/skills/   # AI skills (LinkedIn post manager, etc.)
.claude/          # Claude configuration and skill symlinks
apps/persona/     # Next.js dashboard for profile management
packages/         # Reusable libraries (linkedin-api, etc.)
scripts/          # Automation scripts
justfiles/        # Modular just recipes
Justfile          # Main entry point
mise.toml         # Tool version management
```

## Quick Start

1. Install `mise` (do it once, cry never).
2. Run `just setup` (one command to rule them all).
3. Lie down. The AI will take it from here.

## Current Status

| Platform | Connect | Collect | Post | Interact |
|----------|---------|---------|------|----------|
| LinkedIn | Done | Done | Done | Planned |
| Twitter  | Planned | — | — | — |
| Facebook | Planned | — | — | — |