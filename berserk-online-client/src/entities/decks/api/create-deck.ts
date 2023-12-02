import { createAsyncThunk } from '@reduxjs/toolkit'
import { Paths, apiUrl } from 'src/shared/lib'

export const createDeck = createAsyncThunk<
    DeckType,
    DeckType,
    { rejectValue: string }
>('decks/createDeck', async function (deck, { rejectWithValue }) {
    try {
        const path = apiUrl + Paths.ADD_DECK

        const response = await fetch(path, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(deck),
        })

        if (response.status !== 200) {
            throw new Error('Create Deck Error')
        }

        return deck
    } catch (e) {
        const error = e as IError
        return rejectWithValue(error.message)
    }
})
