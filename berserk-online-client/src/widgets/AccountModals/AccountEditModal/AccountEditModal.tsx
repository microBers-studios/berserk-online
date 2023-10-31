import { Modals } from "src/widgets/Navbar/Navbar";
import cls from "./AccountEditModal.module.scss"
import { Modal } from "src/widgets/Modal/Modal";
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import { LoginInput } from "../Inputs/LoginInput";
import { useState } from "react";
import { EmailInput } from "../Inputs/EmailInput";
import { useRequiredContext } from "src/helpers/hooks/useRequiredContext";
import { IUser, UserContextProps } from "src/app/providers/UserProvider/lib/types/types";
import { UserContext } from "src/app/providers/UserProvider";
import { ImageInput } from "../Inputs/ImageInput/ImageInput";
import APIController from "src/API/Controller";
import { ModalButton } from "src/widgets/ModalButton/ModalButton";
import { useAlert } from "src/helpers/hooks/useAlert";

interface AccountEditModalProps {
    setModal: (modal: false | Modals) => void;
}

export const AccountEditModal = ({ setModal }: AccountEditModalProps) => {
    const { isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation }: IAnimator = useAnimate()

    const { user, setUser } = useRequiredContext<UserContextProps>(UserContext)
    const setAlert = useAlert()

    const [name, setName] = useState<string>(user.name)
    const [nameError, setNameError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>(user.email)
    const [emailError, setEmailError] = useState<number>(0)

    const [isLoading, setIsLoading] = useState<boolean>(false)

    const closeModal = () => {
        setIsCloseAnimation(true)

        setTimeout(() => setModal(false), 300)
        document.body.style.overflow = ''
    }

    const onFormSubmit = async (e: React.MouseEvent<HTMLElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const updateObject: Partial<IUser> = {}

        let flag = false

        if (email !== user.email) {
            updateObject.email = email
            flag = true
        }

        if (name !== user.name) {
            updateObject.name = name
            flag = true
        }

        if (!flag) {
            setIsLoading(false)
            closeModal()
            return
        }

        const { code, obj } = await APIController.updateUser(updateObject)

        if (code === 200) {
            setUser(obj as IUser)
            closeModal()
            setAlert('Данные изменены')
        } else if (code === 400) {
            setIsLoading(false)
            setEmailError(4)
        } else {
            setAlert('Ошибка!')
        }
    }

    return (
        <Modal
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={closeModal}
        >
            <div className={cls.AccountEditModal}>
                <form
                    className={cls.AccountEditForm}
                >
                    <h1 className={cls.FormHeader}>Аккаунт</h1>
                    <ImageInput />
                    {<LoginInput
                        name={name}
                        setName={setName}
                        nameError={nameError}
                        setNameError={setNameError}
                        isProtected={true}
                    />}
                    {<EmailInput
                        email={email}
                        setEmail={setEmail}
                        emailError={emailError}
                        setEmailError={setEmailError}
                        isProtected={true}
                    />}
                    <ModalButton
                        text="Сохранить"
                        isActive={isLoading}
                        onButtonClick={onFormSubmit}
                    />
                </form>
            </div >
        </Modal >
    )
}
