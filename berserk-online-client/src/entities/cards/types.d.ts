type CardType = {
    id: number
    name: string
    price: number
    elite: boolean
    unique: boolean
    elements: [Elements]
    type: CardTypes
    health: number
    moves: number | null
    hit: {
        weak: number
        normal: number
        hard: number
    }
    rarity: Rarities
    description: string | null
    painter: string
    set: Sets
    number: number
    image: string
}
