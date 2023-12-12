import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import cls from './SendPasswordResetModal.module.scss'
import { useAppDispatch, useAppSelector, useAnimate } from 'src/shared/lib'
import { Modal, ModalButton, EmailInput } from 'src/shared/ui'
import {
    requestPasswordChanging,
    requestPasswordChangingStatusSelector,
} from 'src/entities/user'
import { EMAIL_REGULAR } from '../../const'

interface SendPasswordResetModalProps {
    closeModal: () => void
}

export const SendPasswordResetModal = ({
    closeModal,
}: SendPasswordResetModalProps) => {
    const {
        isOpenAnimation,
        setIsOpenAnimation,
        isCloseAnimation,
        setIsCloseAnimation,
    }: IAnimator = useAnimate()

    const { user } = useAppSelector((state) => state.user)
    const dispatch = useAppDispatch()
    const requestPasswordChangingStatus = useAppSelector(
        requestPasswordChangingStatusSelector
    )

    const [email, setEmail] = useState<string>(user?.email as string)
    const [emailError, setEmailError] = useState<number>(0)

    const [isReady, setIsReady] = useState<boolean>(true)
    const [intervalID, setIntervalID] = useState<number | null>(null)
    const [time, setTime] = useState<number>(59)

    // useEffect(() => {

    //     const interval = setInterval(() => {
    //         setTime(t => t - 1)
    //     }, 1000)

    //     setIntervalID(interval)
    // }, [dispatch])

    useEffect(() => {
        if (time <= 0) {
            setIsReady(true)
            clearInterval(intervalID as number)
            setIntervalID(null)
        }
    }, [time])

    const exitModal = () => {
        if (!requestPasswordChangingStatus.isPending) {
            setIsCloseAnimation(true)
            setTimeout(closeModal, 300)
            document.body.style.overflow = ''
        }
    }

    const onButtonClick = (e: React.MouseEvent<HTMLButtonElement>) => {
        if (!requestPasswordChangingStatus.isPending) {
            e.preventDefault()
            if (!email) {
                setEmailError(1)
                return
            }
            if (!EMAIL_REGULAR.test(email)) {
                setEmailError(2)
                return
            }
            dispatch(requestPasswordChanging(email))

            setIsReady(false)
            const interval = setInterval(() => {
                setTime((t) => t - 1)
            }, 1000)

            setIntervalID(interval)
            toast('Письмо отправлено.')
        }
    }

    return (
        <Modal
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={exitModal}
            modalClass={cls.modal}
        >
            <form className={cls.EmailForm}>
                <h1 className={cls.ModalHeader}>Сброс пароля</h1>
                <EmailInput
                    email={email}
                    setEmail={setEmail}
                    emailError={emailError}
                    setEmailError={setEmailError}
                />
                <span>
                    На указанный адрес мы отправим Вам письмо для изменения
                    пароля.
                </span>
                <ModalButton
                    text={
                        isReady
                            ? `Отправить повторно`
                            : `Отправить повторно | ${time}`
                    }
                    isActive={!isReady}
                    onButtonClick={onButtonClick}
                />
            </form>
        </Modal>
    )
}
