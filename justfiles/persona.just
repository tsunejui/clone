APP := "apps/persona"

# ── Dev ──────────────────────────────────────────────────
# Start persona dev server (initialises DB on first run)
persona-dev: persona-db-init
    cd {{APP}} && npm run dev

# ── DB ──────────────────────────────────────────────────
# Initialise DB: generate client + push schema (idempotent)
persona-db-init:
    cd {{APP}} && npm run db:generate && npm run db:push

# Seed with a scenario (default: tech-engineer)
# Usage: just persona-db-seed  OR  just persona-db-seed product-manager
persona-db-seed scenario="tech-engineer":
    cd {{APP}} && SEED_SCENARIO={{scenario}} npm run db:seed

# Reset DB and re-seed
persona-db-reset scenario="tech-engineer":
    cd {{APP}} && npm run db:reset
    just persona-db-seed {{scenario}}

# Open Prisma Studio
persona-db-studio:
    cd {{APP}} && npm run db:studio

# ── Install ──────────────────────────────────────────────
# Install dependencies
persona-install:
    cd {{APP}} && npm install
