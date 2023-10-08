import { useState } from 'react';
import { PasswordInput } from "./PasswordInput";
import cls from "./LoginModal.module.scss"
import crossImage from "../../shared/assets/images/cross.png"
import { CheckboxInput } from './CheckboxInput';
import { IAnimator, useAnimate } from '../../helpers/hooks/useAnimate';
import APIController from '../../API/Controller';

interface LoginModalProps {
    setModal: (isModal: boolean) => void;
}

export const LoginModal = ({ setModal }: LoginModalProps) => {
    const {
        isAnimation, setIsAnimation,
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()

    const [isRegistration, setIsRegistration] = useState(false)

    const [name, setName] = useState<string>('')
    const [email, setEmail] = useState<string>('')
    const [password, setPassword] = useState<string>('')

    const onRegClick = () => {
        setIsAnimation(true)
        setIsRegistration(!isRegistration)
    }

    const endAnimation = () => {
        if (isOpenAnimation) {
            setIsOpenAnimation(false)
        }

        if (isAnimation) {
            setIsAnimation(false)
        }
    }

    const closeModal = () => {
        setIsCloseAnimation(true)
        setTimeout(() => setModal(false), 300)
    }

    const onSubmitClick = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        const code: number = await APIController.registrateUser({ name, email, password })
        alert(code)

        closeModal()
    }
    return (

        <div
            className={cls.wrapper}
        >
            <form
                className={`${cls.LoginModal} ${isOpenAnimation && cls.opened} ${isAnimation && cls.animated} ${isCloseAnimation && cls.closed}`}
                onAnimationEnd={endAnimation}
            >
                <div className={cls.FormHeader}>
                    <img
                        src={crossImage}
                        className={cls.crossImage}
                        onClick={closeModal}
                    />
                    <h1 className={cls.header}>
                        {isRegistration
                            ? 'Регистрация'
                            : 'Войти'}
                    </h1>
                </div>

                <div className={cls.inputsWrapper}>
                    {isRegistration &&
                        <label className={cls.FormLabel}>
                            <span>Введите логин: <span className={cls.red}> *</span></span>
                            <input
                                value={name}
                                type="name"
                                name="name"
                                className={cls.FormInput}
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
                                required
                            />
                        </label>
                    }
                    <label className={cls.FormLabel}>
                        <span>Введите адрес электронной почты:<span className={cls.red}> *</span></span>
                        <input
                            value={email}
                            type="email"
                            name="email"
                            className={cls.FormInput}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setEmail(e.target.value)}
                            required
                        />
                    </label>
                    <PasswordInput value={{ password, setPassword }} />
                </div>

                {!isRegistration &&
                    <CheckboxInput />
                }

                <div className={cls.buttonsWrapper}>
                    <button className={cls.FormButton} onClick={onSubmitClick}>
                        {isRegistration
                            ? 'Зарегистрироваться'
                            : 'Войти'}
                    </button>
                    <span
                        onClick={onRegClick}
                        className={cls.changeFormButton}
                    >{isRegistration
                        ? 'Войти'
                        : 'Зарегистрироваться'}
                    </span>
                </div>
            </form>
        </div >
    );
}
