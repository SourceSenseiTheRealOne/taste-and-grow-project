# Build stage
FROM node:20-alpine AS builder

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install dependencies (including dev dependencies for build)
RUN npm ci

# Copy source code
COPY . .

# Generate Prisma Client
RUN npx prisma generate

# Build the application
RUN npm run build

# Verify the build output exists
RUN ls -la dist/ && ls -la dist/src/main.js

# Production stage
FROM node:20-alpine

WORKDIR /app

# Copy package files
COPY package*.json ./
COPY prisma ./prisma/

# Install production dependencies only
RUN npm ci --omit=dev

# Generate Prisma Client in production stage
RUN npx prisma generate

# Copy built application from builder
COPY --from=builder /app/dist ./dist

# Verify files were copied
RUN ls -la ./dist && test -f ./dist/src/main.js

# Expose port
EXPOSE 3000

# Set environment variable
ENV NODE_ENV=production

# Start the application directly with node
CMD ["node", "dist/src/main.js"]

