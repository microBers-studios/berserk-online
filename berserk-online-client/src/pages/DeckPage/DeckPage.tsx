import { useState, useEffect } from 'react';
import { useParams, useNavigate } from "react-router-dom";
import cls from "./DeckPage.module.scss"
import ReactLoading from 'react-loading';
import { CardItem } from './CardItem/CardItem';
import { Searchbar } from 'src/widgets/Searchbar/Searchbar';
import { RouterPaths } from 'src/app/providers/router/router-paths';
import { useAppDispatch, useAppSelector } from 'src/helpers/hooks/redux-hook';
import { getDeck, updateDeck } from 'src/app/store/slices/decksSlice/decksSlice';
import { getDeckStatusSelector } from 'src/app/store/slices/decksSlice/selectors';
import { getUserStatusSelector, loginUserStatusSelector, registrateUserStatusSelector } from 'src/app/store/slices/userSlice/selectors';
import PieChart from 'src/widgets/PieChart/PieChart';
import { IDeck } from 'src/API/utils/types';
import { getElementsChartData, getPricesChartData } from 'src/helpers/getChartData';
import BarChart from 'src/widgets/BarChart/BarChart';

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

    const ordinaryCards = deck?.main
        .filter(c => !c.elite)

    const eliteCards = deck?.main
        .filter(c => c.elite)

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
                <div className={cls.DeckContainer}>
                    <div
                        className={cls.DeckHeaderWrapper}
                    >
                        <h1 className={cls.DeckPageHeader}>{deck?.name}</h1>
                        <p className={cls.DeckCardsCount}>Всего карт: {Number(eliteCards?.reduce((acc, curr) => acc + curr.amount, 0)) + Number(ordinaryCards?.reduce((acc, curr) => acc + curr.amount, 0))}</p>
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
                    <div
                        className={cls.CardsContainer}
                    >
                        <div
                            className={cls.EliteCardsContainer}
                        >
                            <h2
                                className={cls.EliteCardsHeader}
                            >Элитные карты ({eliteCards?.reduce((acc, curr) => acc + curr.amount, 0)})</h2>

                            <ul
                                className={cls.CardsWrapper}
                            >
                                {eliteCards && eliteCards.length
                                    ? eliteCards.map(card =>
                                        <CardItem
                                            key={card.id}
                                            card={card}
                                            isSaveDisabled={isSaveDisabled}
                                            setIsSaveDisabled={setIsSaveDisabled}
                                        />)
                                    : <span
                                        className={cls.NoCardsText}>Карт нет</span>}
                            </ul>
                        </div>
                        <div
                            className={cls.OrdinaryCardsContainer}
                        >
                            <h2
                                className={cls.OrdinaryCardsHeader}
                            >Рядовые карты ({ordinaryCards?.reduce((acc, curr) => acc + curr.amount, 0)})</h2>

                            <ul
                                className={cls.CardsWrapper}
                            >
                                {ordinaryCards && ordinaryCards.length
                                    ? ordinaryCards.map(card =>
                                        <CardItem
                                            key={card.id}
                                            card={card}
                                            isSaveDisabled={isSaveDisabled}
                                            setIsSaveDisabled={setIsSaveDisabled}
                                        />)
                                    : <span
                                        className={cls.NoCardsText}>Карт нет</span>}
                            </ul>
                        </div>
                    </div>
                    <div className={cls.DeckStatistics}>
                        <h2
                            className={cls.DeckStatisticsHeader}
                        >Статистика</h2>
                        <div className={cls.ChartsWrapper}>
                            <PieChart data={getElementsChartData(deck as IDeck)} />
                            <BarChart data={getPricesChartData(deck as IDeck)} />
                        </div>
                    </div>
                </div>
                <Searchbar
                    setIsSaveDisabled={setIsSaveDisabled}
                />
            </>
            // : <ReactLoading type={'bubbles'} color={'#ffffff'} height={100} width={90} />
        }
    </div >
    );
}