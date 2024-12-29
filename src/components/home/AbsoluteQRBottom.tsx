import { View, TouchableOpacity } from 'react-native';
import Icon from '../global/Icon';
import { navigate } from '../../utils/NavigationUtil';
import { bottomTabStyles } from '../../styles/bottomTabStyle';


const AbsoluteQRBottom = () => {

    return (
        <>
            <View style={bottomTabStyles.container}>
                <TouchableOpacity onPress={() => navigate('ReceivedFileScreen')}>
                    <Icon name="apps-sharp" iconFamily="Ionicons" color="#333" size={24} />
                </TouchableOpacity>
                <TouchableOpacity
                    style={bottomTabStyles.qrCode}
                    onPress={() => {}}
                >
                    <Icon name="qrcode-scan" iconFamily="MaterialCommunityIcons" color="#fff" size={24} />
                </TouchableOpacity>
                <TouchableOpacity >
                    <Icon name="beer-sharp" iconFamily="Ionicons" color="#333" size={24} />
                </TouchableOpacity>
            </View>

        </>

    );
};
export default AbsoluteQRBottom;