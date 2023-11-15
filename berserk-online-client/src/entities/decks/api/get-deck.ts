import { createAsyncThunk } from "@reduxjs/toolkit"
import { Paths, apiUrl } from "src/shared/lib"

export const getDeck = createAsyncThunk<DeckType, string, { rejectValue: string }>(
    'decks/getDeck',
    async (id, { rejectWithValue }) => {
        try {
            const path = apiUrl + Paths.GET_DECKS + `/${id}`

            const response = await fetch(path, {
                credentials: 'include'
            })

            const obj = await response.json()

            if (response.status !== 200) {
                throw obj
            }

            return obj
        } catch (e: any) {
            return rejectWithValue(e.message)
        }
    })