import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import cls from './ErrorModal.module.scss'
import { Modal } from 'src/shared/ui'
import { RouterPaths, useAnimate } from 'src/shared/lib'
import errorSvg from 'src/shared/assets/images/error.svg'

// interface ErrorModalProps {
//     className?: string;
// }

export const ErrorModal = () => {
    const {
        isOpenAnimation,
        setIsOpenAnimation,
        isCloseAnimation,
        setIsCloseAnimation,
    }: IAnimator = useAnimate()

    const navigate = useNavigate()

    useEffect(() => {
        document.body.style.overflow = 'hidden'
    }, [])

    const closeModal = () => {
        navigate(RouterPaths.MAIN)
    }

    return (
        <Modal
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={closeModal}
            modalClass={cls.modal}
        >
            <div className={cls.ErrorWrapper}>
                <img src={errorSvg} className={cls.ErrorImage} />
                <h1 className={cls.ErrorModalHeader}>Ошибка!</h1>
                <p className={cls.ErrorText}>
                    Возможно&nbsp;ссылка&nbsp;устарела или неверна.
                </p>
            </div>
        </Modal>
    )
}
