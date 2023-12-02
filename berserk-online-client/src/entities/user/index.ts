export { userSlice } from './model/userSlice'
export { closeCookieModal } from './model/userSlice'

export {
    fetchUserStatusSelector,
    loginUserStatusSelector,
    registrateUserStatusSelector,
    logoutUserStatusSelector,
    updateUserStatusSelector,
    sendConfirmEmailStatusSelector,
    confirmUserEmailStatusSelector,
    loadAvatarStatusSelector,
    deleteAvatarStatusSelector,
    requestPasswordChangingStatusSelector,
    changePasswordStatusSelector,
    isEmailConfirmedSelector,
} from './model/selectors'

export { fetchUser } from './api/fetch-user'
export { loginUser } from './api/login-user'
export { registrateUser } from './api/registrate-user'
export { logoutUser } from './api/logout-user'
export { updateUser } from './api/update-user'
export { sendConfirmEmail } from './api/send-confirm-email'
export { confirmUserEmail } from './api/confirm-user-email'
export { loadAvatar } from './api/load-avatar'
export { deleteAvatar } from './api/delete-avatar'
export { requestPasswordChanging } from './api/request-password-changing'
export { changePassword } from './api/change-password'
