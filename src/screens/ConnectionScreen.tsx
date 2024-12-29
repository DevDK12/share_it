import { View, SafeAreaView, FlatList } from 'react-native'
import LinearGradient from 'react-native-linear-gradient'
import { sendStyles } from '../styles/sendStyles'
import { connectionStyles } from '../styles/connectionStyles'
import CustomText from '../components/global/CustomText'
import { useTCP } from '../service/TCPProvider'
import {  useEffect, useState } from 'react'
import { navigate } from '../utils/NavigationUtil'
import Options from '../components/home/Options'
import FileContainerItem from '../components/connection/FileContainerItem'
import DisconnectBtn from '../components/connection/DisconnectBtn'
import SentBtn from '../components/connection/SentBtn'
import RecieveBtn from '../components/connection/RecieveBtn'
import { formatFileSize } from '../utils/libraryHelper'

const ConnectionScreen = () => {

    const { oppositeConnectedDevice, isConnected } = useTCP();

    const [activeTab, setActiveTab] = useState<'SENT' | 'RECEIVED'>('SENT');

    useEffect(() => {
        if (!isConnected) {
            navigate("HomeScreen");
        }
    }, [isConnected]);

    const handleTabChange = (tab: 'SENT' | 'RECEIVED') => {
        setActiveTab(tab);
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

                    <Options />

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
                            (activeTab === "SENT" ? sentFiles?.length > 0 : receivedFiles?.length > 0) ? (
                            <FlatList
                                data={activeTab === 'SENT' ? sentFiles : receivedFiles}
                                // keyExtractor={(item) => item.toString()}
                                keyExtractor={(item) => item.name}
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



const sentFiles = [
    {
        name: 'test1.mp4',
        mimeType: '.mp4',
        available: true,
        size: 1200,
    },
    {
        name: 'test2.jpg',
        mimeType: '.jpg',
        available: false,
        size: 10000,
    },
    {
        name: 'test3.pdf',
        mimeType: '.pdf',
        available: true,
        size: 400,
    },
    {
        name: 'test4.mp3',
        mimeType: '.mp3',
        available: false,
        size: 20500,
    },
];

const receivedFiles = [
    {
        name: 'test4.jpg',
        mimeType: '.jpg',
        available: false,
        size: 9520,
    },
    {
        name: 'test3.pdf',
        mimeType: '.pdf',
        available: false,
        size: 54156,
    },
    {
        name: 'test2.mp4',
        mimeType: '.mp4',
        available: true,
        size: 95154,
    },
    {
        name: 'test1.mp3',
        mimeType: '.mp3',
        available: false,        
        size: 205854,
    },
];