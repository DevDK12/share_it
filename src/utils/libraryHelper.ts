import { PermissionsAndroid, Platform } from "react-native";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";

export const checkFilePermissions = async (platform: string) => {
    if (platform === 'android') {
        try {
            const granted = await PermissionsAndroid.requestMultiple([
                PermissionsAndroid.PERMISSIONS.READ_EXTERNAL_STORAGE,
                PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
            ]);
            if (granted['android.permission.READ_EXTERNAL_STORAGE'] && granted['android.permission.WRITE_EXTERNAL_STORAGE']) {
                console.log("STORAGE PERMISSION GRANTED ✅")
                return true;
            } else {
                return false;
            }
        } catch (err) {
            return false;
        }
    } else {
        return true;
    }
};

export const requestPhotoPermission = async () => {
    if (Platform.OS !== 'ios') {
        return
    }
    try {
        const result = await request(PERMISSIONS.IOS.PHOTO_LIBRARY);
        if (result === RESULTS.GRANTED) {
            console.log('STORAGE PERMISSION GRANTED ✅');
        } else {
            console.log('STORAGE PERMISSION DENIED ❌');
        }
    } catch (error) {
        console.error('Error requesting permission:', error);
    }
};