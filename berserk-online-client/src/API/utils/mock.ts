import { CardTypes, Elements, Rarities, Sets } from "./data";
import { DecksArray } from "./types";

export const decksObj: Record<string, DecksArray> = {
    decks: [
        {
            id: 0,
            name: 'Битки',
            elements: [Elements.PLAINS],
            cards: [
                {
                    id: 0,
                    amount: 3,
                    rarity: Rarities.COMMON,
                    painter: 'Марина Клейман',
                    elements: [Elements.PLAINS],
                    price: 3,
                    health: 7,
                    moves: 2,
                    hit: { weak: 1, normal: 2, hard: 3 },
                    image: 'https://berserk.ru/image/data/Берсерк/Нашествие%20тьмы/Berserk_NT_all_card_29_pages-to-jpg-0002%20копия.png',
                    name: 'Кентавр',
                    unique: false,
                    elite: false,
                    set: Sets.DARKNESS_INVASION,
                    type: CardTypes.CREATURE,
                    description: null
                },
                {
                    id: 1,
                    amount: 1,
                    rarity: Rarities.COMMON,
                    painter: 'Марина Клейман',
                    elements: [Elements.PLAINS],
                    price: 3,
                    health: 7,
                    moves: 2,
                    hit: { weak: 1, normal: 2, hard: 3 },
                    image: 'https://berserk.ru/image/data/Берсерк/Нашествие%20тьмы/Berserk_NT_all_card_29_pages-to-jpg-0002%20копия.png',
                    name: 'Кентавр',
                    unique: false,
                    elite: false,
                    set: Sets.DARKNESS_INVASION,
                    type: CardTypes.CREATURE,
                    description: null
                }
            ],
        }
    ]
};