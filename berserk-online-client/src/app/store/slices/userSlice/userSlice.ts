import { createSlice, createAsyncThunk, AnyAction, PayloadAction } from "@reduxjs/toolkit"
import defaultAvatar from "src/shared/assets/images/default-avatar.jpg"
import { IError } from "src/app/store/utils/types";
import { Paths, URL } from "src/app/store/utils/urls";
import { IUser } from "src/app/store/utils/types";
import { toast } from 'react-toastify';
import { APIStatus } from "../../utils/const";

interface IUserState {
    user: IUser;
    getUserStatus: APIStatus;
    logoutUserStatus: APIStatus;
    loginUserStatus: APIStatus;
    registrateUserStatus: APIStatus;
    updateUserStatus: APIStatus;
    confirmUserEmailStatus: APIStatus;
    loadAvatarStatus: APIStatus;
    deleteAvatarStatus: APIStatus;
    sendConfirmEmailStatus: APIStatus;
    requestPasswordChangingStatus: APIStatus;
    changePasswordStatus: APIStatus;
    isCookieModal: boolean;
    isEmailConfirmed: boolean;
}

const defaultUser = {
    id: 0,
    name: '',
    email: '',
    avatarUrl: '',
    password: ''
}

const initialState: IUserState = {
    user: defaultUser,
    getUserStatus: APIStatus.Idle,
    logoutUserStatus: APIStatus.Idle,
    loginUserStatus: APIStatus.Idle,
    registrateUserStatus: APIStatus.Idle,
    updateUserStatus: APIStatus.Idle,
    confirmUserEmailStatus: APIStatus.Idle,
    loadAvatarStatus: APIStatus.Idle,
    deleteAvatarStatus: APIStatus.Idle,
    sendConfirmEmailStatus: APIStatus.Idle,
    requestPasswordChangingStatus: APIStatus.Idle,
    changePasswordStatus: APIStatus.Idle,
    isCookieModal: false,
    isEmailConfirmed: true
}

export const getUser = createAsyncThunk<IUser, undefined, { rejectValue: { code: number, email: string } }>(
    'user/getUser',
    async function (_, { rejectWithValue }) {
        let code: number = 0;
        let email: string = '';
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = URL + Paths.GET_ME

            const response: Response = await fetch(path, {
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                credentials: 'include'
            })


            const obj = await response.json()

            if (response.status !== 200) {
                code = response.status
                const errorObj = obj as IError
                email = errorObj.context?.email as string

                throw obj
            }

            const userObj = obj as IUser
            userObj.avatarUrl = userObj.avatarUrl
                ? userObj.avatarUrl
                : defaultAvatar

            return userObj
        } catch (e: any) {
            return rejectWithValue({ code, email })
        }
    })

export const logoutUser = createAsyncThunk(
    'user/logoutUser',
    async function () {
        if (!checkCookie()) throw new Error('Cookie Error')
        const path = URL + Paths.LOGOUT

        const response = await fetch(path, {
            credentials: 'include'
        })

        return response.status
    })

export const loginUser = createAsyncThunk<
    IUser,
    [
        Omit<IUser, 'id' | 'avatarUrl' | 'name'> & { rememberMe: boolean },
        () => void,
        (code: number, id: number) => void
    ],
    { rejectValue: { code: number, email: string } }
>(
    'user/loginUser',
    async function ([userObject, fulfilledCallback, rejectedCallback], { rejectWithValue }) {
        let code: number = 0;
        let email: string = '';
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = URL + Paths.LOGIN

            const response: Response = await fetch(path, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                body: JSON.stringify(userObject),
            })

            const obj: IUser | IError = await response.json()

            if (response.status !== 200) {
                code = response.status
                const errorObj = obj as IError
                email = errorObj.context?.email as string

                throw obj
            }

            const userObj = obj as IUser
            userObj.avatarUrl = userObj.avatarUrl
                ? userObj.avatarUrl
                : defaultAvatar

            fulfilledCallback()
            return userObj
        } catch (e: any) {
            rejectedCallback(code, e.id)
            return rejectWithValue({ code, email })
        }
    })

export const registrateUser = createAsyncThunk<IUser, [Omit<IUser, 'id' | 'avatarUrl'>, () => void], { rejectValue: string }>(
    'user/registrateUser',
    async function ([userObject, fulfilledCallback], { rejectWithValue }) {
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = URL + Paths.REGISTRATION

            const response: Response = await fetch(path, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                },
                credentials: "include",
                body: JSON.stringify(userObject)
            })


            const obj = await response.json()

            if (response.status !== 200) {
                throw new Error(obj.message)
            }

            const userObj = obj as IUser

            userObj.avatarUrl = userObj.avatarUrl
                ? userObj.avatarUrl
                : defaultAvatar

            fulfilledCallback()

            return userObj
        } catch (e: any) {
            return rejectWithValue(e.message)
        }
    })

export const updateUser = createAsyncThunk<IUser, [Partial<IUser>, () => void, (code: number) => void], { rejectValue: { code: number; rejectedCallback: (code: number) => void } }>(
    'user/updateUser',
    async function ([userObject, fulfilledCallback, rejectedCallback], { rejectWithValue }) {
        let code: number = 0;
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = URL + Paths.UPDATE_ME

            const response = await fetch(path, {
                method: 'PATCH',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(userObject)
            })

            const obj = await response.json()

            if (response.status !== 200) {
                code = response.status
                throw new Error(obj.message)
            }

            const userObj = obj as IUser

            userObj.avatarUrl = userObj.avatarUrl
                ? userObj.avatarUrl
                : defaultAvatar

            fulfilledCallback()
            return userObj
        } catch (e: any) {
            return rejectWithValue({ code, rejectedCallback })
        }
    })

export const loadAvatar = createAsyncThunk<IUser, HTMLInputElement, { rejectValue: string }>(
    'user/loadAvatar',
    async function (input, { rejectWithValue }) {
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = URL + Paths.LOAD_AVATAR

            const formData = new FormData()
            const files = input.files as FileList;

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

            const userObj = obj as IUser

            userObj.avatarUrl = userObj.avatarUrl
                ? userObj.avatarUrl
                : defaultAvatar

            return userObj
        } catch (e: any) {
            return rejectWithValue(e.message)
        }
    })

export const deleteAvatar = createAsyncThunk<IUser, undefined, { rejectValue: string }>(
    'user/deleteAvatar',
    async function (_, { rejectWithValue }) {
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = URL + Paths.DELETE_AVATAR

            const response = await fetch(path, {
                method: 'DELETE',
                credentials: 'include'
            })

            const obj = await response.json()

            if (response.status !== 200) {
                throw new Error(obj.message)
            }

            const userObj = obj as IUser

            userObj.avatarUrl = userObj.avatarUrl
                ? userObj.avatarUrl
                : defaultAvatar

            return userObj

        } catch (e: any) {
            return rejectWithValue(e.message)
        }
    })

export const confirmUserEmail = createAsyncThunk<IUser, [string, () => void, () => void], { rejectValue: string }>(
    'user/confirmUserEmail',
    async function ([token, fulfilledCallback, rejectedCallback], { rejectWithValue }) {
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = URL + Paths.CONFIRM_EMAIL + `?token=${token}`

            const response = await fetch(path, {
                method: 'POST',
                credentials: 'include'
            })

            const obj = await response.json()

            if (response.status !== 200) {
                throw new Error(obj.message)
            }

            const userObj = obj as IUser

            userObj.avatarUrl = userObj.avatarUrl
                ? userObj.avatarUrl
                : defaultAvatar
            fulfilledCallback()
            return userObj
        } catch (e: any) {
            rejectedCallback()
            return rejectWithValue(e.message)
        }
    })

export const sendConfirmEmail = createAsyncThunk<void, undefined, { rejectValue: string }>(
    'user/sendConfirmEmail',
    async function (_, { rejectWithValue }) {
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = URL + Paths.CONFIRM_EMAIL_LETTER;
            const response = await fetch(path, {
                credentials: 'include'
            })

            if (response.status !== 200) {
                throw new Error('Error')
            }
        } catch (e: any) {
            return rejectWithValue(e.message)
        }
    })

export const requestPasswordChanging = createAsyncThunk<void, string, { rejectValue: string }>(
    'user/requestPasswordChanging',
    async function (email: string, { rejectWithValue }) {
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = URL + Paths.REQUEST_PASSWORD_CHANGING

            const response = await fetch(path, {
                method: 'POST',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: email })
            })

            if (response.status !== 200) {
                throw new Error('Password Changing Error')
            }

        } catch (e: any) {
            rejectWithValue(e.message)
        }
    }
)

export const changePassword = createAsyncThunk<void, { token: string; password: string, fulfilledCallback: () => void }, { rejectValue: string }>(
    'user/changePassword',
    async function ({ token, password, fulfilledCallback }, { rejectWithValue }) {
        try {
            if (!checkCookie()) throw new Error('Cookie Error')
            const path = URL + Paths.UPDATE_PASSWORD

            const response = await fetch(path, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ token, password })
            })

            if (response.status !== 200) {
                throw new Error('Password Changing Error')
            }

            fulfilledCallback()
        } catch (e: any) {
            return rejectWithValue(e.message)
        }

    }
)

const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        closeCookieModal: (state) => {
            state.isCookieModal = false
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(getUser.pending, (state) => {
                state.getUserStatus = APIStatus.Pending
            })
            .addCase(getUser.fulfilled, (state, action) => {
                state.getUserStatus = APIStatus.Fulfilled
                state.user = action.payload
            })
            .addCase(getUser.rejected, (state, action) => {
                state.getUserStatus = APIStatus.Rejected
                if (action.payload && action.payload.code === 403) {
                    state.isEmailConfirmed = false
                    state.user.email = action.payload.email
                }
            })
            .addCase(logoutUser.pending, (state) => {
                state.logoutUserStatus = APIStatus.Pending
            })
            .addCase(logoutUser.fulfilled, (state) => {
                state.logoutUserStatus = APIStatus.Fulfilled
                state.user = defaultUser
            })
            .addCase(registrateUser.pending, (state) => {
                state.logoutUserStatus = APIStatus.Pending
            })
            .addCase(registrateUser.fulfilled, (state, action) => {
                state.logoutUserStatus = APIStatus.Fulfilled
                state.user = action.payload
            })
            .addCase(registrateUser.rejected, (state) => {
                state.registrateUserStatus = APIStatus.Rejected
            })
            .addCase(loginUser.pending, (state) => {
                state.loginUserStatus = APIStatus.Pending
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.loginUserStatus = APIStatus.Fulfilled
                state.user = action.payload
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.loginUserStatus = APIStatus.Rejected
                if (action.payload && action.payload.code === 403) {
                    state.isEmailConfirmed = false
                    state.user.email = action.payload.email
                }
            })
            .addCase(updateUser.pending, (state) => {
                state.updateUserStatus = APIStatus.Pending
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.updateUserStatus = APIStatus.Fulfilled
                state.user = action.payload
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.updateUserStatus = APIStatus.Rejected

                if (!action.payload) return
                const { code, rejectedCallback } = action.payload
                rejectedCallback(code)
            })
            .addCase(confirmUserEmail.pending, (state) => {
                state.confirmUserEmailStatus = APIStatus.Pending
            })
            .addCase(confirmUserEmail.fulfilled, (state, action) => {
                state.confirmUserEmailStatus = APIStatus.Fulfilled
                state.user = action.payload
                state.isEmailConfirmed = true
                if (state.getUserStatus === APIStatus.Rejected) state.getUserStatus = APIStatus.Fulfilled
                if (state.loginUserStatus === APIStatus.Rejected) state.loginUserStatus = APIStatus.Fulfilled
                if (state.registrateUserStatus === APIStatus.Rejected) state.registrateUserStatus = APIStatus.Fulfilled
            })
            .addCase(confirmUserEmail.rejected, (state) => {
                state.confirmUserEmailStatus = APIStatus.Rejected
            })
            .addCase(loadAvatar.pending, (state) => {
                state.loadAvatarStatus = APIStatus.Pending
            })
            .addCase(loadAvatar.fulfilled, (state, action) => {
                state.loadAvatarStatus = APIStatus.Fulfilled
                state.user = action.payload
            })
            .addCase(loadAvatar.rejected, (state, action) => {
                state.loadAvatarStatus = APIStatus.Rejected
                toast(action.payload)
            })
            .addCase(deleteAvatar.pending, (state) => {
                state.deleteAvatarStatus = APIStatus.Pending
            })
            .addCase(deleteAvatar.fulfilled, (state, action) => {
                state.deleteAvatarStatus = APIStatus.Fulfilled
                state.user = action.payload
            })
            .addCase(deleteAvatar.rejected, (state, action) => {
                state.deleteAvatarStatus = APIStatus.Rejected
                toast(action.payload)
            })
            .addCase(sendConfirmEmail.pending, (state) => {
                state.sendConfirmEmailStatus = APIStatus.Pending
            })
            .addCase(sendConfirmEmail.fulfilled, (state) => {
                state.sendConfirmEmailStatus = APIStatus.Fulfilled
            })
            .addCase(sendConfirmEmail.rejected, (state, action) => {
                state.sendConfirmEmailStatus = APIStatus.Rejected
                toast(action.payload)
            })
            .addCase(requestPasswordChanging.pending, (state) => {
                state.requestPasswordChangingStatus = APIStatus.Pending
            })
            .addCase(requestPasswordChanging.fulfilled, (state) => {
                state.requestPasswordChangingStatus = APIStatus.Fulfilled
            })
            .addCase(requestPasswordChanging.rejected, (state, action) => {
                state.requestPasswordChangingStatus = APIStatus.Rejected
                toast(action.payload)
            })
            .addCase(changePassword.pending, (state) => {
                state.changePasswordStatus = APIStatus.Pending
            })
            .addCase(changePassword.fulfilled, (state) => {
                state.changePasswordStatus = APIStatus.Fulfilled
            })
            .addCase(changePassword.rejected, (state, action) => {
                state.changePasswordStatus = APIStatus.Rejected
                toast(action.payload)
            })
            .addMatcher(isCookieError, (state, action: PayloadAction<string>) => {
                state.isCookieModal = action.payload === 'Cookie Error'
            })
    }
})

const checkCookie = () => localStorage.getItem('cookie')

const isCookieError = (action: AnyAction) => {
    return action.type.endsWith('rejected')
}

export const { closeCookieModal } = userSlice.actions
export default userSlice
