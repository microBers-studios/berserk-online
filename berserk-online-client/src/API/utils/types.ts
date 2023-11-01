import { IUser } from "src/app/providers/UserProvider/lib/types/types";
import { Elements } from "src/API/utils/data";

export interface IRegistration {
    name: string;
    email: string;
    password: string;
}

export interface ILogin {
    email: string;
    password: string;
    rememberMe: boolean;
}

export interface IResponseUserInfo {
    code: number;
    obj: IUser | IError;
}

export interface IResponseDecksInfo {
    code: number;
    obj: IError | DecksArray;
}

export interface IError {
    id: number;
    message: string;
}

export type DecksArray = IDeck[]

export interface IDeck {
    id: number;
    name: string;
    elements: Elements[];
    cards: ICard[]
}

export interface ICard {
    name: string;
    image: string;
}