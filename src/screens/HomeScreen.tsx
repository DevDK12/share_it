import { View } from 'react-native'
import { commonStyles } from '../styles/commonStyles'
import CustomText from '../components/global/CustomText'


const HomeScreen = () => {
    return (
        <View style={commonStyles.baseContainer}>
            <CustomText> Home Screen </CustomText>
        </View>
    )
}
export default HomeScreen