import { useEffect, useState } from "react";
import ReactLoading from 'react-loading'
import cls from "./CardsSearchbar.module.scss"
import { useAppDispatch, useAppSelector } from "src/shared/lib";
import { SearchbarCardItem } from "src/features/decks";
import { cardsSelector, findCardsStatusSelector, findCards } from "src/entities/cards";

interface CardsSearchbarProps {
    setIsSaveDisabled: (b: boolean) => void;
}

export const CardsSearchbar = ({ setIsSaveDisabled }: CardsSearchbarProps) => {
    const dispatch = useAppDispatch()
    const [value, setValue] = useState('')
    const cards = useAppSelector(cardsSelector)
    const findCardsStatus = useAppSelector(findCardsStatusSelector)

    useEffect(() => {
        if (value) {
            dispatch(findCards({ query: value }))
        }
    }, [value, dispatch])

    return (
        <div className={cls.CardsSearchbar} >
            <label
                className={cls.CardsSearchbarLabel}>
                <h3
                    className={cls.CardsSearchbarHeader}
                >Введите название карты: </h3>
                <input
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                    className={cls.CardsSearchbarInput}
                    type="text"
                    placeholder="Вайл..."
                />
            </label>

            <div
                className={cls.ResultsContainerWrapper}>
                <ul
                    className={cls.ResultsContainer}
                >
                    {findCardsStatus.isUncompleted && value
                        ? <ReactLoading type={'bubbles'} color={'#ffffff'} height={100} width={90} />
                        : cards.map(res =>
                            <SearchbarCardItem
                                key={res.id}
                                setIsSaveDisabled={setIsSaveDisabled}
                                card={res} />)
                    }
                </ul>
            </div>
        </div >
    );
}
