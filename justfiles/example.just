LINKEDIN_API := "packages/linkedin-api"

# ── Examples ─────────────────────────────────────────────

# Run an example interactively (select with gum)
example:
    #!/usr/bin/env bash
    set -euo pipefail
    choice=$(find {{LINKEDIN_API}}/example -name '*.py' -type f \
        | sed 's|{{LINKEDIN_API}}/example/||' \
        | sort \
        | gum choose --header "Select an example to run:")
    just _run-example "$choice"

# List LinkedIn posts
example-linkedin-ls-posts:
    just _run-example "linkedin/list_posts.py"

# (internal) Run an example script
_run-example script:
    cd {{LINKEDIN_API}} && uv run python "example/{{script}}"
