import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from '../utils/NavigationUtil';
import SplashScreen from '../screens/SplashScreen';
import HomeScreen from '../screens/HomeScreen';
import ConnectionScreen from '../screens/ConnectionScreen';
import { TCPProvider } from '../service/TCPProvider';

const Stack = createNativeStackNavigator();


const Navigation = () => {
    return (
        <TCPProvider>
            <NavigationContainer ref={navigationRef}>
                <Stack.Navigator initialRouteName="SplashScreen"
                    screenOptions={{
                        headerShown: false,
                    }}
                >
                    <Stack.Screen name="SplashScreen" component={SplashScreen} />
                    <Stack.Screen name="HomeScreen" component={HomeScreen} />
                    <Stack.Screen name="ConnectionScreen" component={ConnectionScreen} />
                </Stack.Navigator>
            </NavigationContainer>
        </TCPProvider>
    );
};
export default Navigation;