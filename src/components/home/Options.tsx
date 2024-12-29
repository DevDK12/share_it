import { FC } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';
import { optionStyles } from '../../styles/optionsStyles';

type OptionsProps = {
    isHome?: boolean;
};
const Options: FC<OptionsProps> = ({ isHome }) => {

    const handleUniversalPicker = async (type: string) => {

    };

    return (
        <View style={optionStyles.container}>
            <TouchableOpacity
                style={optionStyles.subContainer}
                onPress={() => handleUniversalPicker('images')}
            >
                <Icon name='images' iconFamily='Ionicons' size={30} color={Colors.primary} />
                <CustomText fontFamily="Okra-Medium" style={{
                    marginTop: 4,
                    textAlign: 'center', 
                }}>Photo</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
                style={optionStyles.subContainer}
                onPress={() => handleUniversalPicker('file')}
            >
                <Icon name="musical-notes-sharp" iconFamily="Ionicons" size={30} color={Colors.primary} />
                <CustomText fontFamily="Okra-Medium" style={{
                    marginTop: 4,
                    textAlign: 'center',
                }}>Audio</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
                style={optionStyles.subContainer}
                onPress={() => handleUniversalPicker('file')}
            >
                <Icon name="folder-open" iconFamily="Ionicons" size={30} color={Colors.primary} />
                <CustomText fontFamily="Okra-Medium" style={{
                    marginTop: 4,
                    textAlign: "center",
                }}>Files</CustomText>
            </TouchableOpacity>
            <TouchableOpacity
                style={optionStyles.subContainer}
                onPress={() => handleUniversalPicker('file')}
            >
                <Icon name="contacts" iconFamily="MaterialIcons" size={30} color={Colors.primary} />
                <CustomText fontFamily="Okra-Medium" style={{
                    marginTop: 4,
                    textAlign: 'center',
                }}>Contacts</CustomText>
            </TouchableOpacity>
        </View>
    );
};
export default Options;