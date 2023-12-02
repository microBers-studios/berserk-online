import { Modal } from 'src/shared/ui'
import cls from './CardModal.module.scss'
import { useAnimate, useAppDispatch, useAppSelector } from 'src/shared/lib'
import trashCanImage from 'src/shared/assets/images/trash.svg'
import {
    changeCardAmount,
    currentDeckSelector,
    deleteCard,
} from 'src/entities/decks'

interface CardModalProps {
    closeModal: () => void
    card: IDeckCard
    setIsSaveDisabled: (b: boolean) => void
    isSaveDisabled: boolean
}

export const CardModal = ({
    closeModal,
    card,
    setIsSaveDisabled,
    isSaveDisabled,
}: CardModalProps) => {
    const dispatch = useAppDispatch()
    const deck = useAppSelector(currentDeckSelector)
    const {
        isOpenAnimation,
        setIsOpenAnimation,
        isCloseAnimation,
        setIsCloseAnimation,
    }: IAnimator = useAnimate()

    const removeCard = () => {
        hideModal()
        setTimeout(() => {
            dispatch(deleteCard({ cardId: card.id }))

            if (deck?.main.length !== 1) {
                setIsSaveDisabled(false)
            } else if (!isSaveDisabled) {
                setIsSaveDisabled(true)
            }
        }, 250)
    }

    const regCardAmount = (isIncrease: boolean) => {
        if ((!isIncrease && card.amount !== 1) || isIncrease) {
            setIsSaveDisabled(false)
        }
        dispatch(changeCardAmount({ cardId: card.id, isIncrease }))
    }

    const hideModal = () => {
        setIsCloseAnimation(true)
        setTimeout(closeModal, 300)
        document.body.style.overflow = ''
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
                <h2 className={cls.CardHeader}>
                    {card.name + ` (${card.amount})`}
                </h2>
                <div className={cls.CardAmountButtonsWrapper}>
                    <button
                        className={cls.CardAmountButton}
                        onClick={() => regCardAmount(true)}
                    >
                        +
                    </button>
                    <button
                        className={cls.CardAmountButton}
                        onClick={() => regCardAmount(false)}
                    >
                        -
                    </button>
                </div>
                <button className={cls.DeleteCardButton}>
                    <img
                        src={trashCanImage}
                        className={cls.trashCanImage}
                        onClick={removeCard}
                    />
                </button>
            </div>
        </Modal>
    )
}
