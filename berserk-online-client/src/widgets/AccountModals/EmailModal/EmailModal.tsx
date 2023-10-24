import { Modal } from "src/widgets/Modal/Modal";
import cls from "./EmailModal.module.scss"
import { Modals } from "src/widgets/Navbar/Navbar";
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import { AlertContext, AlertContextProps } from "src/app/providers/AlertProvider/lib/AlertContext";
import { useRequiredContext } from "src/helpers/hooks/useRequiredContext";
import { useState } from "react";
import { UserContextProps } from "src/app/providers/UserProvider/lib/types/types";
import { UserContext } from "src/app/providers/UserProvider";
import { EmailInput } from "../Inputs/EmailInput";
import APIController from "src/API/Controller";

interface EmailModalProps {
    setModal: (modal: false | Modals) => void;
}

export const EmailModal = ({ setModal }: EmailModalProps) => {
    const { isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation }: IAnimator = useAnimate()

    const { user } = useRequiredContext<UserContextProps>(UserContext)

    const { setAlert } = useRequiredContext<AlertContextProps>(AlertContext)

    const [email, setEmail] = useState<string>(user.email)
    const [emailError, setEmailError] = useState<number>(0)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const closeModal = () => {
        setIsCloseAnimation(true)
        setTimeout(() => setModal(false), 300)
        document.body.style.overflow = ''
    }

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        await APIController.requestPasswordChanging(email)

        setIsLoading(false)
        setAlert('Письмо отправлено.')
    }

    return (
        <Modal
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={closeModal}
            modalClass={Modals.EMAIL}
        >
            <div>
                <form
                    className={cls.EmailForm}
                    onSubmit={onFormSubmit}
                >
                    <h1>Сброс пароля</h1>
                    <EmailInput
                        email={email}
                        setEmail={setEmail}
                        emailError={emailError}
                        setEmailError={setEmailError}
                    />
                    <span>На указанный адрес мы отправим Вам письмо для изменения пароля.</span>
                    <button
                        className={`${cls.FormButton} ${isLoading && cls.grayButton}`}
                    >
                        Отправить
                    </button>
                </form>
            </div >
        </Modal>
    )
}
