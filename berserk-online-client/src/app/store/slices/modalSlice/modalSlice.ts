import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export enum Mode {
    LOGIN = 'login',
    REGISTRATION = 'registration',
    EDIT = 'account',
    EMAIL = 'reset-email',
    CLOSE = 'close',
    COOKIE = 'cookie',
    DECK_CREATING = 'deck-creating'
}

type IModalState = {
    mode: null | Mode;
    extra: any;
}

const initialState: IModalState = {
    mode: null,
    extra: null
}

const modalSlice = createSlice({
    name: 'modal',
    initialState,
    reducers: {
        setMode: (state, action: PayloadAction<{ mode: null | Mode, extra?: any }>) => {
            state.mode = action.payload.mode
            state.extra = action.payload.extra
        }
    }
})

export const { setMode } = modalSlice.actions;
export default modalSlice