import { DecksArray, IDeck } from "src/API/utils/types";
import cls from "./DeckItem.module.scss"
import { getElement } from "src/helpers/getSymbols";
import { SymbolIcon } from "../../SymbolIcon/SymbolIcon";
import trashCanSvg from "src/shared/assets/images/trash.svg"
import { useAlert } from "src/helpers/hooks/useAlert";
import APIController from "src/API/Controller";

interface DeckItemProps {
    deck: IDeck;
    setDecks: (decks: IDeck[]) => void;
}

export const DeckItem = ({ deck, setDecks }: DeckItemProps) => {
    const setAlert = useAlert()

    const deckElementsList = deck.elements.map((element, index) =>
        <SymbolIcon key={index} src={getElement(element)} />
    )

    const deleteDeck = async () => {
        const { code, obj } = await APIController.deleteDeck(deck.id)

        if (code === 200) {
            setDecks(obj as DecksArray);
            setAlert(`Колода ${deck.name} удалена.`)
        } else {
            setAlert('Ошибка!')
        }
    }

    return (
        <div className={cls.DeckItem} >
            <img
                className={cls.DeckImage}
                src={deck.cards[0].image}
            />
            <div
                className={cls.TrashCanImageWrapper}
            >
                <img
                    src={trashCanSvg}
                    className={cls.TrashCanImage}
                    onClick={deleteDeck}
                />
            </div>
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
