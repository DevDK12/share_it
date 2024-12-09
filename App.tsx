import { View, Text, Image} from 'react-native';
import { commonStyles } from './src/styles/commonStyles';
const App = () => {
  return (
    <View style={commonStyles.baseContainer}>
      <View style={commonStyles.container}>

        <Image source={require('./src/assets/images/logo_text.png')} style={commonStyles.img} />
        <View style={commonStyles.flexRowBetween}>
          <Text>Hello From Share It</Text>
        </View>
      </View>
    </View>
  );
};
export default App;
