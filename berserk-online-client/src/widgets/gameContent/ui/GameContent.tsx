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
                <div className={cls.GamePageRoomInfoWrapper}>
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
                    <div className={cls.ParticipantsInfo}>
                        <div className={cls.PlayersInfoWrapper}>
                            <h3 className={cls.ParticipantsInfoHeader}>
                                Игроки ({room.players.filter((p) => p).length})
                            </h3>
                            <ul className={cls.PlayersInfo}>
                                {room.players
                                    .filter((p) => p)
                                    .map((p) => (
                                        <li
                                            className={cls.ParticipantInfo}
                                            key={p.id}
                                        >
                                            <div
                                                className={
                                                    cls.ParticipantImageWrapper
                                                }
                                            >
                                                <img
                                                    className={
                                                        cls.ParticipantImage
                                                    }
                                                    src={p.avatarUrl}
                                                    alt={p.name}
                                                />
                                            </div>
                                            <span
                                                className={cls.ParticipantName}
                                            >
                                                {p.name}
                                            </span>
                                        </li>
                                    ))}
                            </ul>
                        </div>
                        {room.spectators.length && (
                            <div className={cls.SpectatorsInfoWrapper}>
                                <h3 className={cls.ParticipantsInfoHeader}>
                                    Наблюдатели ({room.spectators.length})
                                </h3>
                                <ul className={cls.SpectatorsInfo}>
                                    {room.spectators
                                        .filter((p) => p)
                                        .map((p) => (
                                            <li
                                                className={cls.ParticipantInfo}
                                                key={p.id}
                                            >
                                                <div
                                                    className={
                                                        cls.ParticipantImageWrapper
                                                    }
                                                >
                                                    <img
                                                        className={
                                                            cls.ParticipantImage
                                                        }
                                                        src={p.avatarUrl}
                                                        alt={p.name}
                                                    />
                                                </div>
                                                <span
                                                    className={
                                                        cls.ParticipantName
                                                    }
                                                >
                                                    {p.name}
                                                </span>
                                            </li>
                                        ))}
                                </ul>
                            </div>
                        )}
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
