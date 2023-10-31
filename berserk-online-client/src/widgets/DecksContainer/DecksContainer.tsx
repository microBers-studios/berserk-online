import { useState, useEffect } from 'react';
import cls from "./DecksContainer.module.scss";
import { DecksArray } from "src/API/utils/types";
import APIController from 'src/API/Controller';
import { DeckItem } from '../DeckItem/DeckItem';


// interface DecksContainerProps {
//     className?: string;
// }

export const DecksContainer = () => {
    const [decks, setDecks] = useState<DecksArray>([])

    useEffect(() => {
        new Promise(async () => {
            const decks = await APIController.getDecks()
            setDecks(decks)
            console.log(decks)
        })
    }, [])

    const decksList = decks.map(deck =>
        <DeckItem key={deck.id} deck={deck} />
    )

    return (
        <div className={cls.DecksContainer} >
            <div className={cls.DecksHeaderWrapper}>
                <div className={cls.HeaderWrapper}>
                    <span
                        className={cls.DecksHeader}
                    >
                        Колоды
                    </span>
                    <span
                        className={cls.DecksCount}
                    >
                        {decks.length} из {decks.length}
                    </span>
                </div>
                <button
                    className={cls.AddButton}
                >
                    Добавить
                </button>
            </div>
            <div className={cls.DecksWrapper}>
                {decksList}
            </div>

        </div >
    );
}
