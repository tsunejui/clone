#!/usr/bin/env python3
"""List LinkedIn posts for the current user or a specific author."""

from __future__ import annotations

import argparse
import json
import sys
from datetime import datetime, timezone
from pathlib import Path

# Add the linkedin-api package to the path
REPO_ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(REPO_ROOT / "packages" / "linkedin-api" / "src"))

from linkedin_api import LinkedInClient, list_posts


def format_timestamp(ts: int | None) -> str:
    if ts is None:
        return "N/A"
    dt = datetime.fromtimestamp(ts / 1000, tz=timezone.utc)
    return dt.strftime("%Y-%m-%d %H:%M")


def main() -> None:
    parser = argparse.ArgumentParser(description="List LinkedIn posts")
    parser.add_argument(
        "--author",
        default=None,
        help="Author profile URN id (defaults to current user)",
    )
    parser.add_argument(
        "--count",
        type=int,
        default=10,
        help="Number of posts to fetch (default: 10)",
    )
    parser.add_argument(
        "--json",
        action="store_true",
        dest="as_json",
        help="Output as JSON",
    )
    args = parser.parse_args()

    with LinkedInClient() as client:
        posts = list_posts(client, count=args.count, profile_urn=args.author)

    if not posts:
        print("No posts found.")
        return

    if args.as_json:
        print(json.dumps(posts, ensure_ascii=False, indent=2))
        return

    for i, post in enumerate(posts, 1):
        text = post["text"] or ""
        preview = text[:120] + ("..." if len(text) > 120 else "")
        date = format_timestamp(post.get("created_at"))
        likes = post["num_likes"]
        comments = post["num_comments"]

        print(f"[{i}] {preview}")
        print(f"    Date: {date}  Likes: {likes}  Comments: {comments}")
        print(f"    URN: {post['urn']}")
        print()


if __name__ == "__main__":
    main()
