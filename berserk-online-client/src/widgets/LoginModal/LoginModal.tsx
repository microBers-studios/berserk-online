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
    const [nameError, setNameError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<boolean>(false)
    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<boolean>(false)

    const [regStatus, setRegStatus] = useState<number>(0)

    const onFormChangeClick = () => {
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

    const onRegClick = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()

        setRegStatus(0)
        if (!name && isRegistration) {
            setNameError(true)
            return
        } else {
            setNameError(false)
        }

        if (!email) {
            setEmailError(true)
            return
        } else {
            setEmailError(false)
        }

        if (!password) {
            setPasswordError(true)
            return
        } else {
            setPasswordError(false)
        }

        const { code, text } = isRegistration
            ? await APIController.registrateUser({ name, email, password })
            : await APIController.loginUser({ email, password })

        setRegStatus(code)
        if (code === 200) closeModal()
        else console.log(text)
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
                                onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                    if (name) setNameError(false)
                                    setName(e.target.value)
                                }}
                                required
                            />
                            {nameError &&
                                <span className={cls.redAlert}>*Заполните это поле</span>}
                        </label>
                    }
                    <label className={cls.FormLabel}>
                        <span>Введите адрес электронной почты:<span className={cls.red}> *</span></span>
                        <input
                            value={email}
                            type="email"
                            name="email"
                            className={cls.FormInput}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                                if (email) setEmailError(false)
                                setEmail(e.target.value)
                            }}
                            required
                        />
                        {emailError &&
                            <span className={cls.redAlert}>*Заполните это поле</span>}
                    </label>
                    <PasswordInput value={{ password, setPassword }} error={{ passwordError, setPasswordError }} />
                    {isRegistration && regStatus === 400 &&
                        <span className={cls.redAlert}>*Пользователь уже существует</span>
                    }
                </div>

                {!isRegistration &&
                    <CheckboxInput />
                }


                <div className={cls.buttonsWrapper}>
                    <button
                        className={cls.FormButton}
                        onClick={onRegClick}
                    >
                        {isRegistration
                            ? 'Зарегистрироваться'
                            : 'Войти'}
                    </button>
                    <span
                        onClick={onFormChangeClick}
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
