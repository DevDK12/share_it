import { View, TouchableOpacity } from 'react-native';
import Icon from '../global/Icon';
import { navigate } from '../../utils/NavigationUtil';
import { bottomTabStyles } from '../../styles/bottomTabStyle';
import { useState } from 'react';
import QRScannerModal from '../modals/QRScannerModal';


const AbsoluteQRBottom = () => {
    const [isQrModalVisible, setIsQrModalVisible] = useState(false);

    return (
        <>
            <View style={bottomTabStyles.container}>
                <TouchableOpacity onPress={() => navigate('ReceivedFileScreen')}>
                    <Icon name="apps-sharp" iconFamily="Ionicons" color="#333" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={bottomTabStyles.qrCode}
                    onPress={() => setIsQrModalVisible(true)}
                >
                    <Icon name="qrcode-scan" iconFamily="MaterialCommunityIcons" color="#fff" size={24} />
                </TouchableOpacity>
                <TouchableOpacity >
                    <Icon name="beer-sharp" iconFamily="Ionicons" color="#333" size={24} />
                </TouchableOpacity>
            </View>
            {
                isQrModalVisible && <QRScannerModal visible={isQrModalVisible} onClose={() => setIsQrModalVisible(false)} />
            }
        </>

    );
};
export default AbsoluteQRBottom;