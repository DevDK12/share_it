import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import TcpSocket from 'react-native-tcp-socket';
import DeviceInfo from "react-native-device-info";
import Server from "react-native-tcp-socket/lib/types/Server";
import TLSSocket from "react-native-tcp-socket/lib/types/TLSSocket";
import {  receiveChunk, recieveFileMeta, transmitChunk } from "./TCPUtils";
import { useChunkStore } from "../db/chunkStore";
import { IFile, IParsedData, TSetReceivedFiles, TSetSentFiles } from "../types/TCPProviderTypes";




type TStartServer = (port: number) => void;
type TConnectToServer = (host: string, port: number, deviceName: string) => void;
type TDisconnect = () => void;


interface TCPContextType {
    server: Server | null;
    clientSocket: TLSSocket | null;
    serverSocket: TLSSocket | null;
    isConnected: boolean;
    oppositeConnectedDevice: any;
    sentFiles: IFile[];
    receivedFiles: IFile[];
    totalSentBytes: number;
    totalReceivedBytes: number;
    startServer: TStartServer;
    connectToServer: TConnectToServer;
    disconnect: TDisconnect;
    setSentFiles: TSetSentFiles;
    setReceivedFiles: TSetReceivedFiles;
};

const TCPContext = createContext<TCPContextType | undefined>(undefined);

export const useTCP = (): TCPContextType => {
    const context = useContext(TCPContext);
    if (!context) {
        throw new Error('useTCP must be used within a TCPProvider');
    }
    return context;
}


//? How TCP Connection works 
//_ We either have server or client at a time in 1 app

//_ We start server on WILDCARD address '0.0.0.0' 
//*     So any device in same network can connect to it via network's IP address
//*     Therefore we display NETWORK's IP address in QR Code for client to connect

//* To store connected device's name, we store it in 'oppositeConnectedDevice'
//*     to remember which device is connected to us or to whom we are connected


export const TCPProvider: FC<{ children: ReactNode }> = ({ children }) => {

    const { resetSenderChunkStore, resetReceiverChunkStore } = useChunkStore();

    const [server, setServer] = useState<Server | null>(null);
    const [clientSocket, setClientSocket] = useState<TLSSocket | null>(null);
    const [serverSocket, setServerSocket] = useState<TLSSocket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [oppositeConnectedDevice, setOppositeConnectedDevice] = useState<any>(null);
    const [sentFiles, setSentFiles] = useState<IFile[]>([]);
    const [receivedFiles, setReceivedFiles] = useState<IFile[]>([]);

    const [totalSentBytes, setTotalSentBytes] = useState<number>(0);
    const [totalReceivedBytes, setTotalReceivedBytes] = useState<number>(0);



    const cleanUp = () => {
        setReceivedFiles([]);
        setSentFiles([]);
        resetReceiverChunkStore();
        resetSenderChunkStore();
        setTotalSentBytes(0);
        setTotalReceivedBytes(0);
    }


    //_ Server side
    const startServer = (port: number) => {
        console.error('🔵🔵Starting Server 🔵🔵');
        if (server) {
            console.error("Server Already running");
            return;
        }

        const newServer = TcpSocket.createTLSServer({
            keystore: require('../../tls_certs/server-keystore.p12'),
        },
            (socket) => {
                //_ This gets activated when client connects to server
                console.log('Client connected : ', socket.address());

                setServerSocket(socket);
                socket.setNoDelay(true);

                //_ To set sender's buffer size for both reading and writing 
                socket.readableHighWaterMark = 1024 * 1024 * 1;
                socket.writableHighWaterMark = 1024 * 1024 * 1;

                socket.on('data', async (data) => {
                    const parsedData: IParsedData = JSON.parse(data?.toString());

                    if (parsedData?.event === 'connect') {
                        setIsConnected(true);
                        setOppositeConnectedDevice(parsedData?.deviceName);
                    }
                    if (parsedData?.event === 'file_ack') {
                        if(!parsedData?.data) {
                            console.log("No file data received");
                            return;
                        }
                        await recieveFileMeta({
                            data: parsedData?.data,
                            socket,
                            setReceivedFiles,
                        });
                    }

                    if (parsedData?.event === 'send_chunk_ack') {

                        await transmitChunk({
                            chunkNo: parsedData?.chunkNo!,
                            socket,
                            setTotalSentBytes,
                            setSentFiles,
                        });
                    }
                    if (parsedData?.event === 'receive_chunk_ack') {
                        await receiveChunk({
                            chunk: parsedData?.chunk!,
                            chunkNo: parsedData?.chunkNo!,
                            socket,
                            setTotalReceivedBytes,
                            setReceivedFiles
                        });
                    }
                });

                socket.on('close', () => {
                    console.log("Client Disconnected");
                    setIsConnected(false);
                    disconnect();
                });

                socket.on('error', (err) => console.log("Socket Error : ", err));
            }
        );

        //_ Start Server on WILDCARD Address
        newServer.listen({
            port,
            host: '0.0.0.0',
        },
            () => {
                const address = newServer.address();
                console.log(`Server running on ${address?.address}:${address?.port}`);
            });


        newServer.on('error', (error) => console.error('Server Error : ', error));
        setServer(newServer);
    };



    //_ Receiver side 
    const connectToServer = (host: string, port: number, deviceName: string) => {
        const newClient = TcpSocket.connectTLS({
            host,
            port,
            cert: true,
            ca: require('../../tls_certs/server-cert.pem')
        },
            () => {
                console.log(`Client Connected to =====> ${host}:${port}`);
                setIsConnected(true)
                setOppositeConnectedDevice(deviceName);
                const myDeviceName = DeviceInfo.getDeviceNameSync()
                newClient.write(JSON.stringify(
                    {
                        event: 'connect',
                        deviceName: myDeviceName
                    }),
                    'utf8',
                    (err) => {
                        if (err) console.log('Error in sending connect data : ', err);
                        console.log('Connect Data sent to server');
                    }
                );
            }
        )

        newClient.setNoDelay(true);

        //_ To set sender's buffer size for both reading and writing 
        newClient.readableHighWaterMark = 1024 * 1024 * 1;
        newClient.writableHighWaterMark = 1024 * 1024 * 1;


        newClient.on('data', async (data) => {
            const parsedData: IParsedData = JSON.parse(data?.toString());

            if (parsedData?.event === 'file_ack') {
                if(!parsedData?.data) {
                    console.log("No file data received");
                    return;
                }
                await recieveFileMeta({
                    data: parsedData?.data,
                    socket: newClient,
                    setReceivedFiles,
                });
            }

            if (parsedData?.event === 'send_chunk_ack') {
                await transmitChunk({
                    chunkNo: parsedData?.chunkNo!,
                    socket: newClient,
                    setTotalSentBytes,
                    setSentFiles,
                });
            }
            if (parsedData?.event === 'receive_chunk_ack') {
                await receiveChunk({
                    chunk: parsedData?.chunk!,
                    chunkNo: parsedData?.chunkNo!,
                    socket: newClient,
                    setTotalReceivedBytes,
                    setReceivedFiles
                });
            }
            
        });


        newClient.on('close', () => {
            console.log("Connection Closed");
            setIsConnected(false);
            disconnect();
        });

        newClient.on('error', (err) => console.log("Client Error : ", err));

        setClientSocket(newClient);

    }


    //_ Cleanup : Remove all listeners
    useEffect(() => {
        return () => {
            if (clientSocket) clientSocket.removeAllListeners();
        };
    }, [clientSocket]);
    useEffect(() => {
        return () => {
            if (serverSocket) serverSocket.removeAllListeners();
        };
    }, [serverSocket]);
    useEffect(() => {
        return () => {
            if (server) server.removeAllListeners();
        };
    }, [server]);



    //_ Disconnecting 
    const disconnect = () => {
        if (clientSocket) {
            console.log('🔴 Client Socket Destroyed 🔴');
            clientSocket.destroy();
            setClientSocket(null);
        }
        if (serverSocket) {
            console.log('🔴Server Socket Destroyed🔴');
            serverSocket.destroy();
            setServerSocket(null);
        }
        if (server) {
            console.log('🔴Server Closed🔴');
            server.close();
            setServer(null);
        }
        setIsConnected(false);

        cleanUp();
    };


    return (
        <TCPContext.Provider value={{
            server,
            clientSocket,
            serverSocket,
            isConnected,
            oppositeConnectedDevice,
            sentFiles,
            receivedFiles,
            totalSentBytes,
            totalReceivedBytes,
            startServer,
            connectToServer,
            disconnect,
            setSentFiles,
            setReceivedFiles,
        }}
        >
            {children}
        </TCPContext.Provider>
    );
}