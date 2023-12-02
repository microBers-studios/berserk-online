import { createAsyncThunk } from '@reduxjs/toolkit'
import defaultAvatar from 'src/shared/assets/images/default-avatar.jpg'
import { apiUrl, Paths, checkCookie } from 'src/shared/lib'

export const loadAvatar = createAsyncThunk<
    UserType,
    HTMLInputElement,
    { rejectValue: string }
>('user/loadAvatar', async function (input, { rejectWithValue }) {
    try {
        if (!checkCookie()) throw new Error('Cookie Error')
        const path = apiUrl + Paths.LOAD_AVATAR

        const formData = new FormData()
        const files = input.files as FileList

        formData.append('avatar', files[0])

        const response = await fetch(path, {
            method: 'POST',
            body: formData,
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
