import { createAsyncThunk } from '@reduxjs/toolkit'
import defaultAvatar from 'src/shared/assets/images/default-avatar.jpg'
import { apiUrl, Paths, checkCookie } from 'src/shared/lib'

export const confirmUserEmail = createAsyncThunk<
    UserType,
    [string, () => void, () => void],
    { rejectValue: string }
>(
    'user/confirmUserEmail',
    async function (
        [token, fulfilledCallback, rejectedCallback],
        { rejectWithValue }
    ) {
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = apiUrl + Paths.CONFIRM_EMAIL + `?token=${token}`

            const response = await fetch(path, {
                method: 'POST',
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
            fulfilledCallback()
            return userObj
        } catch (e) {
            rejectedCallback()
            const error = e as IError
            return rejectWithValue(error.message)
        }
    }
)
