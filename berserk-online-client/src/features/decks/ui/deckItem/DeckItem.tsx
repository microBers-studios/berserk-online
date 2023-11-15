import { useState } from 'react';
import { useNavigate } from "react-router-dom";
import cls from "./DeckItem.module.scss"
import trashCanSvg from "src/shared/assets/images/trash.svg";
import {
    useAppDispatch,
    useAppSelector,
    getElement,
    RouterPaths
} from 'src/shared/lib';
import { SymbolIcon } from "src/shared/ui";
import { deleteDeck, deleteDeckStatusSelector } from 'src/entities/decks';

interface DeckItemProps {
    deck: DeckType;
}

export const DeckItem = ({ deck }: DeckItemProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [isDeleteAnimation, setIsDeleteAnimation] = useState(false)
    const deleteDeckStatus = useAppSelector(deleteDeckStatusSelector)
    const mainCardsCount = deck.main.reduce((acc, curr) => acc + curr.amount, 0)

    const removeDeck = async (e: React.MouseEvent) => {
        e.stopPropagation()
        if (!deleteDeckStatus.isPending) {
            setIsDeleteAnimation(true)
            dispatch(deleteDeck(deck.id))
        }
    }

    return (
        <div
            onClick={() => navigate(`${RouterPaths.DECK}/${deck.id}`)}
            className={`${cls.DeckItem} ${isDeleteAnimation && cls.deletingDeck}`}
        >
            <img
                className={cls.DeckImage}
                src={deck.main.filter(c => c.elite).length
                    ? deck.main.filter(c => c.elite).sort((a, b) => b.price - a.price)[0].image
                    : deck.main.sort((a, b) => b.price - a.price)[0].image}
            />
            <div
                className={cls.TrashCanImageWrapper}
            >
                <img
                    src={trashCanSvg}
                    className={cls.TrashCanImage}
                    onClick={removeDeck}
                />
            </div>
            <div className={cls.DeckItemHeaderWrapper}>
                <div className={cls.DeckItemHeaderTopWrapper}>
                    <p className={cls.DeckItemHeader}>
                        {deck.name}
                    </p>
                </div>
                <div className={cls.DeckItemHeaderBottomWrapper}>
                    <span className={cls.DeckElements}>
                        {deck.elements.map((element, index) =>
                            <SymbolIcon key={index} src={getElement(element)} />)}
                    </span>
                    <span
                        className={cls.CardsCount}
                    >{mainCardsCount} {mainCardsCount % 10 === 1
                        ? 'карта'
                        : mainCardsCount % 10 >= 5 || !(mainCardsCount % 10)
                            ? 'карт'
                            : 'карты'}
                    </span>
                </div>
            </div>
        </div >
    );
}
