FROM node:lts AS base
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
RUN corepack enable && corepack prepare pnpm@10.10.0 --activate

FROM base AS deps
WORKDIR /app
COPY package.json pnpm-lock.yaml pnpm-workspace.yaml .npmrc ./
RUN --mount=type=cache,id=pnpm,target=/pnpm/store pnpm install --frozen-lockfile

FROM deps AS build
WORKDIR /app
ARG GITHUB_USERNAME
ENV GITHUB_USERNAME=$GITHUB_USERNAME
COPY . .
RUN pnpm build

FROM node:lts-slim AS deploy
WORKDIR /app
ENV PNPM_HOME="/pnpm"
ENV PATH="$PNPM_HOME:$PATH"
COPY --from=deps /app/node_modules /app/node_modules
COPY --from=build /app/dist /app/

ENV HOST=0.0.0.0
ENV BLOG_CONTENT_PATH=/data/content/blog
ENV SHOW_DRAFTS=false

VOLUME ["/data/content"]

CMD ["node", "/app/server/entry.mjs"]
