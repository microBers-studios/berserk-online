import { createAsyncThunk } from '@reduxjs/toolkit'
import defaultAvatar from 'src/shared/assets/images/default-avatar.jpg'
import { apiUrl, Paths, checkCookie } from 'src/shared/lib'

export const updateUser = createAsyncThunk<
    UserType,
    [Partial<UserType>, () => void, (code: number) => void],
    {
        rejectValue: {
            code: number
            rejectedCallback: (code: number) => void
        }
    }
>(
    'user/updateUser',
    async function (
        [userObject, fulfilledCallback, rejectedCallback],
        { rejectWithValue }
    ) {
        let code: number = 0
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = apiUrl + Paths.UPDATE_ME

            const response = await fetch(path, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userObject),
            })

            const obj = await response.json()

            if (response.status !== 200) {
                code = response.status
                throw new Error(obj.message)
            }

            const userObj = obj as UserType

            userObj.avatarUrl = userObj.avatarUrl
                ? userObj.avatarUrl
                : defaultAvatar

            fulfilledCallback()
            return userObj
        } catch (e) {
            return rejectWithValue({ code, rejectedCallback })
        }
    }
)
