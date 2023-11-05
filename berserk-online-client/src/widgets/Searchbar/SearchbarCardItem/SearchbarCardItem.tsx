import { ICard, IDeck, IDeckCard } from "src/API/utils/types";
import cls from "./SearchbarCardItem.module.scss"
import { SymbolIcon } from "src/widgets/SymbolIcon/SymbolIcon";
import { getElement, getElite, getRarity, getTypeSymbol } from "src/helpers/getSymbols";
import { CardTypes } from "src/API/utils/data";
import { useState, useEffect } from "react";
import { CardTitleItem } from "src/widgets/CardTitleItem/CardTitleItem";
import tickImage from "src/shared/assets/images/green-tick.png";
import plusImage from "src/shared/assets/images/red-plus.png";

interface SearchbarCardItemProps {
    card: ICard;
    deck: IDeck;
    setDeck: (deck: IDeck) => void;
}

export const SearchbarCardItem = ({ card, deck, setDeck }: SearchbarCardItemProps) => {
    const [isInDeck, setIsInDeck] = useState(false)
    const [isInSideDeck, setIsInSideDeck] = useState(false)
    const [isMouseOver, setIsMouseOver] = useState(false)
    const [clientY, setClientY] = useState(0)

    useEffect(() => {
        if (deck.sideboard) {
            setIsInSideDeck(deck.sideboard.findIndex(c => c.id === card.id) !== -1)
        }

        setIsInDeck(deck.main.findIndex(c => c.id === card.id) !== -1)
    }, [deck])

    const addCardToDeck = () => {
        console.log(isInSideDeck, isInDeck)
        if (isInSideDeck && isInDeck) {
            return
        }

        let newDeck = JSON.parse(JSON.stringify(deck));

        if (isInDeck) {
            newDeck.sideboard
                .push({ ...card, amount: 1 })
            newDeck.sideboard.sort((a: IDeckCard, b: IDeckCard) => b.amount - a.amount)
        } else {
            newDeck.main.push({ ...card, amount: 1 })
            newDeck.main.sort((a: IDeckCard, b: IDeckCard) => b.amount - a.amount)
        }

        setDeck(newDeck)
    }

    return (
        <li className={cls.SearchbarCardItem}>
            <span
                className={`${cls.AddButton} ${(!isInDeck || !isInSideDeck) && cls.plusButton}`}
                onClick={addCardToDeck}
            >
                <img
                    className={cls.AddButtonImage}
                    src={isInDeck && isInSideDeck ? tickImage : plusImage}
                />
            </span>
            <div
                className={cls.CardInfo}
                onMouseOver={() => setIsMouseOver(true)}
                onMouseLeave={() => setIsMouseOver(false)}
                onMouseMove={(e: React.MouseEvent) => setClientY(e.clientY)}
            >
                <span
                    className={cls.CardName}
                >{card.name} {card.type !== CardTypes.CREATURE &&
                    <SymbolIcon src={getTypeSymbol(card.type)} />}
                </span>
                <span
                    className={cls.CardPrice}>
                    {card.price}
                    <SymbolIcon
                        src={getElite(card.elite, card.unique)} />
                </span>
                <span>{card.elements
                    .map((element, i) =>
                        <SymbolIcon
                            key={i}
                            src={getElement(element)} />)
                }
                </span>
                <SymbolIcon
                    src={getRarity(card.rarity, card.set)} />
            </div>
            {isMouseOver &&
                <CardTitleItem cardSrc={card.image} clientY={clientY} />}
        </li>

    );
}
