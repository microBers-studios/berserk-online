import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/helpers/hooks/redux-hook";
import { toast } from "react-toastify";
import cls from "./EmailModal.module.scss"
import { Modal } from "src/widgets/Modal/Modal";
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import { EmailInput } from "../Inputs/EmailInput";
import { ModalButton } from "src/widgets/ModalButton/ModalButton";
import { requestPasswordChanging } from "src/app/store/slices/userSlice/userSlice";
import { requestPasswordChangingStatusSelector } from "src/app/store/slices/userSlice/selectors";
import { Mode, setMode } from "src/app/store/slices/modalSlice/modalSlice";

export const EmailModal = () => {
    const { isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation }: IAnimator = useAnimate()

    const { user } = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    const requestPasswordChangingStatus = useAppSelector(requestPasswordChangingStatusSelector)

    const [email, setEmail] = useState<string>(user?.email as string)
    const [emailError, setEmailError] = useState<number>(0)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const closeModal = () => {
        if (!requestPasswordChangingStatus.isPending) {
            setIsCloseAnimation(true)
            setTimeout(() => dispatch(setMode({ mode: null })), 300)
            document.body.style.overflow = ''
        }
    }

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        if (!requestPasswordChangingStatus.isPending) {
            e.preventDefault()
            setIsLoading(true)
            dispatch(requestPasswordChanging(email))
            setIsLoading(false)
            toast('Письмо отправлено.')
        }
    }

    return (
        <Modal
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={closeModal}
            modalClass={Mode.EMAIL}
        >
            <div>
                <form
                    className={cls.EmailForm}
                    onSubmit={onFormSubmit}
                >
                    <h1
                        className={cls.ModalHeader}
                    >Сброс пароля</h1>
                    <EmailInput
                        email={email}
                        setEmail={setEmail}
                        emailError={emailError}
                        setEmailError={setEmailError}
                    />
                    <span>На указанный адрес мы отправим Вам письмо для изменения пароля.</span>
                    <ModalButton
                        text="Отправить"
                        isActive={isLoading}
                    />
                </form>
            </div >
        </Modal >
    )
}
