import { Mode } from "../models/articles.model";

export interface AppSlice {
    readonly pageMode: Mode;
    readonly isBusy?: boolean;
}

export const initialAppSlice: AppSlice = {
    pageMode: null,
    isBusy: false
}
