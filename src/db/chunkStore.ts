import { create } from "zustand";
import {Buffer} from 'buffer';

//_ Zustand Global state for ChunkStore

export interface IRecieverChunkStore {
    id: string | null;
    name: string;
    chunkArray: Buffer[];
    totalChunks: number;
};

export interface ISenderChunkStore extends Omit<IRecieverChunkStore, 'name'> {}

export type TSetRecieverChunkStore =  (chunkStore: IRecieverChunkStore) => void;
export type TResetReciverChunkStore = () => void;
export type TSetSenderChunkStore = (chunkStore: ISenderChunkStore) => void;
export type TResetSenderChunkStore = () => void;


interface IChunkStore { 

    //_ Stores chunk[] at Reciever side
    reciverChunkStore : IRecieverChunkStore | null;

    //_ Stores chunk[] at Sender side
    senderChunkStore: ISenderChunkStore | null;

    setReciverChunkStore: TSetRecieverChunkStore
    resetReciverChunkStore: TResetReciverChunkStore;
    setSenderChunkStore: TSetSenderChunkStore
    resetSenderChunkStore: TResetSenderChunkStore;
}


export const useChunkStore = create<IChunkStore>((set) => ({
    reciverChunkStore: null,
    senderChunkStore: null,
    setReciverChunkStore: (reciverChunkStore) => set({reciverChunkStore}),
    resetReciverChunkStore: () => set({reciverChunkStore: null}),
    setSenderChunkStore: (senderChunkStore) => set({senderChunkStore}),
    resetSenderChunkStore: () => set({senderChunkStore: null}),
}))