import 'dotenv/config';

export default {
    expo: {
        name: "Nilman",
        slug: "Nilman",
        version: "1.0.0",
        orientation: "portrait",
        icon: "./src/assets/images/logo.png",
        scheme: "nilman",
        userInterfaceStyle: "automatic",
        newArchEnabled: true,
        jsEngine: "hermes",
        splash: {
            image: "./src/assets/images/logo.png",
            resizeMode: "contain",
            backgroundColor: "#ffffff"
        },
        assetBundlePatterns: [
            "**/*"
        ],
        ios: {
            bundleIdentifier: "com.bhzd1k.nilman",
            supportsTablet: true
        },
        android: {
            package: "com.nilman.app",
            edgeToEdgeEnabled: true,
            adaptiveIcon: {
                foregroundImage: "./src/assets/images/adaptive-icon.png",
                backgroundColor: "#FFFFFF"
            }
        },
        web: {
            bundler: "metro",
            output: "static",
            favicon: "./src/assets/images/favicon.png"
        },
        experiments: {
            typedRoutes: true,
            reactCompiler: false
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
    },
    plugins: [
        "expo-router",
        "@maplibre/maplibre-react-native",
        "expo-location",
        {
            "locationAlwaysAndWhenInUsePermission": "Allow $(PRODUCT_NAME) to use your location."
        },
        ["expo-dev-client", {
            "addGeneratedSchema": false
        }],
        [
            "expo-splash-screen",
            {
                "image": "./assets/images/splash-icon.png",
                "imageWidth": 200,
                "resizeMode": "contain",
                "backgroundColor": "#ffffff"
            }
        ],
    ]
};
