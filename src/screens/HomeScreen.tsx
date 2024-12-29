import { View } from 'react-native'
import { commonStyles } from '../styles/commonStyles'
import HomeHeader from '../components/home/HomeHeader'


const HomeScreen = () => {
    return (
        <View style={commonStyles.baseContainer}>
            <HomeHeader />

        </View>
    )
}
export default HomeScreen