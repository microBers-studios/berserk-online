import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiUrl, Paths, checkCookie } from 'src/shared/lib'

export const sendConfirmEmail = createAsyncThunk<
    void,
    undefined,
    { rejectValue: string }
>('user/sendConfirmEmail', async function (_, { rejectWithValue }) {
    try {
        if (!checkCookie()) throw new Error('Cookie Error')
        const path = apiUrl + Paths.CONFIRM_EMAIL_LETTER
        const response = await fetch(path, {
            credentials: 'include',
        })

        if (response.status !== 200) {
            throw new Error('Error')
        }
    } catch (e) {
        const error = e as IError
        return rejectWithValue(error.message)
    }
})
