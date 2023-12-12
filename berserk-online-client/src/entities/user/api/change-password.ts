import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiUrl, Paths, checkCookie } from 'src/shared/lib'

export const changePassword = createAsyncThunk<
    void,
    { token: string; password: string; fulfilledCallback: () => void },
    { rejectValue: string }
>(
    'user/changePassword',
    async function (
        { token, password, fulfilledCallback },
        { rejectWithValue }
    ) {
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = apiUrl + Paths.UPDATE_PASSWORD

            const response = await fetch(path, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    token,
                    password,
                }),
            })

            if (response.status !== 200) {
                throw new Error('Password Changing Error')
            }

            fulfilledCallback()
        } catch (e) {
            const error = e as IError
            return rejectWithValue(error.message)
        }
    }
)
