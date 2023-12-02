import { useAppDispatch, useAppSelector } from 'src/shared/lib'
import cls from './SaveButton.module.scss'
import {
    getDeckStatusSelector,
    updateDeck,
    updateDeckStatusSelector,
} from 'src/entities/decks'
import { currentDeckSelector } from 'src/entities/decks'

interface SaveButtonProps {
    isSaveDisabled: boolean
    setIsSaveDisabled: (b: boolean) => void
}

export const SaveButton = ({
    isSaveDisabled,
    setIsSaveDisabled,
}: SaveButtonProps) => {
    const dispatch = useAppDispatch()

    const deck = useAppSelector(currentDeckSelector)
    const updateDeckStatus = useAppSelector(updateDeckStatusSelector)
    const getDeckStatus = useAppSelector(getDeckStatusSelector)

    const onSaveClick = async () => {
        if (!deck) return
        dispatch(updateDeck(deck))
        setIsSaveDisabled(true)
    }

    return (
        <button
            className={cls.SaveDeckButton}
            disabled={
                !deck?.main.length ||
                isSaveDisabled ||
                updateDeckStatus.isPending ||
                getDeckStatus.isUncompleted
            }
            onClick={onSaveClick}
        >
            Сохранить
        </button>
    )
}
