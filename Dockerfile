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

# Copy built files to Apache document root
COPY --from=builder /app/dist /usr/local/apache2/htdocs/

# Copy custom Apache configuration
COPY apache.conf /usr/local/apache2/conf/httpd.conf

# Create necessary directories and set permissions
RUN chown -R www-data:www-data /usr/local/apache2/htdocs/ && \
    chmod -R 755 /usr/local/apache2/htdocs/

# Expose port
EXPOSE 80

# Start Apache
CMD ["httpd-foreground"]