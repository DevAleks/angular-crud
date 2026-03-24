import { signalStore, withState } from '@ngrx/signals';
import { initialAppSlice } from './app.slice';

export const AppStore = signalStore({ providedIn: 'root' }, withState(initialAppSlice));
