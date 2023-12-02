import { useAnimate } from 'src/shared/lib'
import { Modal, ModalButton } from 'src/shared/ui'
import cls from './ConfirmModal.module.scss'

interface ConfirmModalProps {
    text: string
    callback: () => void
    closeModal: () => void
}

export const ConfirmModal = ({
    text,
    callback,
    closeModal,
}: ConfirmModalProps) => {
    const {
        isOpenAnimation,
        setIsOpenAnimation,
        isCloseAnimation,
        setIsCloseAnimation,
    }: IAnimator = useAnimate()

    const hideModal = () => {
        setIsCloseAnimation(true)
        setTimeout(() => closeModal(), 300)
    }

    return (
        <Modal
            isOpenAnimation={isOpenAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            isCloseAnimation={isCloseAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            closeModal={hideModal}
            modalClass={cls.modal}
        >
            {text}
            <ModalButton text="Ок" onButtonClick={callback} />
        </Modal>
    )
}
