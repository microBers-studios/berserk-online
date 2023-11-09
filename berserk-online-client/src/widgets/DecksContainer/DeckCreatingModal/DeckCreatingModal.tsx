import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Modal } from "src/widgets/Modal/Modal";
import cls from "./DeckCreatingModal.module.scss"
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import { ModalButton } from "src/widgets/ModalButton/ModalButton";
import { Deck } from 'src/app/providers/Deck/Deck';
import { RouterPaths } from 'src/app/providers/router/router-paths';
import { useAppDispatch, useAppSelector } from 'src/helpers/hooks/redux-hook';
import { Mode, setMode } from 'src/app/store/slices/modalSlice/modalSlice';
import { createDeck } from 'src/app/store/slices/decksSlice/decksSlice';
import { createDeckStatusSelector } from 'src/app/store/slices/decksSlice/selectors';
import { IDeck } from 'src/API/utils/types';

export const DeckCreatingModal = () => {
    const [deckName, setDeckName] = useState('')
    const createDeckStatus = useAppSelector(createDeckStatusSelector)
    const dispatch = useAppDispatch()
    const navigate = useNavigate()

    const {
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()

    let deck: IDeck = new Deck(deckName);

    useEffect(() => {
        if (createDeckStatus.isFulfilled) {
            close()

            navigate(`${RouterPaths.DECK}/${deck.id}/creating`)
        }
    }, [createDeckStatus])

    const close = () => {
        if (!createDeckStatus.isPending) {
            setIsCloseAnimation(true)

            setTimeout(() => {
                document.body.style.overflow = ''
                dispatch(setMode({ mode: null }))
            }, 300)
        }
    }

    const addDeck = async (e: React.FormEvent) => {
        if (!createDeckStatus.isPending) {
            e.preventDefault()

            // const deck = new Deck(deckName)

            dispatch(createDeck(deck))
        }
    }

    return (
        <div className={cls.DeckCreatingModal} >
            <Modal
                isOpenAnimation={isOpenAnimation}
                setIsOpenAnimation={setIsOpenAnimation}
                isCloseAnimation={isCloseAnimation}
                setIsCloseAnimation={setIsCloseAnimation}
                closeModal={close}
                modalClass={Mode.EMAIL}
            >
                <form
                    className={cls.DeckCreatingForm}
                    onSubmit={addDeck}
                >
                    <h1
                        className={cls.DeckCreatingHeader}
                    >
                        Создание колоды
                    </h1>

                    <label
                        className={cls.DeckNameLabel}>
                        <span>Введите имя колоды:<span className={cls.red}> *</span></span>
                        <input
                            value={deckName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setDeckName(e.target.value)}
                            type="text"
                            className={cls.DeckNameInput}
                            required={true}
                        />
                    </label>

                    <div
                        className={cls.DeckCreatingButton}
                    >
                        <ModalButton
                            text='Создать'
                            isActive={createDeckStatus.isPending}
                        />
                    </div>

                </form>
            </Modal>
        </div >
    );
}
