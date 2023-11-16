import { Modal } from "src/shared/ui";
import { useAnimate } from "src/shared/lib";
import { PasswordResetForm } from "src/features/authorization";

interface PasswordResetModalProps {
    closeModal: () => void;
    token: string;
}

export const PasswordResetModal = ({ closeModal, token }: PasswordResetModalProps) => {
    const {
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()

    const endChanging = () => {
        setIsCloseAnimation(true)
        setTimeout(() => closeModal(), 300)
        document.body.style.overflow = ''
    }

    return (
        <Modal
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={closeModal}
        >
            <PasswordResetForm
                token={token}
                closeModal={endChanging}
            />
        </Modal>
    );
}
