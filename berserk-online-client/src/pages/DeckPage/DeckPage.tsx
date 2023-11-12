import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import cls from "./DeckPage.module.scss"
import ReactLoading from 'react-loading';
import { Searchbar } from 'src/widgets/Searchbar/Searchbar';
import { RouterPaths } from 'src/app/providers/router/router-paths';
import { useAppDispatch, useAppSelector } from 'src/helpers/hooks/redux-hook';
import { getDeck, updateDeck } from 'src/app/store/slices/decksSlice/decksSlice';
import { getDeckStatusSelector } from 'src/app/store/slices/decksSlice/selectors';
import { getUserStatusSelector, loginUserStatusSelector, registrateUserStatusSelector } from 'src/app/store/slices/userSlice/selectors';
import { IDeck } from 'src/app/store/utils/types';
import { DeckConstructor } from 'src/widgets/DeckConstructor/DeckConstructor';
import { DeckStatistics } from 'src/widgets/DeckStatistics/DeckStatistics';

// interface DeckPageProps {
// }

export const DeckPage = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const getUserStatus = useAppSelector(getUserStatusSelector)
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
        || (getUserStatus.isUncompleted && loginUserStatus.isUncompleted && registrateUserStatus.isUncompleted)

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
                    <DeckStatistics deck={deck as IDeck} />
                </div>
                <Searchbar setIsSaveDisabled={setIsSaveDisabled} />
            </>
        }
    </div >
    );
}