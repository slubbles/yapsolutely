FROM node:22-bookworm-slim AS base

WORKDIR /app

RUN apt-get update \
	&& apt-get install -y --no-install-recommends openssl ca-certificates \
	&& rm -rf /var/lib/apt/lists/*

COPY package.json package-lock.json ./
COPY apps/web/package.json apps/web/package.json
COPY apps/voice/package.json apps/voice/package.json

RUN npm ci --workspaces --include-workspace-root

COPY . .

RUN npm run db:generate -w apps/web
RUN npm run build -w apps/web

EXPOSE 3000

CMD ["npm", "run", "start", "-w", "apps/web"]
