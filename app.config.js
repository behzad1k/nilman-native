import 'dotenv/config';

export default {
    expo: {
        name: "Nilman",
        slug: "Nilman",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./src/assets/icon.png",
        userInterfaceStyle: "light",
        splash: {
            image: "./assets/splash.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            supportsTablet: true
        },
        android: {
            adaptiveIcon: {
                foregroundImage: "./assets/adaptive-icon.png",
                backgroundColor: "#FFFFFF"
            }
        },
        web: {
            favicon: "./assets/favicon.png"
        },
        extra: {
            router: {},
            eas: {
                projectId: "e74d8537-a1e8-432b-acb0-0e6d62eddb89"
            },
            apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL,
            apiTimeout: process.env.EXPO_PUBLIC_API_TIMEOUT,
            appEnv: process.env.EXPO_PUBLIC_APP_ENV,
        }
    }
};
