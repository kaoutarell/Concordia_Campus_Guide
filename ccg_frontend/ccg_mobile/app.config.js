import "dotenv/config";

export default ({ config }) => ({
  expo: {
    name: "ccg_mobile",
    slug: "ccg_mobile",
    version: "1.0.0",
    orientation: "portrait",
    icon: "./assets/icon.png",
    userInterfaceStyle: "light",
    newArchEnabled: true,
    splash: {
      image: "./assets/splash-icon.png",
      resizeMode: "contain",
      backgroundColor: "#ffffff",
    },
    plugins: [
      [
        "expo-location",
        {
          locationAlwaysAndWhenInUsePermission: "Allow the app to access your location at all times.",
          locationWhenInUsePermission: "Allow the app to access your location while using the app.",
        },
      ],
      "expo-localization",
      [
        "@react-native-google-signin/google-signin",
        {
          iosUrlScheme: process.env.IOS_URL_SCHEME
        }
      ]
    ],
    ios: {
      supportsTablet: true,
      bundleIdentifier: "com.ikozay.ccg-mobile",
    },
    android: {
      adaptiveIcon: {
        foregroundImage: "./assets/adaptive-icon.png",
        backgroundColor: "#ffffff",
      },
      permissions: ["android.permission.ACCESS_COARSE_LOCATION", "android.permission.ACCESS_FINE_LOCATION"],
      config: {
        googleMaps: {
          apiKey: process.env.GOOGLE_MAPS_API_KEY,
        },
      },
      package: "com.ikozay.ccg_mobile",
    },
    web: {
      favicon: "./assets/favicon.png",
    },
  },
});
