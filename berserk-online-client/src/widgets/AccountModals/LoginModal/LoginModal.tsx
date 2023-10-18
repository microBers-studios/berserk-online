import { useState } from 'react';
import APIController from 'src/API/Controller';
import { IAnimator, useAnimate } from 'src/helpers/hooks/useAnimate';
import { PasswordInput } from "../Inputs/PasswordInput";
import { CheckboxInput } from '../Inputs/CheckboxInput';
import { LoginInput } from '../Inputs/LoginInput';
import { EmailInput } from '../Inputs/EmailInput';
import { AlertContext } from 'src/app/providers/AlertProvider';
import { AlertContextProps } from 'src/app/providers/AlertProvider/lib/AlertContext';
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext';
import cls from "./LoginModal.module.scss"
import { UserContext } from 'src/app/providers/UserProvider';
import { IUser, UserContextProps } from 'src/app/providers/UserProvider/lib/types/types';
import { Modal } from 'src/widgets/Modal/Modal';
import { Modals } from 'src/widgets/Navbar/Navbar';
import { validatePassword } from 'src/helpers/validatePassword';

interface LoginModalProps {
    setModal: (modal: false | Modals) => void;
    defaultModal: Modals
}

const regulars = {
    EMAIL_REGULAR: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}

export const LoginModal = ({ setModal, defaultModal }: LoginModalProps) => {
    const {
        isAnimation, setIsAnimation,
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()

    const { setAlert } = useRequiredContext<AlertContextProps>(AlertContext)
    const { setUser } = useRequiredContext<UserContextProps>(UserContext)

    const [isRegistration, setIsRegistration] = useState<boolean>(defaultModal === Modals.REGISTRATION)
    const [isLoading, setIsLoading] = useState<boolean>(false)

    const [name, setName] = useState<string>('')
    const [nameError, setNameError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<number>(0)
    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<number>(0)
    const [isChecked, setIsChecked] = useState<boolean>(false)

    const [regStatus, setRegStatus] = useState<number>(0)

    const onFormChangeClick = () => {
        setIsAnimation(true)
        setIsRegistration(!isRegistration)
    }

    const closeModal = () => {
        setIsCloseAnimation(true)
        setTimeout(() => setModal(false), 300)
        document.body.style.overflow = ''
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

        if (!password || validatePassword(password) && isRegistration) {
            setPasswordError(password ? validatePassword(password) ? 0 : 2 : 1)
            return
        }

        setIsLoading(true)

        const { code, obj } = isRegistration
            ? await APIController.registrateUser({ name, email, password })
            : await APIController.loginUser({ email, password, rememberMe: isChecked })

        setRegStatus(code)
        if (code === 200) {
            closeModal()
            setAlert(isRegistration
                ? 'Вы зарегистрированы'
                : 'Вы вошли в аккаунт')

            const { obj } = await APIController.getMe()
            setUser(obj as IUser)
        } else if (code === 400 && !isRegistration) {

            switch (Number(obj.id)) {
                case 2:
                    setPasswordError(3)
                    break;
                case 1:
                    setEmailError(3)
                    break;
            }
        }
    }

    return (
        <Modal
            isAnimation={isAnimation}
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsAnimation={setIsAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={closeModal}
        >
            <form
                className={cls.Form}
            >
                <h1 className={cls.FormHeader}>
                    {isRegistration
                        ? 'Регистрация'
                        : 'Войти'}
                </h1>

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
                        className={`${cls.FormButton} ${isLoading && cls.grayButton}`}
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
        </Modal>
    );
}
