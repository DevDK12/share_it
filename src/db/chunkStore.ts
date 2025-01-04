import { create } from "zustand";
import { IRecieverChunkStore, ISenderChunkStore, TResetReciverChunkStore, TResetSenderChunkStore, TSetRecieverChunkStore, TSetSenderChunkStore } from "../types/chunkStoreTypes";

//_ Zustand Global state for ChunkStore





interface IChunkStore { 

    //_ Stores chunk[] at Reciever side
    reciverChunkStore : IRecieverChunkStore | null;

    //_ Stores chunk[] at Sender side
    senderChunkStore: ISenderChunkStore | null;

    setReciverChunkStore: TSetRecieverChunkStore;
    resetReciverChunkStore: TResetReciverChunkStore;
    setSenderChunkStore: TSetSenderChunkStore;
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