import { useState } from 'react';
import { IAnimator, useAnimate } from 'src/helpers/hooks/useAnimate';
import { PasswordInput } from "../Inputs/PasswordInput";
import { CheckboxInput } from '../Inputs/CheckboxInput';
import { LoginInput } from '../Inputs/LoginInput';
import { EmailInput } from '../Inputs/EmailInput';
import cls from "./LoginModal.module.scss"
import { Modal } from 'src/widgets/Modal/Modal';
import { Mode, setMode } from "src/app/store/slices/modalSlice/modalSlice"
import { validatePassword } from 'src/helpers/validatePassword';
import { ModalButton } from 'src/widgets/ModalButton/ModalButton';
import { useAppDispatch, useAppSelector } from 'src/helpers/hooks/redux-hook';
import { loginUser, registrateUser } from 'src/app/store/slices/userSlice/userSlice';
import { loginUserStatusSelector, registrateUserStatusSelector } from 'src/app/store/slices/userSlice/selectors';
import { toast } from 'react-toastify';

export const formRegulars = {
    EMAIL_REGULAR: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
}

export const LoginModal = () => {
    const {
        isAnimation, setIsAnimation,
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()

    const dispatch = useAppDispatch()
    const loginUserStatus = useAppSelector(loginUserStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)
    const { mode } = useAppSelector(state => state.modal)

    const [name, setName] = useState<string>('')
    const [nameError, setNameError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<number>(0)
    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<number>(0)
    const [isChecked, setIsChecked] = useState<boolean>(true)
    const isRegistration = mode === Mode.REGISTRATION

    const onFormChangeClick = () => {
        setIsAnimation(true)
        dispatch(setMode({ mode: isRegistration ? Mode.LOGIN : Mode.REGISTRATION }))
        setNameError(false)
        setEmailError(0)
        setPasswordError(0)
    }

    const closeModal = async (isOverflowHidden = true) => {
        if (!loginUserStatus.isPending && !registrateUserStatus.isPending) {
            setIsCloseAnimation(true)

            if (isOverflowHidden) {
                document.body.style.overflow = ''
            }

            await new Promise((resolve) => {
                setTimeout(() => {
                    dispatch(setMode({ mode: null }))
                    resolve(0)
                }, 300)
            })
        }
    }

    const onPasswordResetClick = async () => {
        if (!loginUserStatus.isPending && !registrateUserStatus.isPending) {
            await closeModal(false)
            dispatch(setMode({ mode: Mode.EMAIL }))
        }
    }

    const onRegClick = (e: React.MouseEvent<HTMLElement>) => {
        if (!loginUserStatus.isPending && !registrateUserStatus.isPending) {
            e.preventDefault()

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

            if (isRegistration) {
                dispatch(registrateUser([{ name, email, password }, registrationFulfilledCallback]))
            } else {
                dispatch(loginUser([{ email, password, rememberMe: isChecked }, loginFulfilledCallback, loginRejectedCallback]))
            }
        }
    }

    const loginFulfilledCallback = () => {
        closeModal()
        toast('Вы вошли в аккаунт')
    }

    const registrationFulfilledCallback = () => {
        dispatch(setMode({ mode: Mode.CLOSE, extra: { email } }))
    }

    const loginRejectedCallback = (code: number, id: number) => {
        if (code === 400) {
            switch (Number(id)) {
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
                    <PasswordInput
                        password={password}
                        setPassword={setPassword}
                        passwordError={passwordError}
                        setPasswordError={setPasswordError}
                    />
                    {isRegistration && registrateUserStatus.isRejected &&
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
                        isActive={loginUserStatus.isPending || registrateUserStatus.isPending}
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
