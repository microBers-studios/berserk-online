import { useEffect, useState } from "react";
import ReactLoading from 'react-loading'
import cls from "./Searchbar.module.scss"
import APIController from "src/API/Controller";
import { ICard } from "src/API/utils/types";
import { SearchbarCardItem } from "./SearchbarCardItem/SearchbarCardItem";

// interface SearchBarProps {
//     className?: string;
// }

export const Searchbar = () => {
    const [value, setValue] = useState('')
    const [results, setResults] = useState<ICard[]>([])
    const [isLoading, setIsLoading] = useState(false)

    useEffect(() => {
        if (!value) {
            setResults([])
            return
        }

        new Promise(async () => {
            setIsLoading(true)
            const cards = await APIController.findCards(value)
            setResults(cards)
            setIsLoading(false)
        })

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
                    {isLoading
                        ? <ReactLoading type={'bubbles'} color={'#ffffff'} height={100} width={90} />
                        : results.map(res =>
                            <SearchbarCardItem key={res.id} card={res} />)
                    }
                </ul>
            </div>
        </div >
    );
}
