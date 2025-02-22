import { View, SafeAreaView, TouchableOpacity, Image, Animated, Easing } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { sendStyles } from '../styles/sendStyles'
import Icon from '../components/global/Icon'
import CustomText from '../components/global/CustomText'
import BreakerText from '../components/ui/BreakerText'
import { Colors, screenWidth } from '../utils/Constants'
import LottieView from 'lottie-react-native'
import { useEffect, useState } from 'react'
import BackBtn from '../components/ui/BackBtn'
import QRScannerModal from '../components/modals/QRScannerModal'
import DeviceBtn from '../components/ui/DeviceBtn'
import {produce} from 'immer';
import { getRandomPosition } from '../utils/libraryHelper'
import { useTCP } from '../service/TCPProvider'
import { navigate } from '../utils/NavigationUtil'
import dgram from 'react-native-udp'
import UdpSocket from 'react-native-udp/lib/types/UdpSocket'
import { IPosition } from '../types/types'



interface Device {
    id: string,
    name: string,
    image: string,
    fullAddress: string,
    position: IPosition,
    scale: Animated.Value,
}

const SendScreen = () => {

    const [showScanner, setShowScanner] = useState(false);
    const [nearByDevices, setNearByDevices] = useState<Device []>([]);
    const {isConnected, connectToServer} = useTCP();


    const listenForDevices = async () => {
        const serverSocket = dgram.createSocket({
            type: 'udp4',
            reusePort: true,
            debug: true,
        });
        const port = 57143;
        serverSocket.bind(port, () => {
            console.log('UDP Server Listening for nearby devices on port: ', port);
        });

        serverSocket.on('message', (msg, rinfo) => {

            const address = msg?.toString();
            const [ _, otherDevice] = address?.replace('tcp://','').split('|');
            
            setNearByDevices((prev) => {
                const deviceExists = prev?.some(device => device?.name === otherDevice);

                if(deviceExists) return prev;

                return produce(prev, (draftDevice: Device[]) => {
                    draftDevice.push({
                        id: `${Date.now()}_${Math.random()}`,
                        name: otherDevice,
                        image: require('../assets/icons/device.jpg'),
                        fullAddress: address,
                        position: getRandomPosition({ radius: 150, existingPositions: (prev.map((device) => device.position)), minDistance: 50 }),
                        scale: new Animated.Value(0),
                    })
                    
                    Animated.timing(draftDevice[draftDevice.length - 1].scale, {
                        toValue: 1,
                        duration: 1500,
                        easing: Easing.out(Easing.ease),
                        useNativeDriver: true,
                    }).start();
                })
            });
        });

        return serverSocket;
    }


    useEffect(()=>{
        let udpServerSocket: UdpSocket;
        const setupServer = async () => {
            udpServerSocket = await listenForDevices();
        }

        setupServer();

        return () => {
            if(udpServerSocket){
                udpServerSocket.close(() => {
                    console.log('UDP Server Closed');
                });
            }
            setNearByDevices([]);
        }
    },[])


    const connectToDevice = (address: string) => {

        const [connectionData, deviceName] = address.replace('tcp://', '').split('|');
        const [host, port] = connectionData.split(":");

        connectToServer(host, parseInt(port, 10), deviceName);
    }



    useEffect(()=>{
        if(isConnected){
            navigate('ConnectionScreen');
        }
    },[isConnected]);

    
    return (
        <LinearGradient 
            colors={['#ffffff', '#8689ed', '#a066e5']} 
            style={sendStyles.container}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <SafeAreaView />

            <BackBtn />

            <View style={sendStyles.mainContainer}>
                <View style={sendStyles.infoContainer}>
                    <Icon name="search" iconFamily="Ionicons" color="#fff" size={40} />
                    <CustomText fontFamily="Okra-Bold" color='#fff' fontSize={16} style={{marginTop: 20}} >
                        Looking for nearby devices
                    </CustomText>
                    <CustomText fontFamily="Okra-Medium" color='#fff' fontSize={12} style={{textAlign: 'center'}} >
                        Ensure your device's hotspot is active and the reciever device is connected to it.
                    </CustomText>
                    <BreakerText text={'or'} />

                    <TouchableOpacity 
                        style={sendStyles.qrButton}
                        onPress={() => setShowScanner(true)}
                    >
                        <Icon name="qrcode-scan" iconFamily="MaterialCommunityIcons" color={Colors.primary} size={16} />
                        <CustomText fontFamily="Okra-Bold" color={Colors.primary}  >
                            Scan QR
                        </CustomText>
                    </TouchableOpacity>
                </View>



                <View style={sendStyles.animationContainer}>
                    <View style={sendStyles.lottieContainer}>
                        <LottieView
                            style={sendStyles.lottie}
                            source={require('../assets/animations/scanner.json')}
                            autoPlay
                            loop={true}
                            hardwareAccelerationAndroid
                        />
                        {
                            nearByDevices?.map((device) => (
                                <Animated.View
                                    key={device?.id}
                                    style={
                                        [
                                            sendStyles.deviceDot,
                                            { 
                                                transform: [{ scale: device.scale }],
                                                left: screenWidth / 2.33 + device.position?.x,
                                                top: screenWidth / 2.33 +  device.position?.y,
                                            },
                                        ]
                                    }
                                >
                                    <DeviceBtn 
                                        device={device.name} 
                                        image={device.image} 
                                        onPress={() => connectToDevice(device.fullAddress)}
                                    />
                                </Animated.View>
                            ))
                        }
                    </View>
                    <Image source={require('../assets/images/profile.jpg')} style={sendStyles.profileImage} />
                </View>

                
                {
                    showScanner && (
                        <QRScannerModal 
                            visible={showScanner} 
                            onClose={() => setShowScanner(false)}
                        />
                    )
                }

            </View>
        </LinearGradient>
    )
}
export default SendScreen