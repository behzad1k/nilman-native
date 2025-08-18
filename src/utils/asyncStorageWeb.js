// src/utils/asyncStorageWeb.js
// Web-safe AsyncStorage implementation

// Safe window check
const isBrowser = typeof window !== 'undefined' && window.localStorage;

const AsyncStorage = {
    getItem: async (key) => {
        if (!isBrowser) return null;
        try {
            return localStorage.getItem(key);
        } catch (error) {
            console.warn('AsyncStorage getItem error:', error);
            return null;
        }
    },

    setItem: async (key, value) => {
        if (!isBrowser) return;
        try {
            localStorage.setItem(key, value);
        } catch (error) {
            console.warn('AsyncStorage setItem error:', error);
        }
    },

    removeItem: async (key) => {
        if (!isBrowser) return;
        try {
            localStorage.removeItem(key);
        } catch (error) {
            console.warn('AsyncStorage removeItem error:', error);
        }
    },

    clear: async () => {
        if (!isBrowser) return;
        try {
            localStorage.clear();
        } catch (error) {
            console.warn('AsyncStorage clear error:', error);
        }
    },

    getAllKeys: async () => {
        if (!isBrowser) return [];
        try {
            return Object.keys(localStorage);
        } catch (error) {
            console.warn('AsyncStorage getAllKeys error:', error);
            return [];
        }
    },

    multiGet: async (keys) => {
        if (!isBrowser) return [];
        try {
            return keys.map(key => [key, localStorage.getItem(key)]);
        } catch (error) {
            console.warn('AsyncStorage multiGet error:', error);
            return [];
        }
    },

    multiSet: async (keyValuePairs) => {
        if (!isBrowser) return;
        try {
            keyValuePairs.forEach(([key, value]) => {
                localStorage.setItem(key, value);
            });
        } catch (error) {
            console.warn('AsyncStorage multiSet error:', error);
        }
    },

    multiRemove: async (keys) => {
        if (!isBrowser) return;
        try {
            keys.forEach(key => {
                localStorage.removeItem(key);
            });
        } catch (error) {
            console.warn('AsyncStorage multiRemove error:', error);
        }
    }
};

// Export with proper module format
if (typeof module !== 'undefined' && module.exports) {
    module.exports = AsyncStorage;
} else {
    // ES6 export fallback
    export default AsyncStorage;
}