import { useState } from 'react'
import cls from "./PasswordInput.module.scss"
import eyeOpened from "../../../shared/assets/images/eye-opened.png"
import eyeClosed from "../../../shared/assets/images/eye-closed.svg"

export const PasswordInput = () => {
    const [isHidden, setIsHidden] = useState<boolean>(true)

    const onEyeClick = () => {
        setIsHidden(!isHidden)
    }

    return (
        <label className={cls.FormLabel} htmlFor="password">
            <span>Введите пароль:</span>
            <div className={cls.passwordInput}>
                <input
                    type={isHidden ? "password" : "input"}
                    name="password"
                    className={cls.FormInput}
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
