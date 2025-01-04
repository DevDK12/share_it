export interface IRecieverChunkStore {
    id: string | null;
    name: string;
    chunkArray: Buffer[];
    totalChunks: number;
};

export interface ISenderChunkStore extends Omit<IRecieverChunkStore, 'name'> {}

export type TSetRecieverChunkStore =  (chunkStore: IRecieverChunkStore | null) => void;
export type TResetReciverChunkStore = () => void;
export type TSetSenderChunkStore = (chunkStore: ISenderChunkStore | null) => void;
export type TResetSenderChunkStore = () => void;