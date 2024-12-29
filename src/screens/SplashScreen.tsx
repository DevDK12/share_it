import { View, Image } from 'react-native';
import { navigate } from '../utils/NavigationUtil';
import { commonStyles } from '../styles/commonStyles';
import { useEffect } from 'react';

const SplashScreen = () => {


    const navigateToHome = () => {
        navigate('HomeScreen');
    };

    useEffect(()=>{
        const timeOut = setTimeout(navigateToHome,1200);
        return () => clearTimeout(timeOut);
    },[]);

    return (
        <View style={commonStyles.container}>
            <Image 
                style={commonStyles.img} 
                source={require('../assets/images/logo_text.png')} 
            />
        </View>
    );
};
export default SplashScreen;