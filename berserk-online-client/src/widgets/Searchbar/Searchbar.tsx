import { useEffect, useState } from "react";
import ReactLoading from 'react-loading'
import cls from "./Searchbar.module.scss"
import { SearchbarCardItem } from "./SearchbarCardItem/SearchbarCardItem";
import { useAppDispatch, useAppSelector } from "src/helpers/hooks/redux-hook";
import { cardsSelector, findCardsStatusSelector } from "src/app/store/slices/cardsSlice/selectors";
import { findCards } from "src/app/store/slices/cardsSlice/cardsSlice";

interface SearchBarProps {
    setIsSaveDisabled: (b: boolean) => void;
}

export const Searchbar = ({ setIsSaveDisabled }: SearchBarProps) => {
    const dispatch = useAppDispatch()
    const [value, setValue] = useState('')
    const cards = useAppSelector(cardsSelector)
    const findCardsStatus = useAppSelector(findCardsStatusSelector)

    useEffect(() => {
        if (value) {
            dispatch(findCards({ query: value }))
        }
    }, [value])

    return (
        <div className={cls.Searchbar} >
            <label
                className={cls.SearchbarLabel}>
                <h3
                    className={cls.SearchbarHeader}
                >Введите название карты: </h3>
                <input
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                    className={cls.SearchbarInput}
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
