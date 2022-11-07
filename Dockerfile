FROM node:16 AS builder
WORKDIR /app

ADD package.json package-lock.json tsconfig.json ./
RUN npm install

ADD index.ts ./
RUN npm run build

# === App Image ======
FROM node:16 AS app
WORKDIR /app

ADD package.json package-lock.json ./
RUN npm install --production

COPY --from=builder /app/dist/ ./
CMD node dist/index.js