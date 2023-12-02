import { useState } from 'react'
import cls from './PasswordInput.module.scss'
import eyeOpened from 'src/shared/assets/images/eye-opened.png'
import eyeClosed from 'src/shared/assets/images/eye-closed.svg'

interface PasswordInputProps {
    password: string
    setPassword: (str: string) => void
    passwordError: number
    setPasswordError: (num: number) => void
    label?: string
}

export const PasswordInput = ({
    password,
    setPassword,
    passwordError,
    setPasswordError,
    label = 'Введите пароль:',
}: PasswordInputProps) => {
    const [isHidden, setIsHidden] = useState<boolean>(true)

    const onEyeClick = () => {
        setIsHidden(!isHidden)
    }

    return (
        <label className={`${cls.FormLabel} ${cls.passwordLabel}`}>
            <span>
                {label}
                <span className={cls.red}> *</span>
            </span>
            <div className={cls.passwordInput}>
                <input
                    value={password}
                    type={isHidden ? 'password' : 'input'}
                    name="password"
                    className={cls.FormInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                        if (password) setPasswordError(0)
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
            {passwordError === 1 && (
                <span className={cls.redAlert}>*Заполните это поле</span>
            )}
            {passwordError === 2 && (
                <span className={cls.longRedAlert}>
                    *Пароль не должен быть короче 8 символов и должен содержать
                    буквы, цифры и символы
                </span>
            )}
            {passwordError === 3 && (
                <span className={cls.redAlert}>Пароль неверный.</span>
            )}
            {passwordError === 4 && (
                <span className={cls.redAlert}>Пароли не совпадают</span>
            )}
        </label>
    )
}
