/**
 * @format
 */

import {AppRegistry, TextInput} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import { Text } from 'react-native-svg';



//_ Disabling font scaling  done by user

if(Text.defaultProps){
    Text.defaultProps.allowFontScaling = false;
}
else{
    Text.defaultProps = {allowFontScaling: false};
}

if(TextInput.defaultProps){
    TextInput.defaultProps.allowFontScaling = false;
}
else{
    TextInput.defaultProps = {allowFontScaling: false};
}

AppRegistry.registerComponent(appName, () => App);
