import { IDeck } from "src/API/utils/types";
import cls from "./DeckItem.module.scss"
import { getElement } from "src/helpers/getSymbols";
import { SymbolIcon } from "../SymbolIcon/SymbolIcon";

interface DeckItemProps {
    deck: IDeck;
}

export const DeckItem = ({ deck }: DeckItemProps) => {

    const deckElementsList = deck.elements.map((element, index) =>
        <SymbolIcon key={index} src={getElement(element)} />
    )

    return (
        <div className={cls.DeckItem} >
            <img
                className={cls.DeckImage}
                src={deck.cards[0].image}
            />
            <div className={cls.DeckItemHeaderWrapper}>
                <div className={cls.DeckItemHeaderTopWrapper}>
                    <p
                        className={cls.DeckItemHeader}
                    >
                        {deck.name}
                    </p>
                </div>
                <div className={cls.DeckItemHeaderBottomWrapper}>
                    <span className={cls.DeckElements}>
                        {deckElementsList}
                    </span>
                    <span
                        className={cls.CardsCount}
                    >{deck.cards.length} {deck.cards.length % 10 === 1
                        ? 'карта'
                        : deck.cards.length % 10 < 5
                            ? 'карты'
                            : 'карт'}
                    </span>
                </div>

            </div>

        </div >
    );
}
