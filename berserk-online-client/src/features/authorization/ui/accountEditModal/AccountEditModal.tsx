import { ReactNode, useState } from 'react'
import { toast } from 'react-toastify'
import { useAppDispatch, useAppSelector } from 'src/shared/lib'
import cls from './AccountEditModal.module.scss'
import {
    deleteAvatarStatusSelector,
    loadAvatarStatusSelector,
    updateUser,
    updateUserStatusSelector,
} from 'src/entities/user'
import { LoginInput, EmailInput, ModalButton, Modal } from 'src/shared/ui'
import { EMAIL_REGULAR } from '../../const'
import { useAnimate } from 'src/shared/lib/react/hooks/useAnimate'

interface AccountEditModalProps {
    closeModal: () => void
    ImageInput: ReactNode
}

export const AccountEditModal = ({
    closeModal,
    ImageInput,
}: AccountEditModalProps) => {
    const { user } = useAppSelector((state) => state.user)
    const dispatch = useAppDispatch()

    const {
        isOpenAnimation,
        setIsOpenAnimation,
        isCloseAnimation,
        setIsCloseAnimation,
    }: IAnimator = useAnimate()

    const updateUserStatus = useAppSelector(updateUserStatusSelector)
    const loadAvatarStatus = useAppSelector(loadAvatarStatusSelector)
    const deleteAvatarStatus = useAppSelector(deleteAvatarStatusSelector)

    const [name, setName] = useState<string>(user.name)
    const [nameError, setNameError] = useState<boolean>(false)
    const [email, setEmail] = useState<string>(user.email)
    const [emailError, setEmailError] = useState<number>(0)

    const exitModal = () => {
        setIsCloseAnimation(true)
        setTimeout(closeModal, 300)
        document.body.style.overflow = ''
    }

    const onFormSubmit = (e: React.MouseEvent<HTMLElement>) => {
        if (
            !updateUserStatus.isPending &&
            !loadAvatarStatus.isPending &&
            !deleteAvatarStatus.isPending
        ) {
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
                exitModal()
                return
            }

            dispatch(
                updateUser([updateObject, fulfilledCallback, rejectedCallback])
            )
        }
    }

    const fulfilledCallback = () => {
        exitModal()
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
            modalClass={cls.modal}
            closeModal={() =>
                !updateUserStatus.isPending &&
                !loadAvatarStatus.isPending &&
                !deleteAvatarStatus.isPending &&
                exitModal()
            }
        >
            <form className={cls.AccountEditForm}>
                <h1 className={cls.FormHeader}>Аккаунт</h1>
                {ImageInput}
                {
                    <LoginInput
                        name={name}
                        setName={setName}
                        nameError={nameError}
                        setNameError={setNameError}
                        isProtected={true}
                    />
                }
                {
                    <EmailInput
                        email={email}
                        setEmail={setEmail}
                        emailError={emailError}
                        setEmailError={setEmailError}
                        isProtected={true}
                    />
                }
                <ModalButton
                    text="Сохранить"
                    isActive={updateUserStatus.isPending}
                    onButtonClick={onFormSubmit}
                />
            </form>
        </Modal>
    )
}
