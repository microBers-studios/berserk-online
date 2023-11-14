import { useEffect, useState } from 'react'
import { toast } from 'react-toastify';
import cls from "./CloseModal.module.scss"
import { Modal } from "src/widgets/Modal/Modal";
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import { ModalButton } from 'src/widgets/ModalButton/ModalButton';
import gmailSvg from 'src/shared/assets/images/gmail.svg';
import mailDotRuSvg from 'src/shared/assets/images/maildotru.svg';
import mailDotComSvg from 'src/shared/assets/images/maildotcom.svg';
import { useAppDispatch, useAppSelector } from 'src/shared/lib/redux/redux-hook';
import { registrateUserStatusSelector, sendConfirmEmailStatusSelector } from 'src/app/store/slices/userSlice/selectors';
import { sendConfirmEmail } from 'src/app/store/slices/userSlice/userSlice';
import { Mode } from 'src/app/store/slices/modalSlice/modalSlice';

interface CloseModalProps {
    emailObject: { email: string };
    isAuto?: boolean;
}

const mailServices = {
    "mail.ru": ["Почта Mail.Ru", "https://e.mail.ru/", mailDotRuSvg],
    "mail.com": ["Почта Mail.Com", "https://mail.com/", mailDotComSvg],
    'bk.ru': ["Почта Mail.Ru (bk.ru)", "https://e.mail.ru/"],
    'list.ru': ["Почта Mail.Ru (list.ru)", "https://e.mail.ru/"],
    'inbox.ru': ["Почта Mail.Ru (inbox.ru)", "https://e.mail.ru/"],
    'yandex.ru': ["Яндекс.Почта", "https://mail.yandex.ru/"],
    'ya.ru': ["Яндекс.Почта", "https://mail.yandex.ru/"],
    'yandex.ua': ["Яндекс.Почта", "https://mail.yandex.ua/"],
    'yandex.by': ["Яндекс.Почта", "https://mail.yandex.by/"],
    'yandex.kz': ["Яндекс.Почта", "https://mail.yandex.kz/"],
    'yandex.com': ["Yandex.Mail", "https://mail.yandex.com/"],
    'gmail.com': ["Gmail", "https://mail.google.com/", gmailSvg],
    'googlemail.com': ["Gmail", "https://mail.google.com/"],
    'outlook.com': ["Outlook.com", "https://mail.live.com/"],
    'hotmail.com': ["Outlook.com (Hotmail)", "https://mail.live.com/"],
    'live.ru': ["Outlook.com (live.ru)", "https://mail.live.com/"],
    'live.com': ["Outlook.com (live.com)", "https://mail.live.com/"],
    'me.com': ["iCloud Mail", "https://www.icloud.com/"],
    'icloud.com': ["iCloud Mail", "https://www.icloud.com/"],
    'rambler.ru': ["Рамблер-Почта", "https://mail.rambler.ru/"],
    'yahoo.com': ["Yahoo! Mail", "https://mail.yahoo.com/"],
    'ukr.net': ["Почта ukr.net", "https://mail.ukr.net/"],
    'i.ua': ["Почта I.UA", "http://mail.i.ua/"],
    'bigmir.net': ["Почта Bigmir.net", "http://mail.bigmir.net/"],
    'tut.by': ["Почта tut.by", "https://mail.tut.by/"],
    'inbox.lv': ["Inbox.lv", "https://www.inbox.lv/"],
    'mail.kz': ["Почта mail.kz", "http://mail.kz/"]
} as Record<string, string[]>

export const CloseModal = ({ emailObject, isAuto = true }: CloseModalProps) => {

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
                className={cls.CloseModal}
            >
                <p
                    className={cls.CloseModalText}
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
            </div >
        </Modal >
    );
}
