import { TouchableOpacity } from 'react-native'
import Icon from '../global/Icon'
import CustomText from '../global/CustomText'
import { connectionStyles } from '../../styles/connectionStyles'
import { useTCP } from '../../service/TCPProvider'


const DisconnectBtn = () => {
    const {disconnect} = useTCP();
    return (
        <TouchableOpacity
            style={connectionStyles.disconnectButton}
            onPress={() => disconnect()}
        >
            <Icon name="remove-circle" size={12} color='red' iconFamily="Ionicons" />
            <CustomText numberOfLines={1} fontFamily="Okra-Bold" fontSize={10} >
                Disconnect
            </CustomText>
        </TouchableOpacity>
    )
}
export default DisconnectBtn