import { View, StyleSheet, TouchableOpacity } from 'react-native';
import { screenHeight } from '../../utils/Constants';
import { Image } from 'react-native';

const sendImg = require('../../assets/icons/send1.jpg');
const receiveImg = require('../../assets/icons/receive1.jpg');

const SendReceiveButton = () => {
    return (
        <View style={styles.container}>
            <TouchableOpacity 
                style={styles.button}
                onPress={() =>{}}
            >
                <Image 
                    style={styles.img} 
                    source={sendImg} 
                />
            </TouchableOpacity>
            <TouchableOpacity 
                style={styles.button}
                onPress={() =>{}}
            >
                <Image 
                    style={styles.img} 
                    source={receiveImg} 
                />
            </TouchableOpacity>
        </View>
    );
};


const styles = StyleSheet.create({
    container: {
        marginTop: screenHeight * 0.04,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
    },
    img: {
        width: '100%',
        height: '100%',
        resizeMode: 'cover',
    },
    button: {
        width: 140,
        height: 100,
        borderRadius: 10,
        overflow: 'hidden',
    }
});


export default SendReceiveButton;