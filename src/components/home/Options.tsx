import { FC } from 'react';
import { View, TouchableOpacity } from 'react-native';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import Icon from '../global/Icon';
import CustomText from '../global/CustomText';
import { optionStyles } from '../../styles/optionsStyles';
import { useTCP } from '../../service/TCPProvider';
import { navigate } from '../../utils/NavigationUtil';
import { DocumentPickerResponse } from 'react-native-document-picker';
import { Asset } from 'react-native-image-picker';
import { pickDocument, pickImage } from '../../utils/libraryHelper';



type OptionsProps = {
    isHome?: boolean;
    onMediaPickedUp?: (media: Asset) => void;
    onFilePickedUp?: (file: DocumentPickerResponse) => void;
};
const Options: FC<OptionsProps> = ({ isHome, onMediaPickedUp, onFilePickedUp }) => {

    const {isConnected} = useTCP();


    //_ Options will open file picker 
    //* But only if user is at Connection screen else it will force to make connection first
    //* by sending to Send Screen 

    const handleUniversalPicker = async (type: string) => {
        if(isHome){
            if(isConnected){
                navigate("ConnectionScreen");
            }
            else{
                navigate('SendScreen');
            }
            return;
        }

        if(type === 'images' && onMediaPickedUp){
            pickImage(onMediaPickedUp);
        }
        if(type === 'file' && onFilePickedUp){
            pickDocument(onFilePickedUp);
        }
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