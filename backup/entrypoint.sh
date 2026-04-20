#!/usr/bin/env bash
# Write the cron schedule from env and start crond in foreground.
set -euo pipefail

CRON_SCHEDULE="${BACKUP_CRON:-0 2 * * *}"
echo "Backup schedule: ${CRON_SCHEDULE}"

# Write crontab
echo "${CRON_SCHEDULE} /usr/local/bin/backup.sh >> /var/log/backup.log 2>&1" > /etc/crontabs/root

# Ensure log file exists
touch /var/log/backup.log

# Tail log in background so Docker captures output
tail -f /var/log/backup.log &

exec crond -f -l 8
