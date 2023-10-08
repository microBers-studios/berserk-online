import { URL, Paths } from "./utils/urls";

export default class APIController {
    static async registrateUser(obj: IRegistration): Promise<number> {
        const path = URL + Paths.REGISTRATION
        console.log(path)
        const response: Response = await fetch(path, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Access-Control-Allow-Origin': '*'
            },
            body: JSON.stringify(obj)
        })

        return response.status
    }


}