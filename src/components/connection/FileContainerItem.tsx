import { ActivityIndicator, ListRenderItem, Platform, TouchableOpacity, View } from 'react-native'
import { connectionStyles } from '../../styles/connectionStyles'
import CustomText from '../global/CustomText'
import { Colors } from 'react-native/Libraries/NewAppScreen'
import ReactNativeBlobUtil from 'react-native-blob-util'
import Icon from '../global/Icon'
import { formatFileSize } from '../../utils/libraryHelper'
import { IFile } from '../../types/TCPProviderTypes'



export const renderThumbnail = (mimeType:string) => {
    switch (mimeType) {
        case '.mp3':
            return <Icon name="musical-notes" size={16} color='blue' iconFamily='Ionicons' />
        case '.mp4':
            return <Icon name="videocam" size={16} color='green' iconFamily='Ionicons' />
        case '.jpg':
            return <Icon name="image" size={16} color='orange' iconFamily='Ionicons' />
        case '.pdf':
            return <Icon name="document" size={16} color='red' iconFamily='Ionicons' />
        default:
            return <Icon name="folder" size={16} color='gray' iconFamily='Ionicons' />
    };
}


const FileContainerItem : ListRenderItem<IFile> = ({item}) => {

    const handleFileOpen = (uri: string) => {
        const normalizedPath = Platform.OS === 'ios' ? `file://${uri}` : uri;
        if(Platform.OS === 'ios'){
            ReactNativeBlobUtil.ios.openDocument(normalizedPath)
            .then(() => console.log('File opened successfully'))
            .catch((error: any) => console.log('Error opening file', error))
        }
        else{
            ReactNativeBlobUtil.android.actionViewIntent(normalizedPath, '*/*')
            .then(() => console.log('File opened successfully'))
            .catch((error: any) => console.log('Error opening file', error))
        }
    }


    return (
        <View style={connectionStyles.fileItem}>
            <View style={connectionStyles.fileInfoContainer}>
                {renderThumbnail(item?.mimeType)}
                <View style={connectionStyles.fileDetails}>
                    <CustomText numberOfLines={1} fontFamily="Okra-Bold" fontSize={10}>
                        {item?.name}
                    </CustomText>
                    <CustomText numberOfLines={1} fontFamily="Okra-Medium" fontSize={9}>
                        {item?.mimeType} • {formatFileSize(item?.size)}
                    </CustomText>
                </View>
            </View>
            {
                item?.available ? (
                    <TouchableOpacity
                        style={connectionStyles.openButton}
                        onPress={() => handleFileOpen(item?.uri)}
                    >
                        <CustomText numberOfLines={1} fontSize={9} color='#FFFFFF' fontFamily='Okra-Bold'>
                            Open
                        </CustomText>
                    </TouchableOpacity>
                ) : (
                    <ActivityIndicator size="small" color={Colors.primary} />
                )
            }
        </View>
    )
}
export default FileContainerItem