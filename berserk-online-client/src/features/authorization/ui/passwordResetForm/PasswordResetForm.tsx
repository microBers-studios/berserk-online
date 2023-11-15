import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/shared/lib";
import cls from "./PasswordResetForm.module.scss"
import { ModalButton, PasswordInput } from "src/shared/ui";
import { changePassword, changePasswordStatusSelector } from "src/entities/user";
import { validatePassword } from "../../lib/validate-password";

interface PasswordResetFormProps {
    token: string;
    closeModal: () => void;
}

export const PasswordResetForm = ({ token, closeModal }: PasswordResetFormProps) => {
    const dispatch = useAppDispatch()
    const changePasswordStatus = useAppSelector(changePasswordStatusSelector)

    const [password, setPassword] = useState('')
    const [passwordError, setPasswordError] = useState(0)

    const [extraPassword, setExtraPassword] = useState('')
    const [extraPasswordError, setExtraPasswordError] = useState(0)

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

            dispatch(changePassword({ token, password, fulfilledCallback: closeModal }))
        }
    }

    return (
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
    );
}
