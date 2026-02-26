setup:
    @INTERACTIVE_HEADER='Select setup tasks to run' scripts/interactive.sh \
        "Setup MCP Router::scripts/setup-mcp-router.sh"

setup-mcp-router:
    @scripts/setup-mcp-router.sh

link-skills:
    @scripts/link-skills.sh
