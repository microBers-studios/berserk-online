import { createAsyncThunk } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { RootState } from 'src/app/store'
import { Paths, apiUrl } from 'src/shared/lib'

export const updateDeck = createAsyncThunk<
    undefined,
    DeckType,
    { rejectValue: string }
>('decks/updateDeck', async function (_, { rejectWithValue, getState }) {
    try {
        const state = getState() as RootState
        const path = apiUrl + Paths.UPDATE_DECK

        if (!state.decks.currentDeck) {
            throw new Error('Deck Updating Error')
        }

        const response = await fetch(path, {
            method: 'PUT',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(state.decks.currentDeck),
        })

        if (response.status !== 200) {
            throw new Error('Deck Updating Error')
        }

        toast('Изменения сохранены')
    } catch (e) {
        const error = e as IError
        return rejectWithValue(error.message)
    }
})
