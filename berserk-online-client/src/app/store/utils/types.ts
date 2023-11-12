import { CardTypes, Elements, Rarities, Sets } from "src/app/store/utils/enums";

export interface IError {
    id: number;
    message: string;
    context?: {
        email?: string;
    }
}

export interface IUser {
    id: number;
    avatarUrl: string;
    email: string;
    name: string;
    password: string;
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
    number: number;
    image: string;
}

export interface IDeckCard extends ICard {
    amount: number;
}

export interface IDeck {
    id: string;
    name: string;
    elements: Elements[];
    main: IDeckCard[];
}

export type DecksArray = IDeck[]
