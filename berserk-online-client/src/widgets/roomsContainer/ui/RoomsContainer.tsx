import { useAppDispatch, useAppSelector } from 'src/shared/lib'
import { useEffect } from 'react'
import cls from './RoomsContainer.module.scss'
// import { useNavigate } from 'react-router-dom'
import {
    fetchUserStatusSelector,
    loginUserStatusSelector,
    registrateUserStatusSelector,
} from 'src/entities/user'
import { fetchDecksStatusSelector } from 'src/entities/decks'
import { isEmailConfirmedSelector } from 'src/entities/user'
import ReactLoading from 'react-loading'
import { RoomItem } from 'src/features/rooms'
import { roomsSelector } from 'src/entities/rooms'

// interface RoomsContainerProps {
//     className?: string
// }

export const RoomsContainer = () => {
    const { user } = useAppSelector((state) => state.user)
    const fetchUserStatus = useAppSelector(fetchUserStatusSelector)
    const loginUserStatus = useAppSelector(loginUserStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)
    const fetchDecksStatus = useAppSelector(fetchDecksStatusSelector)
    const isEmailConfirmed = useAppSelector(isEmailConfirmedSelector)
    const rooms = useAppSelector(roomsSelector)
    const dispatch = useAppDispatch()
    // const navigate = useNavigate()

    const userIsUnauthorized = !user.id && !fetchUserStatus.isUncompleted

    useEffect(() => {
        if (
            (fetchUserStatus.isFulfilled ||
                loginUserStatus.isFulfilled ||
                registrateUserStatus.isFulfilled) &&
            isEmailConfirmed
        ) {
            // dispatch(fetchDecks())
        }
    }, [
        fetchUserStatus,
        loginUserStatus,
        registrateUserStatus,
        isEmailConfirmed,
        dispatch,
    ])

    const makeRoom = () => {
        // dispatch(setCurrentDeck({ deck: createDeck('') }))
        // navigate(RouterPaths.CREATE_DECK)
    }

    return (
        <div className={cls.RoomsContainer}>
            <div className={cls.RoomsHeaderWrapper}>
                <div className={cls.HeaderWrapper}>
                    <span className={cls.RoomsHeader}>Комнаты</span>
                    {!userIsUnauthorized && fetchDecksStatus.isFulfilled && (
                        <span className={cls.RoomsCount}>
                            {rooms.length} из {rooms.length}
                        </span>
                    )}
                </div>
                {!userIsUnauthorized &&
                    !(
                        fetchUserStatus.isUncompleted &&
                        loginUserStatus.isUncompleted &&
                        registrateUserStatus.isUncompleted
                    ) && (
                        <button className={cls.AddButton} onClick={makeRoom}>
                            Создать
                        </button>
                    )}
            </div>
            <div
                className={`${cls.RoomsWrapper} ${
                    (userIsUnauthorized || !rooms.length) && cls.NoRooms
                }`}
            >
                {fetchDecksStatus.isPending ||
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
                    rooms.map((room) => <RoomItem key={room.id} />)
                ) : (
                    <span className={cls.NoRoomsContent}>Комнат пока нет</span>
                )}
            </div>
        </div>
    )
}
