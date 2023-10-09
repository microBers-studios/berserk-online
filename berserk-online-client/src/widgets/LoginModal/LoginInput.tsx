import cls from "./LoginModal.module.scss"

interface LoginInputProps {
    name: string;
    setName: (s: string) => void;
    nameError: boolean;
    setNameError: (b: boolean) => void
}

export const LoginInput = ({ name, setName, nameError, setNameError }: LoginInputProps) => {

    return (
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
    );
}
