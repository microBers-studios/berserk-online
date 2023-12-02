import { createAsyncThunk } from '@reduxjs/toolkit'
import { Paths, apiUrl } from 'src/shared/lib'

export const deleteDeck = createAsyncThunk<
    DeckType[],
    string,
    { rejectValue: string }
>('decks/deleteDeck', async function (id, { rejectWithValue }) {
    try {
        const path = apiUrl + Paths.DELETE_DECK + `?id=${id}`

        const response = await fetch(path, {
            method: 'DELETE',
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
