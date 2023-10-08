import { useState } from 'react'
import cls from "./LoginModal.module.scss"
import eyeOpened from "../../shared/assets/images/eye-opened.png"
import eyeClosed from "../../shared/assets/images/eye-closed.svg"

interface PasswordInputProps {
    value: {
        password: string
        setPassword: (str: string) => void
    }
}

export const PasswordInput = ({ value }: PasswordInputProps) => {
    const [isHidden, setIsHidden] = useState<boolean>(true)
    const { password, setPassword } = value

    const onEyeClick = () => {
        setIsHidden(!isHidden)
    }

    return (
        <label className={cls.FormLabel}>
            <span>Введите пароль:<span className={cls.red}> *</span></span>
            <div className={cls.passwordInput}>
                <input
                    value={password}
                    type={isHidden ? "password" : "input"}
                    name="password"
                    className={cls.FormInput}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setPassword(e.target.value)}
                    required
                />
                <img
                    src={isHidden ? eyeClosed : eyeOpened}
                    className={cls.passwordEye}
                    onClick={onEyeClick}
                />
            </div>
        </label>
    );
}
