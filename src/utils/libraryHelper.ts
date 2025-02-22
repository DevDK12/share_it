import { launchImageLibrary, Asset, ImagePickerResponse } from 'react-native-image-picker';
import DocumentPicker, {
    DocumentPickerResponse,
} from 'react-native-document-picker';
import { PermissionsAndroid, Platform } from "react-native";
import { Permission, PERMISSIONS, request, requestMultiple, RESULTS } from "react-native-permissions";
import { TOnFilePickedUp, TOnMediaPickedUp } from '../components/home/Options';
import { IPosition } from '../types/types';

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


export const formatFileSize = (sizeInBytes: number): string => {
    if (sizeInBytes >= 1024 ** 3) {
        return (sizeInBytes / 1024 ** 3).toFixed(2) + ' GB';
    } else if (sizeInBytes >= 1024 ** 2) {
        return (sizeInBytes / 1024 ** 2).toFixed(2) + ' MB';
    } else if (sizeInBytes >= 1024) {
        return (sizeInBytes / 1024).toFixed(2) + ' KB';
    } else {
        return sizeInBytes + ' B';
    }
};








interface IGetRandomPositionProps {
    radius: number,
    existingPositions: IPosition[],
    minDistance: number
}

export const getRandomPosition = ({ radius, existingPositions, minDistance }: IGetRandomPositionProps): IPosition => {
    let position: IPosition;
    let isOverlapping: boolean;


    do {
        const degree = Math.random() * 360; //* Angle in degrees
        const theta = (degree * Math.PI) / 180; //* Angle in radians

        const r = Math.random() * (radius - 50) + 50; //* Radius varies from 50 to radius

        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);

        position = { x, y };

        isOverlapping = existingPositions.some((pos) => {
            const dx = pos.x - position.x;
            const dy = pos.y - position.y;
            return Math.sqrt(dx * dx + dy * dy) < minDistance;
        })
    }
    while (isOverlapping);

    return position;
}





export const pickImage = (onMediaPickedUp: TOnMediaPickedUp) => {
    launchImageLibrary(
        {
            mediaType: 'photo',
            quality: 1,
            includeBase64: false,
        },
        (response: ImagePickerResponse) => {
            if (response.didCancel) {
                console.log('User canceled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else {
                const { assets } = response;
                if (assets && assets.length > 0) {
                    const selectedImage = assets[0];
                    onMediaPickedUp(selectedImage);
                }
            }
        },
    );
};

export const pickDocument = (onFilePickedUp: TOnFilePickedUp) => {
    DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
    })
        .then((res: DocumentPickerResponse[]) => {
            onFilePickedUp(res[0]);
        })
        .catch((err: any) => {
            if (DocumentPicker.isCancel(err)) {
                console.log('User canceled document picker');
            } else {
                console.log('DocumentPicker Error: ', err);
            }
        });
};








const logPermissionStatus = (permission: string, status: string) => {
    if (status === RESULTS.GRANTED) {
        console.log(`${permission} PERMISSION GRANTED ✅`);
    } else if (status === RESULTS.DENIED) {
        console.log(`${permission} PERMISSION DENIED ❌`);
    } else if (status === RESULTS.BLOCKED) {
        console.log(`${permission} PERMISSION BLOCKED 🚫`);
    } else {
        console.log(`${permission} PERMISSION STATUS: ${status}`);
    }
};

export const requestPermissions = async () => {
    try {
        const permissionsToRequest =
            Platform.OS === 'ios'
                ? [
                    PERMISSIONS.IOS.CAMERA,
                    PERMISSIONS.IOS.MICROPHONE,
                    PERMISSIONS.IOS.PHOTO_LIBRARY,
                ]
                : [
                    PERMISSIONS.ANDROID.CAMERA,
                    PERMISSIONS.ANDROID.RECORD_AUDIO,
                    PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE,
                ];

        const results = await requestMultiple(permissionsToRequest);

        for (const [permission, status] of Object.entries(results)) {
            logPermissionStatus(permission, status);
        }

        const isCameraGranted =
            Platform.OS === 'ios'
                ? results[PERMISSIONS.IOS.CAMERA] === 'granted'
                : results[PERMISSIONS.ANDROID.CAMERA] === 'granted';

        const isMicrophoneGranted =
            Platform.OS === 'ios'
                ? results[PERMISSIONS.IOS.MICROPHONE] === 'granted'
                : results[PERMISSIONS.ANDROID.RECORD_AUDIO] === 'granted';

        const isPhotoLibraryGranted =
            Platform.OS === 'ios'
                ? results[PERMISSIONS.IOS.PHOTO_LIBRARY] === 'granted'
                : results[PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE] === 'granted';

        return { isCameraGranted, isMicrophoneGranted, isPhotoLibraryGranted };
    } catch (error) {
        console.error('Error requesting permissions:', error);
        return { isCameraGranted: false, isMicrophoneGranted: false };
    }
};


export const requestPermission = async (permission: string, iosPermission: Permission, androidPermission: Permission) => {
    try {
        const permissionToRequest = Platform.OS === 'ios' ? iosPermission : androidPermission;

        const status = await request(permissionToRequest);

        logPermissionStatus(permissionToRequest, status);

        return status === 'granted';
    } catch (error) {
        console.error(`Error requesting ${permission.toLowerCase()} permission:`, error);
        return false;
    }
};

export const requestCameraPermission = async () => requestPermission('Camera', PERMISSIONS.IOS.CAMERA, PERMISSIONS.ANDROID.CAMERA);

export const requestPhotoLibraryPermission = async () => requestPermission('Photo Library', PERMISSIONS.IOS.PHOTO_LIBRARY, PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE);



export const requestMicrophonePermission = async () => requestPermission('Microphone', PERMISSIONS.IOS.MICROPHONE, PERMISSIONS.ANDROID.RECORD_AUDIO);
