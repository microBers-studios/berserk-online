import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/helpers/hooks/redux-hook";
import cls from "./SearchbarCardItem.module.scss"
import { ICard, IDeck } from "src/API/utils/types";
import { SymbolIcon } from "src/widgets/SymbolIcon/SymbolIcon";
import { getElement, getElite, getRarity, getTypeSymbol } from "src/helpers/getSymbols";
import { CardTypes } from "src/API/utils/data";
import { CardTitleItem } from "src/widgets/CardTitleItem/CardTitleItem";
import tickImage from "src/shared/assets/images/green-tick.png";
import plusImage from "src/shared/assets/images/red-plus.png";
import { addCard } from "src/app/store/slices/decksSlice/decksSlice";

interface SearchbarCardItemProps {
    card: ICard;
    setIsSaveDisabled: (b: boolean) => void;
}

export const SearchbarCardItem = ({ card, setIsSaveDisabled }: SearchbarCardItemProps) => {
    const deck = useAppSelector(state => state.decks.currentDeck) as IDeck
    const dispatch = useAppDispatch()
    const [isMouseOver, setIsMouseOver] = useState(false)
    const [clientY, setClientY] = useState(0)

    const isInSideDeck = deck.sideboard.findIndex(c => c.id === card.id) !== -1
    const isInDeck = deck.main.findIndex(c => c.id === card.id) !== -1

    const addCardToDeck = () => {
        dispatch(addCard({ card }))
        setIsSaveDisabled(false)
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
