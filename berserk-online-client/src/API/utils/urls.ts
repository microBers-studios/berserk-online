export const URL = 'https://localhost:7283'

export enum Paths {
    REGISTRATION = '/Authentication/register',
    LOGIN = '/Authentication/login',
    GET_ME = '/User/getMe',
    LOAD_AVATAR = '/User/loadAvatar',
    UPDATE_ME = '/User/updateMe',
    LOGOUT = '/Authentication/logout',
    REQUEST_PASSWORD_CHANGING = '/Authentication/requestRecover',
    UPDATE_PASSWORD = '/Authentication/changePassword'
}