import { createAsyncThunk } from '@reduxjs/toolkit'
import defaultAvatar from 'src/shared/assets/images/default-avatar.jpg'
import { apiUrl, Paths, checkCookie } from 'src/shared/lib'

export const deleteAvatar = createAsyncThunk<
    UserType,
    undefined,
    { rejectValue: string }
>('user/deleteAvatar', async function (_, { rejectWithValue }) {
    try {
        if (!checkCookie()) throw new Error('Cookie Error')
        const path = apiUrl + Paths.DELETE_AVATAR

        const response = await fetch(path, {
            method: 'DELETE',
            credentials: 'include',
        })

        const obj = await response.json()

        if (response.status !== 200) {
            throw new Error(obj.message)
        }

        const userObj = obj as UserType

        userObj.avatarUrl = userObj.avatarUrl
            ? userObj.avatarUrl
            : defaultAvatar

        return userObj
    } catch (e) {
        const error = e as IError
        return rejectWithValue(error.message)
    }
})
