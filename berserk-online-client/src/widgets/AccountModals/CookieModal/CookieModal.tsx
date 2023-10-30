import { IAnimator, useAnimate } from "src/helpers/hooks/useAnimate";
import cls from "./CookieModal.module.scss"
import { Modal } from "src/widgets/Modal/Modal";
import { Modals } from "src/widgets/Navbar/Navbar";
import cookieSvg from "src/shared/assets/images/cookie.svg"
import { ModalButton } from "src/widgets/ModalButton/ModalButton";
import { useRequiredContext } from "src/helpers/hooks/useRequiredContext";
import { CookieModalContext, CookieModalContextProps } from "src/app/providers/CookieModalProvider/lib/CookieModalContext";

interface CookieModalProps {
    modal: false | Modals;
    setModal: (modal: false | Modals) => void;
}

export const CookieModal = ({ modal, setModal }: CookieModalProps) => {
    const { isOpenAnimation, setIsOpenAnimation,
        isCloseAnimation, setIsCloseAnimation }: IAnimator = useAnimate()

    const { setIsCookieModal } = useRequiredContext<CookieModalContextProps>(CookieModalContext)

    const closeModal = () => {
        setIsCloseAnimation(true)
        setTimeout(() => {
            if (modal === Modals.COOKIE) setModal(false)
            setIsCookieModal(false)
        }, 300)
        document.body.style.overflow = ''
    }

    const onOkClick = () => {
        localStorage.setItem('cookie', 'true')
        closeModal()
    }

    return (
        <Modal
            isCloseAnimation={isCloseAnimation}
            isOpenAnimation={isOpenAnimation}
            setIsCloseAnimation={setIsCloseAnimation}
            setIsOpenAnimation={setIsOpenAnimation}
            closeModal={closeModal}
        >
            <div className={cls.CookieModal} >
                <img
                    className={cls.CookieSvg}
                    src={cookieSvg}
                    alt=""
                />
                <h1
                    className={cls.CookieModalHeader}
                >Мы используем Cookie</h1>
                <ModalButton
                    text={'Ок'}
                    onButtonClick={onOkClick}
                />
            </div >
        </Modal>
    );
}
