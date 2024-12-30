import { TouchableOpacity } from 'react-native'
import Icon from '../global/Icon'
import { goBack } from '../../utils/NavigationUtil'
import { sendStyles } from '../../styles/sendStyles'

const BackBtn = () => {
    return (
        <TouchableOpacity onPress={()=> goBack()} style={sendStyles.backButton}>
            <Icon name="arrow-back" iconFamily="Ionicons" color="#000" size={16} />
        </TouchableOpacity>
    )
}
export default BackBtn