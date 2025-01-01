import { FC, useEffect, useMemo, useState } from 'react';
import { View, Modal, TouchableOpacity, Image } from 'react-native';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';

import { ActivityIndicator } from 'react-native';
import {Camera, CodeScanner, useCameraDevice} from 'react-native-vision-camera';
import Animated, {
    Easing,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import { modalStyles } from '../../styles/modalStyles';
import { navigate } from '../../utils/NavigationUtil';
import { useTCP } from '../../service/TCPProvider';

type QRScannerModalProps = {
    visible: boolean;
    onClose: () => void;
};

const QRScannerModal: FC<QRScannerModalProps> = ({ visible, onClose }) => {

    const {isConnected, connectToServer} = useTCP();
    const [isCameraLoading, setIsCameraLoading] = useState(true);
    const [codeFound, setCodeFound] = useState(false);
    const [hasPermission, setHasPermission] = useState(false);
    const device = useCameraDevice("back") as any;

    //_ Shimmer animation  
    //* Basically we have shimmer overlay (a simple box) containing linear gradient that continuously runs left to right
    //* So shimmerStyle is animated style that moves left to right the original box
    const shimmerTranslateX = useSharedValue(-300);
    const shimmerStyle = useAnimatedStyle(()=>({
        transform: [{translateX: shimmerTranslateX.value}]
    }));

    useEffect(()=>{
        const checkPermission = async () => {
            const cameraPermission = await Camera.requestCameraPermission();
            setHasPermission(cameraPermission === 'granted');
        }

        checkPermission();
        if(visible){
            setIsCameraLoading(true);
            //_ Delay for camera to load
            //* So modal animation don't clash with camera loading
            const timer = setTimeout(()=> setIsCameraLoading(false),400);
            return () => clearTimeout(timer);
        }
    },[visible])

    useEffect(()=>{
        shimmerTranslateX.value = withRepeat(
            withTiming(300, {
                duration: 1500,
                easing: Easing.linear,
            },),
            -1, //* Infinity repetitions
            false,
        )
    },[shimmerTranslateX])

    const handleScan = (data: string | undefined) => {

        if(!data) return;

        
        //_ Address to connect 
        //* tcp://192.168.1.1:1234|DeviceName (tcp://host:port|deviceName)

        const [connectionData, deviceName] = data.replace('tcp://', '').split('|');
        const [host, port] = connectionData?.split(":");

        //_ Connect to Server
        connectToServer(host, parseInt(port, 10), deviceName);
    }

    //_ On Connecting to Server
    useEffect(() => {
        console.log('isConnected updated to: ', isConnected);

        if(isConnected){
            onClose();
            navigate('ConnectionScreen');
        }
    
    }, [isConnected])
    


    const codeScanner = useMemo<CodeScanner>(() => ({
        codeTypes: ['qr', 'codabar'],
        onCodeScanned: (codes) => {
            if (codeFound) {
                //* Code scanner is run in a loop
                //* If we previously found a code, don't scan again i.e. return
                return
            }
            console.log(`Scanned ${codes?.length} codes!`);
            if(codes?.length > 0){
                const scannedData = codes[0].value;
                console.log('Scanned Data : ',scannedData);
                setCodeFound(true);

                //* Extract host, port, device, and connection data from scanned code
                //* and make a tcp connection
                handleScan(scannedData)
            }
        },
        }),
    []);

    return (
        <Modal
            animationType="slide"
            visible={visible}
            presentationStyle="fullScreen"
            onRequestClose={onClose}
            onDismiss={onClose}
        >
            <View style={modalStyles.modalContainer}>
                <View style={modalStyles.qrContainer}>
                    {
                        isCameraLoading ? 
                        (
                            //_ Camera loader
                            <View style={modalStyles.skeleton}>
                                
                                <Animated.View style={[modalStyles.shimmerOverlay, shimmerStyle]}> 
                                    <LinearGradient 
                                        colors= {['#f3f3f3', '#fff', '#f3f3f3']}
                                        start= { {x: 0, y: 0} }
                                        end= { {x: 1, y: 0} }
                                        style={modalStyles.shimmerGradient}
                                    />
                                </Animated.View>

                            </View>
                        )
                        :
                        //_ Camera not loading 
                        (
                            <>
                                {
                                    (!device || !hasPermission) ? (

                                        <View style={modalStyles.skeleton}>
                                            <Image 
                                                source={require('../../assets/images/no_camera.png')}
                                                style={modalStyles.noCameraImage}
                                            />
                                        </View>
                                    )
                                    : (
                                        <View style={modalStyles.skeleton}>
                                            <Camera 
                                                style={modalStyles.camera}
                                                device={device}
                                                isActive={visible}
                                                codeScanner={codeScanner}
                                            />
                                        </View>
                                    )
                                }
                            </>
                        )

                    }
                </View>
                
                <View style={modalStyles.info}>
                    <CustomText style={modalStyles.infoText1}>
                        Ensure you're on the same Wi-Fi network.
                    </CustomText>
                    <CustomText style={modalStyles.infoText2}>
                        Ask the receiver to show a QR code to connect and transfer files.
                    </CustomText>
                </View>

                <ActivityIndicator size="small" color='#000' style={{alignSelf: 'center'}} />

                <TouchableOpacity onPress={onClose} style={modalStyles.closeButton}>
                    <Icon name="close" iconFamily="Ionicons" color="#000" size={24} />
                </TouchableOpacity>
            </View>

        </Modal>
    );
};
export default QRScannerModal;