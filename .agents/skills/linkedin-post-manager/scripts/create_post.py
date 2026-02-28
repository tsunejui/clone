#!/usr/bin/env python3
"""Create a new LinkedIn post."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

# Add the linkedin-api package to the path
REPO_ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(REPO_ROOT / "packages" / "linkedin-api" / "src"))

from linkedin_api import LinkedInClient, create_post


def main() -> None:
    parser = argparse.ArgumentParser(description="Create a LinkedIn post")
    parser.add_argument("--text", required=True, help="Post content text")
    parser.add_argument(
        "--visibility",
        default="PUBLIC",
        choices=["PUBLIC", "CONNECTIONS_ONLY"],
        help="Post visibility (default: PUBLIC)",
    )
    args = parser.parse_args()

    with LinkedInClient() as client:
        result = create_post(client, text=args.text, visibility=args.visibility)

    print("Post published successfully!")
    if result:
        print(f"Response: {result}")


if __name__ == "__main__":
    main()
