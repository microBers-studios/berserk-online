import { ReactNode, useState } from "react";
import { toast } from "react-toastify";
import { useAppDispatch, useAppSelector } from "src/shared/lib";
import cls from "./AccountEditForm.module.scss"
import {
    deleteAvatarStatusSelector,
    loadAvatarStatusSelector,
    updateUser,
    updateUserStatusSelector
} from "src/entities/user";
import {
    LoginInput,
    EmailInput,
    ModalButton
} from "src/shared/ui";
import { EMAIL_REGULAR } from "../../const";

interface AccountEditFormProps {
    closeModal: () => void;
    ImageInput: ReactNode;
}

export const AccountEditForm = ({ closeModal, ImageInput }: AccountEditFormProps) => {
    const { user } = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()

    const updateUserStatus = useAppSelector(updateUserStatusSelector)
    const loadAvatarStatus = useAppSelector(loadAvatarStatusSelector)
    const deleteAvatarStatus = useAppSelector(deleteAvatarStatusSelector)

    const [name, setName] = useState<string>(user.name)
    const [nameError, setNameError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>(user.email)
    const [emailError, setEmailError] = useState<number>(0)

    const onFormSubmit = (e: React.MouseEvent<HTMLElement>) => {
        if (!updateUserStatus.isPending && !loadAvatarStatus.isPending && !deleteAvatarStatus.isPending) {
            e.preventDefault()

            const updateObject: Partial<UserType> = {}

            if (!email || !EMAIL_REGULAR.test(email)) {
                setEmailError(2)
                return
            }

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
                closeModal()
                return
            }

            dispatch(updateUser([updateObject, fulfilledCallback, rejectedCallback]))
        }
    }

    const fulfilledCallback = () => {
        closeModal()
        toast('Данные изменены')
    }

    const rejectedCallback = (code: number) => {
        if (code === 400) {
            setEmailError(4)
        }
    }

    return (
        <form
            className={cls.AccountEditForm}
        >
            <h1 className={cls.FormHeader}>Аккаунт</h1>
            {ImageInput}
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
                isActive={updateUserStatus.isPending}
                onButtonClick={onFormSubmit}
            />
        </form>
    );
}
