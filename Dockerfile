# Multi-stage build for smaller production image
FROM node:20-alpine AS base
WORKDIR /app
COPY package*.json ./

# Dependencies stage
FROM base AS deps
RUN npm ci --only=production && npm cache clean --force

# Build stage
FROM base AS build
RUN npm ci
COPY . .
RUN npm run build

# Production runtime
FROM node:20-alpine AS runtime

# Install curl for healthcheck and dumb-init for signal handling
RUN apk add --no-cache curl dumb-init

WORKDIR /app

# Create app user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nodejs -u 1001 -G nodejs

# Copy built application with proper ownership
COPY --from=deps --chown=nodejs:nodejs /app/node_modules ./node_modules
COPY --from=build --chown=nodejs:nodejs /app/dist ./dist
COPY --from=build --chown=nodejs:nodejs /app/package.json ./

# Create directories with proper permissions
RUN mkdir -p /var/log/app /tmp/uploads && \
    chown -R nodejs:nodejs /var/log/app /tmp/uploads

# Switch to non-root user
USER nodejs

# Expose correct port
EXPOSE 8080

# Improved health check with proper error handling
HEALTHCHECK --interval=30s --timeout=10s --start-period=15s --retries=3 \
  CMD curl -f http://localhost:8080/api/ping -H "Accept: application/json" || exit 1

# Use dumb-init for proper signal handling
ENTRYPOINT ["dumb-init", "--"]

# Start the production server
CMD ["node", "dist/server/node-build.mjs"]