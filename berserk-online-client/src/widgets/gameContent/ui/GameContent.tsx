import { HubConnection } from '@microsoft/signalr'
import cls from './GameContent.module.scss'
import { Chat } from 'src/shared/ui'

interface GamePageContentProps {
    connection: HubConnection
    room: RoomType
}

export const GamePageContent = ({ connection, room }: GamePageContentProps) => {
    return (
        <div className={cls.GamePageContentWrapper}>
            <div className={cls.GamePageContent}>
                <h1 className={cls.GamePageHeader}>{room.name}</h1>
                <div className={cls.GameProcessWrapper}></div>
            </div>
            <Chat connection={connection} room={room} />
        </div>
    )
}
