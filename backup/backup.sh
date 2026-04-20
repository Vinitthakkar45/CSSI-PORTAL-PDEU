#!/usr/bin/env bash
# CSSI Backup Script
#
# Schedule: every Saturday at 2 AM (0 2 * * 6)
#
# Strategy:
#   - PostgreSQL: dumped, compressed locally, and uploaded to Cloudinary (small, critical)
#   - MinIO media: stored on a persistent Docker volume (minio_data) on the server disk.
#     No remote copy — if the server disk fails, restore media from the last local archive
#     or re-upload from source. The DB is the irreplaceable part.
#
# Steps:
#   1. pg_dump → compressed binary dump
#   2. tar + gzip the dump into a local archive
#   3. Upload to Cloudinary, keeping exactly ONE copy there
#   4. Prune local archives — keep exactly 1
#
set -euo pipefail

TIMESTAMP=$(date +%Y%m%d_%H%M%S)
WORK_DIR="/backups/work_${TIMESTAMP}"
ARCHIVE="/backups/cssi_db_${TIMESTAMP}.tar.gz"
LOG="[CSSI-BACKUP ${TIMESTAMP}]"

log() { echo "${LOG} $*"; }
die() { echo "${LOG} ERROR: $*" >&2; exit 1; }

# ── Validate required env vars ───────────────────────────────────────────────
: "${POSTGRES_HOST:?}" "${POSTGRES_DB:?}" "${POSTGRES_USER:?}" "${POSTGRES_PASSWORD:?}"
: "${CLOUDINARY_CLOUD_NAME:?}" "${CLOUDINARY_API_KEY:?}" "${CLOUDINARY_API_SECRET:?}"

export PGPASSWORD="${POSTGRES_PASSWORD}"

mkdir -p "${WORK_DIR}"

# ── Step 1: Dump PostgreSQL ──────────────────────────────────────────────────
log "Dumping PostgreSQL '${POSTGRES_DB}'..."
pg_dump \
  -h "${POSTGRES_HOST}" \
  -U "${POSTGRES_USER}" \
  -d "${POSTGRES_DB}" \
  --format=custom \
  --compress=9 \
  -f "${WORK_DIR}/dump.pgdump" \
  || die "pg_dump failed"
DB_SIZE=$(du -sh "${WORK_DIR}/dump.pgdump" | cut -f1)
log "PostgreSQL dump done (${DB_SIZE})."

# ── Step 2: Compress into local archive ─────────────────────────────────────
log "Compressing archive..."
tar -czf "${ARCHIVE}" -C /backups "work_${TIMESTAMP}" \
  || die "Compression failed"
ARCHIVE_SIZE=$(du -sh "${ARCHIVE}" | cut -f1)
log "Archive created: ${ARCHIVE} (${ARCHIVE_SIZE})"
rm -rf "${WORK_DIR}"

# ── Step 3: Upload DB dump to Cloudinary ─────────────────────────────────────
BACKUP_PUBLIC_ID_PREFIX="cssi_db_backups"
DB_PUBLIC_ID="${BACKUP_PUBLIC_ID_PREFIX}/db_${TIMESTAMP}"

log "Checking for existing Cloudinary backup..."
EXISTING=$(curl -s \
  "https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/raw/upload" \
  --user "${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}" \
  -G \
  --data-urlencode "prefix=${BACKUP_PUBLIC_ID_PREFIX}/" \
  --data-urlencode "max_results=10" \
  | grep -oE '"public_id":"[^"]+"' \
  | sed 's/"public_id":"//;s/"//' \
  || true)

if [ -n "${EXISTING}" ]; then
  log "Deleting existing Cloudinary backup(s)..."
  while IFS= read -r PID; do
    [ -z "${PID}" ] && continue
    curl -s -X DELETE \
      "https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/resources/raw/upload" \
      --user "${CLOUDINARY_API_KEY}:${CLOUDINARY_API_SECRET}" \
      -d "public_ids[]=${PID}" > /dev/null
    log "  Deleted: ${PID}"
  done <<< "${EXISTING}"
fi

log "Uploading DB dump to Cloudinary (${DB_SIZE})..."
UPLOAD_TS=$(date +%s)
SIGNATURE=$(printf '%s' "public_id=${DB_PUBLIC_ID}&timestamp=${UPLOAD_TS}${CLOUDINARY_API_SECRET}" \
  | openssl dgst -sha256 | sed 's/^.* //')

UPLOAD_RESULT=$(curl -s \
  "https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/raw/upload" \
  -F "file=@${ARCHIVE}" \
  -F "public_id=${DB_PUBLIC_ID}" \
  -F "api_key=${CLOUDINARY_API_KEY}" \
  -F "timestamp=${UPLOAD_TS}" \
  -F "signature=${SIGNATURE}")

if echo "${UPLOAD_RESULT}" | grep -q '"error"'; then
  die "Cloudinary upload failed: ${UPLOAD_RESULT}"
fi
if ! echo "${UPLOAD_RESULT}" | grep -q '"public_id"'; then
  die "Cloudinary upload gave unexpected response: ${UPLOAD_RESULT}"
fi
log "Cloudinary upload complete."

# ── Step 4: Prune local archives — keep exactly 1 ───────────────────────────
log "Pruning local archives (keeping latest 1)..."
ls -1t /backups/cssi_db_*.tar.gz 2>/dev/null | tail -n +2 | xargs -r rm -f

log "Backup complete."
log "  Local:      ${ARCHIVE} (${ARCHIVE_SIZE})"
log "  Cloudinary: ${DB_PUBLIC_ID}"
