FROM alpine:3.21

# postgresql-client for pg_dump, mc for MinIO, curl for Cloudinary API
RUN apk add --no-cache \
    postgresql16-client \
    curl \
    bash \
    tar \
    gzip \
    tzdata \
    grep \
    openssl

COPY backup.sh /usr/local/bin/backup.sh
COPY entrypoint.sh /entrypoint.sh
RUN chmod +x /usr/local/bin/backup.sh /entrypoint.sh

VOLUME ["/backups"]

ENTRYPOINT ["/entrypoint.sh"]
