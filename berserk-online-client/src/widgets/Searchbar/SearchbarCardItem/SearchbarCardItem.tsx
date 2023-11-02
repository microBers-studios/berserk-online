import { ICard } from "src/API/utils/types";
import cls from "./SearchbarCardItem.module.scss"
import { SymbolIcon } from "src/widgets/SymbolIcon/SymbolIcon";
import { getElement, getElite, getRarity, getTypeSymbol } from "src/helpers/getSymbols";
import { CardTypes } from "src/API/utils/data";

interface SearchbarCardItemProps {
    card: ICard
}

export const SearchbarCardItem = ({ card }: SearchbarCardItemProps) => {
    return (
        <li className={cls.SearchbarCardItem} >
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
        </li >
    );
}
