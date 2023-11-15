import { useState } from "react";
import {
    useAppDispatch,
    useAppSelector,
    getElement,
    getElite,
    getRarity,
    getTypeSymbol,
    CardTypes
} from "src/shared/lib";
import cls from "./SearchbarCardItem.module.scss"
import { SymbolIcon, CardTitleItem } from "src/shared/ui";
import tickImage from "src/shared/assets/images/green-tick.png";
import plusImage from "src/shared/assets/images/red-plus.png";
import { addCard } from "src/entities/decks";

interface SearchbarCardItemProps {
    card: CardType;
    setIsSaveDisabled: (b: boolean) => void;
}

export const SearchbarCardItem = ({ card, setIsSaveDisabled }: SearchbarCardItemProps) => {
    const deck = useAppSelector(state => state.decks.currentDeck) as DeckType
    const dispatch = useAppDispatch()
    const [isMouseOver, setIsMouseOver] = useState(false)
    const [clientY, setClientY] = useState(0)

    const isInDeck = deck.main.findIndex(c => c.id === card.id) !== -1

    const addCardToDeck = () => {
        dispatch(addCard({ card }))
        setIsSaveDisabled(false)
    }

    return (
        <li className={cls.SearchbarCardItem}>
            <span
                className={`${cls.AddButton} ${!isInDeck && cls.plusButton}`}
                onClick={addCardToDeck}
            >
                <img
                    className={cls.AddButtonImage}
                    src={isInDeck ? tickImage : plusImage}
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
                <CardTitleItem
                    isSearchbar={true}
                    cardSrc={card.image}
                    clientY={clientY}
                />}
        </li>
    );
}
