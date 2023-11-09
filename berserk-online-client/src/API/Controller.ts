import { ICard } from "./utils/types";
import { URL, Paths } from "./utils/urls";

export default class APIController {
    static async findCards(query: string, limit = 15): Promise<ICard[]> {
        const path = URL + Paths.FIND_CARDS + `?query=${query}&limit=${limit}`

        const response = await fetch(path, {
            credentials: 'include'
        })

        const arr = await response.json()

        return arr
    }
}