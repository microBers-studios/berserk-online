import { useEffect } from 'react'
import { toast } from 'react-toastify'
import {
    createDeck,
    createDeckStatusSelector,
    currentDeckSelector,
} from 'src/entities/decks'
import { RouterPaths, useAppDispatch, useAppSelector } from 'src/shared/lib'
import { useNavigate } from 'react-router-dom'
import { Button } from 'src/shared/ui'

interface CreateButtonProps {
    deckName: string
    isSaveDisabled: boolean
}

export const CreateButton = ({
    deckName,
    isSaveDisabled,
}: CreateButtonProps) => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const deck = useAppSelector(currentDeckSelector)
    const createDeckStatus = useAppSelector(createDeckStatusSelector)

    useEffect(() => {
        if (createDeckStatus.isFulfilled && deck && deck.name) {
            navigate(`${RouterPaths.DECK}/${deck.id}`)
            localStorage.removeItem('deck')
        }
    }, [createDeckStatus, deck, navigate])

    const onSaveClick = async () => {
        if (!deck) return
        if (!deckName) {
            toast('Введите имя колоды')
            return
        }
        dispatch(createDeck({ ...deck, name: deckName }))
        if (localStorage.getItem('deck')) {
            localStorage.removeItem('deck')
        }
    }

    return (
        <Button
            disabled={!deck?.main.length || isSaveDisabled}
            onClick={onSaveClick}
            title="Сохранить"
        />
    )
}
