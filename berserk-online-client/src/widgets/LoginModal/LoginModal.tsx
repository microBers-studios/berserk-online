import { useState } from 'react';
import { PasswordInput } from "../components/PasswordInput/PasswordInput";
import cls from "./LoginModal.module.scss"
import crossImage from "../../shared/assets/images/cross.png"

interface LoginModalProps {
    setModal: (isModal: boolean) => void;
}

export const LoginModal = ({ setModal }: LoginModalProps) => {
    const [isRegistration, setIsRegistration] = useState(false)

    const onLoginClick = (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
    }

    const onRegClick = () => {
        setIsRegistration(true)
    }

    return (

        <div className={cls.wrapper}>
            <form className={cls.LoginModal}>
                <div className={cls.FormHeader}>
                    <img
                        src={crossImage}
                        className={cls.crossImage}
                        onClick={() => setModal(false)}
                    />
                    <h1 className={cls.header}>
                        {isRegistration
                            ? 'Регистрация'
                            : 'Войти'}
                    </h1>
                </div>

                <div className={cls.inputsWrapper}>
                    {isRegistration &&
                        <label className={cls.FormLabel} htmlFor="name">
                            <span>Введите логин:</span>
                            <input
                                type="name"
                                name="name"
                                className={cls.FormInput}
                                required
                            />
                        </label>
                    }
                    <label className={cls.FormLabel} htmlFor="email">
                        <span>Введите адрес электронной почты:</span>
                        <input
                            type="email"
                            name="email"
                            className={cls.FormInput}
                            required
                        />
                    </label>
                    <PasswordInput />
                </div>

                <div className={cls.buttonsWrapper}>
                    <button className={cls.FormButton} onClick={onLoginClick}>
                        {isRegistration
                            ? 'Зарегистрироваться'
                            : 'Войти'}
                    </button>
                    {!isRegistration && <span
                        onClick={onRegClick}
                        className={cls.changeFormButton}
                    >
                        Зарегистрироваться
                    </span>}
                </div>
            </form>
        </div>
    );
}
