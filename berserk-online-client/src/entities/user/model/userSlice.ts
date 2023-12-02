import { createSlice, AnyAction, PayloadAction } from '@reduxjs/toolkit'
import { toast } from 'react-toastify'
import { APIStatus } from 'src/shared/lib'
import { fetchUser } from '../api/fetch-user'
import { logoutUser } from '../api/logout-user'
import { registrateUser } from '../api/registrate-user'
import { loginUser } from '../api/login-user'
import { updateUser } from '../api/update-user'
import { confirmUserEmail } from '../api/confirm-user-email'
import { loadAvatar } from '../api/load-avatar'
import { deleteAvatar } from '../api/delete-avatar'
import { sendConfirmEmail } from '../api/send-confirm-email'
import { requestPasswordChanging } from '../api/request-password-changing'
import { changePassword } from '../api/change-password'

interface IUserState {
    user: UserType
    fetchUserStatus: APIStatus
    logoutUserStatus: APIStatus
    loginUserStatus: APIStatus
    registrateUserStatus: APIStatus
    updateUserStatus: APIStatus
    confirmUserEmailStatus: APIStatus
    loadAvatarStatus: APIStatus
    deleteAvatarStatus: APIStatus
    sendConfirmEmailStatus: APIStatus
    requestPasswordChangingStatus: APIStatus
    changePasswordStatus: APIStatus
    isCookieModal: boolean
    isEmailConfirmed: boolean
}

const defaultUser = {
    id: 0,
    name: '',
    email: '',
    avatarUrl: '',
    password: '',
}

const initialState: IUserState = {
    user: defaultUser,
    fetchUserStatus: APIStatus.Idle,
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
    isEmailConfirmed: true,
}

export const userSlice = createSlice({
    name: 'user',
    initialState,
    reducers: {
        closeCookieModal: (state) => {
            state.isCookieModal = false
        },
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchUser.pending, (state) => {
                state.fetchUserStatus = APIStatus.Pending
            })
            .addCase(fetchUser.fulfilled, (state, action) => {
                state.fetchUserStatus = APIStatus.Fulfilled
                state.user = action.payload
            })
            .addCase(fetchUser.rejected, (state, action) => {
                state.fetchUserStatus = APIStatus.Rejected
                if (
                    action.payload &&
                    typeof action.payload !== 'string' &&
                    action.payload.code === 403
                ) {
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
                if (
                    action.payload &&
                    typeof action.payload !== 'string' &&
                    action.payload.code === 403
                ) {
                    state.isEmailConfirmed = false
                    state.user.email = action.payload?.email
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
                if (state.fetchUserStatus === APIStatus.Rejected)
                    state.fetchUserStatus = APIStatus.Fulfilled
                if (state.loginUserStatus === APIStatus.Rejected)
                    state.loginUserStatus = APIStatus.Fulfilled
                if (state.registrateUserStatus === APIStatus.Rejected)
                    state.registrateUserStatus = APIStatus.Fulfilled
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
            .addMatcher(
                isCookieError,
                (state, action: PayloadAction<string>) => {
                    state.isCookieModal = action.payload === 'Cookie Error'
                }
            )
    },
})

const isCookieError = (action: AnyAction) => {
    return action.type.endsWith('rejected')
}

export const { closeCookieModal } = userSlice.actions
