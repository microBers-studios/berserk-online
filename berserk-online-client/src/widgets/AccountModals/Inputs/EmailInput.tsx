import { useState } from "react";
import cls from "./inputs.module.scss"
import penImage from "src/shared/assets/images/pen.png"

interface EmailInputProps {
    email: string;
    setEmail: (s: string) => void;
    emailError: number;
    setEmailError: (b: number) => void
    isProtected?: boolean;
}

export const EmailInput = ({ email, setEmail, emailError, setEmailError, isProtected = false }: EmailInputProps) => {

    const [protect, setProtect] = useState<boolean>(isProtected)

    return (

        <label className={`${cls.FormLabel} ${cls.emailLabel}`}>
            {isProtected
                ? <span>Адрес электронной почты: </span>
                : <span>Введите адрес электронной почты: <span className={cls.red}> *</span></span>
            }
            <div className={cls.inputContainer}>
                {protect
                    ? <span>{email}</span>
                    : <input
                        value={email}
                        type="email"
                        name="email"
                        className={cls.FormInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (email) setEmailError(0)
                            setEmail(e.target.value)
                        }}
                        required
                    />
                }
                {isProtected && <img
                    src={penImage}
                    onClick={() => setProtect(!protect)}
                    className={cls.inputImage}
                />}
            </div>

            {emailError === 1 &&
                <span className={cls.redAlert}>*Заполните это поле</span>}
            {emailError === 2 &&
                <span className={cls.redAlert}>*Адрес невалиден</span>}
            {emailError === 3 &&
                <span className={cls.redAlert}>Пользователь не найден</span>}
        </label>
    );
}
