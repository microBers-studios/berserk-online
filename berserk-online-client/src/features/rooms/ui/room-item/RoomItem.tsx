import { Button } from 'src/shared/ui'
import cls from './RoomItem.module.scss'
import classicalCard from 'src/shared/assets/images/classical-berserk-card.jpg'

interface RoomItemProps {
    room: RoomType
    setJoiningRoom: (b: null | RoomType) => void
}

export const RoomItem = ({ room, setJoiningRoom }: RoomItemProps) => {
    const roomPlayers = room.players.filter((p) => p)

    return (
        <div className={cls.RoomItem}>
            <div className={cls.RoomItemImageWrapper}>
                <img className={cls.RoomItemImage} src={classicalCard} alt="" />
            </div>
            <div className={cls.RoomItemInfo}>
                <div className={cls.RoomItemHeaderWrapper}>
                    <h3 className={cls.RoomHeader}>{room.name}</h3>
                    <span className={cls.PlayersCount}>
                        {roomPlayers.length}/{room.players.length} игроков
                    </span>
                </div>
                <div className={cls.RoomParticipantsInfo}>
                    <ul className={cls.PlayersInfo}>
                        {room.players
                            .filter((p) => p)
                            .map((p) => (
                                <li className={cls.PlayerInfo} key={p.id}>
                                    <div className={cls.PlayerImageWrapper}>
                                        <img
                                            className={cls.PlayerImage}
                                            src={p.avatarUrl}
                                            alt={p.name}
                                        />
                                    </div>
                                    <span className={cls.PlayerName}>
                                        {p.name}
                                    </span>
                                </li>
                            ))}
                    </ul>
                </div>
            </div>
            <Button
                title="Зайти"
                onClick={() => setJoiningRoom(room)}
                className={cls.JoinRoomButton}
            />
        </div>
    )
}
