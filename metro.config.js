const { getDefaultConfig, mergeConfig } = require('@react-native/metro-config');

const defaultConfig = getDefaultConfig(__dirname);
const { assetExts, sourceExts } = defaultConfig.resolver;

/**
 * Metro configuration
 * https://facebook.github.io/metro/docs/configuration
 *
 * @type {import('metro-config').MetroConfig}
 */


//? Metro Bundle Config
//* Mainly consists of :

//_ Resolver
//*   resolves every file in the project

//_ Transformer
//*   transforms required files (js) via Babel
//*   eg : assets like svg are resolved but not transformed

//_ Serializer
//*   serializes the transformed files into a bundle

//* We have default configuration in react-native.config.js (default.js) where
//*     extension :  [.ts, .js, .tsx, .jsx .... ] are already defined
//*     platform :  [ios, android] are already defined
//*     List of assets in assetExts present


// const getDefaultValues = (projectRoot) => ({
//   resolver: {
//      assetExts,
//   },
//   serializer: {
//   },
//   transformer: {
//   },
//   watcher: {
//   },
//   cacheStores: [
//   ],
//   projectRoot: projectRoot || path.resolve(__dirname, "../../.."),
// });
//
// async function getDefaultConfig(rootPath) {
//   return getDefaultValues(rootPath);
// }
//
// export getDefaultConfig;


const config = {
    transformer: {
        babelTransformerPath: require.resolve('react-native-svg-transformer'),
    },
    resolver: {
        assetExts: [...assetExts.filter((ext) => ext !== 'svg'), 'pem', 'p12'],
        //* 'pem' && 'p12' file for tls file

        sourceExts: [...sourceExts, 'svg'],
        //_ Resolving svg as file to be able to be transformed
    },
};

module.exports = mergeConfig(defaultConfig, config);
