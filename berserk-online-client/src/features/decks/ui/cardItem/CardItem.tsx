import { useState } from 'react';
import cls from "./CardItem.module.scss"
import { SymbolIcon, CardTitleItem } from "src/shared/ui";
import {
    useAppDispatch,
    useAppSelector,
    getElement,
    getElite,
    getRarity,
    getTypeSymbol,
    CardTypes
} from "src/shared/lib";
import trashcanImage from "src/shared/assets/images/trash.svg"
import { changeCardAmount, deleteCard } from 'src/entities/decks';

interface CardItemProps {
    card: IDeckCard;
    isSaveDisabled: boolean;
    setIsSaveDisabled: (b: boolean) => void;
    isSide?: boolean;
}

export const CardItem = ({ card, isSide = false, isSaveDisabled, setIsSaveDisabled }: CardItemProps) => {
    const dispatch = useAppDispatch()
    const deck = useAppSelector(state => state.decks.currentDeck)
    const [isDeleteAnimation, setIsDeleteAnimation] = useState(false)
    const [isMouseOver, setIsMouseOver] = useState(false)
    const [clientY, setClientY] = useState(0)

    const removeCard = () => {
        setIsDeleteAnimation(true)

        setTimeout(() => {
            dispatch(deleteCard({ cardId: card.id, isSide }))
            console.log(deck?.main.length)
            if (deck?.main.length !== 1) {
                setIsSaveDisabled(false)
            } else if (!isSaveDisabled) {
                setIsSaveDisabled(true)
            }
        }, 250)
    }

    const regCardAmount = (isIncrease: boolean) => {
        if ((!isIncrease && card.amount !== 1) || isIncrease) {
            setIsSaveDisabled(false)
        }
        dispatch(changeCardAmount({ cardId: card.id, isIncrease, isSide }))
    }

    return (
        <li
            className={`${cls.CardItem} ${isDeleteAnimation && cls.deleting}`}
        >
            <div className={cls.CardAmountButtons}>
                <span
                    className={cls.plus}
                    onClick={() => regCardAmount(true)}>+</span>
                <span
                    className={cls.minus}
                    onClick={() => regCardAmount(false)}>-</span>
            </div>
            <div
                className={cls.CardContentWrapper}
                onMouseOver={() => setIsMouseOver(true)}
                onMouseLeave={() => setIsMouseOver(false)}
                onMouseMove={(e: React.MouseEvent) => setClientY(e.clientY)}
            >
                <span className={cls.CardAmount}>{card.amount}</span>
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
            <div className={cls.DeleteCardButton}>
                <img
                    src={trashcanImage}
                    className={cls.trashcanImage}
                    onClick={removeCard}
                />
            </div>

            {isMouseOver &&
                <CardTitleItem cardSrc={card.image} clientY={clientY} />}
        </li>
    );
}
