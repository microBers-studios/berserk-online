export const URL = 'https://localhost:7283'

export enum Paths {
    REGISTRATION = '/Authentication/register',
    LOGIN = '/Authentication/login',
    LOGOUT = '/Authentication/logout',
    REQUEST_PASSWORD_CHANGING = '/Authentication/requestRecover',
    UPDATE_PASSWORD = '/Authentication/changePassword',
    CONFIRM_EMAIL_LETTER = '/Authentication/confirmationRequest',
    CONFIRM_EMAIL = '/Authentication/confirmEmail',
    GET_ME = '/User/getMe',
    LOAD_AVATAR = '/User/loadAvatar',
    DELETE_AVATAR = '/User/deleteAvatar',
    UPDATE_ME = '/User/updateMe',
    FIND_CARDS = '/CardBase/find',
    GET_DECKS = '/Deck/getMe',
    GET_DECK = '/Deck/getMe',
    ADD_DECK = '/Deck/add',
    DELETE_DECK = '/Deck/delete',
    UPDATE_DECK = '/Deck/update',
}