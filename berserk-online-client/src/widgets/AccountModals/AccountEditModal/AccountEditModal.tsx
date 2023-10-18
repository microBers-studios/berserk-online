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

interface AccountEditModalProps {
    setModal: (modal: false | Modals) => void;
}

export const AccountEditModal = ({ setModal }: AccountEditModalProps) => {
    const { isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation }: IAnimator = useAnimate()

    const { user, setUser } = useRequiredContext<UserContextProps>(UserContext)

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

    const onFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setIsLoading(true)

        const updateObject: Partial<IUser> = {}

        if (email !== user.email) {
            updateObject.email = email
        }

        if (name !== user.name) {
            updateObject.name = name
        }

        const { code, obj } = await APIController.updateUser(updateObject)

        if (code === 200) {
            setUser(obj as IUser)
        } else if (code === 400) {
            setIsLoading(false)
            setEmailError(4)
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
                    onSubmit={onFormSubmit}
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
                    <button
                        className={`${cls.FormButton} ${isLoading && cls.grayButton}`}
                    >
                        Сохранить
                    </button>
                </form>
            </div >
        </Modal>
    )
}
