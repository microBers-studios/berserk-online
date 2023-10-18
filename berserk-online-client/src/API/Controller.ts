import { IUser } from "src/app/providers/UserProvider/lib/types/types";
import { IRegistration, ILogin, IResponseInfo } from "./utils/types";
import { URL, Paths } from "./utils/urls";
import defaultAvatar from "src/shared/assets/images/default-avatar.jpg"

export default class APIController {
    static async registrateUser(obj: IRegistration): Promise<IResponseInfo> {
        const path = URL + Paths.REGISTRATION

        const response: Response = await fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            credentials: "include",
            body: JSON.stringify(obj)
        })

        const user = await response.json().catch(console.error)

        return { code: response.status, obj: user }
    }

    static async loginUser(object: ILogin): Promise<IResponseInfo> {
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

        const obj = await response.json().catch(console.error)

        return { code: response.status, obj }
    }

    static async getMe(): Promise<IResponseInfo> {
        const path = URL + Paths.GET_ME

        const response: Response = await fetch(path, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            credentials: 'include'
        })

        const obj = await response.json().catch(console.error)

        obj.avatarUrl = obj.avatarUrl
            ? obj.avatarUrl
            : defaultAvatar

        return { code: response.status, obj }
    }

    static async loadAvatar(input: HTMLInputElement): Promise<IResponseInfo> {
        const path = URL + Paths.LOAD_AVATAR

        const formData = new FormData()
        const files = input.files as FileList;

        formData.append('avatar', files[0])

        const response = await fetch(path, {
            method: 'POST',
            body: formData,
            credentials: 'include',
        })

        const obj = await response.json().catch(console.error)

        return obj
    }

    static async updateUser(user: Partial<IUser>): Promise<IResponseInfo> {
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

        return { code: response.status, obj }
    }

}