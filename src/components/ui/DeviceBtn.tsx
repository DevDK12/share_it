import {TouchableOpacity, Image } from 'react-native'
import CustomText from '../global/CustomText'
import { sendStyles } from '../../styles/sendStyles'
import { FC } from 'react'


type DeviceBtnProps = {
    device: string,
    image: string,
    onPress: () => void,
}

const DeviceBtn:FC<DeviceBtnProps> = ({device, image, onPress}) => {
    return (
        <TouchableOpacity
            style={sendStyles.popup}
            onPress={onPress}
        >
            <Image source={image} style={sendStyles.deviceImage} />
            <CustomText 
                color='#333' 
                fontSize={8} 
                fontFamily="Okra-Bold" 
                style={sendStyles.deviceText} 
            >
                {device}
            </CustomText>
        </TouchableOpacity>
    )
}
export default DeviceBtn