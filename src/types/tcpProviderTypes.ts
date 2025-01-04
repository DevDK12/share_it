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
export type TSetReceivedFiles = React.Dispatch<React.SetStateAction<IFile[]>>;
export type TSetTotalSentBytes = React.Dispatch<React.SetStateAction<number>>;
export type TSetTotalReceivedBytes = React.Dispatch<React.SetStateAction<number>>;

export interface IParsedData {
    event: string;
    data: any;
    deviceName?: string;
    chunkNo?: number;
    chunk?: string;
}