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

# Create patch files first
RUN cat > /tmp/async-storage-patch.js << 'EOF'
function getValue(key) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return null;
  }
  try {
    return window.localStorage.getItem(key);
  } catch (e) {
    return null;
  }
}

function setValue(key, value) {
  if (typeof window === 'undefined' || !window.localStorage) {
    return;
  }
  try {
    window.localStorage.setItem(key, value);
  } catch (e) {
    // Silent fail
  }
}

const AsyncStorage = {
  getItem: function(key, callback) {
    return new Promise((resolve) => {
      const result = getValue(key);
      callback && callback(null, result);
      resolve(result);
    });
  },
  setItem: function(key, value, callback) {
    return new Promise((resolve) => {
      setValue(key, value);
      callback && callback(null);
      resolve();
    });
  },
  removeItem: function(key, callback) {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.removeItem(key);
        } catch (e) {}
      }
      callback && callback(null);
      resolve();
    });
  },
  clear: function(callback) {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          window.localStorage.clear();
        } catch (e) {}
      }
      callback && callback(null);
      resolve();
    });
  },
  getAllKeys: function(callback) {
    return new Promise((resolve) => {
      let result = [];
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          result = Object.keys(window.localStorage);
        } catch (e) {}
      }
      callback && callback(null, result);
      resolve(result);
    });
  },
  multiGet: function(keys, callback) {
    return new Promise((resolve) => {
      const result = keys.map(key => [key, getValue(key)]);
      callback && callback(null, result);
      resolve(result);
    });
  },
  multiSet: function(keyValuePairs, callback) {
    return new Promise((resolve) => {
      keyValuePairs.forEach(([key, value]) => setValue(key, value));
      callback && callback(null);
      resolve();
    });
  },
  multiRemove: function(keys, callback) {
    return new Promise((resolve) => {
      if (typeof window !== 'undefined' && window.localStorage) {
        try {
          keys.forEach(key => window.localStorage.removeItem(key));
        } catch (e) {}
      }
      callback && callback(null);
      resolve();
    });
  }
};

module.exports = AsyncStorage;
EOF

RUN cat > /tmp/maplibre-patch.js << 'EOF'
// Web-safe MapLibre mock
function factory() {
  return {
    MapView: function() { return null; },
    Camera: function() { return null; },
    MarkerView: function() { return null; },
    PointAnnotation: function() { return null; },
    Callout: function() { return null; },
    UserLocation: function() { return null; },
    Logger: {
      setLogLevel: function() {},
      setLogCallback: function() {}
    },
    UserTrackingMode: {
      None: 0,
      Follow: 1,
      FollowWithHeading: 2,
      FollowWithCourse: 3
    },
    CameraModes: {
      Flight: 'flight',
      Ease: 'ease',
      Linear: 'linear'
    }
  };
}

module.exports = factory;
EOF

RUN cat > /tmp/maplibre-index-patch.js << 'EOF'
// Web-safe MapLibre exports
const MockComponent = function() { return null; };

export const MapView = MockComponent;
export const Camera = MockComponent;
export const MarkerView = MockComponent;
export const PointAnnotation = MockComponent;
export const Callout = MockComponent;
export const UserLocation = MockComponent;

export const Logger = {
  setLogLevel: function() {},
  setLogCallback: function() {}
};

export const UserTrackingMode = {
  None: 0,
  Follow: 1,
  FollowWithHeading: 2,
  FollowWithCourse: 3
};

export const CameraModes = {
  Flight: 'flight',
  Ease: 'ease',
  Linear: 'linear'
};

export default MockComponent;
EOF

# Apply AsyncStorage patch
RUN if [ -f "node_modules/@react-native-async-storage/async-storage/lib/commonjs/AsyncStorage.js" ]; then \
    echo "📝 Patching AsyncStorage for web..." && \
    cp node_modules/@react-native-async-storage/async-storage/lib/commonjs/AsyncStorage.js \
       node_modules/@react-native-async-storage/async-storage/lib/commonjs/AsyncStorage.js.backup && \
    cp /tmp/async-storage-patch.js node_modules/@react-native-async-storage/async-storage/lib/commonjs/AsyncStorage.js && \
    echo "✅ AsyncStorage patched successfully"; \
else \
    echo "⚠️ AsyncStorage not found, skipping patch"; \
fi

# Apply MapLibre MLRNModule patch
RUN if [ -f "node_modules/@maplibre/maplibre-react-native/lib/module/MLRNModule.js" ]; then \
    echo "📝 Patching MapLibre MLRNModule for web..." && \
    cp node_modules/@maplibre/maplibre-react-native/lib/module/MLRNModule.js \
       node_modules/@maplibre/maplibre-react-native/lib/module/MLRNModule.js.backup && \
    cp /tmp/maplibre-patch.js node_modules/@maplibre/maplibre-react-native/lib/module/MLRNModule.js && \
    echo "✅ MapLibre MLRNModule patched successfully"; \
else \
    echo "⚠️ MapLibre MLRNModule not found, skipping patch"; \
fi

# Apply MapLibre index patch
RUN if [ -f "node_modules/@maplibre/maplibre-react-native/lib/module/index.js" ]; then \
    echo "📝 Patching MapLibre index for web..." && \
    cp node_modules/@maplibre/maplibre-react-native/lib/module/index.js \
       node_modules/@maplibre/maplibre-react-native/lib/module/index.js.backup && \
    cp /tmp/maplibre-index-patch.js node_modules/@maplibre/maplibre-react-native/lib/module/index.js && \
    echo "✅ MapLibre index patched successfully"; \
else \
    echo "⚠️ MapLibre index not found, skipping patch"; \
fi

# Clean up patch files
RUN rm -f /tmp/async-storage-patch.js /tmp/maplibre-patch.js /tmp/maplibre-index-patch.js

# Set environment variables for build
ENV NODE_ENV=production
ENV EXPO_PLATFORM=web
ENV EXPO_USE_FAST_RESOLVER=1

# Clear any existing build artifacts
RUN rm -rf dist/ .expo/ node_modules/.cache/

# Build web app
RUN echo "🏗️ Building web app..." && \
    npx expo export --platform web --clear

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