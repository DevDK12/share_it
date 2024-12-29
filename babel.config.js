module.exports = {
  presets: ['module:@react-native/babel-preset'],

  //_ Add react reanimated library plugin
  plugins: [

    //* Make sure it's last plugin
    'react-native-reanimated/plugin',
  ],
};
