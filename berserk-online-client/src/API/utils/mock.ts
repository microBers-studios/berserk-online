import { CardTypes, Elements, Rarities, Sets } from "./data";
import { DecksArray } from "./types";
import { v4 as uuid } from "uuid";

export const decksObj: Record<string, DecksArray> = {
    decks: [
        {
            "id": uuid(),
            "elements": [
                Elements.PLAINS
            ],
            "name": "Дегаска",
            "main": [
                {
                    amount: 3,
                    "rarity": Rarities.ULTRARARE,
                    "name": "Дегаска",
                    "id": 45,
                    "elite": true,
                    "type": CardTypes.CREATURE,
                    image: 'https://berserk.ru/image/data/00_Berserk/01_%D0%92%D0%BE%D0%B9%D0%BD%D0%B0%20%D1%81%D1%82%D0%B8%D1%85%D0%B8%D0%B9/Berserk_VS_all_card%2032-page-00001.jpg',
                    "painter": "maker-hs",
                    "elements": [
                        Elements.PLAINS
                    ],
                    "price": 7,
                    "health": 13,
                    "hit": {
                        "weak": 2,
                        "normal": 3,
                        "hard": 5
                    },
                    "moves": 2,
                    "number": 32,
                    description: null,
                    "set": Sets.ELEMENTS_WAR,
                    "unique": true
                },

                {
                    amount: 3,
                    "rarity": Rarities.COMMON,
                    "name": "Кочевник",
                    "id": 0,
                    "elite": false,
                    "type": CardTypes.CREATURE,
                    "image": "https://berserk.ru/image/data/00_Berserk/01_Война%20стихий/Berserk_VS_all_card%201-page-00001.jpg",
                    "painter": "Илья Комаров",
                    "elements": [
                        Elements.PLAINS
                    ],
                    "price": 3,
                    "health": 8,
                    "hit": {
                        "weak": 1,
                        "normal": 2,
                        "hard": 3
                    },
                    "moves": 2,
                    "number": 1,
                    description: null,
                    "set": Sets.ELEMENTS_WAR,
                    "unique": false
                },
                {
                    amount: 3,
                    "rarity": Rarities.COMMON,
                    "name": "Кшар",
                    "id": 1,
                    "elite": false,
                    "type": CardTypes.CREATURE,
                    "image": "https://berserk.ru/image/data/00_Berserk/01_Война%20стихий/Berserk_VS_all_card%202-page-00001.jpg",
                    "painter": "Андрей Миронишин",
                    "elements": [
                        Elements.PLAINS
                    ],
                    "price": 3,
                    "health": 6,
                    "hit": {
                        "weak": 1,
                        "normal": 2,
                        "hard": 2
                    },
                    "moves": 2,
                    "number": 2,
                    description: null,
                    "set": Sets.ELEMENTS_WAR,
                    "unique": false
                },
                {
                    amount: 3,
                    "rarity": Rarities.UNCOMMON,
                    "name": "Волхв",
                    "id": 2,
                    "elite": false,
                    "type": CardTypes.CREATURE,
                    "image": "https://berserk.ru/image/data/00_Berserk/01_Война%20стихий/Berserk_VS_all_card%203-page-00001.jpg",
                    "painter": "Firefly",
                    "elements": [
                        Elements.PLAINS
                    ],
                    "price": 4,
                    "health": 7,
                    "hit": {
                        "weak": 1,
                        "normal": 1,
                        "hard": 2
                    },
                    "moves": 1,
                    "number": 3,
                    description: null,
                    "set": Sets.ELEMENTS_WAR,
                    "unique": false
                },
                {
                    amount: 3,
                    "rarity": Rarities.RARE,
                    "name": "Гиррит",
                    "id": 3,
                    "elite": false,
                    "type": CardTypes.CREATURE,
                    "image": "https://berserk.ru/image/data/00_Berserk/01_Война%20стихий/Berserk_VS_all_card%204-page-00001.jpg",
                    "painter": "Lebowski",
                    "elements": [
                        Elements.PLAINS
                    ],
                    "price": 4,
                    "health": 8,
                    "hit": {
                        "weak": 1,
                        "normal": 2,
                        "hard": 2
                    },
                    "moves": 1,
                    "number": 4,
                    description: null,
                    "set": Sets.ELEMENTS_WAR,
                    "unique": true
                },
                {
                    amount: 3,
                    "rarity": Rarities.COMMON,
                    "name": "Ост",
                    "id": 4,
                    "elite": false,
                    "type": CardTypes.CREATURE,
                    "image": "https://berserk.ru/image/data/00_Berserk/01_Война%20стихий/Berserk_VS_all_card%205-page-00001.jpg",
                    "painter": "Наталья Козлова",
                    "elements": [
                        Elements.PLAINS
                    ],
                    "price": 4,
                    "health": 7,
                    "hit": {
                        "weak": 1,
                        "normal": 1,
                        "hard": 2
                    },
                    "moves": 1,
                    "number": 5,
                    description: null,
                    "set": Sets.ELEMENTS_WAR,
                    "unique": false
                }
            ],
            "sideboard": [
                {
                    amount: 3,
                    "rarity": Rarities.RARE,
                    "name": "Циклоп",
                    "id": 100,
                    "elite": true,
                    "type": CardTypes.CREATURE,
                    "image": "https://berserk.ru/image/data/00_Berserk/01_Война%20стихий/Berserk_VS_all_card%20101-page-00001.jpg",
                    "painter": "Руслан Свободин",
                    "elements": [
                        Elements.FORESTS
                    ],
                    "price": 8,
                    "health": 14,
                    "hit": {
                        "weak": 4,
                        "normal": 5,
                        "hard": 6
                    },
                    "moves": 2,
                    "number": 101,
                    description: null,
                    "set": Sets.ELEMENTS_WAR,
                    "unique": false
                },
                {
                    amount: 3,
                    rarity: Rarities.COMMON,
                    name: "Василиск",
                    id: 115,
                    elite: false,
                    type: CardTypes.CREATURE,
                    image: "https://berserk.ru/image/data/00_Berserk/01_Война%20стихий/Berserk_VS_all_card%20116-page-00001.jpg",
                    painter: "Андрей Миронишин",
                    elements: [
                        Elements.SWAMPS
                    ],
                    price: 6,
                    health: 12,
                    hit: {
                        weak: 2,
                        normal: 3,
                        hard: 4
                    },
                    moves: 1,
                    number: 116,
                    description: null,
                    set: Sets.ELEMENTS_WAR,
                    unique: false
                },
                {
                    amount: 3,
                    "rarity": Rarities.COMMON,
                    "name": "Слизь",
                    "id": 120,
                    "elite": true,
                    "type": CardTypes.CREATURE,
                    "image": "https://berserk.ru/image/data/00_Berserk/01_Война%20стихий/Berserk_VS_all_card%20121-page-00001.jpg",
                    "painter": "И. Попов, С. Чигрин",
                    "elements": [
                        Elements.SWAMPS
                    ],
                    "price": 7,
                    "health": 10,
                    "hit": {
                        "weak": 3,
                        "normal": 3,
                        "hard": 4
                    },
                    "moves": 1,
                    "number": 121,
                    description: null,
                    "set": Sets.DARKNESS_INVASION,
                    "unique": false
                }
            ]
        }
    ]
}
