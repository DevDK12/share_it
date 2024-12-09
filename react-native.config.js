//? React Native CLI Config

//* responsible for linking native dependencies (like fonts, icons, and native libraries) into the iOS/Android native projects.

//- Updating RN CLI Config   vs   Metro Config :

//_ Add custom fonts (like .ttf) :
//*   rncli  only (fonts are native files, so rncli links them)

//_ Support .svg imports as components
//*   metro only

//_ Exclude certain node_modules
//*   metro  only

//_ Add TypeScript support
//*   rncli && metro
//*   rncli links them, metro handles them

//_ Use rn vector icons
//*   rncli only

//_ Add custom file extensions (like .md)
//*   metro only (to resolve .md files, there is no linking here)

//_ Link native libraries (like react-native-reanimated)
//*   rncli only

//_ Add custom assets (like images)
//*   metro only (there is no linking here)

module.exports = {
    project: {
        ios: {},
        android: {},
    },

    //_ Vector icons for Android only
    'react-native-vector-icons': {
        platforms: {
            ios: null,
        },
    },
    //_ Custom fonts
    assets: ['./src/assets/fonts/'],
    getTransformModulePath() {
        return require.resolve('react-native-typescript-transformer');
    },
    getSourceExts() {
        return ['ts', 'tsx'];
    },
};
