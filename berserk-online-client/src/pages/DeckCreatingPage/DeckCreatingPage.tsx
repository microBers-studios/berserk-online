import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import cls from "./DeckCreatingPage.module.scss"
import { CardItem } from '../DeckPage/CardItem/CardItem';
import { Searchbar } from 'src/widgets/Searchbar/Searchbar';
import { RouterPaths } from 'src/app/providers/router/router-paths';
import { useAppDispatch, useAppSelector } from 'src/helpers/hooks/redux-hook';
import { setCurrentDeck, createDeck } from 'src/app/store/slices/decksSlice/decksSlice';
import { createDeckStatusSelector } from 'src/app/store/slices/decksSlice/selectors';

// export interface DeckCreatingPage {
// }

export const DeckCreatingPage = () => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const deck = useAppSelector(state => state.decks.currentDeck)
    const createDeckStatus = useAppSelector(createDeckStatusSelector)
    const [isSaveDisabled, setIsSaveDisabled] = useState(true)
    const [deckName, setDeckName] = useState('')

    useEffect(() => {
        if (!deck) navigate(RouterPaths.MAIN)

        return function () {
            setCurrentDeck({ deck: null })
        }
    }, [])

    useEffect(() => {
        if (deck?.main.length) {
            setIsSaveDisabled(false)
        }

        if (deck) {
            localStorage.setItem('deck', JSON.stringify(deck))
        }
    }, [deck])

    useEffect(() => {
        if (createDeckStatus.isFulfilled && deck && deck.name) {
            navigate(`${RouterPaths.DECK}/${deck.id}`)
            localStorage.removeItem('deck')
        }

    }, [createDeckStatus])

    const ordinaryCards = deck?.main
        .filter(c => !c.elite)

    const eliteCards = deck?.main
        .filter(c => c.elite)

    const onSaveClick = async () => {
        if (!deck) return
        if (!deckName) {
            toast('Введите имя колоды')
        }
        dispatch(createDeck({ ...deck, name: deckName }))
    }

    return (<div className={cls.DeckPage}>
        <>
            <div className={cls.DeckContainer}>
                <div
                    className={cls.DeckHeaderWrapper}
                >
                    <span
                        className={cls.DeckPageHeader}
                    >
                        Имя:
                        <input
                            className={cls.DeckPageHeaderInput}
                            onChange={((e: React.ChangeEvent<HTMLInputElement>) => setDeckName(e.target.value))}
                            value={deckName}
                            autoFocus={true}
                        />
                    </span>

                    <p className={cls.DeckCardsCount}>Всего карт: {Number(eliteCards?.reduce((acc, curr) => acc + curr.amount, 0)) + Number(ordinaryCards?.reduce((acc, curr) => acc + curr.amount, 0))}</p>
                    <button
                        className={cls.SaveDeckButton}
                        disabled={deck?.main.concat(deck.sideboard === undefined ? [] : deck.sideboard).length === 0 || isSaveDisabled}
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
    </div >
    );
}
