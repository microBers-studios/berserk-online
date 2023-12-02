import { createAsyncThunk } from '@reduxjs/toolkit'
import defaultAvatar from 'src/shared/assets/images/default-avatar.jpg'
import { apiUrl, Paths, checkCookie } from 'src/shared/lib'

export const fetchUser = createAsyncThunk<
    UserType,
    undefined,
    { rejectValue: { code: number; email: string } | string }
>('user/getUser', async function (_, { rejectWithValue }) {
    let code: number = 0
    let email: string = ''
    try {
        if (!checkCookie()) throw new Error('Cookie Error')
        const path = apiUrl + Paths.GET_ME

        const response: Response = await fetch(path, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            credentials: 'include',
        })

        const obj = await response.json()

        if (response.status !== 200) {
            code = response.status
            const errorObj = obj as ErrorType
            email = errorObj.context?.email as string

            throw obj
        }

        const userObj = obj as UserType
        userObj.avatarUrl = userObj.avatarUrl
            ? userObj.avatarUrl
            : defaultAvatar

        return userObj
    } catch (e) {
        const error = e as Error
        if (error.message === 'Cookie Error') {
            return rejectWithValue('Cookie Error')
        }
        return rejectWithValue({ code, email })
    }
})
