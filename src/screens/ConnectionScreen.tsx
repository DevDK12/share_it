import { View, SafeAreaView, FlatList } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { sendStyles } from '../styles/sendStyles'
import { connectionStyles } from '../styles/connectionStyles'
import CustomText from '../components/global/CustomText'
import { useTCP } from '../service/TCPProvider'
import {  useEffect, useState } from 'react'
import { resetAndNavigate } from '../utils/NavigationUtil'
import Options from '../components/home/Options'
import FileContainerItem from '../components/connection/FileContainerItem'
import DisconnectBtn from '../components/connection/DisconnectBtn'
import SentBtn from '../components/connection/SentBtn'
import RecieveBtn from '../components/connection/RecieveBtn'
import { formatFileSize } from '../utils/libraryHelper'
import { Asset } from 'react-native-image-picker'
import { DocumentPickerResponse } from 'react-native-document-picker'
import { transmitFileMeta } from '../service/TCPUtils'
import { useChunkStore } from '../db/chunkStore'

const ConnectionScreen = () => {

    const { oppositeConnectedDevice, isConnected, setSentFiles, clientSocket, serverSocket, sentFiles, recievedFiles } = useTCP();
    const { senderChunkStore, setSenderChunkStore } = useChunkStore();

    const [activeTab, setActiveTab] = useState<'SENT' | 'RECEIVED'>('SENT');

    useEffect(() => {
        if (!isConnected) {
            resetAndNavigate("HomeScreen");
        }
    }, [isConnected]);

    const handleTabChange = (tab: 'SENT' | 'RECEIVED') => {
        setActiveTab(tab);
    }


    const handleMediaPickedUp = (image: Asset) => {
        console.log("Picked image: ", image);

        
        //* Send image to the connected device
        
        transmitFileMeta({
            file: image,
            type: 'image',
            setSentFiles,
            setSenderChunkStore,
            senderChunkStore,
            socket: clientSocket || serverSocket,
        });
    }

    const handleFilePickedUp = (file: DocumentPickerResponse) => {
        console.log("Picked file: ", file);

        
        //* Send file to the connected device
        
        transmitFileMeta({
            file: file,
            type: 'file',
            setSentFiles,
            senderChunkStore,
            setSenderChunkStore,
            socket: clientSocket || serverSocket,
        });
    }



    return (
        <LinearGradient
            style={sendStyles.container}
            colors={['#FFFFFF', '#CDDAEE', '#BDBAFF']}
            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
        >
            <SafeAreaView />
            <View style={sendStyles.mainContainer}>
                <View style={connectionStyles.container}>
                    <View style={connectionStyles.connectionContainer}>
                        <View style={{ width: '55%' }}>
                            <CustomText numberOfLines={1} fontFamily="Okra-Medium">
                                Connected with
                            </CustomText>
                            <CustomText numberOfLines={1} fontFamily="Okra-Bold" fontSize={14}>
                                {oppositeConnectedDevice || "Unknown"}
                            </CustomText>
                        </View>
                        <DisconnectBtn />
                    </View>

                    <Options 
                        isHome={false}
                        onFilePickedUp={handleFilePickedUp}
                        onMediaPickedUp={handleMediaPickedUp}
                    />

                    <View style={connectionStyles.fileContainer}>

                        {/*//_ TAB Header */}
                        <View style={connectionStyles.sendReceiveContainer}>
                            <View style={connectionStyles.sendReceiveButton}>
                                <SentBtn activeTab={activeTab} handleTabChange={handleTabChange} />
                                <RecieveBtn activeTab={activeTab} handleTabChange={handleTabChange} />
                            </View>

                            <View style={connectionStyles.sendReceiveButtonContainer}> 
                                <CustomText fontFamily="Okra-Bold" fontSize={9}>
                                    {formatFileSize(263000)}
                                </CustomText>
                                <CustomText fontFamily="Okra-Bold" fontSize={12}>
                                    /
                                </CustomText>
                                <CustomText fontFamily="Okra-Bold" fontSize={10}>
                                    {formatFileSize(505400)}
                                </CustomText>
                            </View>
                        </View>

                        {/*//_ Tab body */}
                        {
                            (activeTab === "SENT" ? sentFiles?.length > 0 : recievedFiles?.length > 0) ? (
                            <FlatList
                                data={activeTab === 'SENT' ? sentFiles : recievedFiles}
                                // keyExtractor={(item) => item.toString()}
                                keyExtractor={(item) => item.id}
                                renderItem={FileContainerItem}
                                contentContainerStyle={connectionStyles.fileList}
                            />
                            )
                            :
                            <View style={connectionStyles.noDataContainer}>
                                <CustomText numberOfLines={1} fontFamily="Okra-Medium" fontSize={11}>
                                    {activeTab === 'SENT' ? "No files sent yet" : "No files received yet"}
                                </CustomText>
                            </View>
                        }
                    </View>
                </View>
            </View>
        </LinearGradient>
    )
}
export default ConnectionScreen;


