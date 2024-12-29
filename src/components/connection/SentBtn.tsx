import { TouchableOpacity } from 'react-native'
import Icon from '../global/Icon'
import CustomText from '../global/CustomText'
import { connectionStyles } from '../../styles/connectionStyles'
import { FC } from 'react';


type SentBtnProps = {
    activeTab: 'SENT' | 'RECEIVED';
    handleTabChange: (tab: 'SENT' | 'RECEIVED') => void;
};
const SentBtn : FC<SentBtnProps> = ({activeTab, handleTabChange}) => {
    return (
        <TouchableOpacity
            style={[
                connectionStyles.sendReceiveButton,
                activeTab === 'SENT' ? connectionStyles.activeButton : connectionStyles.inactiveButton
            ]}
            onPress={() => handleTabChange('SENT')}
        >
            <Icon
                name="cloud-upload"
                size={12}
                color={activeTab === 'SENT' ? '#fff' : 'blue'}
                iconFamily="Ionicons"
            />
            <CustomText
                numberOfLines={1}
                fontFamily="Okra-Bold"
                fontSize={9}
                color={activeTab === 'SENT' ? '#fff' : 'blue'}
            >
                SENT
            </CustomText>
        </TouchableOpacity>
    )
}
export default SentBtn