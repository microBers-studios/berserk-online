import { createAsyncThunk } from '@reduxjs/toolkit'
import defaultAvatar from 'src/shared/assets/images/default-avatar.jpg'
import { apiUrl, Paths, checkCookie } from 'src/shared/lib'

export const loginUser = createAsyncThunk<
    UserType,
    [
        Omit<UserType, 'id' | 'avatarUrl' | 'name'> & {
            rememberMe: boolean
        },
        () => void,
        (code: number, id: number) => void,
    ],
    { rejectValue: { code: number; email: string } | string }
>(
    'user/loginUser',
    async function (
        [userObject, fulfilledCallback, rejectedCallback],
        { rejectWithValue }
    ) {
        let code: number = 0
        let email: string = ''
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = apiUrl + Paths.LOGIN

            const response: Response = await fetch(path, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify(userObject),
            })

            const obj: UserType | ErrorType = await response.json()

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

            fulfilledCallback()
            return userObj
        } catch (e) {
            const error = e as IError
            rejectedCallback(code, error.id)
            if (error.message === 'Cookie Error') {
                return rejectWithValue('Cookie Error')
            }
            return rejectWithValue({ code, email })
        }
    }
)
