import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import ReactLoading from 'react-loading'
import {
    useAppDispatch,
    useAppSelector,
    createDeck,
    RouterPaths,
} from 'src/shared/lib'
import cls from './DecksContainer.module.scss'
import {
    fetchUserStatusSelector,
    loginUserStatusSelector,
    registrateUserStatusSelector,
} from 'src/entities/user'
import { DeckItem } from 'src/features/decks'
import {
    decksSelector,
    fetchDecksStatusSelector,
    fetchDecks,
    setCurrentDeck,
} from 'src/entities/decks'
import { isEmailConfirmedSelector } from 'src/entities/user/model/selectors'

export const DecksContainer = () => {
    const { user } = useAppSelector((state) => state.user)
    const fetchUserStatus = useAppSelector(fetchUserStatusSelector)
    const loginUserStatus = useAppSelector(loginUserStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)
    const fetchDecksStatus = useAppSelector(fetchDecksStatusSelector)
    const isEmailConfirmed = useAppSelector(isEmailConfirmedSelector)
    const decks = useAppSelector(decksSelector)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const userIsUnauthorized = !user.id && !fetchUserStatus.isUncompleted

    useEffect(() => {
        if (
            (fetchUserStatus.isFulfilled ||
                loginUserStatus.isFulfilled ||
                registrateUserStatus.isFulfilled) &&
            isEmailConfirmed
        ) {
            dispatch(fetchDecks())
        }
    }, [
        fetchUserStatus,
        loginUserStatus,
        registrateUserStatus,
        isEmailConfirmed,
        dispatch,
    ])

    const makeDeck = () => {
        dispatch(setCurrentDeck({ deck: createDeck('') }))
        navigate(RouterPaths.CREATE_DECK)
    }

    return (
        <div className={cls.DecksContainer}>
            <div className={cls.DecksHeaderWrapper}>
                <div className={cls.HeaderWrapper}>
                    <span className={cls.DecksHeader}>Колоды</span>
                    {!userIsUnauthorized && fetchDecksStatus.isFulfilled && (
                        <span className={cls.DecksCount}>
                            {decks.length} из {decks.length}
                        </span>
                    )}
                </div>
                {!userIsUnauthorized &&
                    !(
                        fetchUserStatus.isUncompleted &&
                        loginUserStatus.isUncompleted &&
                        registrateUserStatus.isUncompleted
                    ) && (
                        <button className={cls.AddButton} onClick={makeDeck}>
                            Создать
                        </button>
                    )}
            </div>
            <div
                className={`${cls.DecksWrapper} ${
                    (userIsUnauthorized || !decks.length) && cls.NoDecks
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
                    <span className={cls.NoDecksContent}>
                        Войдите в аккаунт, чтобы увидеть колоды
                    </span>
                ) : decks.length ? (
                    decks.map((deck) => <DeckItem key={deck.id} deck={deck} />)
                ) : (
                    <span className={cls.NoDecksContent}>Колод пока нет</span>
                )}
            </div>
        </div>
    )
}
