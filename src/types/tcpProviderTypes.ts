export interface IFile{
    id: string;
    name: string ;
    size: number ;
    uri: string;
    totalChunks: number;
    mimeType: string;
    available?: boolean;
}




export type TSetSentFiles = React.Dispatch<React.SetStateAction<IFile[]>>;
export type TSetRecievedFiles = React.Dispatch<React.SetStateAction<IFile[]>>;

export interface IParsedData {
    event: string;
    data: any;
    deviceName?: string;
}