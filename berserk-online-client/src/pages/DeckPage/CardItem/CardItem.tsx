import { useState } from 'react';
import { ICard, IDeck, IDeckCard } from "src/API/utils/types";
import cls from "./CardItem.module.scss"
import { SymbolIcon } from "src/widgets/SymbolIcon/SymbolIcon";
import { getElement, getElite, getRarity, getTypeSymbol } from "src/helpers/getSymbols";
import { CardTypes } from "src/API/utils/data";
import trashcanImage from "src/shared/assets/images/trash.svg"
import { useAlert } from "src/helpers/hooks/useAlert";
import { CardTitleItem } from 'src/widgets/CardTitleItem/CardTitleItem';

interface CardItemProps {
    card: IDeckCard;
    deck: IDeck;
    setDeck: (deck: IDeck) => void;
    isSide?: boolean;
}

export const CardItem = ({ card, deck, setDeck, isSide = false }: CardItemProps) => {
    const setAlert = useAlert()
    const [isDeleteAnimation, setIsDeleteAnimation] = useState(false)
    const [isMouseOver, setIsMouseOver] = useState(false)
    const [clientY, setClientY] = useState(0)

    const changeCardAmount = (isIncrease: boolean) => {
        const newDeck = JSON.parse(JSON.stringify(deck))
        const cardsList = isSide
            ? newDeck.sideboard
            : newDeck.main

        const amount = isIncrease
            ? card.amount + 1 > 30
                ? 30
                : card.amount + 1
            : card.amount - 1 < 1
                ? 1
                : card.amount - 1

        if (!isSide) {
            newDeck.main = cardsList.map((c: IDeckCard) => {
                return c.id === card.id
                    ? { ...c, amount }
                    : c
            })
        } else {
            if (newDeck.sideboard === undefined) {
                setAlert('Ошибка!')
                throw new Error('Sideboard Error')
            }

            newDeck.sideboard = cardsList.map((c: IDeckCard) => {
                return c.id === card.id
                    ? { ...c, amount }
                    : c
            })
        }

        setDeck(newDeck)
    }

    const deleteCard = () => {
        setIsDeleteAnimation(true)

        setTimeout(() => {
            const newDeck = JSON.parse(JSON.stringify(deck))

            const cardsList = isSide
                ? newDeck.sideboard
                : newDeck.main

            if (isSide) {
                newDeck.sideboard = cardsList.filter((c: ICard) => c.id !== card.id)
            } else {
                newDeck.main = cardsList.filter((c: ICard) => c.id !== card.id)
            }

            setDeck(newDeck)
        }, 250)
    }

    return (
        <li
            className={`${cls.CardItem} ${isDeleteAnimation && cls.deleting}`}
        >
            <div className={cls.CardAmountButtons}>
                <span
                    className={cls.plus}
                    onClick={() => changeCardAmount(true)}>+</span>
                <span
                    className={cls.minus}
                    onClick={() => changeCardAmount(false)}>-</span>
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
                    onClick={deleteCard}
                />
            </div>

            {isMouseOver &&
                <CardTitleItem cardSrc={card.image} clientY={clientY} />}
        </li>
    );
}
