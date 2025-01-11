//? Configure eslint 

//? Import assets
//*  Import images, fonts, etc. in src/assets

//? Configure bable config
//* If we are using any plugin like reanimated

//? Configure Metro bundler 
//* To resolve and transform assets
//_ Support .svg imports as components

//_ Exclude certain node_modules

//_ Add TypeScript support
//*   to handle .tsx files

//_ Add custom file extensions (like .md)
//*   to resolve .md files, there is no linking here

//_ Add custom assets (like images)
//*   there is no linking here


//? Configure React Native CLI
//- Updating RN CLI Config   vs   Metro Config :

//_ Add custom fonts (like .ttf) :
//*   fonts are native files, so rncli links them

//_ Add TypeScript support
//*   to link TypeScript files

//_ Use rn vector icons

//_ Link native libraries (like react-native-reanimated)


//? Linking react native assets
//*   Only link after importing assets and declaring in rn-config
//   npx react-native-asset


//? Name Change :
//_ 	Android :
//* 		app_name : /android/app/src/main/res/values/strings.xml

//_ 	IOS :
//* 		CFBundleDisplayName : /ios/share_it/Info.plist


//? Configure Android
//_ 	Configure Android Manifest
//* 		/android/app/src/main/AndroidManifest.xml
//* 		configure permissions

//_ 	Configure Gradle
//* 		/android/app/build.gradle
//* 		Add font families for vector icons


//? Configuring IOS
//_ 	Configure Info.plist
//* 		/ios/share_it/Info.plist
//* 		Network services requested by app
//* 		Privacy Usage Description for each permission requested by app
//* 		Set up font family
//* 	 (These are reviewed in Appstore team for approval)

//_ 	Configure Podfile
//* 		/ios/Podfile
//* 		configure permissions



//? Configure App icon  and Launch screen
//_ Android
//*   	Open '/android' directory in Android Studio
//* 		it will automatically start downloading dependencies and build project
//*   	Right click 'app' => new => ImageAsset
//*   	Set Foreground layer's path = "ShareIt Assets/AppIcons/Assets.xcassets/AppIcon.appiconset/1024.png"
//*   	Resize if necessary
//* 	Set Background layer's color via color picker

//_ Ios
//*     Open '/ios' directory in Xcode
//*         it will automatically start downloading dependencies and build project

//*     Go to 'share_it/Images' => AppIcon'
//*         Drop desired sized icons in respective slots from "ShareIt Assets/AppIcons/Assets.xcassets/AppIcon.appiconset/"
//*         Right click in sidebar => 'New Image Set' => name = 'Logo'  and select 1024 sized icon

//*     Go to 'share_it/LaunchScreen' :
//*         Select items in canvas and delete it
//*         use color picker to set color of Launch screen to logo color (or keep it empty)



//? Running project
//_ Android
//*     npm start => -a
//*         or
//*     npm run android


//_ IOS
//*    1st : npm run pod-install

//*    2nd :
//*          npm start => -i
//*               or
//*          npm run ios


//? Responsive screens :
// https://medium.com/@mz-real/creating-responsive-uis-in-react-native-made-easy-with-react-native-responsive-hook-35fa5649cd5f



//? Debugging Android :

//_ clean android cache :
//*     clean-android : "cd android && gradlew clean"
//*     Deletes compiled classes / jars via gradle from entire project including node_modules
//-     Should be used before cleaning npm

//_ clean-android : 
//*     clean-android (these are not in git) : 
//          rmdir /s /q android\build 
//          rmdir /s /q android\app\build 
//          rmdir /s /q android\app\.cxx
//          rmdir /s /q android\.gradle
//          rmdir /s /q android\.idea
//!         rmdir /s /q android\app\src\main\res (part of git)


//_ Clean gradle : 
//*     cd android && gradlew clean

//_ clean npm cache :
//*     clean-npm : "rd /s /q node_modules && npm cache clean --force"

//_ Clean metro cache : 
//*     clean-metro : "rmdir /s /q %TEMP%\\metro-cache"
//*     We can also clean it mannualy via 'Windows + R' => %TEMP% => delete 'metro-cache' folder

//_ Clean (jest) haste map cache :
//- Not sure where in windows its stored
//*     clean-jest : "rmdir /s /q %TEMP%\\haste-map-*"

//_ Clean watchman cache :
//*     clean-watchman : "watchman watch-del-all"

//_ Clean Ultimate :
//* Should be used if nothing else works
//*     clean-ultimate : "rd /s /q node_modules && npm cache clean --force && watchman watch-del-all && rmdir /s /q %TEMP%\\haste-map-* && rmdir /s /q %TEMP%\\metro-cache"
//*                                                 or                                          
//*    clean-ultimate : npm run clean-npm && npm run clean-watchman && npm run clean-jest && npm run clean-metro"

//_ Now run "npm i && npm run reset-cache"



//? Generating Self signed SSL certificate: 
//* Go to 'react-native-tcp-socket' and follow instructions






//? Android Signing :

//_ Generate keystore 
//* named 'release.keystore' and place it in 'android/app'

// keytool -genkeypair -v -storetype PKCS12 -keystore release.keystore -alias androidreleasekey -keyalg RSA -keysize 2048 -validity 10000
//*                            or 
//*     Use android studio to generate keystore



//_ Update  'android/gradle.properties' 
//* These are global variables available for gradle 
//*     (can change their names)
//* add following :
//      MYAPP_UPLOAD_STORE_FILE=release.keystore
//      MYAPP_UPLOAD_KEY_ALIAS=androidreleasekey
//      MYAPP_UPLOAD_STORE_PASSWORD=android
//      MYAPP_UPLOAD_KEY_PASSWORD=android

//_ Update 'android/app/build.gradle' 
//* add following :
// android {
//     ...
//     defaultConfig { ... }
//     signingConfigs {
//        debug {
//             ...
//         }
//         release {
//             if (project.hasProperty('MYAPP_UPLOAD_STORE_FILE')) {
//                 storeFile file(MYAPP_UPLOAD_STORE_FILE)
//                 storePassword MYAPP_UPLOAD_STORE_PASSWORD
//                 keyAlias MYAPP_UPLOAD_KEY_ALIAS
//                 keyPassword MYAPP_UPLOAD_KEY_PASSWORD
//             }
//         }
//     }
//     buildTypes {
//         release {
//             ...
//             signingConfig signingConfigs.release
//         }
//     }
// }

//* Can configure above to reduce size by splitting APKs for different architectures (see docs)




//? Check gradle compatibility
//* Make sure Gradle and Gradle Plugin are synced 
// https://developer.android.com/build/releases/gradle-plugin?buildsystem=ndk-build#updating-gradle
//_ Gradle version :
//*     cd android && gradlew -v
//*     open 'android/gradle/wrapper/gradle-wrapper.properties' and check 'distributionUrl'

//_ Gradle Plugin version :
//*     open 'android/build.gradle' and check buildscript.dependencies.classpath = 'com.android.tools.build:gradle:<plugin-version>'

//_ Import Android 
//*    Open 'android/' in Android Studio and let it sync

//! Sometimes move project to new location (after deleting all .gitignore files)









//? Android Build 


//_ APK generation
//! Make sure to import android by opening 'android/' in Android Studio
//*     Generate React Native Bundle :
//          npx react-native bundle --platform android --dev false --entry-file index.js --bundle-output android/app/src/main/assets/index.android.bundle --assets-dest android/app/src/main/res 

//*     Assemble to APK :
//          cd android && gradlew clean && gradlew assembleRelease && cd .. 
//*         Output : android/app/build/outputs/apk/release/app-release.apk

//*     Install APK to device :
//          adb install -r android/app/build/outputs/apk/release/app-release.apk

// if error ENOENT: no such file or directory, open 'android/app/src/main/assets/index.android.bundle' 
// run : mkdir android/app/src/main/assets


//_ AAB generation (Android App Bundle)
//*     npx react-native build-android --mode=release
//*                     or
//*     cd android && gradlew bundleRelease && cd ..

//*     Output :  android/app/build/outputs/bundle/release/app-release.aab


