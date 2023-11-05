import { IUser } from "src/app/providers/UserProvider/lib/types/types";
import { IRegistration, ILogin, IResponseUserInfo, IResponseDecksInfo, DecksArray, IResponseDeckInfo, ICard, IDeck } from "./utils/types";
import { URL, Paths } from "./utils/urls";
import defaultAvatar from "src/shared/assets/images/default-avatar.jpg"
import { decksObj } from "./utils/mock";

export default class APIController {
    static async registrateUser(userObject: IRegistration): Promise<IResponseUserInfo> {
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

        obj.avatarUrl = obj.avatarUrl
            ? obj.avatarUrl
            : defaultAvatar

        return { code: response.status, obj }
    }

    static async loginUser(object: ILogin): Promise<IResponseUserInfo> {
        const path = URL + Paths.LOGIN

        const response: Response = await fetch(path, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(object),
        })

        const obj = await response.json()

        obj.avatarUrl = obj.avatarUrl
            ? obj.avatarUrl
            : defaultAvatar

        return { code: response.status, obj }
    }

    static async getMe(): Promise<IResponseUserInfo> {
        const path = URL + Paths.GET_ME

        const response: Response = await fetch(path, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            credentials: 'include'
        })


        if (response.status === 401) {
            return {
                code: response.status,
                obj: {
                    id: -1,
                    message: 'User unauthorized'
                }
            }
        }

        const obj = await response.json()

        obj.avatarUrl = obj.avatarUrl
            ? obj.avatarUrl
            : defaultAvatar

        return { code: response.status, obj }
    }

    static async loadAvatar(input: HTMLInputElement): Promise<IResponseUserInfo> {
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

        // if (response.status === 200) {
        //     obj.avatarUrl = 'https://images.unsplash.com/photo-1472214103451-9374bd1c798e?auto=format&fit=crop&q=80&w=1000&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8cGljfGVufDB8fDB8fHww'
        // }

        return { code: response.status, obj }
    }

    static async updateUser(user: Partial<IUser>): Promise<IResponseUserInfo> {
        const path = URL + Paths.UPDATE_ME

        const response = await fetch(path, {
            method: 'PATCH',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(user)
        })

        const obj = await response.json()
        obj.avatarUrl = obj.avatarUrl
            ? obj.avatarUrl
            : defaultAvatar


        return { code: response.status, obj }
    }

    static async logout(): Promise<void> {
        const path = URL + Paths.LOGOUT

        await fetch(path, {
            credentials: 'include'
        })
    }

    static async requestPasswordChanging(email: string): Promise<number> {
        const path = URL + Paths.REQUEST_PASSWORD_CHANGING

        const response = await fetch(path, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email: email })
        })

        return response.status
    }

    static async changePassword(token: string, password: string): Promise<number> {

        const path = URL + Paths.UPDATE_PASSWORD

        const response = await fetch(path, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ token, password })
        })

        return response.status
    }

    static async sendConfirmEmail(): Promise<number> {
        const path = URL + Paths.CONFIRM_EMAIL_LETTER;

        const response = await fetch(path, {
            credentials: 'include',
        })

        return response.status
    }

    static async confirmEmail(token: string): Promise<IResponseUserInfo> {
        const path = URL + Paths.CONFIRM_EMAIL + `?token=${token}`

        const response = await fetch(path, {
            method: 'POST',
            credentials: 'include'
        })

        const obj = await response.json()

        obj.avatarUrl = obj.avatarUrl
            ? obj.avatarUrl
            : defaultAvatar

        return { code: response.status, obj }
    }

    static async deleteAvatar(): Promise<IResponseUserInfo> {
        const path = URL + Paths.DELETE_AVATAR

        const response = await fetch(path, {
            method: 'DELETE',
            credentials: 'include'
        })

        const obj = await response.json()

        obj.avatarUrl = obj.avatarUrl
            ? obj.avatarUrl
            : defaultAvatar

        return { code: response.status, obj }
    }

    static async findCards(query: string, limit = 15): Promise<ICard[]> {
        const path = URL + Paths.FIND_CARDS + `?query=${query}&limit=${limit}`

        const response = await fetch(path)

        const arr = await response.json()

        return arr
    }

    static async getDecks(): Promise<DecksArray> {
        return new Promise(res => {
            setTimeout(() => res(decksObj.decks), 1000)
        })
    }

    static async createDeck(deck: IDeck): Promise<number> {
        return new Promise(res => {
            setTimeout(() => {
                decksObj.decks.push(deck)
                res(1)
            }, 300)
        })
    }

    static async deleteDeck(id: string): Promise<IResponseDecksInfo> {
        return new Promise(res => {
            setTimeout(() => {
                decksObj.decks = decksObj.decks.filter(d => d.id !== id)
                res({ code: 200, obj: decksObj.decks })
            }, 300)
        })
    }

    static async getDeck(id: string): Promise<IResponseDeckInfo> {
        return new Promise(res => {
            setTimeout(() => {
                const deck = decksObj.decks.find(d => d.id === id)

                const code = deck === undefined
                    ? 404
                    : 200;

                const obj = deck === undefined
                    ? {
                        id: 0,
                        message: 'error'
                    }
                    : deck;

                res({ code, obj })
            }, 1000)
        })
    }
}