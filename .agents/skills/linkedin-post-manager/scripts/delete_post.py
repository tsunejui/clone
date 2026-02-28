#!/usr/bin/env python3
"""Delete one or more LinkedIn posts."""

from __future__ import annotations

import argparse
import sys
from pathlib import Path

# Add the linkedin-api package to the path
REPO_ROOT = Path(__file__).resolve().parents[4]
sys.path.insert(0, str(REPO_ROOT / "packages" / "linkedin-api" / "src"))

from linkedin_api import LinkedInClient, delete_post


def main() -> None:
    parser = argparse.ArgumentParser(description="Delete LinkedIn post(s)")
    parser.add_argument(
        "urns",
        nargs="+",
        help="Share URN(s) of the post(s) to delete",
    )
    args = parser.parse_args()

    with LinkedInClient() as client:
        for urn in args.urns:
            delete_post(client, share_urn=urn)
            print(f"Deleted: {urn}")

    print(f"\n{len(args.urns)} post(s) deleted.")


if __name__ == "__main__":
    main()
