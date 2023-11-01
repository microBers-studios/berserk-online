import { IUser } from "src/app/providers/UserProvider/lib/types/types";
import { CardTypes, Elements, Rarities, Sets } from "src/API/utils/data";

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

export interface IResponseDeckInfo {
    code: number;
    obj: IError | IDeck;
}

export interface IError {
    id: number;
    message: string;
}

export interface ICard {
    id: number;
    name: string;
    price: number;
    elite: boolean;
    unique: boolean;
    elements: [Elements];
    type: CardTypes;
    health: number;
    moves: number | null;
    hit: {
        weak: number;
        normal: number;
        hard: number
    },
    rarity: Rarities,
    description: string | null;
    painter: string;
    set: Sets;
    image: string;
}

export interface IDeckCard extends ICard {
    amount: number;
}

export interface IDeck {
    id: number;
    name: string;
    elements: Elements[];
    cards: IDeckCard[]
}

export type DecksArray = IDeck[]
