//? React Native CLI Config

//* responsible for linking native dependencies (like fonts, icons, and native libraries) into the iOS/Android native projects.


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
