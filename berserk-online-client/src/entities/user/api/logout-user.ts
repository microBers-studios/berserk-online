import { createAsyncThunk } from '@reduxjs/toolkit'
import { apiUrl, Paths, checkCookie } from 'src/shared/lib'

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async function () {
        if (!checkCookie()) throw new Error('Cookie Error')
        const path = apiUrl + Paths.LOGOUT

        const response = await fetch(path, {
            credentials: 'include',
        })

        return response.status
    }
)
