# Dockerfile
FROM node:18-alpine

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

# Install serve to serve static files
RUN npm install -g serve

# Expose port 3003
EXPOSE 3003

# Start the app
CMD ["serve", "-s", "dist", "-l", "3003"]