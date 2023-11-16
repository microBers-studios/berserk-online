import { useEffect } from 'react';
import { toast } from "react-toastify";
import cls from "./CreateButton.module.scss"
import { createDeck, createDeckStatusSelector, currentDeckSelector } from "src/entities/decks";
import { RouterPaths, useAppDispatch, useAppSelector } from "src/shared/lib";
import { useNavigate } from 'react-router-dom';

interface CreateButtonProps {
    deckName: string;
    isSaveDisabled: boolean;
}

export const CreateButton = ({ deckName, isSaveDisabled }: CreateButtonProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const deck = useAppSelector(currentDeckSelector)
    const createDeckStatus = useAppSelector(createDeckStatusSelector)

    useEffect(() => {
        if (createDeckStatus.isFulfilled && deck && deck.name) {
            navigate(`${RouterPaths.DECK}/${deck.id}`)
            localStorage.removeItem('deck')
        }

    }, [createDeckStatus])

    const onSaveClick = async () => {
        if (!deck) return
        if (!deckName) {
            toast('Введите имя колоды')
        }
        dispatch(createDeck({ ...deck, name: deckName }))
    }

    return (
        <button
            className={cls.SaveDeckButton}
            disabled={!deck?.main.length || isSaveDisabled}
            onClick={onSaveClick}
        >
            Сохранить
        </button>
    );
}
