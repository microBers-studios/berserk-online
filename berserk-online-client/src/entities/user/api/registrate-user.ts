import { createAsyncThunk } from '@reduxjs/toolkit'
import defaultAvatar from 'src/shared/assets/images/default-avatar.jpg'
import { apiUrl, Paths, checkCookie } from 'src/shared/lib'

export const registrateUser = createAsyncThunk<
    UserType,
    [Omit<UserType, 'id' | 'avatarUrl'>, () => void],
    { rejectValue: string }
>(
    'user/registrateUser',
    async function ([userObject, fulfilledCallback], { rejectWithValue }) {
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = apiUrl + Paths.REGISTRATION

            const response: Response = await fetch(path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                credentials: 'include',
                body: JSON.stringify(userObject),
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
            const error = e as IError
            return rejectWithValue(error.message)
        }
    }
)
