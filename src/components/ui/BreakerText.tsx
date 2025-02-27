import { FC } from 'react'
import { View, StyleSheet } from 'react-native'
import CustomText from '../global/CustomText';


const BreakerText: FC<{ text: string }> = ({ text }) => {
    return (
        <View style={styles.breakerContainer}>
            <View style={styles.horizontalLine} />
            <CustomText
                style={styles.breakerText}
                fontFamily='Okra-Medium'
                fontSize={12}
            >
                {text}
            </CustomText>
            <View style={styles.horizontalLine} />
        </View>
    )
}
export default BreakerText;


const styles = StyleSheet.create({
    breakerContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        marginVertical: 20,
        width: '80%',
    },
    horizontalLine: {
        flex: 1,
        height: 1,
        backgroundColor: '#ccc',
    },
    breakerText: {
        marginHorizontal: 10,
        color: '#fff',
        textAlign: 'center',
        opacity: 0.8,
    }
})