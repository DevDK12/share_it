import { View, SafeAreaView, TouchableOpacity, Image } from 'react-native';
import { commonStyles } from '../../styles/commonStyles';
import { homeHeaderStyles } from '../../styles/homeHeaderStyles';
import { screenHeight, screenWidth, svgPath } from '../../utils/Constants';
import Svg, {Defs, LinearGradient, Path, Stop} from 'react-native-svg';
import Icon from '../global/Icon';
import QRGenerateModal from '../modals/QRGenerateModal';
import { useState } from 'react';
import { navigate } from '../../utils/NavigationUtil';

const logo = require('../../assets/images/logo_t.png');
const profile = require('../../assets/images/profile.jpg');

const HomeHeader = () => {
    const [showQr, setShowQr] = useState(false);

    return (
        <View style={homeHeaderStyles.mainContainer}>
            <SafeAreaView />
            <View style={[commonStyles.flexRowBetween, homeHeaderStyles.container]} >
                <TouchableOpacity onPress={() => navigate('ReceivedFilesScreen')}>
                    <Icon name="menu" size={22} color="#fff" iconFamily="Ionicons" />
                </TouchableOpacity>
                <Image source={logo} style={homeHeaderStyles.logo} />
                <TouchableOpacity onPress={() =>  setShowQr(true) }>
                    <Image source={profile} style={homeHeaderStyles.profile} />
                </TouchableOpacity>
            </View>
            <Svg
                height={screenHeight * 0.18}
                width={screenWidth}
                viewBox="0 0 1440 220"
                style={homeHeaderStyles.curve}
            >
                <Defs>
                    <LinearGradient id="grad" x1="0" y1="0" x2="0" y2="1">
                        <Stop offset="0%" stopColor="#007Aff" stopOpacity="1" />
                        <Stop offset="100%" stopColor="#80Bfff" stopOpacity="1" />
                    </LinearGradient>
                </Defs>
                <Path 
                    fill="#80Bfff" 
                    d={svgPath} 
                />
                <Path 
                    fill="url(#grad)" 
                    d={svgPath} 
                />

            </Svg>
            {showQr && <QRGenerateModal visible={showQr} onClose={() => setShowQr(false)} />}

        </View>
    );
};
export default HomeHeader;