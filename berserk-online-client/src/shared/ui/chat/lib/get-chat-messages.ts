export function getChatMessages(room: RoomType): Array<IMessage | IRoomEvent> {
    return [...room.chatMessages, ...room.logs].sort((obj1, obj2) => {
        const hours = [obj1, obj2].map((o) =>
            parseInt(o.timeStamp.split(':')[0])
        )
        const minutes = [obj1, obj2].map((o) =>
            parseInt(o.timeStamp.split(':')[1])
        )
        const seconds = [obj1, obj2].map((o) =>
            parseInt(o.timeStamp.split(':')[2])
        )

        if (hours[0] !== hours[1]) {
            return hours[0] - hours[1]
        } else if (minutes[0] !== minutes[1]) {
            return minutes[0] - minutes[1]
        }

        return seconds[0] - seconds[1]
    })
}
