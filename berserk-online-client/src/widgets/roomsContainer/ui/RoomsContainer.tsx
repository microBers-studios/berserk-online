import { useAppSelector } from 'src/shared/lib'
import { useState } from 'react'
import cls from './RoomsContainer.module.scss'
import {
    fetchUserStatusSelector,
    loginUserStatusSelector,
    registrateUserStatusSelector,
} from 'src/entities/user'
import ReactLoading from 'react-loading'
import { CreateRoomModal, JoinRoomModal, RoomItem } from 'src/features/rooms'
import { HubConnection } from '@microsoft/signalr'

interface RoomsContainerProps {
    rooms: RoomType[] | null
    connection: HubConnection | null
    setIsInvoking: (b: boolean) => void
}

export const RoomsContainer = ({
    rooms,
    connection,
    setIsInvoking,
}: RoomsContainerProps) => {
    const [isRoomCreating, setIsRoomCreating] = useState<boolean>(false)
    const [joiningRoom, setJoiningRoom] = useState<null | RoomType>(null)
    const { user } = useAppSelector((state) => state.user)
    const fetchUserStatus = useAppSelector(fetchUserStatusSelector)
    const loginUserStatus = useAppSelector(loginUserStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)

    const userIsUnauthorized = !user.id && !fetchUserStatus.isUncompleted

    const openCreateRoomModal = () => {
        setIsRoomCreating(true)
    }

    return (
        <>
            <div className={cls.RoomsContainer}>
                <div className={cls.RoomsHeaderWrapper}>
                    <div className={cls.HeaderWrapper}>
                        <span className={cls.RoomsHeader}>Комнаты</span>
                        {!userIsUnauthorized && connection && rooms && (
                            <span className={cls.RoomsCount}>
                                {rooms.length || 0} из {rooms.length || 0}
                            </span>
                        )}
                    </div>
                    {!userIsUnauthorized &&
                        connection &&
                        !(
                            fetchUserStatus.isUncompleted &&
                            loginUserStatus.isUncompleted &&
                            registrateUserStatus.isUncompleted
                        ) && (
                            <button
                                className={cls.AddButton}
                                onClick={openCreateRoomModal}
                            >
                                Создать
                            </button>
                        )}
                </div>
                <div
                    className={`${cls.RoomsWrapper} ${
                        (userIsUnauthorized || !rooms?.length) && cls.NoRooms
                    }`}
                >
                    {!connection ||
                    !rooms ||
                    (fetchUserStatus.isUncompleted &&
                        loginUserStatus.isUncompleted &&
                        registrateUserStatus.isUncompleted) ? (
                        <ReactLoading
                            type={'bubbles'}
                            color={'#ffffff'}
                            height={100}
                            width={90}
                        />
                    ) : userIsUnauthorized ? (
                        <span className={cls.NoRoomsContent}>
                            Войдите в аккаунт, чтобы увидеть комнаты
                        </span>
                    ) : rooms.length ? (
                        rooms.map((room) => (
                            <RoomItem
                                key={room.id}
                                room={room}
                                setJoiningRoom={setJoiningRoom}
                            />
                        ))
                    ) : (
                        <span className={cls.NoRoomsContent}>
                            Комнат пока нет
                        </span>
                    )}
                </div>
            </div>
            {isRoomCreating && (
                <CreateRoomModal
                    closeModal={() => setIsRoomCreating(false)}
                    connection={connection}
                    setIsInvoking={setIsInvoking}
                />
            )}
            {joiningRoom && (
                <JoinRoomModal
                    room={joiningRoom}
                    closeModal={() => setJoiningRoom(null)}
                />
            )}
        </>
    )
}
