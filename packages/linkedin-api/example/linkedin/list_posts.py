"""List my LinkedIn posts using the linkedin_api package."""

from linkedin_api import LinkedInClient, list_posts


def main() -> None:
    with LinkedInClient() as client:
        posts = list_posts(client, count=20)

        if not posts:
            print("No posts found.")
            return

        for i, post in enumerate(posts, 1):
            text_preview = (post["text"] or "")[:120]
            if len(post["text"] or "") > 120:
                text_preview += "..."
            print(f"[{i}] {text_preview}")
            print(f"    Likes: {post['num_likes']}  Comments: {post['num_comments']}")
            print()


if __name__ == "__main__":
    main()
