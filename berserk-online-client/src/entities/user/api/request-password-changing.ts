import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiUrl, Paths, checkCookie } from 'src/shared/lib'

export const requestPasswordChanging = createAsyncThunk<
    void,
    string,
    { rejectValue: string }
>(
    'user/requestPasswordChanging',
    async function (email: string, { rejectWithValue }) {
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = apiUrl + Paths.REQUEST_PASSWORD_CHANGING

            const response = await fetch(path, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email: email }),
            })

            if (response.status !== 200) {
                throw new Error('Password Changing Error')
            }
        } catch (e) {
            const error = e as IError
            return rejectWithValue(error.message)
        }
    }
)
