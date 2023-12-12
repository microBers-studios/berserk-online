import { Modal } from 'src/shared/ui'
import cls from './SearchbarCardModal.module.scss'
import { useAnimate, useAppDispatch, useAppSelector } from 'src/shared/lib'
import plusImage from 'src/shared/assets/images/red-plus.png'
import { addCard, currentDeckSelector } from 'src/entities/decks'

interface SearchbarCardModalProps {
    card: CardType
    closeModal: () => void
    setIsSaveDisabled: (b: boolean) => void
}

export const SearchbarCardModal = ({
    card,
    closeModal,
    setIsSaveDisabled,
}: SearchbarCardModalProps) => {
    const dispatch = useAppDispatch()
    const deck = useAppSelector(currentDeckSelector)
    const {
        isOpenAnimation,
        setIsOpenAnimation,
        isCloseAnimation,
        setIsCloseAnimation,
    }: IAnimator = useAnimate()

    const isInDeck = Boolean(deck?.main.find((c) => c.id === card.id))

    const hideModal = () => {
        setIsCloseAnimation(true)
        setTimeout(closeModal, 300)
        document.body.style.overflow = ''
    }

    const addCardToDeck = () => {
        dispatch(addCard({ card }))
        setIsSaveDisabled(false)
        hideModal()
    }

    return (
        <Modal
            isOpenAnimation={isOpenAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            isCloseAnimation={isCloseAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            closeModal={hideModal}
            modalClass={cls.CardModal}
            theme={'dark'}
        >
            <div className={cls.CardModalContent}>
                <div className={cls.CardImageWrapper}>
                    <img
                        src={card.image}
                        alt={card.name}
                        className={cls.CardImage}
                    />
                </div>
                <h2 className={cls.CardHeader}>{card.name}</h2>
                {!isInDeck && (
                    <button className={cls.AddButton} onClick={addCardToDeck}>
                        <img
                            className={cls.plusImage}
                            src={plusImage}
                            alt="add"
                        />
                    </button>
                )}
            </div>
        </Modal>
    )
}
