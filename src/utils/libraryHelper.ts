import { launchImageLibrary, Asset, ImagePickerResponse } from 'react-native-image-picker';
import DocumentPicker, {
    DocumentPickerResponse,
} from 'react-native-document-picker';
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







export interface IPosition {
    x: number,
    y: number,
}
export interface IGetRandomPositionProps {
    radius: number,
    existingPositions: IPosition[],
    minDistance: number
}

export const getRandomPosition = ({ radius, existingPositions, minDistance }: IGetRandomPositionProps): IPosition => {
    let position: IPosition;
    let isOverlapping: boolean;

    //_ Circle Position Formula
    //* (x,y) : (  r * cos(theta)  , r * sin(theta)  )
    //* where r varies  [50 , radius]

    do {
        const degree = Math.random() * 360; //* Angle in degrees
        const theta = (degree * Math.PI) / 180; //* Angle in radians

        const r = Math.random() * (radius - 50) + 50; //* Radius varies from 50 to radius

        const x = r * Math.cos(theta);
        const y = r * Math.sin(theta);

        position = { x, y };

        //* Overlapping : Min dist b/w center of two points  <  minDistance
        isOverlapping = existingPositions.some((pos) => {
            const dx = pos.x - position.x;
            const dy = pos.y - position.y;
            return Math.sqrt(dx * dx + dy * dy) < minDistance;
        })
    }
    while (isOverlapping);

    return position;
}





type MediaPickedCallback = (media: Asset) => void;
type FilePickedCallback = (file: DocumentPickerResponse) => void;

export const pickImage = (onMediaPickedUp: MediaPickedCallback) => {
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

export const pickDocument = (onFilePickedUp: FilePickedCallback) => {
    DocumentPicker.pick({
        type: [DocumentPicker.types.allFiles],
    })
        .then((res: any) => {
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