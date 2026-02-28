#!/usr/bin/env python3
"""Update an existing LinkedIn post's text."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

# Add the linkedin-api package to the path
REPO_ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(REPO_ROOT / "packages" / "linkedin-api" / "src"))

from linkedin_api import LinkedInClient, update_post


def main() -> None:
    parser = argparse.ArgumentParser(description="Update a LinkedIn post")
    parser.add_argument("--urn", required=True, help="Share URN of the post to update")
    parser.add_argument("--text", required=True, help="New post content text")
    args = parser.parse_args()

    with LinkedInClient() as client:
        result = update_post(client, share_urn=args.urn, text=args.text)

    print("Post updated successfully!")
    if result:
        print(f"Response: {result}")


if __name__ == "__main__":
    main()
