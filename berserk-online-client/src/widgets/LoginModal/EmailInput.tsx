import cls from "./LoginModal.module.scss"

interface EmailInputProps {
    email: string;
    setEmail: (s: string) => void;
    emailError: number;
    setEmailError: (b: number) => void
}

export const EmailInput = ({ email, setEmail, emailError, setEmailError }: EmailInputProps) => {

    return (
        <label className={cls.FormLabel}>
            <span>Введите адрес электронной почты:<span className={cls.red}> *</span></span>
            <input
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
            {emailError === 1 &&
                <span className={cls.redAlert}>*Заполните это поле</span>}
            {emailError === 2 &&
                <span className={cls.redAlert}>*Адрес невалиден</span>}
        </label>
    );
}
