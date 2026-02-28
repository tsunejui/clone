# linkedin-api

LinkedIn Voyager API client with cookie-based authentication.

## Installation

```bash
cd packages/linkedin-api
uv sync
```

## Configuration

Log in to LinkedIn via `linkedin-scraper-mcp`. Cookies are stored at `~/.linkedin-mcp/cookies.json`.

> **Note:** LinkedIn aggressively invalidates sessions after detecting API calls. Re-login to get fresh cookies before each use.

The profile URN is automatically fetched from the `/me` API on first use and cached to `~/.linkedin-mcp/profile_cache.json` for subsequent calls.

## Usage

### List my posts

```bash
just example-linkedin-ls-posts
```

Or run directly:

```bash
cd packages/linkedin-api
uv run python example/linkedin/list_my_posts.py
```

### Programmatic usage

```python
from linkedin_api import LinkedInClient, list_posts

with LinkedInClient() as client:
    # Profile URN is auto-resolved and cached
    posts = list_posts(client, count=20)

    for post in posts:
        print(post["text"], post["num_likes"])
```

## API

### `LinkedInClient(cookies_path=None)`

- `cookies_path`: Path to cookies file. Defaults to `~/.linkedin-mcp/cookies.json`.
- `client.me()` — Get current user's profile info and cache the URN.
- `client.get_profile_urn()` — Return URN from memory, disk cache, or `/me` API call.

### `list_posts(client, count=20, start=0, profile_urn=None)`

- `count`: Number of posts to fetch (max 100).
- `start`: Pagination offset.
- `profile_urn`: Pass directly to skip the automatic URN resolution.
- Returns `list[dict]` with keys: `urn`, `text`, `created_at`, `num_likes`, `num_comments`.

## Technical Details

- Uses `curl_cffi` to impersonate Chrome's TLS fingerprint, bypassing LinkedIn/Cloudflare detection.
- Voyager API endpoint: `/feed/updates` (`q=memberShareFeed`).
- Cookies are sent via the `Cookie` header (not a cookie jar) to prevent session invalidation during redirects.
