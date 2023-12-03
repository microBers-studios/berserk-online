import { Button } from 'src/shared/ui'
import cls from './RoomItem.module.scss'
import classicalCard from 'src/shared/assets/images/classical-berserk-card.jpg'

interface RoomItemProps {
    room: RoomType;
    setJoiningRoom: (b: null | RoomType) => void;
}

export const RoomItem = ({ room, setJoiningRoom }: RoomItemProps) => {
    const roomPlayers = room.players.filter((p) => p)

    return (
        <div className={cls.RoomItem}>
            <div className={cls.RoomItemImageWrapper}>
                <img className={cls.RoomItemImage} src={classicalCard} alt="" />
            </div>
            <div className={cls.RoomItemInfo}>
                <h3 className={cls.RoomHeader}>{room.name}</h3>
                <div className={cls.RoomParticipantsInfo}>
                    <span>
                        {roomPlayers.length}/{room.players.length} игроков
                    </span>
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
