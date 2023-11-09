import { useState } from "react";
import { useAppDispatch, useAppSelector } from "src/helpers/hooks/redux-hook";
import cls from "./AccountEditModal.module.scss"
import { Modal } from "src/widgets/Modal/Modal";
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import { LoginInput } from "../Inputs/LoginInput";
import { EmailInput } from "../Inputs/EmailInput";
import { ImageInput } from "../Inputs/ImageInput/ImageInput";
import { ModalButton } from "src/widgets/ModalButton/ModalButton";
import { IUser } from "src/types";
import { updateUser } from "src/app/store/slices/userSlice/userSlice";
import { formRegulars } from "../LoginModal/LoginModal";
import { toast } from "react-toastify";
import { deleteAvatarStatusSelector, loadAvatarStatusSelector, updateUserStatusSelector } from "src/app/store/slices/userSlice/selectors";
import { setMode } from "src/app/store/slices/modalSlice/modalSlice";

export const AccountEditModal = () => {
    const { isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation }: IAnimator = useAnimate()

    const { user } = useAppSelector(state => state.user)
    const dispatch = useAppDispatch()
    const updateUserStatus = useAppSelector(updateUserStatusSelector)
    const loadAvatarStatus = useAppSelector(loadAvatarStatusSelector)
    const deleteAvatarStatus = useAppSelector(deleteAvatarStatusSelector)

    const [name, setName] = useState<string>(user.name)
    const [nameError, setNameError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>(user.email)
    const [emailError, setEmailError] = useState<number>(0)

    const closeModal = () => {
        if (!updateUserStatus.isPending && !loadAvatarStatus.isPending && !deleteAvatarStatus.isPending) {
            setIsCloseAnimation(true)

            setTimeout(() => dispatch(setMode({ mode: null })), 300)
            document.body.style.overflow = ''
        }
    }

    const onFormSubmit = (e: React.MouseEvent<HTMLElement>) => {
        if (!updateUserStatus.isPending && !loadAvatarStatus.isPending && !deleteAvatarStatus.isPending) {
            e.preventDefault()

            const updateObject: Partial<IUser> = {}

            if (!email || !formRegulars.EMAIL_REGULAR.test(email)) {
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
                        isActive={updateUserStatus.isPending}
                        onButtonClick={onFormSubmit}
                    />
                </form>
            </div >
        </Modal >
    )
}
