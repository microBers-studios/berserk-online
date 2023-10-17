import { IUser } from "src/app/providers/UserProvider/lib/types/types";
import { IRegistration, ILogin, IResponseCode } from "./utils/types";
import { URL, Paths } from "./utils/urls";

export default class APIController {
    static async registrateUser(obj: IRegistration): Promise<IResponseCode> {
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

        const text = await response.text()

        return { code: response.status, text }
    }

    static async loginUser(obj: ILogin): Promise<IResponseCode> {
        const path = URL + Paths.LOGIN

        const response: Response = await fetch(path, {
            method: 'POST',
            credentials: 'include',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
            body: JSON.stringify(obj),
        })

        const text = await response.text()

        return { code: response.status, text }
    }

    static async getMe(): Promise<{ code: number, user: IUser }> {
        const path = URL + Paths.GET_ME

        const response: Response = await fetch(path, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            credentials: 'include'
        })

        const obj = await response.json()

        return { code: response.status, user: obj }
    }

    static async loadAvatar(input: HTMLInputElement): Promise<string> {
        const path = URL + Paths.LOAD_AVATAR

        const formData = new FormData()
        const files = input.files as FileList;
        formData.append('avatar', files[0])

        // const headers = new Headers()
        // headers.append('Cookie', document.cookie)

        const response = await fetch(path, {
            method: 'POST',
            body: JSON.stringify(formData),
            // headers
            credentials: 'include',
            headers: {
                "Content-Type": "application/json",
            }
        })

        console.log(response.statusText)

        // console.log(await response.json())

        return ''
    }

}