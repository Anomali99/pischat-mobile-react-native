# Pischat Mobile

![JavaScript Badge](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=000&style=flat-square)
![TypeScript Badge](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=fff&style=flat-square)
![React Badge](https://img.shields.io/badge/React-61DAFB?logo=react&logoColor=000&style=flat-square)
![SQLite Badge](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=fff&style=for-the-badge)
![Android Badge](https://img.shields.io/badge/Android-34A853?logo=android&logoColor=fff&style=for-the-badge)

- OS Target (Android)
- Framework (React Native)
- Local Storage (SQLite)

## Installation

```bash
npm install
```

```bash
npm run start
```

```bash
npm run android
```

## build APK

### Debug APK

```bash
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

```bash
cd android
```

```bash
./gradlew assembleDebug
```

APK file in `android/app/build/outputs/apk/debug/app-debug.apk`

### Release APK

```bash
keytool -genkey -v -keystore pischat_mobile.keystore -alias pischat -keyalg RSA -keysize 2048 -validity 10000
```

```bash
mv pischat_mobile.keystore android/app
```

open your `android\app\build.gradle` file and add the keystore configuration.

```
android {
....
  signingConfigs {
    release {
      storeFile file('your_key_name.keystore')
      storePassword 'your_key_store_password'
      keyAlias 'your_key_alias'
      keyPassword 'your_key_file_alias_password'
    }
  }
  buildTypes {
    release {
      ....
      signingConfig signingConfigs.release
    }
  }
}
```

```bash
react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res
```

```bash
cd android
```

```bash
./gradlew assembleRelease
```

APK file in `android/app/build/outputs/apk/release/app-release.apk`
