from __future__ import annotations

from typing import Any

from .client import LinkedInClient


def list_posts(
    client: LinkedInClient,
    count: int = 20,
    start: int = 0,
    profile_urn: str | None = None,
) -> list[dict[str, Any]]:
    """List posts for the given profile (defaults to current user).

    Args:
        client: LinkedInClient instance.
        count: Number of posts to fetch (max 100).
        start: Pagination offset.
        profile_urn: Profile URN (dashEntityUrn). If None, calls /me first.
    """
    urn = profile_urn or client.get_profile_urn()
    # Strip prefix to get the ID portion for profileId param
    urn_id = urn.split(":")[-1] if ":" in urn else urn

    data = client._get(
        "/feed/updates",
        params={
            "profileId": urn_id,
            "q": "memberShareFeed",
            "moduleKey": "member-share",
            "count": count,
            "start": start,
        },
    )

    return _parse_posts(data.get("elements", []))


def _parse_posts(elements: list[dict[str, Any]]) -> list[dict[str, Any]]:
    """Extract post info from Voyager feed update elements."""
    posts: list[dict[str, Any]] = []

    for el in elements:
        value = el.get("value", {}).get(
            "com.linkedin.voyager.feed.render.UpdateV2", {}
        )

        # Extract commentary text
        text = value.get("commentary", {}).get("text", {}).get("text", "")

        # Fallback: article title
        if not text:
            content = value.get("content", {})
            article = content.get(
                "com.linkedin.voyager.feed.render.ArticleComponent", {}
            )
            text = article.get("title", {}).get("text", "")

        # Social counts
        social = value.get("socialDetail", {})
        counts = social.get("totalSocialActivityCounts", {})

        posts.append(
            {
                "urn": el.get("updateUrn", ""),
                "text": text,
                "created_at": el.get("createdTime"),
                "num_likes": counts.get("numLikes", 0),
                "num_comments": counts.get("numComments", 0),
            }
        )

    return posts


def create_post(
    client: LinkedInClient,
    text: str,
    visibility: str = "PUBLIC",
) -> dict[str, Any]:
    """Create a new LinkedIn post.

    Args:
        client: LinkedInClient instance.
        text: Post content text.
        visibility: "PUBLIC" or "CONNECTIONS_ONLY".

    Returns:
        API response dict (may be empty on success).
    """
    urn = client.get_profile_urn()

    payload = {
        "visibleToConnectionsOnly": visibility == "CONNECTIONS_ONLY",
        "externalAudienceProviders": [],
        "commentaryV2": {
            "text": text,
            "attributesV2": [],
        },
        "origin": "FEED",
        "allowedCommentersScope": "ALL",
        "postState": "PUBLISHED",
        "authorUrn": urn,
    }

    return client._post("/contentcreation/normShares", payload)


def update_post(
    client: LinkedInClient,
    share_urn: str,
    text: str,
) -> dict[str, Any] | None:
    """Update an existing LinkedIn post's text.

    Args:
        client: LinkedInClient instance.
        share_urn: The share URN (e.g. "urn:li:share:123456").
        text: New post content text.

    Returns:
        API response dict, or None on 204 No Content.
    """
    payload = {
        "patch": {
            "$set": {
                "commentaryV2": {
                    "text": text,
                    "attributesV2": [],
                },
            },
        },
    }

    return client._partial_update(
        "/contentcreation/normShares", share_urn, payload
    )


def delete_post(client: LinkedInClient, share_urn: str) -> None:
    """Delete a LinkedIn post.

    Args:
        client: LinkedInClient instance.
        share_urn: The share URN (e.g. "urn:li:share:123456").
    """
    client._delete("/contentcreation/normShares", share_urn)
