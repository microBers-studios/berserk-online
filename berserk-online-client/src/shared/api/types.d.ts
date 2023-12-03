interface RoomType {
    id: string
    name: string
    players: UserType[]
    spectators: UserType[]
}

interface IRoomEvent {
    type: RoomEvent
    initiator: UserType
}

interface IRoomListEvent {
    type: RoomListEvent
    subject: RoomType
}
