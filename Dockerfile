# Stage 1: Install dependencies
FROM node:22-alpine AS deps

WORKDIR /app

RUN npm install -g pnpm@9.15.0

COPY package.json pnpm-lock.yaml ./

RUN apk add --no-cache \
    libc6-compat \
    python3 \
    make \
    g++ \
    cairo-dev \
    pango-dev \
    jpeg-dev \
    giflib-dev

RUN pnpm install --frozen-lockfile

# Stage 2: Build the application
FROM node:22-alpine AS builder

WORKDIR /app

RUN npm install -g pnpm@9.15.0

COPY --from=deps /app/node_modules ./node_modules
COPY . .

ARG NEXT_PUBLIC_MEDIA_BASE_URL
ARG NEXT_PUBLIC_MINIO_BUCKET

ENV NEXT_PUBLIC_MEDIA_BASE_URL=$NEXT_PUBLIC_MEDIA_BASE_URL
ENV NEXT_PUBLIC_MINIO_BUCKET=$NEXT_PUBLIC_MINIO_BUCKET

RUN pnpm build

# Stage 3: Production runtime
FROM node:22-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production

RUN addgroup --system --gid 1001 nodejs && \
    adduser --system --uid 1001 nextjs

COPY --from=builder /app/public ./public
COPY --from=builder --chown=nextjs:nodejs /app/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/.next/static ./.next/static

USER nextjs

EXPOSE 3000

ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]