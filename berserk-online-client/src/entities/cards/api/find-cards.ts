import { createAsyncThunk } from '@reduxjs/toolkit'
import { Paths, apiUrl } from 'src/shared/lib'

export const findCards = createAsyncThunk<
    { cards: CardType[] },
    { query: string; limit?: number },
    { rejectValue: string }
>(
    'cards/findCards',
    async function ({ query, limit = 10 }, { rejectWithValue }) {
        try {
            const path =
                apiUrl + Paths.FIND_CARDS + `?query=${query}&limit=${limit}`

            const response = await fetch(path, {
                credentials: 'include',
            })

            if (!response.ok) {
                throw new Error('Finding cards error')
            }

            const arr = await response.json()

            return { cards: arr }
        } catch (e) {
            const error = e as IError
            return rejectWithValue(error.message)
        }
    }
)
