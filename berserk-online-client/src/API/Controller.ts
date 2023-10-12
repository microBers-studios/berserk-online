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
            body: JSON.stringify(obj)
        })

        const text = await response.text()

        return { code: response.status, text }
    }

    static async loginUser(obj: ILogin): Promise<IResponseCode> {
        const path = URL + Paths.LOGIN

        const response: Response = await fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(obj)
        })

        const text = await response.text()

        return { code: response.status, text }
    }


}