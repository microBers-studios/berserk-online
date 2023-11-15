import { useAppDispatch, useAppSelector } from "src/shared/lib";
import { Modal } from "src/shared/ui";
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import {
    deleteAvatarStatusSelector,
    loadAvatarStatusSelector,
    updateUserStatusSelector
} from "src/entities/user";
import { setMode } from "src/entities/modal";
import { AccountEditForm, ChangeAvatarInput } from "src/features/authorization";

export const AccountEditModal = () => {
    const { isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation }: IAnimator = useAnimate()

    const dispatch = useAppDispatch()
    const updateUserStatus = useAppSelector(updateUserStatusSelector)
    const loadAvatarStatus = useAppSelector(loadAvatarStatusSelector)
    const deleteAvatarStatus = useAppSelector(deleteAvatarStatusSelector)

    const closeModal = () => {
        if (!updateUserStatus.isPending && !loadAvatarStatus.isPending && !deleteAvatarStatus.isPending) {
            setIsCloseAnimation(true)

            setTimeout(() => dispatch(setMode({ mode: null })), 300)
            document.body.style.overflow = ''
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
            <AccountEditForm
                ImageInput={<ChangeAvatarInput />}
                closeModal={closeModal}
            />
        </Modal >
    )
}
