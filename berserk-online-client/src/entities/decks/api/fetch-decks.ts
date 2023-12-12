import { createAsyncThunk } from '@reduxjs/toolkit'
import { Paths, apiUrl } from 'src/shared/lib'

export const fetchDecks = createAsyncThunk<
    DeckType[],
    undefined,
    { rejectValue: string }
>('decks/getDecks', async function (_, { rejectWithValue }) {
    try {
        const path = apiUrl + Paths.GET_DECKS

        const response = await fetch(path, {
            credentials: 'include',
        })

        const obj = await response.json()

        if (response.status !== 200) {
            throw obj
        }

        return obj
    } catch (e) {
        const error = e as IError
        return rejectWithValue(error.message)
    }
})
