import { createSlice } from '@reduxjs/toolkit'

interface IRoomsState {
    rooms: RoomType[]
}

const initialState: IRoomsState = {
    rooms: [],
}

export const roomsSlice = createSlice({
    name: 'rooms',
    initialState,
    reducers: {},
})
