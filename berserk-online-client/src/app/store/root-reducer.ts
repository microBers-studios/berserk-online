import { combineReducers } from '@reduxjs/toolkit'
import { userSlice } from 'src/entities/user'
import { modalSlice } from 'src/entities/modal'
import { decksSlice } from 'src/entities/decks'
import { cardsSlice } from 'src/entities/cards'

export const rootReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
    [modalSlice.name]: modalSlice.reducer,
    [decksSlice.name]: decksSlice.reducer,
    [cardsSlice.name]: cardsSlice.reducer
})