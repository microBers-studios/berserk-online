import { useEffect, useState } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector, useAnimate } from 'src/shared/lib'
import cls from './SendEmailConfirmModal.module.scss'
import {
    registrateUserStatusSelector,
    sendConfirmEmailStatusSelector,
    sendConfirmEmail,
} from 'src/entities/user'
import { Modal, ModalButton } from 'src/shared/ui'
import { mailServices } from '../../const'

interface CloseModalProps {
    email: string
    isAuto?: boolean
}

export const SendEmailConfirmModal = ({
    email,
    isAuto = true,
}: CloseModalProps) => {
    const {
        isOpenAnimation,
        setIsOpenAnimation,
        isCloseAnimation,
        setIsCloseAnimation,
    }: IAnimator = useAnimate()
    const sendConfirmEmailStatus = useAppSelector(
        sendConfirmEmailStatusSelector
    )
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)
    const dispatch = useAppDispatch()

    const [mailService, setMailService] = useState<string[] | null>(null)
    const [isReady, setIsReady] = useState<boolean>(false)
    const [intervalID, setIntervalID] = useState<number | null>(null)
    const [time, setTime] = useState<number>(59)

    useEffect(() => {
        try {
            setMailService(mailServices[email.split('@')[1]])
        } catch (e) {
            const error = e as Error
            toast(error.message)
        }

        if (!isAuto) dispatch(sendConfirmEmail())

        const interval = setInterval(() => {
            setTime((t) => t - 1)
        }, 1000)

        setIntervalID(interval)
    }, [dispatch, email, isAuto])

    useEffect(() => {
        if (time <= 0) {
            setIsReady(true)
            clearInterval(intervalID as number)
            setIntervalID(null)
        }
    }, [time])

    const onButtonClick = async () => {
        if (
            !sendConfirmEmailStatus.isPending &&
            !registrateUserStatus.isPending
        ) {
            dispatch(sendConfirmEmail())

            setIsReady(false)
            setTime(59)

            const interval = setInterval(() => {
                setTime((t) => t - 1)
            }, 1000)

            setIntervalID(interval)
        }
    }

    const closeModal = () => {
        if (
            !sendConfirmEmailStatus.isPending &&
            !registrateUserStatus.isPending
        ) {
            window.close()
        }
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
            <div className={cls.SendEmailModal}>
                <p className={cls.SendEmailModalText}>
                    Перейдите в почту, чтобы подтвердить свой аккаунт
                    {mailService === undefined ? '.' : ':'}
                </p>
                {mailService &&
                    (mailService[2] !== undefined ? (
                        <div className={cls.MailImageLinkWrapper}>
                            <a
                                href={mailService[1]}
                                target="_blank"
                                className={cls.MailLink}
                            >
                                <img
                                    className={cls.MailServiceImage}
                                    src={mailService[2]}
                                />
                            </a>
                        </div>
                    ) : (
                        <div className={cls.MailLinkWrapper}>
                            <a
                                href={mailService[1]}
                                target="_blank"
                                className={cls.MailLink}
                            >
                                <p className={cls.MailLink}>{mailService[0]}</p>
                            </a>
                        </div>
                    ))}
                <ModalButton
                    text={
                        isReady
                            ? `Отправить повторно`
                            : `Отправить повторно | ${time}`
                    }
                    isActive={!isReady}
                    onButtonClick={onButtonClick}
                />
            </div>
        </Modal>
    )
}
