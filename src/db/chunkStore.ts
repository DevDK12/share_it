import { create } from "zustand";

//_ Zustand Global state for ChunkStore

//* Zustand setters should not be passed but rather consumed directly


interface IReceiverChunkStore {
    id: string | null;
    name: string;
    chunkArray: Buffer[];
    totalChunks: number;
};

interface ISenderChunkStore extends Omit<IReceiverChunkStore, 'name'> {}

type TSetReceiverChunkStore =  (chunkStore: IReceiverChunkStore ) => void;
type TResetReceiverChunkStore = () => void;
type TSetSenderChunkStore = (chunkStore: ISenderChunkStore ) => void;
type TResetSenderChunkStore = () => void;

interface IChunkStore { 

    //_ Stores chunk[] at Reciever side
    receiverChunkStore : IReceiverChunkStore | null;

    //_ Stores chunk[] at Sender side
    senderChunkStore: ISenderChunkStore | null;

    setReceiverChunkStore: TSetReceiverChunkStore;
    resetReceiverChunkStore: TResetReceiverChunkStore;
    setSenderChunkStore: TSetSenderChunkStore;
    resetSenderChunkStore: TResetSenderChunkStore;
}


export const useChunkStore = create<IChunkStore>((set) => ({
    receiverChunkStore: null,
    senderChunkStore: null,
    setReceiverChunkStore: (receiverChunkStore) => set({receiverChunkStore}),
    resetReceiverChunkStore: () => set({receiverChunkStore: null}),
    setSenderChunkStore: (senderChunkStore) => set({senderChunkStore}),
    resetSenderChunkStore: () => set({senderChunkStore: null}),
}))