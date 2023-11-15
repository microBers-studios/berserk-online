import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import { useAppDispatch, useAppSelector } from 'src/shared/lib';
import cls from "./SendEmailModal.module.scss"
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import {
    registrateUserStatusSelector,
    sendConfirmEmailStatusSelector,
    sendConfirmEmail
} from 'src/entities/user';
import { Mode } from 'src/entities/modal';
import { Modal, ModalButton } from "src/shared/ui";
import { mailServices } from '../../const';

interface CloseModalProps {
    emailObject: { email: string };
    isAuto?: boolean;
}

export const SendEmailModal = ({ emailObject, isAuto = true }: CloseModalProps) => {
    const { isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation }: IAnimator = useAnimate()
    const sendConfirmEmailStatus = useAppSelector(sendConfirmEmailStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)
    const dispatch = useAppDispatch()

    const [mailService, setMailService] = useState<string[] | null>(null)
    const [isReady, setIsReady] = useState<boolean>(false)
    const [intervalID, setIntervalID] = useState<number | null>(null)
    const [time, setTime] = useState<number>(59)

    useEffect(() => {
        try {
            setMailService(mailServices[emailObject.email.split('@')[1]])
        } catch (e: any) {
            toast(e.message)
        }

        if (!isAuto) dispatch(sendConfirmEmail())

        const interval = setInterval(() => {
            setTime(t => t - 1)
        }, 1000)

        setIntervalID(interval)
    }, [])

    useEffect(() => {
        if (time <= 0) {
            setIsReady(true)
            clearInterval(intervalID as number)
            setIntervalID(null)
        }
    }, [time])

    const onButtonClick = async () => {
        if (!sendConfirmEmailStatus.isPending && !registrateUserStatus.isPending) {
            dispatch(sendConfirmEmail())

            setIsReady(false)
            setTime(59)

            const interval = setInterval(() => {
                setTime(t => t - 1)
            }, 1000)

            setIntervalID(interval)
        }
    }

    const closeModal = () => {
        if (!sendConfirmEmailStatus.isPending && !registrateUserStatus.isPending) {
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
            modalClass={Mode.CLOSE}
        >
            <div
                className={cls.SendEmailModal}
            >
                <p
                    className={cls.SendEmailModalText}
                >Перейдите в почту, чтобы подтвердить свой аккаунт{mailService === undefined ? '.' : ':'}
                </p>
                {mailService &&
                    (mailService[2] !== undefined ? <div className={cls.MailImageLinkWrapper}>
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
                        :
                        <div className={cls.MailLinkWrapper}>
                            <a
                                href={mailService[1]}
                                target="_blank"
                                className={cls.MailLink}
                            >
                                <p className={cls.MailLink}>
                                    {mailService[0]}
                                </p>
                            </a>
                        </div>)}
                <ModalButton
                    text={isReady
                        ? `Отправить повторно`
                        : `Отправить повторно | ${time}`}
                    isActive={!isReady}
                    onButtonClick={onButtonClick}
                />
            </div>
        </Modal>
    );
}
