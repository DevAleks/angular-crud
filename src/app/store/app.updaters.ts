import { PartialStateUpdater } from "@ngrx/signals";
import { AppSlice } from "./app.slice";

export function setBusy(isBusy: boolean): PartialStateUpdater<AppSlice> {
    return _ => ({ isBusy });
}
