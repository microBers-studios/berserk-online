import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import cls from "./DeckPage.module.scss"
import ReactLoading from 'react-loading';
import { CardsSearchbar } from 'src/widgets/cardsSearchbar';
import { useAppDispatch, useAppSelector, RouterPaths } from 'src/shared/lib';
import {
    getDeck,
    updateDeck,
    getDeckStatusSelector
} from 'src/entities/decks';
import {
    fetchUserStatusSelector,
    loginUserStatusSelector,
    registrateUserStatusSelector
} from 'src/entities/user';
import { DeckConstructor } from 'src/widgets/deckConstructor';
import { DeckStatistics } from 'src/widgets/deckStatistics';

// interface DeckPageProps {
// }

export const DeckPage = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const fetchUserStatus = useAppSelector(fetchUserStatusSelector)
    const loginUserStatus = useAppSelector(loginUserStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)
    const getDeckStatus = useAppSelector(getDeckStatusSelector)
    const updateDeckStatus = useAppSelector(getDeckStatusSelector)
    const { user } = useAppSelector(state => state.user)

    const { id } = useParams()

    const deck = useAppSelector(state => state.decks.currentDeck)
    const [isSaveDisabled, setIsSaveDisabled] = useState(true)
    const isLoading = (!deck || deck.id !== id) && getDeckStatus.isUncompleted
        || updateDeckStatus.isPending
        || (fetchUserStatus.isUncompleted && loginUserStatus.isUncompleted && registrateUserStatus.isUncompleted)

    useEffect(() => {
        if (user.id) {
            if (!id) {
                navigate(RouterPaths.ERROR)
                return
            }
            if (!deck || deck.id !== id) dispatch(getDeck(id))
        }
    }, [user])

    const onSaveClick = async () => {
        if (!deck) return
        dispatch(updateDeck(deck))
        setIsSaveDisabled(true)
    }

    return (<div className={cls.DeckPage}>
        {isLoading
            ? <ReactLoading type={'bubbles'} color={'#ffffff'} height={100} width={90} />
            : <>
                <div className={cls.DeckPageWrapper}>
                    <div className={cls.DeckHeaderWrapper}>
                        <h1 className={cls.DeckPageHeader}>{deck?.name}</h1>
                        <p className={cls.DeckCardsCount}>Всего карт: {deck?.main.reduce((acc, curr) => acc + curr.amount, 0)}</p>
                        <button
                            className={cls.SaveDeckButton}
                            disabled={!deck?.main.length
                                || isSaveDisabled
                                || updateDeckStatus.isPending
                                || getDeckStatus.isUncompleted}
                            onClick={onSaveClick}
                        >
                            Сохранить
                        </button>
                    </div>
                    <DeckConstructor
                        deck={deck}
                        isSaveDisabled={isSaveDisabled}
                        setIsSaveDisabled={setIsSaveDisabled}
                    />
                    <DeckStatistics deck={deck as DeckType} />
                </div>
                <CardsSearchbar setIsSaveDisabled={setIsSaveDisabled} />
            </>
        }
    </div >
    );
}