import { createStatusObjectSelector } from "../../utils/const"

export const getUserStatusSelector = createStatusObjectSelector(state => state.user.getUserStatus)
export const logoutUserStatusSelector = createStatusObjectSelector(state => state.user.logoutUserStatus)
export const loginUserStatusSelector = createStatusObjectSelector(state => state.user.loginUserStatus)
export const registrateUserStatusSelector = createStatusObjectSelector(state => state.user.registrateUserStatus)
export const updateUserStatusSelector = createStatusObjectSelector(state => state.user.updateUserStatus)
export const confirmUserEmailStatusSelector = createStatusObjectSelector(state => state.user.confirmUserEmailStatus)
export const loadAvatarStatusSelector = createStatusObjectSelector(state => state.user.loadAvatarStatus)
export const deleteAvatarStatusSelector = createStatusObjectSelector(state => state.user.deleteAvatarStatus)
export const sendConfirmEmailStatusSelector = createStatusObjectSelector(state => state.user.sendConfirmEmailStatus)
export const requestPasswordChangingStatusSelector = createStatusObjectSelector(state => state.user.requestPasswordChangingStatus)
export const changePasswordStatusSelector = createStatusObjectSelector(state => state.user.changePasswordStatus)