import { View, SafeAreaView, TouchableOpacity, Image, Platform} from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { sendStyles } from '../styles/sendStyles'
import Icon from '../components/global/Icon'
import CustomText from '../components/global/CustomText'
import BreakerText from '../components/ui/BreakerText'
import { Colors } from '../utils/Constants'
import LottieView from 'lottie-react-native'
import {  useEffect, useRef, useState } from 'react'
import BackBtn from '../components/ui/BackBtn'
import { useTCP } from '../service/TCPProvider'
import { goBack, navigate } from '../utils/NavigationUtil'
import dgram from 'react-native-udp'
import QRGenerateModal from '../components/modals/QRGenerateModal'
import { getBroadcastIPAddress, getLocalIPAddress } from '../utils/networkUtils'
import DeviceInfo from 'react-native-device-info'




const RecieveScreen = () => {

    const [showQR, setShowQR] = useState(false);
    const [qrValue, setQrValue] = useState('');
    const {isConnected, startServer, server} = useTCP();

    //_ Interval ref
    //* Persists across re-renders and does not trigger re-render (unlike useState)
    const intervalRef = useRef<NodeJS.Timeout | null>(null);


    const handleGoBack = () => {
        if(intervalRef.current){
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        };
        goBack();
    }


    //_ Starting Server on component mount
    const setupServer = async () => {
        const deviceName = await DeviceInfo.getDeviceName();
        const ip = await getLocalIPAddress();
        const port = 4000;
        if(server){
            setQrValue(`tcp://${ip}:${port}|${deviceName}`);
            console.log(`Server info : ${ip}:${port}|${deviceName}`);
            return;
        }
        
        startServer(port);
        setQrValue(`tcp://${ip}:${port}|${deviceName}`);
        console.log(`Server info : ${ip}:${port}|${deviceName}`);
    };

    
    useEffect(()=>{
        setupServer();
    },[]);




    //_ Broadcasting Discovery Packet 
    //* We broadcast discovery packet within same network to broadcastAddress (i.e. network Address + .255 )
    //*     Eg if IP address = 192.168.1.2 then broadcast address = 192.168.1.255
    //*         network address = 192.168.1         host address = x.x.x.2       broadcast address = x.x.x.255    

    //- Dont use useCallback here
    const broadcastDiscoveryPacket = async () => {
        const deviceName = await DeviceInfo.getDeviceName();
        const broadcastAddress = await getBroadcastIPAddress();
        const targetAddress = broadcastAddress || "255.255.255.255"; //* fallback broadcast address
        const port = 57143;

        const clientSocket = dgram.createSocket({
            type: 'udp4',
            reusePort: true,
            debug: true,
        });

        clientSocket.bind(()=>{
            try{
                if(Platform.OS === 'ios'){
                    clientSocket.setBroadcast(true);
                }
                clientSocket.send(`${qrValue}`,0,`${qrValue}`.length, port, targetAddress, (err) => {
                    if(err){
                        console.log('Error broadcasting discovery signal', err);
                    }
                    else{
                        console.log(`${deviceName} sent Discovery signal to ${targetAddress}`);
                    }
                    clientSocket.close();
                })
            }
            catch(err){
                console.log('Error binding client', err);
                clientSocket.close();
            }
        })
    }


    //* Discovery packet is broadcasted on every 3 sec 
    //* (after  component mount once qrValue is generated i.e. server started)
    useEffect(()=>{
        if(!qrValue) return;

        broadcastDiscoveryPacket();
        intervalRef.current = setInterval(broadcastDiscoveryPacket, 3000);

        return () => {
            if(intervalRef.current){
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            };
        }
    },[qrValue])






    useEffect(()=>{
        if(isConnected){
            navigate('ConnectionScreen');
            if(intervalRef.current){
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            };
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

            <BackBtn onPress={handleGoBack} />

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