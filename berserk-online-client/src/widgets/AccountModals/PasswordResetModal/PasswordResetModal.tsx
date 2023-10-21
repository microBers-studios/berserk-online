import { Modal } from "src/widgets/Modal/Modal";
import cls from "./PasswordResetModal.module.scss"
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import { PasswordInput } from "../Inputs/PasswordInput";
import { useState } from "react";

interface PasswordResetModalProps {
    closeModal: () => void;
}

export const PasswordResetModal = ({ closeModal }: PasswordResetModalProps) => {
    const {
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()

    const [password, setPassword] = useState<string>('')
    const [passwordError, setPasswordError] = useState<number>(0)

    return (
        <div className={cls.PasswordResetModal} >
            <Modal
                isCloseAnimation={isCloseAnimation}
                isOpenAnimation={isOpenAnimation}
                setIsCloseAnimation={setIsCloseAnimation}
                setIsOpenAnimation={setIsOpenAnimation}
                closeModal={closeModal}
            >
                <form
                    className={cls.Form}
                >

                    <h1 className={cls.FormHeader}>
                        Сброс пароля
                    </h1>
                    <div className={cls.PasswordInputs}>
                        <PasswordInput
                            password={password}
                            setPassword={setPassword}
                            passwordError={passwordError}
                            setPasswordError={setPasswordError}
                            label={'Введите новый пароль:'}
                        />

                        <PasswordInput
                            password={password}
                            setPassword={setPassword}
                            passwordError={passwordError}
                            setPasswordError={setPasswordError}
                            label={'Подтвердите новый пароль:'}
                        />
                    </div>


                    <button className={cls.FormButton}>Сохранить</button>
                </form>
            </Modal>
        </div >
    );
}
