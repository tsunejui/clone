---
name: linkedin-post-manager
description: Use this skill when the user wants to manage LinkedIn posts — listing, creating, updating, or deleting posts. Trigger when the user mentions LinkedIn posts, publishing to LinkedIn, reviewing their LinkedIn content, or managing their LinkedIn feed. Also use when analyzing post performance (likes, comments).
---

# LinkedIn Post Manager

Manage LinkedIn posts via the `linkedin-api` package at `packages/linkedin-api/`.

## Available Operations

| Action | Script | Just Command |
|--------|--------|--------------|
| List posts | `scripts/list_posts.py` | `just list-posts [author] [count]` |
| Create post | `scripts/create_post.py` | `just create-post <text> [visibility]` |
| Update post | `scripts/update_post.py` | `just update-post <urn> <text>` |
| Delete post | `scripts/delete_post.py` | `just delete-post <urn>` |

## How to Use

### List Posts

```bash
# List your own posts (default 10)
just list-posts

# List posts from a specific author
just list-posts "author-urn-id" 20
```

Or run the script directly:

```bash
python3 .agents/skills/linkedin-post-manager/scripts/list_posts.py --count 10
python3 .agents/skills/linkedin-post-manager/scripts/list_posts.py --author "ACoAAA..." --count 20
```

### Post Fields

Each post returns:
- **urn** — Unique update identifier (needed for update/delete)
- **text** — Post content (or article title as fallback)
- **created_at** — Unix timestamp of creation
- **num_likes** — Total like count
- **num_comments** — Total comment count

## Prerequisites

- Cookies file at `~/.linkedin-mcp/cookies.json` (exported from browser, Netscape/JSON format)
- The `linkedin-api` package installed: `uv pip install -e packages/linkedin-api`

## Architecture

- **Auth**: Cookie-based authentication via `~/.linkedin-mcp/cookies.json`
- **API Client**: `LinkedInClient` uses `curl_cffi` for Chrome TLS fingerprint impersonation
- **Profile Cache**: `~/.linkedin-mcp/profile_cache.json` caches your profile URN

## Keywords
LinkedIn posts, list posts, create post, publish LinkedIn, delete post, post analytics, LinkedIn feed, post engagement
