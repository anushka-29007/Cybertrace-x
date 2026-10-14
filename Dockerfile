# Multi-stage Dockerfile for CyberTrace-X Framework
# Stage 1: Build the React Client
FROM node:20-alpine AS client-builder
WORKDIR /app/client

COPY client/package*.json ./
RUN npm install

COPY client/ ./
RUN npm run build

# Stage 2: Setup Server & Serve Built Assets
FROM node:20-alpine AS production
WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Install server dependencies
COPY server/package*.json ./server/
WORKDIR /app/server
RUN npm install --omit=dev

# Copy server code
COPY server/ /app/server/

# Copy built frontend assets from client-builder into /app/client/dist
COPY --from=client-builder /app/client/dist /app/client/dist

EXPOSE 5000

CMD ["node", "server.js"]
