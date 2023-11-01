import { IDeckCard } from "src/API/utils/types";
import cls from "./CardItem.module.scss"
import { SymbolIcon } from "src/widgets/SymbolIcon/SymbolIcon";
import { getElement, getElite, getRarity, getTypeSymbol } from "src/helpers/getSymbols";
import { CardTypes } from "src/API/utils/data";

interface CardItemProps {
    card: IDeckCard;
}

export const CardItem = ({ card }: CardItemProps) => {

    const increaseCardAmount = () => {

    }

    const decreaseCardAmount = () => {

    }

    return (
        <li className={cls.CardItem} >
            <div
                className={cls.CardAmountWrapper}
            >
                <div className={cls.CardAmountButtons}>
                    <span
                        className={cls.plus}
                        onClick={increaseCardAmount}>+</span>
                    <span
                        className={cls.minus}
                        onClick={decreaseCardAmount}>-</span>
                </div>
                <span className={cls.CardAmount}>{card.amount}</span>
            </div>
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
                .map(element =>
                    <SymbolIcon
                        src={getElement(element)} />)
            }
            </span>
            <SymbolIcon
                src={getRarity(card.rarity, card.set)} />
        </li>
    );
}
