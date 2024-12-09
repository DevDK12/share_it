//? Import assets
//*  Import images, fonts, etc. in src/assets

//? Configure Metro bundler


//? Configure React Native CLI


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

//_ 	Configure vector icons
//* 		For android only
//* 		Add font families for vector icons in /android/app/build.gradle


//? Configuring IOS
//_ 	Configure Podfile
//* 		/ios/Podfile
//* 		configure permissions

//_ 	Configure Info.plist
//* 		/ios/share_it/Info.plist
//* 		Network services requested by app
//* 		Privacy Usage Description for each permission requested by app
//* 		Set up font family
//* 	 (These are reviewed in Appstore team for approval)


//? Configure eslint 


//? Configure Package.json
//_ Add 'pod-install' script

//_ Necessary Packages
// - 	Utilities :
//* 		uuid ,zustand ,immer (For mutating immutable states)
//* 		rn-get-random-values (used by uuid)

//- 	Navigation :
//* 		@react-navigation/rn-stack (rn == react-native)
//* 		rn-screens (used by above)


//- 	UI :  
//*         Nativewind (for tailwind css to react native)
//* 		lottie-rn  			(For ruuning json animations)
//* 		rn-reanimated
//* 		rn-vector-icons
//* 		rn-responsive-fontsize
//* 		rn-svg,
//* 		rn-svg-transformer
//* 		rn-safe-area-context (safe area view)

//* 		(not used here but good for responsiveness)
//* 		react-native-responsive-hook
//* 	    react-native-responsive-screen

//- 	Native :  
//* 		rn-image-picker, rn-document-picker
//* 		rn-permissions	(For requesting permissions)
//* 		rn-fs (native file system access)
//* 		rn-vision-camera (For camera)
//* 		rn-device-info
//* 		rn-gesture-handler (for smooth gestures via FABRIC and UI thread)


//- 	Database :
//* 		rn-mmkv (key value storage faster than Async storage)


//_ Project specific packages :
//* 		rn-tcp-socket
//* 		rn-udp
//* 		rn-network-info,
//* 		rn-blob-util  (for file transfer)
//* 		rn-qrcode-svg


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


//- Responsive screens :
// https://medium.com/@mz-real/creating-responsive-uis-in-react-native-made-easy-with-react-native-responsive-hook-35fa5649cd5f
