# Dockerfile - Fixed version with all patches
FROM node:18-alpine

# Install curl for health checks
RUN apk add --no-cache curl

# Set working directory
WORKDIR /app

# Copy package files first for better caching
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Create patch script
RUN echo '#!/bin/sh' > /tmp/patch-packages.sh && \
    echo 'echo "🔧 Patching packages for web build..."' >> /tmp/patch-packages.sh && \
    echo '' >> /tmp/patch-packages.sh && \
    echo '# Patch AsyncStorage' >> /tmp/patch-packages.sh && \
    echo 'ASYNC_STORAGE_PATH="node_modules/@react-native-async-storage/async-storage/lib/commonjs/AsyncStorage.js"' >> /tmp/patch-packages.sh && \
    echo 'if [ -f "$ASYNC_STORAGE_PATH" ]; then' >> /tmp/patch-packages.sh && \
    echo '  echo "📝 Patching AsyncStorage for web..."' >> /tmp/patch-packages.sh && \
    echo '  cp "$ASYNC_STORAGE_PATH" "${ASYNC_STORAGE_PATH}.backup"' >> /tmp/patch-packages.sh && \
    echo '  cat > "$ASYNC_STORAGE_PATH" << '\''EOFA'\''' >> /tmp/patch-packages.sh && \
    echo 'const AsyncStorage = {' >> /tmp/patch-packages.sh && \
    echo '  getItem: function(key, callback) {' >> /tmp/patch-packages.sh && \
    echo '    return new Promise((resolve) => {' >> /tmp/patch-packages.sh && \
    echo '      const result = (typeof window !== "undefined" && window.localStorage) ? window.localStorage.getItem(key) : null;' >> /tmp/patch-packages.sh && \
    echo '      callback && callback(null, result);' >> /tmp/patch-packages.sh && \
    echo '      resolve(result);' >> /tmp/patch-packages.sh && \
    echo '    });' >> /tmp/patch-packages.sh && \
    echo '  },' >> /tmp/patch-packages.sh && \
    echo '  setItem: function(key, value, callback) {' >> /tmp/patch-packages.sh && \
    echo '    return new Promise((resolve) => {' >> /tmp/patch-packages.sh && \
    echo '      if (typeof window !== "undefined" && window.localStorage) {' >> /tmp/patch-packages.sh && \
    echo '        try { window.localStorage.setItem(key, value); } catch (e) {}' >> /tmp/patch-packages.sh && \
    echo '      }' >> /tmp/patch-packages.sh && \
    echo '      callback && callback(null);' >> /tmp/patch-packages.sh && \
    echo '      resolve();' >> /tmp/patch-packages.sh && \
    echo '    });' >> /tmp/patch-packages.sh && \
    echo '  },' >> /tmp/patch-packages.sh && \
    echo '  removeItem: function(key, callback) {' >> /tmp/patch-packages.sh && \
    echo '    return new Promise((resolve) => {' >> /tmp/patch-packages.sh && \
    echo '      if (typeof window !== "undefined" && window.localStorage) {' >> /tmp/patch-packages.sh && \
    echo '        try { window.localStorage.removeItem(key); } catch (e) {}' >> /tmp/patch-packages.sh && \
    echo '      }' >> /tmp/patch-packages.sh && \
    echo '      callback && callback(null);' >> /tmp/patch-packages.sh && \
    echo '      resolve();' >> /tmp/patch-packages.sh && \
    echo '    });' >> /tmp/patch-packages.sh && \
    echo '  },' >> /tmp/patch-packages.sh && \
    echo '  clear: function(callback) {' >> /tmp/patch-packages.sh && \
    echo '    return new Promise((resolve) => {' >> /tmp/patch-packages.sh && \
    echo '      if (typeof window !== "undefined" && window.localStorage) {' >> /tmp/patch-packages.sh && \
    echo '        try { window.localStorage.clear(); } catch (e) {}' >> /tmp/patch-packages.sh && \
    echo '      }' >> /tmp/patch-packages.sh && \
    echo '      callback && callback(null);' >> /tmp/patch-packages.sh && \
    echo '      resolve();' >> /tmp/patch-packages.sh && \
    echo '    });' >> /tmp/patch-packages.sh && \
    echo '  },' >> /tmp/patch-packages.sh && \
    echo '  getAllKeys: function(callback) {' >> /tmp/patch-packages.sh && \
    echo '    return new Promise((resolve) => {' >> /tmp/patch-packages.sh && \
    echo '      const result = (typeof window !== "undefined" && window.localStorage) ? Object.keys(window.localStorage) : [];' >> /tmp/patch-packages.sh && \
    echo '      callback && callback(null, result);' >> /tmp/patch-packages.sh && \
    echo '      resolve(result);' >> /tmp/patch-packages.sh && \
    echo '    });' >> /tmp/patch-packages.sh && \
    echo '  },' >> /tmp/patch-packages.sh && \
    echo '  multiGet: function(keys, callback) {' >> /tmp/patch-packages.sh && \
    echo '    return new Promise((resolve) => {' >> /tmp/patch-packages.sh && \
    echo '      const result = keys.map(key => [key, (typeof window !== "undefined" && window.localStorage) ? window.localStorage.getItem(key) : null]);' >> /tmp/patch-packages.sh && \
    echo '      callback && callback(null, result);' >> /tmp/patch-packages.sh && \
    echo '      resolve(result);' >> /tmp/patch-packages.sh && \
    echo '    });' >> /tmp/patch-packages.sh && \
    echo '  },' >> /tmp/patch-packages.sh && \
    echo '  multiSet: function(keyValuePairs, callback) {' >> /tmp/patch-packages.sh && \
    echo '    return new Promise((resolve) => {' >> /tmp/patch-packages.sh && \
    echo '      if (typeof window !== "undefined" && window.localStorage) {' >> /tmp/patch-packages.sh && \
    echo '        try { keyValuePairs.forEach(([key, value]) => window.localStorage.setItem(key, value)); } catch (e) {}' >> /tmp/patch-packages.sh && \
    echo '      }' >> /tmp/patch-packages.sh && \
    echo '      callback && callback(null);' >> /tmp/patch-packages.sh && \
    echo '      resolve();' >> /tmp/patch-packages.sh && \
    echo '    });' >> /tmp/patch-packages.sh && \
    echo '  },' >> /tmp/patch-packages.sh && \
    echo '  multiRemove: function(keys, callback) {' >> /tmp/patch-packages.sh && \
    echo '    return new Promise((resolve) => {' >> /tmp/patch-packages.sh && \
    echo '      if (typeof window !== "undefined" && window.localStorage) {' >> /tmp/patch-packages.sh && \
    echo '        try { keys.forEach(key => window.localStorage.removeItem(key)); } catch (e) {}' >> /tmp/patch-packages.sh && \
    echo '      }' >> /tmp/patch-packages.sh && \
    echo '      callback && callback(null);' >> /tmp/patch-packages.sh && \
    echo '      resolve();' >> /tmp/patch-packages.sh && \
    echo '    });' >> /tmp/patch-packages.sh && \
    echo '  }' >> /tmp/patch-packages.sh && \
    echo '};' >> /tmp/patch-packages.sh && \
    echo 'module.exports = AsyncStorage;' >> /tmp/patch-packages.sh && \
    echo 'EOFA' >> /tmp/patch-packages.sh && \
    echo '  echo "✅ AsyncStorage patched successfully"' >> /tmp/patch-packages.sh && \
    echo 'else' >> /tmp/patch-packages.sh && \
    echo '  echo "⚠️ AsyncStorage not found, skipping patch"' >> /tmp/patch-packages.sh && \
    echo 'fi' >> /tmp/patch-packages.sh && \
    echo '' >> /tmp/patch-packages.sh && \
    echo '# Patch MapLibre' >> /tmp/patch-packages.sh && \
    echo 'MAPLIBRE_PATH="node_modules/@maplibre/maplibre-react-native/lib/module/MLRNModule.js"' >> /tmp/patch-packages.sh && \
    echo 'if [ -f "$MAPLIBRE_PATH" ]; then' >> /tmp/patch-packages.sh && \
    echo '  echo "📝 Patching MapLibre for web..."' >> /tmp/patch-packages.sh && \
    echo '  cp "$MAPLIBRE_PATH" "${MAPLIBRE_PATH}.backup"' >> /tmp/patch-packages.sh && \
    echo '  cat > "$MAPLIBRE_PATH" << '\''EOFM'\''' >> /tmp/patch-packages.sh && \
    echo 'function factory() {' >> /tmp/patch-packages.sh && \
    echo '  return {' >> /tmp/patch-packages.sh && \
    echo '    MapView: function() { return null; },' >> /tmp/patch-packages.sh && \
    echo '    Camera: function() { return null; },' >> /tmp/patch-packages.sh && \
    echo '    MarkerView: function() { return null; },' >> /tmp/patch-packages.sh && \
    echo '    PointAnnotation: function() { return null; },' >> /tmp/patch-packages.sh && \
    echo '    Callout: function() { return null; },' >> /tmp/patch-packages.sh && \
    echo '    UserLocation: function() { return null; }' >> /tmp/patch-packages.sh && \
    echo '  };' >> /tmp/patch-packages.sh && \
    echo '}' >> /tmp/patch-packages.sh && \
    echo 'module.exports = factory;' >> /tmp/patch-packages.sh && \
    echo 'EOFM' >> /tmp/patch-packages.sh && \
    echo '  echo "✅ MapLibre patched successfully"' >> /tmp/patch-packages.sh && \
    echo 'else' >> /tmp/patch-packages.sh && \
    echo '  echo "⚠️ MapLibre not found, skipping patch"' >> /tmp/patch-packages.sh && \
    echo 'fi' >> /tmp/patch-packages.sh && \
    chmod +x /tmp/patch-packages.sh

# Run the patch script
RUN /tmp/patch-packages.sh

# Set environment variables for build
ENV NODE_ENV=production
ENV EXPO_PLATFORM=web
ENV EXPO_USE_FAST_RESOLVER=1

# Install dotenv-cli to load environment variables during build
RUN npm install -g dotenv-cli

# Clear any existing build artifacts
RUN rm -rf dist/ .expo/ node_modules/.cache/

# Build web app with environment variables
RUN echo "🏗️ Building web app with environment variables..." && \
    dotenv -e .env npx expo export --platform web --clear

# Verify build output
RUN if [ ! -d "dist" ]; then \
        echo "❌ Build failed - dist directory not created"; \
        exit 1; \
    else \
        echo "✅ Build successful - dist directory created"; \
        ls -la dist/; \
    fi

# Install serve globally
RUN npm install -g serve

# Create non-root user for security
RUN addgroup -g 1001 -S nodejs && \
    adduser -S nextjs -u 1001 && \
    chown -R nextjs:nodejs /app

USER nextjs

# Expose port 3003
EXPOSE 3003

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=10s --retries=3 \
    CMD curl -f http://localhost:3003 || exit 1

# Start the app
CMD ["serve", "-s", "dist", "-l", "3003", "--no-clipboard", "--cors"]