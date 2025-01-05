import { useEffect, useState } from 'react'
import { View, Text, Platform, ListRenderItem, TouchableOpacity, ActivityIndicator, FlatList } from 'react-native'
import RNFS from 'react-native-fs'
import { IFile } from '../types/TCPProviderTypes';
import { connectionStyles } from '../styles/connectionStyles';
import FileContainerItem, { renderThumbnail } from '../components/connection/FileContainerItem';
import CustomText from '../components/global/CustomText';
import { formatFileSize } from '../utils/libraryHelper';
import LinearGradient from 'react-native-linear-gradient';
import { SafeAreaView } from 'react-native-safe-area-context';
import { sendStyles } from '../styles/sendStyles';
import { Colors } from '../utils/Constants';
import { goBack } from '../utils/NavigationUtil';
import BackBtn from '../components/ui/BackBtn';
import ReactNativeBlobUtil from 'react-native-blob-util';


type TFileReceived = Omit<IFile, 'totalChunks' | 'available'>; 


const ReceivedFilesScreen = () => {
    const [receivedFiles, setReceivedFiles] = useState<TFileReceived[]>([])
    const [isLoading, setIsLoading] = useState<boolean>(true)

    const getFilesFromDirectory = async () => {
        setIsLoading(true)
        
        const platformPath = Platform.OS === 'android' ? `${RNFS.DownloadDirectoryPath}/` : `${RNFS.DocumentDirectoryPath}/`;
        console.log('Platform Path for Received FIles is ', platformPath);

        try {
            const exists = await RNFS.exists(platformPath);
            if(!exists){
                setReceivedFiles([]);
                setIsLoading(false);
                return;
            }

            const files = await RNFS.readDir(platformPath);
            const formattedFiles : TFileReceived[] = files.map(file => ({
                id: file.name,
                name: file.name,
                size: file.size,
                uri: file.path,
                mimeType: file.name.split('.').pop() || 'unknown',
            }));

            setReceivedFiles(formattedFiles);


        } catch (error) {
            console.log("Error reading files from directory: ", error);
            setIsLoading(false);
        }
        finally{
            setIsLoading(false);
        }


        setIsLoading(false)
    }


    useEffect(()=>{
        getFilesFromDirectory();
    },[])


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


    const renderItem : ListRenderItem<TFileReceived> = ({item }) => (
        <View style={connectionStyles.fileItem}>

            <View style={connectionStyles.fileContainer}>
                {renderThumbnail(item.mimeType)}
                <View style={connectionStyles.fileDetails}>
                    <CustomText numberOfLines={1} fontFamily='Okra-Bold' fontSize={10}>
                        {item.name}
                    </CustomText>
                    <CustomText numberOfLines={1} fontFamily='Okra-Medium' fontSize={8}>
                        {item.mimeType} • {formatFileSize(item.size)}
                    </CustomText>
                </View>
            </View>
                <TouchableOpacity
                    style={connectionStyles.openButton}
                    onPress={() => handleFileOpen(item?.uri)}
                >
                    <CustomText numberOfLines={1} fontSize={9} color='#FFFFFF' fontFamily='Okra-Bold'>
                        Open
                    </CustomText>
                </TouchableOpacity>
        </View>
    )


    return (
        <LinearGradient
            style={sendStyles.container}
            colors={['#FFFFFF', '#CDDAEE', '#BDBAFF']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <SafeAreaView />
            <View style={sendStyles.mainContainer}>
                <BackBtn />

                <CustomText fontSize={15} color='#fff' fontFamily='Okra-Bold' style={{textAlign: 'center', margin: 10, }}>
                    All Received Files
                </CustomText>
                {isLoading ? 
                    <ActivityIndicator size="small" color={Colors.primary} /> 
                    : 
                    receivedFiles.length > 0 ? (
                        <View style={{flex: 1}}>
                            <FlatList 
                                data={receivedFiles}
                                renderItem={renderItem}
                                keyExtractor={item => item.id}
                                contentContainerStyle={connectionStyles.fileList}
                            />
                        </View>
                    ) : (
                        <View style={connectionStyles.noDataContainer}>
                            <CustomText fontSize={11} numberOfLines={1} fontFamily='Okra-Medium'>
                                No files received yet
                            </CustomText>
                        </View>
                    )
                }
            </View>
        </LinearGradient>
    )
}
export default ReceivedFilesScreen