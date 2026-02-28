LINKEDIN_SCRIPTS := ".agents/skills/linkedin-post-manager/scripts"

# ── LinkedIn Posts ────────────────────────────────────────
# List LinkedIn posts (default: your own, max 10)
linkedin-list-posts author="" count="10":
    python3 {{LINKEDIN_SCRIPTS}}/list_posts.py \
        {{ if author != "" { "--author " + author } else { "" } }} \
        --count {{count}}

# Create a new LinkedIn post
linkedin-create-post text visibility="PUBLIC":
    python3 {{LINKEDIN_SCRIPTS}}/create_post.py \
        --text "{{text}}" \
        --visibility {{visibility}}

# Update an existing post's text
linkedin-update-post urn text:
    python3 {{LINKEDIN_SCRIPTS}}/update_post.py \
        --urn "{{urn}}" \
        --text "{{text}}"

# Delete a single post
linkedin-delete-post urn:
    python3 {{LINKEDIN_SCRIPTS}}/delete_post.py \
        --urn "{{urn}}"
