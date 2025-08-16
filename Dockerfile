# Dockerfile
FROM node:18-alpine AS builder

# Set working directory
WORKDIR /app

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build web app
RUN npx expo export --platform web

# Production stage with Apache
FROM httpd:2.4-alpine

# Expose port
EXPOSE 3003

# Start Apache
CMD ["httpd-foreground"]