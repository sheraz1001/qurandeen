# QuranDeen Mobile App Build Guide

This guide explains how to build QuranDeen as native iOS and Android apps using Capacitor.

## Prerequisites

### For iOS Development:
- macOS computer with Xcode installed
- Apple Developer Account ($99/year)
- Xcode Command Line Tools

### For Android Development:
- Android Studio installed
- Android SDK
- Java JDK 11 or higher

## Build Steps

### 1. Build the Web App
```bash
npm run build
```

### 2. Initialize Capacitor (first time only)
```bash
npx cap init "Quran Deen" "com.qurandeen.app" --web-dir dist
```

### 3. Add Platforms

**Add iOS:**
```bash
npx cap add ios
```

**Add Android:**
```bash
npx cap add android
```

### 4. Sync Web Assets to Native Projects
After any web changes:
```bash
npx cap sync
```

### 5. Open in Native IDEs

**Open in Xcode (iOS):**
```bash
npx cap open ios
```

**Open in Android Studio:**
```bash
npx cap open android
```

## App Store Submission

### iOS App Store
1. Open project in Xcode
2. Configure signing with your Apple Developer account
3. Set version and build number
4. Archive the app (Product > Archive)
5. Upload to App Store Connect
6. Submit for review

### Google Play Store
1. Open project in Android Studio
2. Generate signed APK/AAB (Build > Generate Signed Bundle)
3. Create app listing in Google Play Console
4. Upload AAB file
5. Submit for review

## App Icons

App icons are located in:
- `client/public/icons/` - Source icons
- `ios/App/App/Assets.xcassets/AppIcon.appiconset/` - iOS icons
- `android/app/src/main/res/mipmap-*/` - Android icons

Use a tool like [capacitor-assets](https://github.com/ionic-team/capacitor-assets) to generate all icon sizes:
```bash
npx capacitor-assets generate
```

## Splash Screen

Configure splash screen in `capacitor.config.ts`:
```typescript
plugins: {
  SplashScreen: {
    launchShowDuration: 2000,
    backgroundColor: '#0d1117'
  }
}
```

## Push Notifications (Optional)

Install the Push Notifications plugin:
```bash
npm install @capacitor/push-notifications
npx cap sync
```

## Common Commands

| Command | Description |
|---------|-------------|
| `npm run build` | Build web app |
| `npx cap sync` | Sync web to native |
| `npx cap copy` | Copy web assets only |
| `npx cap open ios` | Open in Xcode |
| `npx cap open android` | Open in Android Studio |
| `npx cap run ios` | Run on iOS device/simulator |
| `npx cap run android` | Run on Android device/emulator |

## Testing on Devices

### iOS Simulator:
```bash
npx cap run ios --target "iPhone 15 Pro"
```

### Android Emulator:
```bash
npx cap run android
```

### Physical Devices:
Connect your device and run the appropriate command. For iOS, ensure your device is registered in your Apple Developer account.

## Troubleshooting

### iOS Build Errors
- Ensure Xcode is up to date
- Clean build folder (Cmd+Shift+K)
- Delete Derived Data

### Android Build Errors
- Update Gradle wrapper
- Sync project with Gradle files
- Clear build cache: `./gradlew clean`

## Resources

- [Capacitor Documentation](https://capacitorjs.com/docs)
- [Apple Developer Documentation](https://developer.apple.com/documentation/)
- [Android Developer Documentation](https://developer.android.com/docs)
