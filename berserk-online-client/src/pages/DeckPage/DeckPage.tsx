import { useState, useEffect } from 'react';
import { useParams, useNavigate, Navigate } from "react-router-dom";
import cls from "./DeckPage.module.scss"
import ReactLoading from 'react-loading';
import { CardItem } from './CardItem/CardItem';
import { Searchbar } from 'src/widgets/Searchbar/Searchbar';
import { RouterPaths } from 'src/app/providers/router/router-paths';
import { useAppDispatch, useAppSelector } from 'src/helpers/hooks/redux-hook';
import { getDeck, updateDeck } from 'src/app/store/slices/decksSlice/decksSlice';
import { getDeckStatusSelector, updateDeckStatusSelector } from 'src/app/store/slices/decksSlice/selectors';

interface DeckPageProps {
    setPage: (page: RouterPaths | null) => void;
}

export const DeckPage = ({ setPage }: DeckPageProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const { id } = useParams()

    const deck = useAppSelector(state => state.decks.currentDeck)
    const getDeckStatus = useAppSelector(getDeckStatusSelector)
    const createDeckStatus = useAppSelector(getDeckStatusSelector)
    const updateDeckStatus = useAppSelector(updateDeckStatusSelector)
    const [isSaveDisabled, setIsSaveDisabled] = useState(true)

    const ordinaryCards = deck?.main
        .filter(c => !c.elite)

    const eliteCards = deck?.main
        .filter(c => c.elite)

    useEffect(() => {
        if (!createDeckStatus.isPending) {
            setPage(null)
            if (!id) navigate(RouterPaths.ERROR)

            dispatch(getDeck([id as string, rejectedCallback]))
        }
    }, [createDeckStatus])

    const rejectedCallback = (code: number) => {
        if (code === 404) {
            navigate('/error')
        }
    }

    const onSaveClick = async () => {
        if (!deck) return
        dispatch(updateDeck(deck))
    }

    return (<div className={cls.DeckPage}>
        {getDeckStatus.isPending || createDeckStatus.isPending
            ? <ReactLoading type={'bubbles'} color={'#ffffff'} height={100} width={90} />
            : getDeckStatus.isFulfilled
                ? <>
                    <div className={cls.DeckContainer}>
                        <div
                            className={cls.DeckHeaderWrapper}
                        >
                            <h1 className={cls.DeckPageHeader}>{deck?.name}</h1>
                            <p className={cls.DeckCardsCount}>Всего карт: {Number(eliteCards?.reduce((acc, curr) => acc + curr.amount, 0)) + Number(ordinaryCards?.reduce((acc, curr) => acc + curr.amount, 0))}</p>
                            <button
                                className={cls.SaveDeckButton}
                                disabled={deck?.main.concat(deck.sideboard === undefined ? [] : deck.sideboard).length === 0
                                    || isSaveDisabled || updateDeckStatus.isPending || getDeckStatus.isUncompleted}
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
                                                setIsSaveDisabled={setIsSaveDisabled}
                                            />)
                                        : <span
                                            className={cls.NoCardsText}>Карт нет</span>}
                                </ul>
                            </div>
                            <div
                                className={cls.SideboardCardsContainer}
                            >
                                <h2
                                    className={cls.SideboardCardsHeader}
                                >Сайдборд ({deck?.sideboard.reduce((acc, curr) => acc + curr.amount, 0)})</h2>

                                {deck?.sideboard.length
                                    ?
                                    <ul
                                        className={cls.CardsWrapper}
                                    >
                                        {deck.sideboard.map(card =>
                                            <CardItem
                                                key={card.id}
                                                card={card}
                                                setIsSaveDisabled={setIsSaveDisabled}
                                                isSide={true}
                                            />)}
                                    </ul>
                                    : <span
                                        className={cls.NoCardsText}>Карт нет</span>}
                            </div>
                        </div>

                    </div>
                    <Searchbar
                        setIsSaveDisabled={setIsSaveDisabled}
                    />
                </>
                : <Navigate to='/error' />
        }
    </div >
    );
}
