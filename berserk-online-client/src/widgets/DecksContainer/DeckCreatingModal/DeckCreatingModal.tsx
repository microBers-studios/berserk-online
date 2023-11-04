import { useState } from 'react';
import { useNavigate } from 'react-router-dom'
import { Modal } from "src/widgets/Modal/Modal";
import cls from "./DeckCreatingModal.module.scss"
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import { ModalButton } from "src/widgets/ModalButton/ModalButton";
import { Modals } from "src/widgets/Navbar/Navbar";
import { Deck } from 'src/app/providers/Deck/Deck';
import { RouterPaths } from 'src/app/providers/router/router-paths';
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext';
import { DecksContext } from 'src/app/providers/DecksProvider/utils/DecksContext';
import APIController from 'src/API/Controller';
import { useAlert } from 'src/helpers/hooks/useAlert';

interface DeckCreatingModalProps {
    closeModal: () => void
}

export const DeckCreatingModal = ({ closeModal }: DeckCreatingModalProps) => {
    const [deckName, setDeckName] = useState('')
    const [isLoading, setIsLoading] = useState(false)
    const navigate = useNavigate()
    const setAlert = useAlert()

    const {
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()

    const { decks, setDecks } = useRequiredContext(DecksContext)

    const close = () => {
        setIsCloseAnimation(true)

        setTimeout(() => {
            document.body.style.overflow = ''
            closeModal()
        }, 300)
    }

    const createDeck = async (e: React.FormEvent) => {
        e.preventDefault()

        const deck = new Deck(deckName)

        setIsLoading(true)
        const code = await APIController.createDeck(deck)
        setIsLoading(false)

        if (code === 200) {
            setDecks([...decks, deck])
        }

        if (code === 404) {
            setAlert('Ошибка!')
        }

        close()

        navigate(`${RouterPaths.DECK}/${deck.id}`)
    }

    return (
        <div className={cls.DeckCreatingModal} >
            <Modal
                isOpenAnimation={isOpenAnimation}
                setIsOpenAnimation={setIsOpenAnimation}
                isCloseAnimation={isCloseAnimation}
                setIsCloseAnimation={setIsCloseAnimation}
                closeModal={close}
                modalClass={Modals.EMAIL}
            >
                <form
                    className={cls.DeckCreatingForm}
                    onSubmit={createDeck}
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
                            isActive={isLoading}
                        />
                    </div>

                </form>
            </Modal>
        </div >
    );
}
