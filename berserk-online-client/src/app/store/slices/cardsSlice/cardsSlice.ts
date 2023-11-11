import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { ICard } from "src/API/utils/types";
import { APIStatus } from "../../const";
import { URL, Paths } from "src/API/utils/urls";


interface ICardsState {
    cards: ICard[];
    findCardsStatus: APIStatus;
}

const initialState: ICardsState = {
    cards: [],
    findCardsStatus: APIStatus.Idle
}

export const findCards = createAsyncThunk<{ cards: ICard[] }, { query: string, limit?: number }, { rejectValue: string }>(
    'cards/findCards',
    async function ({ query, limit = 10 }, { rejectWithValue }) {
        try {
            const path = URL + Paths.FIND_CARDS + `?query=${query}&limit=${limit}`

            const response = await fetch(path, {
                credentials: 'include'
            })

            if (!response.ok) {
                throw new Error('Finding cards error')
            }

            const arr = await response.json()

            return { cards: arr }
        } catch (e: any) {
            return rejectWithValue(e.message)
        }
    })

const cardsSlice = createSlice({
    name: 'cards',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(findCards.pending, (state) => {
                state.findCardsStatus = APIStatus.Pending
            })
            .addCase(findCards.fulfilled, (state, action) => {
                state.cards = action.payload.cards
                state.findCardsStatus = APIStatus.Fulfilled
            })
            .addCase(findCards.rejected, (state) => {
                state.findCardsStatus = APIStatus.Rejected
            })
    }
})

export default cardsSlice