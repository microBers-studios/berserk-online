interface RoomType {
    id: string
    name: string
    players: UserType[]
    spectators: UserType[]
    chatMessages: IMessage[]
    logs: IRoomEvent[]
}

interface IRoomEvent {
    id: string
    type: RoomEvent
    initiator: UserType
    timeStamp: string
}

interface IRoomListEvent {
    type: RoomListEvent
    subject: RoomType
}
