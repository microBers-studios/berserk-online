import { useState, useEffect } from 'react';
import cls from "./DecksContainer.module.scss";
import { DecksArray } from "src/API/utils/types";
import APIController from 'src/API/Controller';
import { DeckItem } from './DeckItem/DeckItem';
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext';
import { UserContext } from 'src/app/providers/UserProvider';
import { defaultUser } from 'src/app/providers/UserProvider/lib/UserContextProvider';
import ReactLoading from 'react-loading';

// interface DecksContainerProps {
//     className?: string;
// }

export const DecksContainer = () => {
    const { user, isUserLoading } = useRequiredContext(UserContext)
    const [decks, setDecks] = useState<DecksArray>([])
    const [isLoading, setIsLoading] = useState<boolean>(false)

    let userIsUnauthorized = user === defaultUser && !isUserLoading

    useEffect(() => {
        if (userIsUnauthorized) {
            return
        }
        new Promise(async () => {
            setIsLoading(true)
            const decks = await APIController.getDecks()
            setIsLoading(false)
            setDecks(decks)
        })
    }, [user])

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
                    {!userIsUnauthorized && !isLoading &&
                        <span
                            className={cls.DecksCount}
                        >
                            {decks.length} из {decks.length}
                        </span>}
                </div>
                {!userIsUnauthorized && !isUserLoading &&
                    <button
                        className={cls.AddButton}
                    >
                        Добавить
                    </button>}
            </div>
            <div className={`${cls.DecksWrapper} ${(userIsUnauthorized
                || isUserLoading
                || !decksList.length) && cls.NoDecks}`}>
                {isLoading
                    ? <ReactLoading type={'bubbles'} color={'#ffffff'} height={100} width={90} />
                    : userIsUnauthorized
                        ? <span
                            className={cls.NoDecksContent}
                        >
                            Войдите в аккаунт, чтобы увидеть колоды
                        </span>
                        : decksList.length
                            ? decksList
                            : <span className={cls.NoDecksContent}>Колод пока нет</span>}
            </div>
        </div >
    );
}
