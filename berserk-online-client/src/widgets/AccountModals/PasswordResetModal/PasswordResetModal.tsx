import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/shared/lib/redux/redux-hook";
import cls from "./PasswordResetModal.module.scss"
import { Modal } from "src/widgets/Modal/Modal";
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import { PasswordInput } from "../Inputs/PasswordInput";
import { validatePassword } from "src/shared/lib/password/validate-password";
import { ModalButton } from "src/widgets/ModalButton/ModalButton";
import { changePassword } from "src/app/store/slices/userSlice/userSlice";
import { changePasswordStatusSelector } from "src/app/store/slices/userSlice/selectors";

interface PasswordResetModalProps {
    closeModal: () => void;
    token: string;
}

export const PasswordResetModal = ({ closeModal, token }: PasswordResetModalProps) => {
    const {
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()

    const dispatch = useAppDispatch()
    const changePasswordStatus = useAppSelector(changePasswordStatusSelector)

    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<number>(0)

    const [extraPassword, setExtraPassword] = useState<string>('')
    const [extraPasswordError, setExtraPasswordError] = useState<number>(0)

    const endChanging = () => {
        setIsCloseAnimation(true)
        setTimeout(() => closeModal(), 300)
        document.body.style.overflow = ''
    }

    const onFormSubmit = async (e: React.FormEvent) => {
        if (!changePasswordStatus.isPending) {
            e.preventDefault()

            if (!password || !validatePassword(password)) {
                const error = password ? validatePassword(password) ? 0 : 2 : 1
                setPasswordError(error)
                if (error) return
            }

            if (password.trim() !== extraPassword.trim()) {
                setExtraPasswordError(4)
                return
            }

            dispatch(changePassword({ token, password, fulfilledCallback: endChanging }))
        }
    }

    return (
        <div className={cls.PasswordResetModal} >
            <Modal
                isCloseAnimation={isCloseAnimation}
                isOpenAnimation={isOpenAnimation}
                setIsCloseAnimation={setIsCloseAnimation}
                setIsOpenAnimation={setIsOpenAnimation}
                closeModal={closeModal}
            >
                <form
                    className={cls.Form}
                    onSubmit={onFormSubmit}
                >

                    <h1 className={cls.FormHeader}>
                        Сброс пароля
                    </h1>
                    <div className={cls.PasswordInputs}>
                        <PasswordInput
                            password={password}
                            setPassword={setPassword}
                            passwordError={passwordError}
                            setPasswordError={setPasswordError}
                            label={'Введите новый пароль:'}
                        />

                        <PasswordInput
                            password={extraPassword}
                            setPassword={setExtraPassword}
                            passwordError={extraPasswordError}
                            setPasswordError={setExtraPasswordError}
                            label={'Подтвердите новый пароль:'}
                        />
                    </div>
                    <ModalButton
                        text="Сохранить"
                        isActive={changePasswordStatus.isPending}
                    />
                </form>
            </Modal>
        </div >
    );
}
