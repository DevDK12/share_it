import { TouchableOpacity } from 'react-native'
import Icon from '../global/Icon'
import CustomText from '../global/CustomText'
import { connectionStyles } from '../../styles/connectionStyles'
import { FC } from 'react';


type RecieveBtnProps = {
    activeTab: 'SENT' | 'RECEIVED';
    handleTabChange: (tab: 'SENT' | 'RECEIVED') => void;
};
const RecieveBtn: FC<RecieveBtnProps> = ({ activeTab, handleTabChange }) => {
    return (
        <TouchableOpacity
            style={[
                connectionStyles.sendReceiveButton,
                activeTab === 'RECEIVED' ? connectionStyles.activeButton : connectionStyles.inactiveButton
            ]}
            onPress={() => handleTabChange('RECEIVED')}
        >
            <Icon
                name="cloud-upload"
                size={12}
                color={activeTab === 'RECEIVED' ? '#fff' : 'blue'}
                iconFamily="Ionicons"
            />
            <CustomText
                numberOfLines={1}
                fontFamily="Okra-Bold"
                fontSize={9}
                color={activeTab === 'RECEIVED' ? '#fff' : 'blue'}
            >
                RECEIVED
            </CustomText>
        </TouchableOpacity>

    )
}
export default RecieveBtn