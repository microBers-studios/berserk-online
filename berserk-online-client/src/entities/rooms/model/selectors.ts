import { RootState } from 'src/app/store'

export const roomsSelector = (state: RootState) => state.rooms.rooms
