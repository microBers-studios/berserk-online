import { HubConnection } from '@microsoft/signalr'
import cls from './GameContent.module.scss'
import { Button, Chat } from 'src/shared/ui'
import { useNavigate } from 'react-router-dom'
import { RouterPaths } from 'src/shared/lib'

interface GamePageContentProps {
    connection: HubConnection
    room: RoomType
}

export const GamePageContent = ({ connection, room }: GamePageContentProps) => {
    const navigate = useNavigate()

    const leaveRoom = () => {
        connection.invoke('Leave').then(async () => {
            await connection.stop()
            navigate(RouterPaths.ROOMS)
        })
    }

    return (
        <div className={cls.GamePageContentWrapper}>
            <div className={cls.GamePageContent}>
                <div className={cls.GamePageHeaderWrapper}>
                    <Button title="Leave" onClick={leaveRoom} />
                    <h1 className={cls.GamePageHeader}>{room.name}</h1>
                </div>
                <div className={cls.GameProcessWrapper}></div>
            </div>
            <Chat connection={connection} room={room} />
        </div>
    )
}
