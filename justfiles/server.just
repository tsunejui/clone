APP := "apps/persona"
PID := "apps/persona/.pid"
LOG := "apps/persona/.dev.log"

# ── Server ─────────────────────────────────────────────
# Start dev server in background
start:
    scripts/start.sh {{APP}} {{PID}} {{LOG}}

# Stop dev server
stop:
    scripts/stop.sh {{PID}}

# Restart dev server
restart: stop start

# Show dev server status
status:
    scripts/status.sh {{PID}} {{APP}} {{LOG}}

# ── Migration ──────────────────────────────────────────
# Apply pending migrations (creates new migration if schema changed)
migrate-up:
    cd {{APP}} && npx prisma generate && npx prisma migrate dev

# Create a migration file without applying
migrate-create name="migration":
    cd {{APP}} && npx prisma migrate dev --create-only --name {{name}}

# Reset DB: drop all data and re-apply migrations
migrate-reset:
    cd {{APP}} && npx prisma migrate reset --force

# ── Data ───────────────────────────────────────────────
# Seed DB (default scenario: tech-engineer)
db-seed scenario="tech-engineer":
    cd {{APP}} && SEED_SCENARIO={{scenario}} npx tsx prisma/seed.ts

# Delete all data from DB (auto-backups first, keeps schema + migrations)
db-wipe:
    scripts/db-wipe.sh {{APP}}

# ── Backup ────────────────────────────────────────────
# Backup current DB with timestamp
db-backup:
    scripts/db-backup.sh {{APP}}

# List all DB backups
db-backups:
    @ls -lh {{APP}}/backups/*.db 2>/dev/null || echo "No backups found."

# Restore DB from backup (interactive or specify version like 20260227-120000)
db-restore version="":
    scripts/db-restore.sh {{APP}} {{version}}
