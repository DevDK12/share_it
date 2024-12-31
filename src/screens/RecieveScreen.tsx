import { View, SafeAreaView, TouchableOpacity, Image} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { sendStyles } from '../styles/sendStyles'
import Icon from '../components/global/Icon'
import CustomText from '../components/global/CustomText'
import BreakerText from '../components/ui/BreakerText'
import { Colors } from '../utils/Constants'
import LottieView from 'lottie-react-native'
import { useEffect, useState } from 'react'
import BackBtn from '../components/ui/BackBtn'
import { useTCP } from '../service/TCPProvider'
import { navigate } from '../utils/NavigationUtil'
import QRGenerateModal from '../components/modals/QRGenerateModal'




const RecieveScreen = () => {

    const [showQR, setShowQR] = useState(false);
    const {isConnected} = useTCP();



    useEffect(()=>{
        if(isConnected){
            navigate('ConnectionScreen');
        }
    },[isConnected]);

    
    return (
        <LinearGradient 
            colors={['#ffffff', '#4da0de', '#3387c5']} 
            style={sendStyles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <SafeAreaView />

            <BackBtn />

            <View style={sendStyles.mainContainer}>
                <View style={sendStyles.infoContainer}>
                    <Icon name="blur-on" iconFamily="MaterialIcons" color="#fff" size={40} />
                    <CustomText fontFamily="Okra-Bold" color='#fff' fontSize={16} style={{marginTop: 20}} >
                        Recieving from nearby devices
                    </CustomText>
                    <CustomText fontFamily="Okra-Medium" color='#fff' fontSize={12} style={{textAlign: 'center'}} >
                        Ensure your device's is connected to sender's hotspot.
                    </CustomText>
                    <BreakerText text={'or'} />

                    <TouchableOpacity 
                        style={sendStyles.qrButton}
                        onPress={() => setShowQR(true)}
                    >
                        <Icon name="qrcode" iconFamily="MaterialCommunityIcons" color={Colors.primary} size={16} />
                        <CustomText fontFamily="Okra-Bold" color={Colors.primary}  >
                            Show QR
                        </CustomText>
                    </TouchableOpacity>
                </View>



                <View style={sendStyles.animationContainer}>
                    <View style={sendStyles.lottieContainer}>
                        <LottieView
                            style={sendStyles.lottie}
                            source={require('../assets/animations/scan2.json')}
                            autoPlay
                            loop={true}
                            hardwareAccelerationAndroid
                        />
                    </View>
                    <Image source={require('../assets/images/profile2.jpg')} style={sendStyles.profileImage} />
                </View>

                
                {
                    showQR && (
                        <QRGenerateModal 
                            visible={showQR} 
                            onClose={() => setShowQR(false)}
                        />
                    )
                }

            </View>
        </LinearGradient>
    )
}
export default RecieveScreen