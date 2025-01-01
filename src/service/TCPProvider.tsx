import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useState } from "react";
import TcpSocket from 'react-native-tcp-socket';
import DeviceInfo from "react-native-device-info";
import Server from "react-native-tcp-socket/lib/types/Server";
import TLSSocket from "react-native-tcp-socket/lib/types/TLSSocket";



interface TCPContextType {
    server: Server | null;
    clientSocket: TLSSocket | null;
    isConnected: boolean;
    oppositeConnectedDevice: any;
    startServer: (port: number) => void;
    connectToServer: (host: string, port: number, deviceName: string) => void;
    disconnect: () => void;
};

const TCPContext = createContext<TCPContextType | undefined>(undefined);

export const useTCP = () : TCPContextType => {
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


export const TCPProvider: FC<{children: ReactNode}> = ({children}) => {

    const [server, setServer] = useState<Server | null>(null);
    const [clientSocket, setClientSocket] = useState<TLSSocket | null>(null);
    const [serverSocket, setServerSocket] = useState<TLSSocket | null>(null);
    const [isConnected, setIsConnected] = useState<boolean>(false);
    const [oppositeConnectedDevice, setOppositeConnectedDevice] = useState<any>(null);


    //_ Server side
    const startServer = useCallback((port: number) => {
        if(server){
            console.log("Server Already running");
            return;
        }

        const newServer = TcpSocket.createTLSServer({
                keystore : require('../../tls_certs/server-keystore.p12'),
            }, 
            (socket) => {
                //_ This gets activated when client connects to server
                console.log('Client connected : ' , socket.address());

                setServerSocket(socket);
                socket.setNoDelay(true);

                //_ To set sender's buffer size for both reading and writing 
                socket.readableHighWaterMark = 1024 * 1024 * 1;
                socket.writableHighWaterMark = 1024 * 1024 * 1;

                socket.on('data', (data) => {
                    const parsedData = JSON.parse(data?.toString());
                    console.log('Data Received from client : ', parsedData);
                    if(parsedData?.event === 'connect'){
                        setIsConnected(true);
                        setOppositeConnectedDevice(parsedData?.deviceName);
                    }
                });

                socket.on('close', () => {
                    console.log("Client Disconnected");
                    setIsConnected(false);
                    disconnect();
                });

                socket.on('error', (err) => console.log("Socket Error : " ,err));
            }
        );

        //_ Start Server on WILDCARD Address
        newServer.listen({
            port,
            host: '0.0.0.0',
        },
        ()=>{
            const address = newServer.address();
            console.log(`Server running on ${address?.address}:${address?.port}`);
        });

        
        newServer.on('error', (error) => console.error('Server Error : ', error));
        setServer(newServer);

    },[server]);






    //_ Receiver side 
    const connectToServer = useCallback((host: string, port: number, deviceName: string) => {
        const newClient = TcpSocket.connectTLS({
                host,
                port,
                cert: true,
                ca: require('../../tls_certs/server-cert.pem')
            },
            ()=>{
                    setIsConnected(true)
                    setOppositeConnectedDevice(deviceName);
                    const myDeviceName = DeviceInfo.getDeviceNameSync()
                    newClient.write(JSON.stringify(
                        {
                            event: 'connect', 
                            deviceName: myDeviceName
                        },
                    ),
                    'utf8',
                    (err) => {
                        if(err) console.log('Error in sending connect data : ', err);
                        console.log('Connect Data sent to server');
                    }
                );
            }
        )

        newClient.setNoDelay(true);

        //_ To set sender's buffer size for both reading and writing 
        newClient.readableHighWaterMark = 1024 * 1024 * 1;
        newClient.writableHighWaterMark = 1024 * 1024 * 1;


        newClient.on('close', ()=>{
            console.log("Connection Closed");
            setIsConnected(false);
            disconnect();
        });

        newClient.on('error', (err) => console.log("Client Error : " ,err));

        setClientSocket(newClient);

    },[clientSocket]);


    //_ Cleanup : Remove all listeners
    useEffect(() => {
        return () => {
            if (clientSocket) clientSocket.removeAllListeners();
            if (serverSocket) serverSocket.removeAllListeners();
            if (server) server.removeAllListeners();
        };
    }, [clientSocket, server, serverSocket]);
    


    //_ Disconnecting 
    const disconnect = () => {
        if(clientSocket){
            clientSocket.destroy();
            setClientSocket(null);
        }
        if(serverSocket){
            serverSocket.destroy();
            setServerSocket(null);
        }
        if(server){
            server.close();
            setServer(null);
        }
        setIsConnected(false);
    };


    return (
        <TCPContext.Provider value={{
                server,
                clientSocket,
                isConnected,
                oppositeConnectedDevice,
                startServer,
                connectToServer,
                disconnect
            }}
        >
            {children}
        </TCPContext.Provider>
    );
}