import { View } from 'react-native'
import { commonStyles } from '../styles/commonStyles'
import HomeHeader from '../components/home/HomeHeader'
import { ScrollView } from 'react-native'
import SendReceiveButton from '../components/home/SendReceiveButton'
import Options from '../components/home/Options'
import Misc from '../components/home/Misc'
import AbsoluteQRBottom from '../components/home/AbsoluteQRBottom'


const HomeScreen = () => {
    return (
        <View style={commonStyles.baseContainer}>
            <HomeHeader />

            <ScrollView
                contentContainerStyle={{
                    paddingBottom: 100,
                    padding: 15,
                }}
                showsVerticalScrollIndicator={false} 
            >
                <SendReceiveButton />
                <Options isHome />
                <Misc />
            </ScrollView>
            <AbsoluteQRBottom />
        </View>
    )
}
export default HomeScreen