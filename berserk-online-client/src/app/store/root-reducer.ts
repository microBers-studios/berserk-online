import { combineReducers } from '@reduxjs/toolkit'
import userSlice from './slices/userSlice/userSlice'
import modalSlice from './slices/modalSlice/modalSlice'
import decksSlice from './slices/decksSlice/decksSlice'
import cardsSlice from './slices/cardsSlice/cardsSlice'

export const rootReducer = combineReducers({
    [userSlice.name]: userSlice.reducer,
    [modalSlice.name]: modalSlice.reducer,
    [decksSlice.name]: decksSlice.reducer,
    [cardsSlice.name]: cardsSlice.reducer
})