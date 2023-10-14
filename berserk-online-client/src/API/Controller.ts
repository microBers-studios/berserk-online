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
        console.log(response.headers.get('Set-Cookie'))

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
        const cookie = response.headers.getSetCookie()

        console.log(cookie)

        return { code: response.status, text }
    }

    static async getMe(): Promise<any> {
        const path = URL + Paths.GET_ME

        const response: Response = await fetch(path, {
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            }
        })

        const obj = await response.json()

        console.log(obj)
    }

}