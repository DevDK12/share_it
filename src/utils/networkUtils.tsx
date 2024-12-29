import { NetworkInfo } from 'react-native-network-info';

export const getLocalIPAddress = async (): Promise<string> => {
    try {
        const gateway = await NetworkInfo.getIPV4Address();
        console.log("IP ADDRESS", gateway)
        return gateway || '0.0.0.0';
    } catch (error) {

        return '0.0.0.0';
    }
};


