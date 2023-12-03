import { useState } from 'react'
import cls from './LoginInput.module.scss'
import penImage from 'src/shared/assets/images/pen.png'

interface LoginInputProps {
    name: string
    setName: (s: string) => void
    nameError: boolean
    setNameError: (b: boolean) => void
    isProtected?: boolean
}

export const LoginInput = ({
    name,
    setName,
    nameError,
    setNameError,
    isProtected = false,
}: LoginInputProps) => {
    const [protect, setProtect] = useState<boolean>(isProtected)

    const onInputEnter = (e: React.KeyboardEvent) => {
        if (e.code === 'Enter' && isProtected) {
            setProtect(true)
        }
    }

    return (
        <label className={`${cls.FormLabel} ${cls.loginLabel}`}>
            {isProtected ? (
                <span>Логин: </span>
            ) : (
                <span>
                    Введите логин:
                    <span className={cls.red}> *</span>
                </span>
            )}
            <div className={cls.inputContainer}>
                {protect ? (
                    <span>{name}</span>
                ) : (
                    <input
                        value={name}
                        type="name"
                        name="name"
                        className={cls.FormInput}
                        onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                            if (name) setNameError(false)
                            setName(e.target.value)
                        }}
                        onKeyDown={onInputEnter}
                        required
                    />
                )}
                {isProtected && (
                    <img
                        src={penImage}
                        onClick={() => setProtect(!protect)}
                        className={`${cls.inputImage} ${
                            !protect && cls.clicked
                        }`}
                    />
                )}
            </div>

            {nameError && (
                <span className={cls.redAlert}>*Заполните это поле</span>
            )}
        </label>
    )
}
