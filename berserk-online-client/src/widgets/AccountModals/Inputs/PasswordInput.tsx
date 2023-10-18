import { useState } from 'react'
import cls from "./inputs.module.scss"
import eyeOpened from "src/shared/assets/images/eye-opened.png"
import eyeClosed from "src/shared/assets/images/eye-closed.svg"

interface PasswordInputProps {
    value: {
        password: string
        setPassword: (str: string) => void
    }
    error: {
        passwordError: number;
        setPasswordError: (num: number) => void
    };
}

export const PasswordInput = ({ value, error }: PasswordInputProps) => {
    const [isHidden, setIsHidden] = useState<boolean>(true)
    const { password, setPassword } = value

    const onEyeClick = () => {
        setIsHidden(!isHidden)
    }

    return (
        <label className={`${cls.FormLabel} ${cls.passwordLabel}`}>
            <span>Введите пароль:<span className={cls.red}> *</span></span>
            <div className={cls.passwordInput}>
                <input
                    value={password}
                    type={isHidden ? "password" : "input"}
                    name="password"
                    className={cls.FormInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (password) error.setPasswordError(0)
                        setPassword(e.target.value)
                    }}
                    required
                />
                <img
                    src={isHidden ? eyeClosed : eyeOpened}
                    className={cls.passwordEye}
                    onClick={onEyeClick}
                />
            </div>
            {error.passwordError === 1 &&
                <span className={cls.redAlert}>*Заполните это поле</span>}
            {error.passwordError === 2 &&
                <span className={cls.longRedAlert}>*Пароль не должен быть короче 8 символов и должен содержать буквы, цифры и символы</span>}
            {error.passwordError === 3 &&
                <span className={cls.redAlert}>Пароль неверный.</span>}
        </label>
    );
}
