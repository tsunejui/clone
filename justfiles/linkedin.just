LINKEDIN_SCRIPTS := ".agents/skills/linkedin-posts-manager/scripts"

# ── LinkedIn Posts ────────────────────────────────────────
# List LinkedIn posts (default: your own, max 10)
list-posts author="" count="10":
    python3 {{LINKEDIN_SCRIPTS}}/list_posts.py \
        {{ if author != "" { "--author " + author } else { "" } }} \
        --count {{count}}

# Create a new LinkedIn post
create-post text visibility="PUBLIC":
    python3 {{LINKEDIN_SCRIPTS}}/create_post.py \
        --text "{{text}}" \
        --visibility {{visibility}}

# Update an existing post's text
update-post urn text:
    python3 {{LINKEDIN_SCRIPTS}}/update_post.py \
        --urn "{{urn}}" \
        --text "{{text}}"

# Delete a single post
delete-post urn:
    python3 {{LINKEDIN_SCRIPTS}}/delete_post.py \
        --urn "{{urn}}"

# Bulk-delete multiple posts (space-separated URNs)
delete-posts +urns:
    python3 {{LINKEDIN_SCRIPTS}}/delete_posts.py {{urns}}
