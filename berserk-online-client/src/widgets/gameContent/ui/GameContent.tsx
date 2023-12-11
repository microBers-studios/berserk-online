import { HubConnection } from '@microsoft/signalr'
import cls from './GameContent.module.scss'
import { Button, Chat } from 'src/shared/ui'
import { useNavigate } from 'react-router-dom'
import { RouterPaths } from 'src/shared/lib'
import { GameField } from 'src/shared/ui/gameField'

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
                    <Button title="Выйти" onClick={leaveRoom} />
                    <div className={cls.HeaderWrapper}>
                        <h1
                            className={`${cls.GamePageHeader} ${
                                room.name.length > 8 && cls.LongHeader
                            }`}
                        >
                            {room.name}
                        </h1>
                    </div>
                </div>
                <div className={cls.GameProcessWrapper}>
                    <GameField />
                </div>
            </div>
            <Chat connection={connection} room={room} />
        </div>
    )
}
