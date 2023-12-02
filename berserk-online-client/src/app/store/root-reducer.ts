import { combineReducers } from '@reduxjs/toolkit'
import { userSlice } from 'src/entities/user'
import { decksSlice } from 'src/entities/decks'
import { cardsSlice } from 'src/entities/cards'
import { roomsSlice } from 'src/entities/rooms'

export const rootReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
    [decksSlice.name]: decksSlice.reducer,
    [cardsSlice.name]: cardsSlice.reducer,
    [roomsSlice.name]: roomsSlice.reducer,
})
