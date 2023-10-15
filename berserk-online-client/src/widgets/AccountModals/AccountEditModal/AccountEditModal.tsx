import { Modals } from "src/widgets/Navbar/Navbar";
import cls from "./AccountEditModal.module.scss"
import { Modal } from "src/widgets/Modal/Modal";
import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";

interface AccountEditModalProps {
    setModal: (modal: false | Modals) => void;
}

export const AccountEditModal = ({ setModal }: AccountEditModalProps) => {
    const {
        isAnimation, setIsAnimation,
        isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation
    }: IAnimator = useAnimate()


    const closeModal = () => {
        setIsCloseAnimation(true)
        setTimeout(() => setModal(false), 300)
        document.body.style.overflow = ''
    }

    return (
        <Modal
            isAnimation={isAnimation}
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsAnimation={setIsAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={closeModal}
        >
            <div className={cls.AccountEditModal}>
                <form
                    className={cls.AccountEditForm}
                >
                    <input type="image" />
                </form>
            </div >
        </Modal>
    );
}
