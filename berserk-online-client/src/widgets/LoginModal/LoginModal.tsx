import { useEffect, useState } from 'react';
import APIController from 'src/API/Controller';
import { IAnimator, useAnimate } from 'src/helpers/hooks/useAnimate';
import { PasswordInput } from "./Inputs/PasswordInput";
import { CheckboxInput } from './Inputs/CheckboxInput';
import { LoginInput } from './Inputs/LoginInput';
import { EmailInput } from './Inputs/EmailInput';
import { AlertContext } from 'src/app/providers/AlertProvider';
import { AlertContextProps } from 'src/app/providers/AlertProvider/lib/AlertContext';
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext';
import crossImage from "src/shared/assets/images/cross.svg"
import cls from "./LoginModal.module.scss"
import { UserContext } from 'src/app/providers/UserProvider';
import { UserContextProps } from 'src/app/providers/UserProvider/lib/types/types';

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
    const { setUser } = useRequiredContext<UserContextProps>(UserContext)

    const [isRegistration, setIsRegistration] = useState(false)

    const [name, setName] = useState<string>('')
    const [nameError, setNameError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<number>(0)
    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<number>(0)
    const [isChecked, setIsChecked] = useState<boolean>(false)

    const [regStatus, setRegStatus] = useState<number>(0)

    useEffect(() => {
        setAlert(email)
    }, [email])

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

        if (!password || !regulars.PASSWORD_REGULAR.test(password) && isRegistration) {
            setPasswordError(password ? regulars.PASSWORD_REGULAR.test(password) ? 0 : 2 : 1)
            return
        }

        const { code, text } = isRegistration
            ? await APIController.registrateUser({ name, email, password })
            : await APIController.loginUser({ email, password, rememberMe: isChecked })

        setRegStatus(code)
        if (code === 200) {
            closeModal()
            setAlert(isRegistration
                ? 'Вы зарегистрированы'
                : 'Вы вошли в аккаунт')

            const user = await APIController.getMe()
            setUser(user)
        } else if (code === 400 && !isRegistration) {
            switch (Number(JSON.parse(text).id)) {
                case 2:
                    setPasswordError(3)
                    break;
                case 1:
                    setEmailError(3)
                    break;
            }
        }
        else {
            console.log(text)
        }
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
                    <CheckboxInput isChecked={isChecked} setIsChecked={setIsChecked} />
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
