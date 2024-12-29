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
//*     clean-android : "rmdir /s /q android\build android\app\build android\app\.cxx"

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