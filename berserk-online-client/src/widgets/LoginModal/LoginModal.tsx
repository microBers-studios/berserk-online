import { useState } from 'react';
import { PasswordInput } from "./PasswordInput";
import cls from "./LoginModal.module.scss"
import crossImage from "../../shared/assets/images/cross.png"
import { CheckboxInput } from './CheckboxInput';
import { IAnimator, useAnimate } from '../../helpers/hooks/useAnimate';
import APIController from '../../API/Controller';
import { LoginInput } from './LoginInput';
import { EmailInput } from './EmailInput';
import { useRequiredContext } from '../../helpers/hooks/useRequiredContext';
import { AlertContext } from '../../app/providers/AlertProvider';
import { AlertContextProps } from '../../app/providers/AlertProvider/lib/AlertContext';

interface LoginModalProps {
    setModal: (isModal: boolean) => void;
}

const regulars = {
    EMAIL_REGULAR: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    PASSWORD_REGULAR: /^(?=.*\d)(?=.*[a-zA-Z])(?=.*[@#$%^&+=]).{8,}$/u
}

export const LoginModal = ({ setModal }: LoginModalProps) => {
    const {
        isAnimation, setIsAnimation,
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()

    const { setAlert } = useRequiredContext<AlertContextProps>(AlertContext)

    const [isRegistration, setIsRegistration] = useState(false)

    const [name, setName] = useState<string>('')
    const [nameError, setNameError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<number>(0)
    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<number>(0)

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
        }

        if (!email || !regulars.EMAIL_REGULAR.test(email)) {
            setEmailError(email ? regulars.EMAIL_REGULAR.test(email) ? 0 : 2 : 1)
            return
        }

        if (!password || !regulars.PASSWORD_REGULAR.test(password)) {
            setPasswordError(password ? regulars.PASSWORD_REGULAR.test(password) ? 0 : 2 : 1)
            // return
        }

        console.log(nameError, emailError, passwordError)

        const { code, text } = isRegistration
            ? await APIController.registrateUser({ name, email, password })
            : await APIController.loginUser({ email, password })

        setRegStatus(code)
        if (code === 200) {
            closeModal()
            setAlert(isRegistration
                ? 'Вы зарегистрированы'
                : 'Вы вошли в аккаунт')
        }
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
                        <LoginInput
                            name={name}
                            setName={setName}
                            setNameError={setNameError}
                            nameError={nameError}
                        />
                    }
                    <EmailInput
                        email={email}
                        setEmail={setEmail}
                        emailError={emailError}
                        setEmailError={setEmailError}
                    />
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
