import { useState, useEffect } from 'react';
import { useNavigate } from "react-router-dom";
import { toast } from 'react-toastify';
import cls from "./DeckCreatingPage.module.scss"
import { CardItem } from '../../features/decks/ui/cardItem/CardItem';
import { CardsSearchbar } from 'src/widgets/cardsSearchbar';
import { useAppDispatch, useAppSelector, RouterPaths } from 'src/shared/lib';
import { setCurrentDeck, createDeck, createDeckStatusSelector } from 'src/entities/decks';

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
                        disabled={!deck?.main.length || isSaveDisabled}
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

            </div>
            <CardsSearchbar
                setIsSaveDisabled={setIsSaveDisabled}
            />
        </>
    </div >
    );
}
