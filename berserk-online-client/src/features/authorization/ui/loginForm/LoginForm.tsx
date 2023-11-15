import { useState } from "react";
import { toast } from "react-toastify";
import cls from "./LoginForm.module.scss"
import { Mode, setMode } from "src/entities/modal";
import {
    loginUser,
    loginUserStatusSelector,
    registrateUser,
    registrateUserStatusSelector
} from "src/entities/user";
import {
    CheckboxInput,
    PasswordInput,
    EmailInput,
    LoginInput,
    ModalButton
} from "src/shared/ui";
import {
    useAppDispatch,
    useAppSelector
} from "src/shared/lib";
import { validatePassword } from "../../lib/validate-password";
import { EMAIL_REGULAR } from "../../const";

interface LoginFormProps {
    isRegistration: boolean;
    closeModal: () => void
}

export const LoginForm = ({
    isRegistration,
    closeModal
}: LoginFormProps) => {

    const dispatch = useAppDispatch()
    const loginUserStatus = useAppSelector(loginUserStatusSelector)
    const registrateUserStatus = useAppSelector(registrateUserStatusSelector)

    const [name, setName] = useState<string>('')
    const [nameError, setNameError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>('')
    const [emailError, setEmailError] = useState<number>(0)
    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<number>(0)
    const [isChecked, setIsChecked] = useState<boolean>(true)

    const onRegClick = (e: React.MouseEvent<HTMLElement>) => {
        if (!loginUserStatus.isPending && !registrateUserStatus.isPending) {
            e.preventDefault()

            if (!name && isRegistration) {
                setNameError(true)
                return
            }

            if (!email || !EMAIL_REGULAR.test(email)) {
                setEmailError(email ? EMAIL_REGULAR.test(email) ? 0 : 2 : 1)
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
            </div>
        </form>
    );
}
