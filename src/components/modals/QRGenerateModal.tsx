import { FC, useEffect, useState } from 'react';
import { View, Modal, TouchableOpacity, Image } from 'react-native';
import { modalStyles } from '../../styles/modalStyles';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';
import DeviceInfo from 'react-native-device-info';

import { ActivityIndicator } from 'react-native';
import Animated, {
    Easing,
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withTiming,
} from 'react-native-reanimated';
import LinearGradient from 'react-native-linear-gradient';
import QRCode from 'react-native-qrcode-svg';
import { multiColor } from '../../utils/Constants';
import { navigate } from '../../utils/NavigationUtil';
import { getLocalIPAddress } from '../../utils/networkUtils';
import { useTCP } from '../../service/TCPProvider';

type QRGenerateModalProps = {
    visible: boolean;
    onClose: () => void;
};

const QRGenerateModal: FC<QRGenerateModalProps> = ({ visible, onClose }) => {

    const {isConnected, startServer, server} = useTCP();

    const [loading, setLoading] = useState(false);
    const [qrValue, setQrValue] = useState('Dev');

    const shimmerTranslateX = useSharedValue(-300);
    const shimmerStyle = useAnimatedStyle(()=>({
        transform: [{translateX: shimmerTranslateX.value}]
    }));

    useEffect(()=>{

        shimmerTranslateX.value = withRepeat(
            withTiming(300, {
                duration: 1500,
                easing: Easing.linear,
            }),
            -1,
            false
        );
        
        console.log('QRGenerateModal visible: ', visible);
        //_ Start server
        if(visible){
            setLoading(true);
            setupServer();
        }
    },[visible]);


    const setupServer = async () => {
        const deviceName = await DeviceInfo.getDeviceName();
        const ip = await getLocalIPAddress();
        const port = 4000;
        if(server){
            setQrValue(`tcp://${ip}:${port}|${deviceName}`);
            setLoading(false);
            return;
        }
        
        startServer(port);
        setQrValue(`tcp://${ip}:${port}|${deviceName}`);
        console.log(`Server info : ${ip}:${port}|${deviceName}`);
        setLoading(false);

    }


    //_ On Device connected to server
    useEffect(() => {
        console.log('isConnected updated to: ', isConnected);
        if(isConnected){
            onClose();
            navigate('ConnectionScreen');
        }
    
    }, [isConnected])
    

    useEffect(()=>{
        shimmerTranslateX.value = withRepeat(
            withTiming(300, {
                duration: 1500,
                easing: Easing.linear,
            },),
            -1,
            false,
        )
    },[shimmerTranslateX])

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
                        loading || qrValue == null || qrValue == '' ? 
                        (
                            
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
                        
                        (
                            <QRCode
                                value={qrValue}
                                size={250}
                                logoSize={60}
                                logoBackgroundColor='#fff'
                                logoMargin={2}
                                logoBorderRadius={10}
                                logo={require('../../assets/images/profile2.jpg')}
                                linearGradient={multiColor}
                                enableLinearGradient
                            />
                        )

                    }
                </View>
                
                <View style={modalStyles.info}>
                    <CustomText style={modalStyles.infoText1}>
                        Ensure you're on the same Wi-Fi network.
                    </CustomText>
                    <CustomText style={modalStyles.infoText2}>
                        Ask the sender to scan this QR code to connect and transfer files.
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
export default QRGenerateModal;