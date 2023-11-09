import { useEffect } from 'react';
import { useAppDispatch, useAppSelector } from 'src/helpers/hooks/redux-hook';
import ReactLoading from 'react-loading';
import cls from "./DecksContainer.module.scss";
import { getUserStatusSelector, loginUserStatusSelector, registrateUserStatusSelector } from 'src/app/store/slices/userSlice/selectors';
import { Mode, setMode } from 'src/app/store/slices/modalSlice/modalSlice';
import { DeckItem } from './DeckItem/DeckItem';
import { decksSelector, getDecksStatusSelector } from 'src/app/store/slices/decksSlice/selectors';
import { getDecks } from 'src/app/store/slices/decksSlice/decksSlice';

// interface DecksContainerProps {
//     setPage: (page: RouterPaths | null) => void
// }

export const DecksContainer = () => {
    const { user } = useAppSelector(state => state.user)
    const getUserStatus = useAppSelector(getUserStatusSelector)
    const loginUserStatus = useAppSelector(loginUserStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)
    const getDecksStatus = useAppSelector(getDecksStatusSelector)
    const decks = useAppSelector(decksSelector)
    const dispatch = useAppDispatch()

    let userIsUnauthorized = !user.id && getUserStatus.isRejected

    useEffect(() => {
        if (getUserStatus.isFulfilled || loginUserStatus.isFulfilled || registrateUserStatus.isFulfilled) {
            dispatch(getDecks())
        }
    }, [getUserStatus, loginUserStatus, registrateUserStatus])

    const openCreatingModal = () => {
        dispatch(setMode({ mode: Mode.DECK_CREATING }))
        document.body.style.overflow = 'hidden'
    }

    return (
        <>
            <div className={cls.DecksContainer} >
                <div className={cls.DecksHeaderWrapper}>
                    <div className={cls.HeaderWrapper}>
                        <span
                            className={cls.DecksHeader}
                        >
                            Колоды
                        </span>
                        {!userIsUnauthorized && getDecksStatus.isFulfilled &&
                            <span
                                className={cls.DecksCount}
                            >
                                {decks.length} из {decks.length}
                            </span>}
                    </div>
                    {!userIsUnauthorized &&
                        <button
                            className={cls.AddButton}
                            onClick={openCreatingModal}
                        >
                            Добавить
                        </button>}
                </div>
                <div className={`${cls.DecksWrapper} ${(userIsUnauthorized
                    || !decks.length
                ) && cls.NoDecks}`}>
                    {getDecksStatus.isPending
                        ? <ReactLoading type={'bubbles'} color={'#ffffff'} height={100} width={90} />
                        : userIsUnauthorized
                            ? <span
                                className={cls.NoDecksContent}
                            >
                                Войдите в аккаунт, чтобы увидеть колоды
                            </span>
                            : decks.length
                                ? decks.map(deck =>
                                    <DeckItem
                                        key={deck.id}
                                        deck={deck}
                                    />
                                )
                                : <span className={cls.NoDecksContent}>Колод пока нет</span>}
                </div>
            </div >
        </>
    );
}
