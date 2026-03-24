export interface Articles {
    readonly id: number;
    readonly text: string;
}

export interface AppSlice {
    readonly articles: Articles[];
    readonly isBusy: boolean;
}

export const initialAppSlice: AppSlice = {
    articles: [], 
    isBusy: false
}