import { useState, useEffect, useMemo } from 'react';
import cls from "./DecksContainer.module.scss";
import APIController from 'src/API/Controller';
import { DeckItem } from './DeckItem/DeckItem';
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext';
import { UserContext } from 'src/app/providers/UserProvider';
import { defaultUser } from 'src/app/providers/UserProvider/lib/UserContextProvider';
import ReactLoading from 'react-loading';
import { DecksContext } from 'src/app/providers/DecksProvider/utils/DecksContext';

// interface DecksContainerProps {
//     className?: string;
// }

export const DecksContainer = () => {
    const { user, isUserLoading } = useRequiredContext(UserContext)
    const { decks, setDecks } = useRequiredContext(DecksContext)
    const [isLoading, setIsLoading] = useState<boolean>(true)

    let userIsUnauthorized = user === defaultUser && !isUserLoading

    useEffect(() => {
        if (userIsUnauthorized) {
            setIsLoading(false)
            return
        }

        new Promise(async () => {
            const decks = await APIController.getDecks()
            setIsLoading(false)
            setDecks(decks)
        })
    }, [decks])

    const decksList = useMemo(() => decks.map(deck =>
        <DeckItem
            key={deck.id}
            deck={deck}
            setDecks={setDecks}
        />
    ), [decks])

    return (
        <div className={cls.DecksContainer} >
            <div className={cls.DecksHeaderWrapper}>
                <div className={cls.HeaderWrapper}>
                    <span
                        className={cls.DecksHeader}
                    >
                        Колоды
                    </span>
                    {!userIsUnauthorized && !isLoading && !isUserLoading &&
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
                || !decksList.length
            ) && cls.NoDecks}`}>
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
