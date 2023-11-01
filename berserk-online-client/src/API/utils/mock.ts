import defaultCard from "src/shared/assets/images/card.jpg"
import { Elements } from "./data";
import { DecksArray } from "./types";

export const decksObj: Record<string, DecksArray> = {
    decks: [
        {
            id: 0,
            name: 'Демоны',
            elements: [Elements.DARKNESS, Elements.NEUTRAL],
            cards: [
                {
                    name: 'name',
                    image: defaultCard
                }, {
                    name: 'name',
                    image: defaultCard
                },
                {
                    name: 'name',
                    image: defaultCard
                }
            ],
        },
        {
            id: 1,
            name: 'Демоны',
            elements: [Elements.DARKNESS, Elements.NEUTRAL],
            cards: [
                {
                    name: 'name',
                    image: defaultCard
                }, {
                    name: 'name',
                    image: defaultCard
                },
                {
                    name: 'name',
                    image: defaultCard
                }
            ],
        },
        {
            id: 2,
            name: 'Демоны',
            elements: [Elements.DARKNESS, Elements.NEUTRAL],
            cards: [
                {
                    name: 'name',
                    image: defaultCard
                }, {
                    name: 'name',
                    image: defaultCard
                },
                {
                    name: 'name',
                    image: defaultCard
                }
            ],
        },
        {
            id: 3,
            name: 'Демоны',
            elements: [Elements.DARKNESS, Elements.NEUTRAL],
            cards: [
                {
                    name: 'name',
                    image: defaultCard
                }, {
                    name: 'name',
                    image: defaultCard
                },
                {
                    name: 'name',
                    image: defaultCard
                }
            ],
        },
        {
            id: 4,
            name: 'Демоны',
            elements: [Elements.DARKNESS, Elements.NEUTRAL],
            cards: [
                {
                    name: 'name',
                    image: defaultCard
                }, {
                    name: 'name',
                    image: defaultCard
                },
                {
                    name: 'name',
                    image: defaultCard
                }
            ],
        },
        {
            id: 5,
            name: 'Демоны',
            elements: [Elements.DARKNESS, Elements.NEUTRAL],
            cards: [
                {
                    name: 'name',
                    image: defaultCard
                }, {
                    name: 'name',
                    image: defaultCard
                },
                {
                    name: 'name',
                    image: defaultCard
                }
            ],
        },
    ]
};