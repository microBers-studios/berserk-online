import { useState } from 'react';
import APIController from 'src/API/Controller';
import { IAnimator, useAnimate } from 'src/helpers/hooks/useAnimate';
import { PasswordInput } from "../Inputs/PasswordInput";
import { CheckboxInput } from '../Inputs/CheckboxInput';
import { LoginInput } from '../Inputs/LoginInput';
import { EmailInput } from '../Inputs/EmailInput';
import { useRequiredContext } from 'src/helpers/hooks/useRequiredContext';
import cls from "./LoginModal.module.scss"
import { UserContext } from 'src/app/providers/UserProvider';
import { IUser, UserContextProps } from 'src/app/providers/UserProvider/lib/types/types';
import { Modal } from 'src/widgets/Modal/Modal';
import { Modals } from 'src/widgets/Navbar/Navbar';
import { validatePassword } from 'src/helpers/validatePassword';
import { ModalButton } from 'src/widgets/ModalButton/ModalButton';
import { useCookie } from 'src/helpers/hooks/useCookie';
import { IResponseUserInfo } from 'src/API/utils/types';
import { CookieModalContext, CookieModalContextProps } from 'src/app/providers/CookieModalProvider/lib/CookieModalContext';
import { useAlert } from 'src/helpers/hooks/useAlert';

interface LoginModalProps {
    setModal: (modal: false | Modals, props?: object | null) => void;
    defaultModal: Modals
}

const formRegulars = {
    EMAIL_REGULAR: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}

export const LoginModal = ({ setModal, defaultModal }: LoginModalProps) => {
    const {
        isAnimation, setIsAnimation,
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()

    const setAlert = useAlert()
    const { setUser, isUserLoading, setIsUserLoading } = useRequiredContext<UserContextProps>(UserContext)

    const [isRegistration, setIsRegistration] = useState<boolean>(defaultModal === Modals.REGISTRATION)

    const [name, setName] = useState<string>('')
    const [nameError, setNameError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<number>(0)
    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<number>(0)
    const [isChecked, setIsChecked] = useState<boolean>(false)

    const [regStatus, setRegStatus] = useState<number>(0)

    const cookied = useCookie()
    const { setIsCookieModal } = useRequiredContext<CookieModalContextProps>(CookieModalContext)

    const onFormChangeClick = () => {
        setIsAnimation(true)
        setIsRegistration(!isRegistration)
    }

    const closeModal = async (isOverflowHidden = true) => {
        setIsCloseAnimation(true)

        if (isOverflowHidden) {
            document.body.style.overflow = ''
        }

        await new Promise((resolve) => {
            setTimeout(() => {
                setModal(false)
                resolve(0)
            }, 300)
        })
    }


    const onPasswordResetClick = async () => {
        await closeModal(false)
        setModal(Modals.EMAIL)
    }

    const onRegClick = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()

        setRegStatus(0)

        if (!name && isRegistration) {
            setNameError(true)
            return
        }

        if (!email || !formRegulars.EMAIL_REGULAR.test(email)) {
            setEmailError(email ? formRegulars.EMAIL_REGULAR.test(email) ? 0 : 2 : 1)
            return
        }

        if (!password || !validatePassword(password) && isRegistration) {
            const error = password ? validatePassword(password) ? 0 : 2 : 1
            setPasswordError(error)
            if (error) return
        }

        setIsUserLoading(true)

        const result = isRegistration
            ? await cookied<IResponseUserInfo>(APIController.registrateUser, [{ name, email, password }])
            : await cookied(APIController.loginUser, [{ email, password, rememberMe: isChecked }])

        if (!result) {
            setIsUserLoading(false)
            setIsCookieModal(true)
            return
        }

        const { code, obj } = result

        setRegStatus(code)
        if (!isRegistration) setIsUserLoading(false)

        console.log(code, isRegistration)
        if (code === 200) {
            if (isRegistration) {
                setModal(Modals.CLOSE, { email })
            } else {
                closeModal()
                if (!isRegistration) setAlert('Вы вошли в аккаунт')
            }
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
        } else {
            setAlert('Ошибка!')
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
                    <PasswordInput
                        password={password}
                        setPassword={setPassword}
                        passwordError={passwordError}
                        setPasswordError={setPasswordError}
                    />
                    {isRegistration && regStatus === 400 &&
                        <span className={cls.redAlert}>*Пользователь уже существует</span>
                    }
                </div>

                {!isRegistration &&
                    <CheckboxInput isChecked={isChecked} setIsChecked={setIsChecked} />
                }

                <div className={cls.buttonsWrapper}>
                    <ModalButton
                        text={isRegistration
                            ? 'Зарегистрироваться'
                            : 'Войти'}
                        isActive={isUserLoading}
                        onButtonClick={onRegClick}
                    />
                    {!isRegistration &&
                        <span
                            className={cls.PasswordResetButton}
                            onClick={onPasswordResetClick}
                        >
                            Забыли пароль?
                        </span>
                    }
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
