import { create } from "zustand";


interface IReceiverChunkStore {
    id: string | null;
    name: string;
    chunkArray: Buffer[];
    totalChunks: number;
};

interface ISenderChunkStore extends Omit<IReceiverChunkStore, 'name'> { }

type TSetReceiverChunkStore = (chunkStore: IReceiverChunkStore) => void;
type TResetReceiverChunkStore = () => void;
type TSetSenderChunkStore = (chunkStore: ISenderChunkStore) => void;
type TResetSenderChunkStore = () => void;

interface IChunkStore {

    receiverChunkStore: IReceiverChunkStore | null;
    senderChunkStore: ISenderChunkStore | null;
    setReceiverChunkStore: TSetReceiverChunkStore;
    resetReceiverChunkStore: TResetReceiverChunkStore;
    setSenderChunkStore: TSetSenderChunkStore;
    resetSenderChunkStore: TResetSenderChunkStore;
}


export const useChunkStore = create<IChunkStore>((set) => ({
    receiverChunkStore: null,
    senderChunkStore: null,
    setReceiverChunkStore: (receiverChunkStore) => set({ receiverChunkStore }),
    resetReceiverChunkStore: () => set({ receiverChunkStore: null }),
    setSenderChunkStore: (senderChunkStore) => set({ senderChunkStore }),
    resetSenderChunkStore: () => set({ senderChunkStore: null }),
}))