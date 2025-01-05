import { TLSSocket } from "net";
import { Buffer } from 'buffer';
import RNFS from 'react-native-fs';
import { produce } from "immer";
import { Asset } from "react-native-image-picker";
import { DocumentPickerResponse } from "react-native-document-picker";
import { Alert, Platform } from "react-native";
import { IFile, TSetReceivedFiles, TSetSentFiles, TSetTotalReceivedBytes, TSetTotalSentBytes } from "../types/TCPProviderTypes";
import { useChunkStore } from "../db/chunkStore";



//_ Convert file to buffer
//_ Update ChunkStore from buffer
//_ Update sentFiles
//_ Send meta data to reciever via 'file_ack' event


type TTransmitFileMeta = {
    file: Asset | DocumentPickerResponse;
    type: 'image' | 'file';
    socket: TLSSocket | null;
    setSentFiles: TSetSentFiles;
}
export const transmitFileMeta = async ({
        file, 
        type, 
        socket, 
        setSentFiles, 
    } : TTransmitFileMeta) => {

    //_ Don't use 'useChunkStore()' here as it can't be used outside of a component
    const { setSenderChunkStore, senderChunkStore } = useChunkStore.getState();
    
    if(senderChunkStore != null){
        Alert.alert("Wait for Current file to be sent!")
        return;
    }


    const normalizedPath = Platform.OS === 'ios' ? file?.uri : file?.uri?.replace('file://', '');
    console.log("Normalized Path: ", normalizedPath);

    let fileData:string;
    try{
        fileData = await RNFS.readFile(normalizedPath!, 'base64');

    }
    catch(e){
        console.log("Returning bcz Error in reading file : ", e);
        return;
    }


    
    const buffer = Buffer.from(fileData, 'base64');


    let totalChunks = 0;
    let chunkArray : Buffer[] = [];
    let offset = 0;
    const CHUNK_SIZE = 1024 * 8; //_ 8KB

    while(offset < buffer.length){
        const chunk = buffer.slice(offset, offset + CHUNK_SIZE);
        chunkArray.push(chunk);
        offset += CHUNK_SIZE;
        totalChunks += 1;
    }

    const fileName = type === 'file' ? (file as DocumentPickerResponse)?.name : (file as Asset)?.fileName;
    const fileSize = type === 'file' ? (file as DocumentPickerResponse)?.size : (file as Asset)?.fileSize;

    if(type === 'file' ){
        console.log("File type " , file.type);
    }


    const metaData = {
        // id: uuid() as string,
        id: `file-${Date.now()}`,
        name: fileName || 'No name',
        size: fileSize || 0,
        mimeType: type === 'file' ? 'file' : '.jpg',
        totalChunks,
    }

    setSenderChunkStore({
        id: metaData.id,
        chunkArray,
        totalChunks,
    })

    console.log('transmitFileMeta updating senderChunkStore: ', senderChunkStore);


    setSentFiles((files: IFile[]) => (
        produce(files, (draftFile: IFile[]) => {
            draftFile.push({
                ...metaData,
                uri: normalizedPath!,
            })
        })
    ))


    if(!socket){
        console.log("Socket not available");
        return;
    }

    try{
        console.log("File Acknowledgement Sending... ");
        
        socket.write(JSON.stringify({
            event: 'file_ack',
            data: metaData,
        }), 'utf8', (err) => {
            if(err){
                console.log("Error in asking for 1st chunk : ", err);
                return;
            }
            console.log("1st Chunk successfully asked ✅");
        });
    }
    catch(e){
        console.log("Error in sending file meta data : ", e);
    }

}




//_ Convert metadata to chunkStore with empty buffer[]
//_ Update recievedFiles
//_ Ask for 1st chunk via 'send_chunk_ack' event

type TRecieveFileMeta = {
    data: IFile | null;
    socket: TLSSocket | null;
    setReceivedFiles: TSetReceivedFiles;
}
export const recieveFileMeta = async ({
        data, 
        socket, 
        setReceivedFiles, 
    } : TRecieveFileMeta) => {

    const { receiverChunkStore, setReceiverChunkStore } = useChunkStore.getState();
    
    if(receiverChunkStore){
        Alert.alert("There are files which need to be received Wait Bro!")
        return;
    }

    if(!data){
        console.log("Data not available");
        return;
    }

    setReceiverChunkStore({
        id: data?.id,
        totalChunks: data.totalChunks,
        name: data.name,
        // size: data.size,
        // mimeType: data.mimeType,
        chunkArray: [],
    });


    setReceivedFiles((files: IFile[]) => (
        produce(files, (draftFile: IFile[]) => {
            draftFile.push(data);
        })
    ));


    if(!socket){
        console.log("Socket not available");
        return;
    }

    try{
        //_ To prevent bucket from overflowing from traffic , delay is added
        await new Promise((resolve) => setTimeout(resolve, 10));
        console.log("File meta data recieved, Now asking for 1st chunk... ");
        socket.write(JSON.stringify({
            event: 'send_chunk_ack',
            chunkNo: 0,
        }), 'utf8', (err) => {
            if(err){
                console.log("Error in asking for 1st chunk : ", err);
                return;
            }
            console.log("1st Chunk successfully asked ✅");
        });
    }
    catch(e){
        console.log("Error in sending chunk ack : ", e);
    }

}





//_ Transmits requested chunk
//_ Updates totalSentBytes
//_ Resets chunkStore if all chunks sent
//_ Updates sentFiles[file] to available if all chunks sent

type TTransmitChunk = {
    chunkNo: number;
    socket: TLSSocket | null;
    setTotalSentBytes: TSetTotalSentBytes;
    setSentFiles: TSetSentFiles;
}

export const transmitChunk = async ({
        chunkNo, 
        socket, 
        setTotalSentBytes, 
        setSentFiles
    } : TTransmitChunk) => {

    const { senderChunkStore, resetSenderChunkStore } = useChunkStore.getState();

    if(!senderChunkStore){
        Alert.alert("There are no chunks to be sent");
        return;
    }

    if(!socket){
        console.log("Socket not available");
        return;
    }

    const totalChunks = senderChunkStore.totalChunks;
    console.log("Total Chunks: ", totalChunks);

    try{
        await new Promise((resolve) => setTimeout(resolve, 10));
        socket.write(
            JSON.stringify({
                event: 'receive_chunk_ack',
                chunk: senderChunkStore.chunkArray[chunkNo].toString('base64'),
                chunkNo,
            }),
            'utf8',
            (error) => {
                if(error) {
                    console.log(`Error in sending chunkNo. - ${chunkNo} : ${error}`);
                    return;
                }
                console.log(`Chunk - ${chunkNo} sent successfully ✅`);
            }
        );

        setTotalSentBytes((prev) => prev + senderChunkStore.chunkArray[chunkNo].length);

        if(chunkNo + 2 > totalChunks){
            console.log("All chunks sent ✅🔴");
            setSentFiles((prevData) => 
                produce(prevData, (draftFiles: any) => {
                    const fileIndex = draftFiles?.findIndex((file: any) => file.id === senderChunkStore.id);
                    if(fileIndex !== -1){
                        draftFiles[fileIndex].available = true;
                    }
                })
            );
            resetSenderChunkStore();

        }
    }
    catch(err){
        console.log("Error in sending chunk : ", err);
    }

}





//_ Updates chunkStore with recieved chunk
//_ Updates totalRecievedBytes
//_ 
//_ Requests for next chunk


type TReceiveChunk = {
    chunk: string;
    chunkNo: number;
    socket: TLSSocket | null;
    setTotalReceivedBytes: TSetTotalReceivedBytes;
    setReceivedFiles: TSetReceivedFiles;
}

export const receiveChunk = async ({
        chunk, 
        chunkNo, 
        socket, 
        setTotalReceivedBytes,  
        setReceivedFiles,
    } : TReceiveChunk) => {

    const { receiverChunkStore, setReceiverChunkStore, resetReceiverChunkStore } = useChunkStore.getState();
    if(!receiverChunkStore){
        console.log("Chunk Store is null");
        return;
    }

    try {
        const bufferChunk = Buffer.from(chunk, 'base64');
        const updatedChunkArray = [...(receiverChunkStore.chunkArray || [])]
        updatedChunkArray[chunkNo] = bufferChunk;
        setReceiverChunkStore({
            ...receiverChunkStore,
            chunkArray: updatedChunkArray,

        });
        setTotalReceivedBytes((prevValue:number) => {
            return prevValue + bufferChunk.length;
        });


    } catch (error) {
        console.log("Error in updating chunk: ", error);
    };

    if(!socket){
        console.log("Socket not available");
        return;
    }


    if(chunkNo + 1 === receiverChunkStore?.totalChunks){
        console.log("All chunks received ✅🔴");
        const filePath = await generateFile();

        if(!filePath){
            console.log("Error in generating file");
            return;
        }

        setReceivedFiles((prevFiles: IFile[]) => 
            produce(prevFiles, (draftFiles: IFile[]) => {
                const fileIndex = draftFiles?.findIndex((file) => file.id === receiverChunkStore.id);
                if(fileIndex !== -1){
                    draftFiles[fileIndex] = {
                        ...draftFiles[fileIndex],
                        uri: filePath,
                        available: true,
                    }
                };
            })
        );

        resetReceiverChunkStore();
        return;
    }


    try{
        await new Promise((resolve) => setTimeout(resolve, 10));
        console.log("Requested for next chunk  ⬇️", chunkNo + 1)
        socket.write(JSON.stringify({event: 'send_chunk_ack', chunkNo: chunkNo + 1})
        , 'utf8', (err) => {
            if(err){
                console.log("Error in asking for 1st chunk : ", err);
                return;
            }
            console.log("1st Chunk successfully asked ✅");
        });
    }
    catch(err){
        console.log("Error in sending file: ", err);
    }

}





//_ Generates file from chunkArray and saves it to device

const generateFile = async () => {

    const { receiverChunkStore } = useChunkStore.getState();

    if(!receiverChunkStore){
        console.log("No Chunks or files to process");
        return;
    }

    if(receiverChunkStore?.totalChunks !== receiverChunkStore?.chunkArray?.length){
        console.log("Not all chunks have been received");
        return;
    }

    try {
        const combinedChunks = Buffer.concat(receiverChunkStore.chunkArray);
        const platformPath = Platform.OS === 'ios' ? `${RNFS.DocumentDirectoryPath}` : `${RNFS.DownloadDirectoryPath}`;
        const filePath = `${platformPath}/${receiverChunkStore.name}`;

        console.log("File Path after saving : ", filePath);
        await RNFS.writeFile(filePath, combinedChunks?.toString('base64'), 'base64');

        console.log("File saved successfully ✅ to => ", filePath);

        return filePath;

    } catch (error) {
        console.error("Error combining chunks or saving file : ", error);
    }
}
