import { useState } from 'react';
import { IDeck } from "src/API/utils/types";
import cls from "./DeckItem.module.scss"
import { getElement } from "src/helpers/getSymbols";
import { SymbolIcon } from "../../SymbolIcon/SymbolIcon";
import trashCanSvg from "src/shared/assets/images/trash.svg";
import { useNavigate } from "react-router-dom";
import { RouterPaths } from "src/app/providers/router/router-paths";
import { IDecksState, deleteDeck } from 'src/app/store/slices/decksSlice/decksSlice';
import { useAppDispatch } from 'src/helpers/hooks/redux-hook';

interface DeckItemProps {
    deck: IDeck;
}

export const DeckItem = ({ deck }: DeckItemProps) => {
    const navigate = useNavigate()
    const dispatch = useAppDispatch()

    const [isDeleteAnimation, setIsDeleteAnimation] = useState(false)

    const removeDeck = async (e: React.MouseEvent) => {
        e.stopPropagation()
        dispatch(deleteDeck([deck.id, deleteFulfilledCallback]))
    }

    const deleteFulfilledCallback = (state: IDecksState, decks: IDeck[]) => {
        setIsDeleteAnimation(true)
        setTimeout(() => {
            state.decks = decks
        }, 350)
    }

    return (
        <div
            onClick={() => navigate(`${RouterPaths.DECK}/${deck.id}`)}
            className={`${cls.DeckItem} ${isDeleteAnimation && cls.deletingDeck}`}
        >
            <img
                className={cls.DeckImage}
                src={deck.main[0]?.image}
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
                    >{deck.main.reduce((acc, curr) => acc + curr.amount, 0)} {deck.main.reduce((acc, curr) => acc + curr.amount, 0) % 10 === 1
                        ? 'карта'
                        : deck.main.reduce((acc, curr) => acc + curr.amount, 0) % 10 >= 5
                            ? 'карт'
                            : 'карты'}
                    </span>
                </div>
            </div>
        </div >
    );
}
