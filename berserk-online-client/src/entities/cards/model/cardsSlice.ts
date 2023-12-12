import { createSlice } from '@reduxjs/toolkit'
import { APIStatus } from 'src/shared/lib'
import { findCards } from '../api/find-cards'

interface ICardsState {
    cards: CardType[]
    findCardsStatus: APIStatus
}

const initialState: ICardsState = {
    cards: [],
    findCardsStatus: APIStatus.Idle,
}

export const cardsSlice = createSlice({
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
    },
})
