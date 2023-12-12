interface IDeckCard extends CardType {
    amount: number
}

type DeckType = {
    id: string
    name: string
    elements: Elements[]
    main: IDeckCard[]
}

type DecksArray = IDeck[]
